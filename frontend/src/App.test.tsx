import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { aiSites } from './data/aiSites'
import { catalog } from './data/catalog'
import { defaultSelection } from './prompt/selection'
import { FAVORITES_KEY } from './storage/favorites'
import { RECENT_KEY } from './storage/recent'

// マスタデータから英文を引く（テストに英文を直書きしない）
function toggleText(id: string): string {
  const toggle = catalog.toggles.find((t) => t.id === id)
  if (!toggle) throw new Error(`トグル ${id} がありません`)
  return toggle.text
}

function optionText(choiceId: string, optionId: string): string {
  const option = catalog.choices
    .find((c) => c.id === choiceId)
    ?.options.find((o) => o.id === optionId)
  if (!option) throw new Error(`選択肢 ${choiceId}.${optionId} がありません`)
  return option.text
}

function presetBase(id: string): string {
  const preset = catalog.presets.find((p) => p.id === id)
  if (!preset) throw new Error(`プリセット ${id} がありません`)
  return preset.base
}

// 画面に出ている生成プロンプト
function promptText(): string {
  return (screen.getByRole('textbox', { name: 'できあがったプロンプト' }) as HTMLTextAreaElement)
    .value
}

describe('App', () => {
  it('アプリ名の見出しを表示する', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'photo-prompt-builder' })).toBeInTheDocument()
  })

  it('起動時は先頭のプリセットのプロンプトが出ている', () => {
    render(<App />)
    const first = catalog.presets[0]
    expect(first).toBeDefined()
    expect(promptText()).toContain(first?.base)
  })

  it('プロンプトの欄は英文として読み上げられるよう lang="en" を持つ', () => {
    render(<App />)
    expect(screen.getByRole('textbox', { name: 'できあがったプロンプト' })).toHaveAttribute(
      'lang',
      'en',
    )
  })

  it('スタイルを選び直すとプロンプトが即時に変わる', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('radio', { name: /Editorial Poster/ }))
    expect(promptText()).toContain(presetBase('editorial-poster'))
    expect(promptText()).not.toContain(presetBase('diorama'))
  })

  it('Claude の自作のスタイルのカードには「出典：Claude の自作」が出る', () => {
    render(<App />)
    const selfMade = catalog.presets.filter((p) => p.source.kind === 'claude')
    expect(selfMade.length).toBeGreaterThan(0)
    expect(screen.getAllByText('出典：Claude の自作')).toHaveLength(selfMade.length)
  })

  it('ユーザー提供のスタイルのカードには出典の行が出ない', () => {
    render(<App />)
    expect(screen.queryByText(/docs\/seed-prompts\.md/)).not.toBeInTheDocument()
  })

  it('トグルを ON/OFF するとその英文が出入りする', () => {
    render(<App />)
    const checkbox = screen.getByRole('checkbox', { name: '柔らかい自然光にする' })
    fireEvent.click(checkbox)
    expect(promptText()).toContain(toggleText('soft-light'))
    fireEvent.click(checkbox)
    expect(promptText()).not.toContain(toggleText('soft-light'))
  })

  it('ラジオを選ぶとその英文が入り、既定に戻すと消える', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('radio', { name: '白黒' }))
    expect(promptText()).toContain(optionText('color-mood', 'mono'))
    fireEvent.click(screen.getAllByRole('radio', { name: '元のまま' })[0] as HTMLElement)
    expect(promptText()).not.toContain(optionText('color-mood', 'mono'))
  })

  it('選択肢に添える一文は、ラジオの説明として読まれる（名前は短いまま）', () => {
    render(<App />)
    const radio = screen.getByRole('radio', { name: '控えめ（写真に近い）' })
    expect(radio).toHaveAccessibleDescription('元の写真の質感や顔つきを多く残す')
  })

  it('形の図は縦横比の正方形・縦・横にだけ付く（元のままには付けない。logs/decisions.md 2026-10-10）', () => {
    render(<App />)
    const aspect = screen.getByRole('group', { name: '縦横比' })
    expect(aspect.querySelectorAll('.option-shape')).toHaveLength(3)
    const original = screen.getAllByRole('radio', { name: '元のまま' }).at(-1)?.closest('label')
    expect(original?.querySelector('.option-shape')).toBeNull()
    const color = screen.getByRole('group', { name: '色味' })
    expect(color.querySelectorAll('.option-shape')).toHaveLength(0)
  })

  it('スタイルを切り替えるとトグルはそのスタイルの既定に戻り、ラジオは引き継ぐ', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('radio', { name: '白黒' }))
    fireEvent.click(screen.getByRole('checkbox', { name: '柔らかい自然光にする' }))
    fireEvent.click(screen.getByRole('radio', { name: /Editorial Poster/ }))
    // editorial-poster は文字を許すので「文字を入れない」は既定で OFF
    expect(screen.getByRole('checkbox', { name: '文字を入れない' })).not.toBeChecked()
    expect(screen.getByRole('checkbox', { name: '柔らかい自然光にする' })).not.toBeChecked()
    expect(screen.getByRole('radio', { name: '白黒' })).toBeChecked()
  })
})

