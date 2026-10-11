// 保存した選択を、一覧で見分けるための短い言葉にする。最近使った設定とお気に入りの両方が使う
import type { Catalog, Selection } from '../prompt/types'

// 1 件の選択を「スタイル名」と「既定から変えた点」の短い言葉にする
export function describeSelection(
  selection: Selection,
  catalog: Catalog,
): {
  presetName: string
  changes: string[]
} {
  const preset = catalog.presets.find((p) => p.id === selection.presetId)
  const changes: string[] = []
  for (const choice of catalog.choices) {
    const picked = choice.options.find((o) => o.id === selection.choices[choice.id])
    if (picked && picked.id !== choice.options[0]?.id) changes.push(picked.label)
  }
  for (const toggle of catalog.toggles) {
    const on = selection.toggleIds.includes(toggle.id)
    const onByDefault = preset?.defaultToggles.includes(toggle.id) ?? false
    if (on && !onByDefault) changes.push(`＋${toggle.label}`)
    if (!on && onByDefault) changes.push(`−${toggle.label}`)
  }
  return { presetName: preset?.name ?? selection.presetId, changes }
}

// 既定から変えた点を 1 つの文にする。何も変えていなければ「既定のまま」
// 1 つの名前の中の空白は改行しない空白にする（狭い欄で「縦 3:4」が「縦／3:4」に割れないように）
export function changesText(changes: string[]): string {
  if (changes.length === 0) return '既定のまま'
  return changes.map((change) => change.replaceAll(' ', ' ')).join('・')
}

// 保存した日時を「9/29 23:05」の形にする
export function formatSavedAt(savedAt: string): string {
  const date = new Date(savedAt)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('ja-JP', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
