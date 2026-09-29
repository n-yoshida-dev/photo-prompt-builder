// 画面の選択状態（Selection）を作る・変える純粋関数。React・DOM・localStorage を import しない
import { catalog as defaultCatalog } from '../data/catalog'
import { findPreset } from './buildPrompt'
import type { Catalog, ChoiceId, Selection } from './types'

// ラジオをすべて既定（先頭の選択肢）にした状態を返す
export function defaultChoices(catalog: Catalog = defaultCatalog): Record<ChoiceId, string> {
  const entries = catalog.choices.map((choice) => {
    const first = choice.options[0]
    if (!first) {
      throw new Error(`選択肢が 1 つも無いラジオです: ${choice.id}`)
    }
    return [choice.id, first.id] as const
  })
  return Object.fromEntries(entries) as Record<ChoiceId, string>
}

// プリセットを選んだ直後の状態。トグルはそのプリセットの既定、ラジオはすべて既定
export function defaultSelection(presetId: string, catalog: Catalog = defaultCatalog): Selection {
  const preset = findPreset(presetId, catalog)
  return {
    presetId: preset.id,
    toggleIds: [...preset.defaultToggles],
    choices: defaultChoices(catalog),
  }
}

// プリセットを切り替える。トグルは新しいプリセットの既定に戻し、ラジオ（色味・縦横比など）は引き継ぐ
// トグルの既定はプリセットごとに違う（editorial-poster は文字を許す）ため、引き継ぐと意図しない組み合わせになる
export function switchPreset(
  selection: Selection,
  presetId: string,
  catalog: Catalog = defaultCatalog,
): Selection {
  return { ...defaultSelection(presetId, catalog), choices: { ...selection.choices } }
}
