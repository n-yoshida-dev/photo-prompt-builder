// プロンプトを組み立てる純粋関数。React・DOM・localStorage を import しない（CLAUDE.md「守ること」）
// 組み立て規則は SPEC.md「プロンプトの組み立て規則」
import { catalog as defaultCatalog } from '../data/catalog'
import type { Catalog, Preset, Selection, ToggleBlock } from './types'

// 見出し。Qiita の実験で差し替えるときはここを直す
export const HEADING_PRESERVE = 'Preserve from the reference photo:'
export const HEADING_COMPOSITION = 'Composition:'
export const HEADING_NEGATIVE = 'Do not:'

// 選択内容から最終プロンプトを組み立てる。catalog はテストで差し替えるための引数で、画面からは省略する
export function buildPrompt(selection: Selection, catalog: Catalog = defaultCatalog): string {
  const preset = findPreset(selection.presetId, catalog)
  const preserve = catalog.preserve[preset.subject]

  const baseLines = [preset.base, ...toggleTexts(selection, catalog, 'base')]
  const styleLines = [
    preset.style,
    ...choiceTexts(selection, catalog),
    ...toggleTexts(selection, catalog, 'style'),
  ]
  const negatives = [...preset.negative, ...toggleTexts(selection, catalog, 'negative')]

  const sections = [
    joinLines(baseLines),
    joinLines(styleLines),
    bulletSection(HEADING_PRESERVE, preserve.identity),
    bulletSection(HEADING_COMPOSITION, preserve.composition),
    bulletSection(HEADING_NEGATIVE, negatives),
  ]
  return sections.filter((section) => section !== '').join('\n\n')
}

// id からプリセットを引く。見つからなければ例外（保存データの破損などを握りつぶさない）
export function findPreset(presetId: string, catalog: Catalog = defaultCatalog): Preset {
  const preset = catalog.presets.find((p) => p.id === presetId)
  if (!preset) {
    throw new Error(`不明なプリセット id です: ${presetId}`)
  }
  return preset
}

// 指定ブロックのうち ON のトグル文を、マスタデータの並び順で返す（選んだ順にすると出力が揺れるため）
function toggleTexts(selection: Selection, catalog: Catalog, block: ToggleBlock): string[] {
  return catalog.toggles
    .filter((toggle) => toggle.block === block && selection.toggleIds.includes(toggle.id))
    .map((toggle) => toggle.text)
}

// ラジオで選んだ文を、マスタデータの並び順で返す。既定の選択肢は text が空なので何も足さない
function choiceTexts(selection: Selection, catalog: Catalog): string[] {
  return catalog.choices.flatMap((choice) => {
    const optionId = selection.choices[choice.id]
    const option = choice.options.find((o) => o.id === optionId)
    if (!option) {
      throw new Error(`不明な選択肢です: ${choice.id}=${String(optionId)}`)
    }
    return option.text === '' ? [] : [option.text]
  })
}

// 空文字を除いて改行で繋ぐ
function joinLines(lines: string[]): string {
  return lines.filter((line) => line !== '').join('\n')
}

// 見出し付きの箇条書き。項目が 0 個なら見出しごと出さない
function bulletSection(heading: string, items: string[]): string {
  if (items.length === 0) {
    return ''
  }
  return [heading, ...items.map((item) => `- ${item}`)].join('\n')
}
