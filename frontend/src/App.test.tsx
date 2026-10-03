import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { aiSites } from './data/aiSites'
import { catalog } from './data/catalog'

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

  it('スタイルを選び直すとプロンプトが即時に変わる', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('radio', { name: /Editorial Poster/ }))
    expect(promptText()).toContain(presetBase('editorial-poster'))
    expect(promptText()).not.toContain(presetBase('diorama'))
  })

  it('Web の原文を種にしたスタイルのカードに、出典とライセンスのリンクと書き換えたことが出る', () => {
    render(<App />)
    const webPresets = catalog.presets.filter((p) => p.source.kind === 'web')
    expect(webPresets.length).toBeGreaterThan(0)
    for (const preset of webPresets) {
      const { label, url, license, licenseUrl, modified } = preset.source
      const sourceLinks = screen.getAllByRole('link', { name: label })
      expect(sourceLinks.some((link) => link.getAttribute('href') === url)).toBe(true)
      const licenseLinks = screen.getAllByRole('link', { name: license })
      expect(licenseLinks.some((link) => link.getAttribute('href') === licenseUrl)).toBe(true)
      if (modified) {
        expect(screen.getByText(`変更：${modified}`)).toBeInTheDocument()
      }
      // 出典はラベルの外にあるので、ラジオの名前には入らない
      expect(screen.getByRole('radio', { name: new RegExp(preset.name) })).not.toHaveAccessibleName(
        /出典/,
      )
    }
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
    fireEvent.click(screen.getByRole('radio', { name: 'モノクロ' }))
    expect(promptText()).toContain(optionText('color-mood', 'mono'))
    fireEvent.click(screen.getAllByRole('radio', { name: '元のまま' })[0] as HTMLElement)
    expect(promptText()).not.toContain(optionText('color-mood', 'mono'))
  })

  it('スタイルを切り替えるとトグルはそのスタイルの既定に戻り、ラジオは引き継ぐ', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('radio', { name: 'モノクロ' }))
    fireEvent.click(screen.getByRole('checkbox', { name: '柔らかい自然光にする' }))
    fireEvent.click(screen.getByRole('radio', { name: /Editorial Poster/ }))
    // editorial-poster は文字を許すので「文字を入れない」は既定で OFF
    expect(screen.getByRole('checkbox', { name: '文字を入れない' })).not.toBeChecked()
    expect(screen.getByRole('checkbox', { name: '柔らかい自然光にする' })).not.toBeChecked()
    expect(screen.getByRole('radio', { name: 'モノクロ' })).toBeChecked()
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
    fireEvent.click(screen.getByRole('radio', { name: 'モノクロ' }))
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
      const link = screen.getByRole('link', { name: `${name} を開く` })
      expect(link).toHaveAttribute('href', url)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      expect(link.getAttribute('href')).not.toContain('?')
    },
  )
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
    fireEvent.click(screen.getByRole('radio', { name: 'モノクロ' }))
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
    fireEvent.click(screen.getByRole('radio', { name: 'モノクロ' }))
    fireEvent.click(screen.getByRole('checkbox', { name: '文字を入れない' }))
    fireEvent.click(screen.getByRole('button', { name: 'プロンプトをコピー' }))
    const item = await screen.findByRole('button', { name: /3D Miniature Diorama/ })
    expect(item).toHaveTextContent('モノクロ・−文字を入れない')
  })

  it('コピーに失敗しても、押した時点の選択は残す（SPEC「コピーボタンを押した時点で保存」）', async () => {
    stubClipboard(vi.fn().mockRejectedValue(new Error('denied')))
    vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'プロンプトをコピー' }))
    await screen.findByText(/コピーできませんでした/)
    expect(screen.getByRole('button', { name: /3D Miniature Diorama/ })).toBeInTheDocument()
  })

  it('まだ何もコピーしていなければ案内を出す', () => {
    render(<App />)
    expect(screen.getByText(/コピーすると、そのときの選択がここに残ります/)).toBeInTheDocument()
  })
})

describe('写真の選択', () => {
  const originalCreate = URL.createObjectURL
  const originalRevoke = URL.revokeObjectURL

  beforeEach(() => {
    // jsdom には一時 URL の仕組みが無いので差し替える
    let n = 0
    URL.createObjectURL = vi.fn(() => `blob:test/${++n}`)
    URL.revokeObjectURL = vi.fn()
    vi.stubGlobal('fetch', vi.fn())
    localStorage.clear()
  })

  afterEach(() => {
    URL.createObjectURL = originalCreate
    URL.revokeObjectURL = originalRevoke
    vi.unstubAllGlobals()
  })

  it('画像だけを並べ、画像でないファイルは数を知らせる。通信も保存もしない', () => {
    const { container } = render(<App />)
    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    const files = [
      new File(['a'], 'a.png', { type: 'image/png' }),
      new File(['b'], 'b.jpg', { type: 'image/jpeg' }),
      new File(['c'], 'memo.txt', { type: 'text/plain' }),
    ]
    fireEvent.change(input, { target: { files } })

    expect(screen.getByText(/2 枚を選んでいます/)).toHaveTextContent(
      '画像ではないファイル 1 件は除きました',
    )
    expect(screen.getByRole('img', { name: 'a.png' })).toHaveAttribute('src', 'blob:test/1')
    expect(screen.getByRole('img', { name: 'b.jpg' })).toBeInTheDocument()
    expect(fetch).not.toHaveBeenCalled()
    expect(localStorage.length).toBe(0)
  })

  it('選び直すと前の一時 URL を解放する', () => {
    const { container } = render(<App />)
    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    fireEvent.change(input, {
      target: { files: [new File(['a'], 'a.png', { type: 'image/png' })] },
    })
    fireEvent.change(input, {
      target: { files: [new File(['b'], 'b.png', { type: 'image/png' })] },
    })
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:test/1')
  })
})