// jsdom の navigator にはクリップボードが無いので、clipboard だけを差し替える（navigator の他の値は残す）
function stubClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
}

describe('コピーと開くボタン', () => {
  afterEach(() => {
    Reflect.deleteProperty(navigator, 'clipboard')
    vi.restoreAllMocks()
  })

  it('コピーすると画面のプロンプトと同じ文字をクリップボードへ書き込み、そう知らせる', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    stubClipboard(writeText)
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'プロンプトをコピー' }))
    expect(await screen.findByText(/コピーしました/)).toBeInTheDocument()
    expect(writeText).toHaveBeenCalledWith(promptText())
  })

  it('コピーした後で条件を変えると「コピーしました」を消す（クリップボードは古いままのため）', async () => {
    stubClipboard(vi.fn().mockResolvedValue(undefined))
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'プロンプトをコピー' }))
    expect(await screen.findByText(/コピーしました/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('radio', { name: '白黒' }))
    expect(screen.queryByText(/コピーしました/)).not.toBeInTheDocument()
  })

  it('コピーできなかったら失敗を知らせ、欄の文字を全選択する', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'))
    stubClipboard(writeText)
    vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'プロンプトをコピー' }))
    expect(await screen.findByText(/コピーできませんでした/)).toBeInTheDocument()
    const textarea = screen.getByRole('textbox', {
      name: 'できあがったプロンプト',
    }) as HTMLTextAreaElement
    expect(document.activeElement).toBe(textarea)
    expect(textarea.selectionEnd - textarea.selectionStart).toBe(textarea.value.length)
    expect(console.error).toHaveBeenCalled()
  })

  it.each(aiSites.map((site) => [site.name, site.url]))(
    '%s を開くリンクは新しいタブで開き、URL にプロンプトを載せない',
    (name, url) => {
      render(<App />)
      const link = screen.getByRole('link', { name: `コピーして ${name} を開く` })
      expect(link).toHaveAttribute('href', url)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      expect(link.getAttribute('href')).not.toContain('?')
    },
  )

  it('開くボタンは ChatGPT と Gemini の 2 つで、Claude は無い（logs/decisions.md 2026-10-03）', () => {
    render(<App />)
    expect(screen.getAllByRole('link', { name: /を開く$/ })).toHaveLength(2)
    expect(screen.queryByRole('link', { name: /Claude/ })).not.toBeInTheDocument()
  })

  it.each(aiSites.map((site) => [site.name]))(
    '%s を開くと、同じクリックの中でプロンプトもコピーし、そう知らせる',
    async (name) => {
      const writeText = vi.fn().mockResolvedValue(undefined)
      stubClipboard(writeText)
      render(<App />)
      const link = screen.getByRole('link', { name: `コピーして ${name} を開く` })
      // jsdom はリンク先へ移動できないので、既定の動き（新しいタブで開く）だけを止める。止めたのはテストで、アプリは止めない
      link.addEventListener('click', (event) => event.preventDefault())
      fireEvent.click(link)
      // クリックの処理の中で書き込みが始まっている（待ってから開く作りではない）
      expect(writeText).toHaveBeenCalledWith(promptText())
      expect(await screen.findByText(/コピーしました/)).toBeInTheDocument()
    },
  )
})

