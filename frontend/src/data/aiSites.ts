// 「開く」ボタンの行き先。サイトの URL が変わったらここを直す（UI のコードに URL を書かない）
// Claude は画像を生成しないので外した（logs/decisions.md 2026-10-03「「Claude を開く」ボタンを外す」）
// ChatGPT は ?prompt= にプロンプトを載せると、iPhone ではアプリが開き、PC のブラウザでも入力欄に入る（送信はされない）。
// Gemini にはアプリで開く形が無いので、トップページを開くだけ（KNOWLEDGE.md 2026-10-14）

export type AiSite = {
  id: 'chatgpt' | 'gemini'
  name: string // ボタンに出す名前
  url: string
  promptParam?: string // プロンプトを載せる URL のクエリの名前。無いサイトは URL に載せない
}

export const aiSites: AiSite[] = [
  { id: 'chatgpt', name: 'ChatGPT', url: 'https://chatgpt.com/', promptParam: 'prompt' },
  { id: 'gemini', name: 'Gemini', url: 'https://gemini.google.com/app' },
]
