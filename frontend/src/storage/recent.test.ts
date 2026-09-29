import { afterEach, describe, expect, it, vi } from 'vitest'
import { defaultSelection } from '../prompt/selection'
import type { Selection } from '../prompt/types'
import {
  addRecent,
  loadRecent,
  parseRecent,
  RECENT_KEY,
  RECENT_LIMIT,
  saveRecent,
  type KeyValueStorage,
} from './recent'

// テスト用の保存領域（Map で localStorage の代わりをする）
function memoryStorage(initial?: string): KeyValueStorage & { data: Map<string, string> } {
  const data = new Map<string, string>()
  if (initial !== undefined) data.set(RECENT_KEY, initial)
  return {
    data,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value)
    },
    removeItem: (key) => {
      data.delete(key)
    },
  }
}

const poster: Selection = {
  ...defaultSelection('editorial-poster'),
  toggleIds: ['soft-light', 'no-extra-objects'],
  choices: { 'style-strength': 'photo', 'color-mood': 'mono', 'aspect-ratio': 'original' },
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('保存と復元の往復', () => {
  it('保存した選択を読み戻すと同じ中身になる', () => {
    const storage = memoryStorage()
    saveRecent([], poster, '2026-09-29T10:00:00.000Z', storage)
    expect(loadRecent(storage)).toEqual([
      { selection: poster, savedAt: '2026-09-29T10:00:00.000Z' },
    ])
  })

  it('保存するのは選択と時刻だけ（写真や他の値は入らない）', () => {
    const storage = memoryStorage()
    saveRecent([], poster, '2026-09-29T10:00:00.000Z', storage)
    const saved = JSON.parse(storage.data.get(RECENT_KEY) ?? '[]') as unknown[]
    expect(Object.keys(saved[0] as object).sort()).toEqual(['savedAt', 'selection'])
    expect(Object.keys((saved[0] as { selection: object }).selection).sort()).toEqual([
      'choices',
      'presetId',
      'toggleIds',
    ])
  })
})

describe('件数と重複', () => {
  it('同じ内容は 1 件にまとめて先頭に上げる（トグルの並び順は問わない）', () => {
    const first = addRecent([], poster, 't1')
    const second = addRecent(first, defaultSelection('diorama'), 't2')
    const again = addRecent(second, { ...poster, toggleIds: [...poster.toggleIds].reverse() }, 't3')
    expect(again.map((e) => e.savedAt)).toEqual(['t3', 't2'])
  })

  it(`最大 ${RECENT_LIMIT} 件に切り詰める`, () => {
    let entries = addRecent([], defaultSelection('diorama'), 't0')
    const moods = ['original', 'muted', 'vivid', 'mono']
    const ratios = ['original', 'square']
    let n = 1
    for (const mood of moods) {
      for (const ratio of ratios) {
        entries = addRecent(
          entries,
          { ...poster, choices: { ...poster.choices, 'color-mood': mood, 'aspect-ratio': ratio } },
          `t${n++}`,
        )
      }
    }
    expect(entries).toHaveLength(RECENT_LIMIT)
    expect(entries[0]?.savedAt).toBe(`t${n - 1}`)
  })
})

describe('壊れたデータ・古いデータ', () => {
  it('壊れた JSON は捨てて空にし、console に出す', () => {
    const storage = memoryStorage('{not json')
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(loadRecent(storage)).toEqual([])
    expect(storage.data.has(RECENT_KEY)).toBe(false)
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining('壊れていたので捨てました'),
      expect.any(SyntaxError),
    )
  })

  it('配列でなければ形が壊れているとみなす', () => {
    expect(() => parseRecent('{"presetId":"diorama"}')).toThrow('配列')
  })

  it('今のマスタデータに無いプリセット・トグル・選択肢を含む記録は 1 件ずつ捨てる', () => {
    const json = JSON.stringify([
      { selection: { ...poster, presetId: 'removed-preset' }, savedAt: 't1' },
      { selection: { ...poster, toggleIds: ['keep-face'] }, savedAt: 't2' },
      {
        selection: { ...poster, choices: { ...poster.choices, 'color-mood': 'sepia' } },
        savedAt: 't3',
      },
      { selection: poster, savedAt: 't4' },
      { selection: poster },
      'text',
    ])
    const { entries, dropped } = parseRecent(json)
    expect(entries.map((e) => e.savedAt)).toEqual(['t4'])
    expect(dropped).toBe(5)
  })

  it('捨てた記録があれば件数を console に出す（黙って消さない）', () => {
    const json = JSON.stringify([
      { selection: { ...poster, presetId: 'removed-preset' }, savedAt: 't1' },
      { selection: poster, savedAt: 't2' },
    ])
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(loadRecent(memoryStorage(json)).map((e) => e.savedAt)).toEqual(['t2'])
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('1 件'))
  })

  it('保存に続けて失敗しても、画面の一覧は減らず、そのたび console に出す', () => {
    const storage = memoryStorage()
    storage.setItem = () => {
      throw new Error('QuotaExceededError')
    }
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const once = saveRecent([], poster, 't1', storage)
    const twice = saveRecent(once, defaultSelection('diorama'), 't2', storage)
    expect(twice.map((e) => e.savedAt)).toEqual(['t2', 't1'])
    expect(error).toHaveBeenCalledTimes(2)
  })

  it('保存領域そのものが使えなければ、空の一覧で動き続ける', () => {
    expect(loadRecent(null)).toEqual([])
    expect(saveRecent([], poster, 't1', null)).toHaveLength(1)
  })

  it('読み込みで例外が出ても（Cookie をブロックしたブラウザなど）、空の一覧で動き続ける', () => {
    const storage = memoryStorage()
    storage.getItem = () => {
      throw new DOMException('The operation is insecure.', 'SecurityError')
    }
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(loadRecent(storage)).toEqual([])
    // 「壊れていた」ではなく「読み込めなかった」と出す（原因と違う文言にしない）
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining('読み込めませんでした'),
      expect.any(DOMException),
    )
  })
})
