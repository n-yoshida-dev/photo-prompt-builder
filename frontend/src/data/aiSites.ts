// 「開く」ボタンの行き先。URL にプロンプトを載せず、トップページを開くだけ（KNOWLEDGE.md 2026-09-29「事前入力 URL は MVP では使わない」）
// サイトの URL が変わったらここを直す（UI のコードに URL を書かない）

export type AiSite = {
  id: 'chatgpt' | 'claude' | 'gemini'
  name: string // ボタンに出す名前
  url: string
}

export const aiSites: AiSite[] = [
  { id: 'chatgpt', name: 'ChatGPT', url: 'https://chatgpt.com/' },
  { id: 'claude', name: 'Claude', url: 'https://claude.ai/new' },
  { id: 'gemini', name: 'Gemini', url: 'https://gemini.google.com/app' },
]
