// プロンプト組み立てに使う型。SPEC.md「データ構造」に合わせる
// data/（マスタデータ）と prompt/（組み立て）の両方が使うので、ここに 1 か所だけ置く

// トグルの id。画面・保存・マスタデータで同じ文字列を使う
export type ToggleId =
  | 'no-text'
  | 'no-extra-objects'
  | 'one-per-photo'
  | 'soft-light'
  | 'paper-texture'
  | 'print-quality'

// ラジオ（いくつかから 1 つ選ぶもの）の id
export type ChoiceId = 'style-strength' | 'color-mood' | 'aspect-ratio'

// 被写体。人物を残すプリセットか、建物や風景を主役にして人物を消すプリセットか
export type Subject = 'people' | 'scene'

// プロンプト上のブロック。トグル文をどこに差し込むかを決める
export type ToggleBlock = 'base' | 'style' | 'negative'

// プリセット。base と style は英文。negative はそのプリセット固有の「〜しない」
export type Preset = {
  id: string
  name: string // 表示名
  descriptionJa: string // 日本語の一行説明
  subject: Subject // どの固定保持文を付けるかが決まる
  base: string // 何をするか（Base Prompt）
  style: string // 見た目の指定（Style）
  negative: string[] // 「Do not:」に続く動詞句
  defaultToggles: ToggleId[]
  source: PresetSource // 英文の出どころ。Web 原文と自作のものはスタイルのカードに出す（logs/decisions.md 2026-10-03）
}

// 英文の出どころの種類。user＝ユーザー提供（docs/seed-prompts.md）、web＝Web で公開された原文、claude＝Claude の自作
export type PresetSourceKind = 'user' | 'web' | 'claude'

// 英文の出どころ。外部由来の文は出典と確認日を持つ（../CLAUDE.md のマスタデータの扱い）
export type PresetSource = {
  kind: PresetSourceKind
  label: string // 出典の名前（web なら「作者 — 作品名」、claude なら「Claude の自作」。カードにそのまま出る）
  url?: string // 公開されている出典の URL（ユーザー提供・自作なら無し）
  license?: string // 利用条件（例：CC BY 4.0）
  licenseUrl?: string // 利用条件の本文へのリンク。全文を同梱するものはアプリ内のファイルを指す
  checkedOn?: string // 出典を確認した日（YYYY-MM-DD）
  modified?: string // 原文から書き換えた箇所の説明（書き換えていなければ無し）。カードに出るので利用者の言葉で書く
}

// 固定の保持文。subject ごとに 1 組。実験モード（MVP 後）以外では常に付く
export type PreserveSet = {
  identity: string[] // 「Preserve from the reference photo:」の下に並ぶ名詞句
  composition: string[] // 「Composition:」の下に並ぶ名詞句
}

// トグル。text は英文。block でどこに差し込むかを決める
export type Toggle = {
  id: ToggleId
  label: string // 日本語ラベル
  block: ToggleBlock
  text: string
}

// ラジオの選択肢。既定（先頭）の text は空文字で、何も足さない
export type ChoiceOption = {
  id: string
  label: string
  text: string
}

// ラジオ。options の先頭が既定
export type Choice = {
  id: ChoiceId
  label: string
  options: ChoiceOption[]
}

// 画面の選択状態。localStorage に保存するのもこの形（写真は含まない）
export type Selection = {
  presetId: string
  toggleIds: ToggleId[]
  choices: Record<ChoiceId, string> // ChoiceId → 選んだ option の id
}

// buildPrompt が参照するマスタデータ一式。テストでは小さな架空データを渡せる
export type Catalog = {
  presets: Preset[]
  preserve: Record<Subject, PreserveSet>
  toggles: Toggle[]
  choices: Choice[]
}