describe('写真を扱わない（logs/decisions.md 2026-10-03「写真を選ぶ」を画面から外す）', () => {
  it('写真を選ぶ欄もファイルの入力も無い', () => {
    const { container } = render(<App />)
    expect(container.querySelector('input[type="file"]')).toBeNull()
    expect(screen.queryByText(/写真を選ぶ/)).not.toBeInTheDocument()
  })

  it('写真は開いた先の画面で添付すると案内する', () => {
    render(<App />)
    expect(screen.getByText(/写真は、開いた先の画面で自分で添付します/)).toBeInTheDocument()
  })
})

describe('最近使った設定', () => {
  beforeEach(() => {
    localStorage.clear()
    stubClipboard(vi.fn().mockResolvedValue(undefined))
  })

  afterEach(() => {
    Reflect.deleteProperty(navigator, 'clipboard')
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('コピー → リロード → 復元で同じプロンプトが出る', async () => {
    const first = render(<App />)
    fireEvent.click(screen.getByRole('radio', { name: /Editorial Poster/ }))
    fireEvent.click(screen.getByRole('radio', { name: '白黒' }))
    fireEvent.click(screen.getByRole('checkbox', { name: '柔らかい自然光にする' }))
    const copied = promptText()
    fireEvent.click(screen.getByRole('button', { name: 'プロンプトをコピー' }))
    await screen.findByText(/コピーしました/)
    first.unmount()

    // 開き直すと既定の選択に戻っている
    render(<App />)
    expect(promptText()).not.toBe(copied)
    fireEvent.click(screen.getByRole('button', { name: /Editorial Poster/ }))
    expect(promptText()).toBe(copied)
  })

  it('一覧は既定から変えた点で見分けられる', async () => {
    render(<App />)
    fireEvent.click(screen.getByRole('radio', { name: '白黒' }))
    fireEvent.click(screen.getByRole('checkbox', { name: '文字を入れない' }))
    fireEvent.click(screen.getByRole('button', { name: 'プロンプトをコピー' }))
    const item = await screen.findByRole('button', { name: /3D Miniature Diorama/ })
    expect(item).toHaveTextContent('白黒・−文字を入れない')
  })

  it('コピーに失敗しても、押した時点の選択は残す（SPEC「コピーボタンを押した時点で保存」）', async () => {
    stubClipboard(vi.fn().mockRejectedValue(new Error('denied')))
    vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'プロンプトをコピー' }))
    await screen.findByText(/コピーできませんでした/)
    expect(screen.getByRole('button', { name: /3D Miniature Diorama/ })).toBeInTheDocument()
  })

  it('外したスタイルの記録が残っていても、その記録だけを捨てて画面は動く（logs/decisions.md 2026-10-04）', () => {
    const removedIds = [
      'painted-anime',
      'watercolor',
      'instant-photo',
      'clay-animation',
      'yarn-embroidery',
    ]
    const stored = [
      ...removedIds.map((presetId, i) => ({
        selection: { ...defaultSelection('diorama'), presetId },
        savedAt: `2026-10-0${i + 1}T10:00:00.000Z`,
      })),
      { selection: defaultSelection('editorial-poster'), savedAt: '2026-10-04T10:00:00.000Z' },
    ]
    localStorage.setItem(RECENT_KEY, JSON.stringify(stored))
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(<App />)
    expect(screen.getByRole('heading', { name: 'photo-prompt-builder' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Editorial Poster/ }))
    expect(promptText()).toContain(presetBase('editorial-poster'))
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('5 件'))
  })

  it('まだ何もコピーしていなければ案内を出す', () => {
    render(<App />)
    expect(screen.getByText(/コピーすると、そのときの選択がここに残ります/)).toBeInTheDocument()
  })
})

