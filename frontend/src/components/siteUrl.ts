import type { AiSite } from '../data/aiSites'

// 開くボタンの行き先の URL を作る。プロンプトを載せる項目のあるサイトだけ、クエリにプロンプトを入れる
// （ChatGPT の ?q= は自動で送信されることがあるので使わない。?prompt= は入力欄に入るだけ。KNOWLEDGE.md 2026-10-14）
export function siteUrl(site: AiSite, prompt: string): string {
  if (!site.promptParam) {
    return site.url
  }
  const url = new URL(site.url)
  url.searchParams.set(site.promptParam, prompt)
  return url.toString()
}
