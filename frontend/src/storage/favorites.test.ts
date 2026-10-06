import { afterEach, describe, expect, it, vi } from 'vitest'
import { buildPrompt } from '../prompt/buildPrompt'
import { defaultSelection } from '../prompt/selection'
import type { Selection } from '../prompt/types'
import {
  addFavorite,
  FAVORITE_NAME_MAX,
  FAVORITES_KEY,
  FAVORITES_LIMIT,
  loadFavorites,
  parseFavorites,
  removeFavorite,
  writeFavorites,
  type FavoriteEntry,
} from './favorites'
import type { KeyValueStorage } from './recent'

// テスト用の保存領域（Map で localStorage の代わりをする）
function memoryStorage(initial?: string): KeyValueStorage & { data: Map<string, string> } {
  const data = new Map<string, string>()
  if (initial !== undefined) data.set(FAVORITES_KEY, initial)
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

const shichigosan: Selection = {
  ...defaultSelection('editorial-poster'),
  toggleIds: ['soft-light', 'no-extra-objects'],
  choices: { 'style-strength': 'photo', 'color-mood': 'muted', 'aspect-ratio': 'portrait' },
}

// 結果が保存できた形（added / replaced）なら一覧を返す
function entriesOf(result: ReturnType<typeof addFavorite>): FavoriteEntry[] {
  if (result.kind !== 'added' && result.kind !== 'replaced') {
    throw new Error(`保存できていません: ${result.kind}`)
  }
  return result.entries
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('名前を付けて保存と呼び出しの往復', () => {
  it('保存して読み戻すと、同じ選択から同じプロンプトが出る', () => {
    const storage = memoryStorage()
    const entries = entriesOf(addFavorite([], '七五三用', shichigosan, '2026-10-07T10:00:00.000Z'))
    expect(writeFavorites(entries, storage)).toBe(true)
    const [restored] = loadFavorites(storage)
    expect(restored?.name).toBe('七五三用')
    expect(restored && buildPrompt(restored.selection)).toBe(buildPrompt(shichigosan))
  })

  it('保存するのは名前・選択・時刻だけ（写真や他の値は入らない）', () => {
    const storage = memoryStorage()
    writeFavorites(
      entriesOf(addFavorite([], '七五三用', shichigosan, '2026-10-07T10:00:00.000Z')),
      storage,
    )
    const saved = JSON.parse(storage.data.get(FAVORITES_KEY) ?? '[]') as Record<string, unknown>[]
    expect(Object.keys(saved[0] ?? {}).sort()).toEqual(['name', 'savedAt', 'selection'])
    expect(Object.keys((saved[0]?.selection as object) ?? {}).sort()).toEqual([
      'choices',
      'presetId',
      'toggleIds',
    ])
  })
})

describe('名前', () => {
  it('前後の空白は外して保存する', () => {
    const result = addFavorite([], '  七五三用  ', shichigosan, 't1')
    expect(result.kind === 'added' && result.name).toBe('七五三用')
  })

  it('空の名前は保存しない', () => {
    expect(addFavorite([], '   ', shichigosan, 't1').kind).toBe('empty-name')
  })

  it(`${FAVORITE_NAME_MAX} 字を超える名前は保存しない`, () => {
    expect(addFavorite([], 'あ'.repeat(FAVORITE_NAME_MAX), shichigosan, 't1').kind).toBe('added')
    expect(addFavorite([], 'あ'.repeat(FAVORITE_NAME_MAX + 1), shichigosan, 't1').kind).toBe(
      'too-long',
    )
  })

  it('同じ名前で保存すると上書きして先頭に上げる', () => {
    let entries = entriesOf(addFavorite([], '七五三用', shichigosan, 't1'))
    entries = entriesOf(addFavorite(entries, '旅行用', defaultSelection('travel-stamps'), 't2'))
    const result = addFavorite(entries, '七五三用', defaultSelection('diorama'), 't3')
    expect(result.kind).toBe('replaced')
    expect(entriesOf(result).map((e) => [e.name, e.selection.presetId])).toEqual([
      ['七五三用', 'diorama'],
      ['旅行用', 'travel-stamps'],
    ])
  })
})

describe('件数と削除', () => {
  it(`${FAVORITES_LIMIT} 件までで、それ以上は新しい名前を保存しない（上書きはできる）`, () => {
    let entries: FavoriteEntry[] = []
    for (let i = 0; i < FAVORITES_LIMIT; i++) {
      entries = entriesOf(addFavorite(entries, `設定${i}`, shichigosan, `t${i}`))
    }
    expect(addFavorite(entries, '新しい設定', shichigosan, 'tx').kind).toBe('full')
    expect(addFavorite(entries, '設定3', shichigosan, 'tx').kind).toBe('replaced')
  })

  it('名前で 1 件だけ外す', () => {
    let entries = entriesOf(addFavorite([], '七五三用', shichigosan, 't1'))
    entries = entriesOf(addFavorite(entries, '旅行用', shichigosan, 't2'))
    expect(removeFavorite(entries, '七五三用').map((e) => e.name)).toEqual(['旅行用'])
  })
})

describe('壊れたデータ・古いデータ', () => {
  it('壊れた JSON は空の一覧で読み、console に出す。保存領域のキーは消さない', () => {
    const storage = memoryStorage('{壊れた')
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(loadFavorites(storage)).toEqual([])
    expect(error).toHaveBeenCalled()
    expect(storage.data.has(FAVORITES_KEY)).toBe(true)
  })

  it('配列でなければ形が壊れているとみなす', () => {
    expect(() => parseFavorites('{"name":"x"}')).toThrow()
  })

  it('今のマスタデータで復元できないもの・名前の無いものは 1 件ずつ除き、件数を console に出す', () => {
    const json = JSON.stringify([
      { name: '七五三用', selection: shichigosan, savedAt: 't1' },
      {
        name: '消えたスタイル',
        selection: { ...shichigosan, presetId: 'watercolor' },
        savedAt: 't2',
      },
      { name: '', selection: shichigosan, savedAt: 't3' },
    ])
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(loadFavorites(memoryStorage(json)).map((e) => e.name)).toEqual(['七五三用'])
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('2 件'))
  })

  it('書き込めなければ false を返し、console に出す（画面で知らせるため）', () => {
    const storage = memoryStorage()
    storage.setItem = () => {
      throw new Error('QuotaExceededError')
    }
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(writeFavorites([], storage)).toBe(false)
    expect(error).toHaveBeenCalled()
  })

  it('保存領域そのものが使えなければ、空の一覧で読み、書き込みは false', () => {
    expect(loadFavorites(null)).toEqual([])
    expect(writeFavorites([], null)).toBe(false)
  })
})
