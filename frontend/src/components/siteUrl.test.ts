import { describe, expect, it } from 'vitest'
import type { AiSite } from '../data/aiSites'
import { siteUrl } from './siteUrl'

const withParam: AiSite = {
  id: 'chatgpt',
  name: 'ChatGPT',
  url: 'https://chatgpt.com/',
  promptParam: 'prompt',
}
const withoutParam: AiSite = { id: 'gemini', name: 'Gemini', url: 'https://gemini.google.com/app' }

describe('siteUrl', () => {
  it('プロンプトを載せる項目があれば、クエリにプロンプトを入れる', () => {
    expect(siteUrl(withParam, 'Make it a diorama.')).toBe(
      'https://chatgpt.com/?prompt=Make+it+a+diorama.',
    )
  })

  it('改行・記号・日本語も、開いた先で元の文に戻る形で入れる', () => {
    const prompt = 'Line 1\nDo not: add text & logos (100%)\n日本語'
    const url = new URL(siteUrl(withParam, prompt))
    expect(url.searchParams.get('prompt')).toBe(prompt)
    expect(url.origin + url.pathname).toBe('https://chatgpt.com/')
  })

  it('項目の無いサイトは、URL にプロンプトを載せない', () => {
    expect(siteUrl(withoutParam, 'Make it a diorama.')).toBe('https://gemini.google.com/app')
  })
})
