import { describe, expect, it } from 'vitest'
import { changesText } from './selectionSummary'

describe('changesText', () => {
  it('何も変えていなければ「既定のまま」', () => {
    expect(changesText([])).toBe('既定のまま')
  })

  it('変えた点を「・」でつなぐ', () => {
    expect(changesText(['鮮やかに', '＋1 枚ずつ出力'])).toBe('鮮やかに・＋1 枚ずつ出力')
  })

  it('1 つの名前の中の空白は改行しない空白にする（「縦 3:4」が 2 行に割れないように）', () => {
    const text = changesText(['縦 3:4'])
    expect(text).toBe('縦 3:4')
    expect(text).not.toContain(' ')
  })
})