describe('お気に入り（logs/decisions.md 2026-10-03「名前を付けて保存」）', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  // 今の設定に名前を付けて保存する
  function saveAs(name: string) {
    fireEvent.change(screen.getByRole('textbox', { name: '今の設定に名前を付けて保存' }), {
      target: { value: name },
    })
    fireEvent.click(screen.getByRole('button', { name: '保存' }))
  }

  it('名前を付けて保存 → 開き直す → 一覧から呼び出すと、同じプロンプトが出る', () => {
    const first = render(<App />)
    fireEvent.click(screen.getByRole('radio', { name: /Editorial Poster/ }))
    fireEvent.click(screen.getByRole('radio', { name: '淡く' }))
    fireEvent.click(screen.getByRole('radio', { name: '縦 3:4' }))
    fireEvent.click(screen.getByRole('checkbox', { name: '柔らかい自然光にする' }))
    const saved = promptText()
    saveAs('七五三用')
    expect(screen.getByText('「七五三用」を保存しました。')).toBeInTheDocument()
    first.unmount()

    render(<App />)
    expect(promptText()).not.toBe(saved)
    fireEvent.click(screen.getByRole('button', { name: /^七五三用/ }))
    expect(promptText()).toBe(saved)
  })

  it('保存されるのは名前と選択と時刻だけで、写真やプロンプトの文は残らない', () => {
    render(<App />)
    saveAs('いつもの')
    const stored = JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? '[]') as Record<
      string,
      unknown
    >[]
    expect(stored).toHaveLength(1)
    expect(Object.keys(stored[0] ?? {}).sort()).toEqual(['name', 'savedAt', 'selection'])
    expect(localStorage.getItem(FAVORITES_KEY)).not.toContain(presetBase('diorama'))
  })

  it('名前が空のうちは保存ボタンを押せない', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: '保存' })).toBeDisabled()
    fireEvent.change(screen.getByRole('textbox', { name: '今の設定に名前を付けて保存' }), {
      target: { value: '   ' },
    })
    expect(screen.getByRole('button', { name: '保存' })).toBeDisabled()
  })

  it('同じ名前で保存すると、今の設定で上書きしたと知らせる', () => {
    render(<App />)
    saveAs('いつもの')
    fireEvent.click(screen.getByRole('radio', { name: '白黒' }))
    saveAs('いつもの')
    expect(screen.getByText('「いつもの」を今の設定で上書きしました。')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^いつもの/ })).toHaveLength(1)
    expect(screen.getByRole('button', { name: /^いつもの/ })).toHaveTextContent('白黒')
  })

  it('削除は確かめてから行い、やめれば残す', () => {
    render(<App />)
    saveAs('いつもの')
    const confirm = vi.spyOn(window, 'confirm').mockReturnValueOnce(false)
    fireEvent.click(screen.getByRole('button', { name: '「いつもの」を削除' }))
    expect(confirm).toHaveBeenCalledWith('お気に入り「いつもの」を削除しますか？')
    expect(screen.getByRole('button', { name: /^いつもの/ })).toBeInTheDocument()

    confirm.mockReturnValueOnce(true)
    fireEvent.click(screen.getByRole('button', { name: '「いつもの」を削除' }))
    expect(screen.queryByRole('button', { name: /^いつもの/ })).not.toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? '[]')).toEqual([])
  })

  it('ブラウザに書き込めないときは、画面を閉じると消えると知らせる', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<App />)
    saveAs('いつもの')
    expect(screen.getByText(/このブラウザに保存できませんでした/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^いつもの/ })).toBeInTheDocument()
  })
})
