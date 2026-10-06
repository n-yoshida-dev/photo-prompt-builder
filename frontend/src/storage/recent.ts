// 最近使った設定の保存・復元（SPEC.md「保存（最近使った設定）」）。localStorage を触るのはこのファイルだけ
// 保存するのは選択状態と保存時刻だけで、写真は保存しない（CLAUDE.md「守ること」）
import { catalog as defaultCatalog } from '../data/catalog'
import type { Catalog, ChoiceId, Selection, ToggleId } from '../prompt/types'

export const RECENT_KEY = 'photo-prompt-builder:recent'
export const RECENT_LIMIT = 5

export type RecentEntry = {
  selection: Selection
  savedAt: string // ISO 8601
}

// 読み書きに使う保存領域。テストで差し替えられるよう、必要な操作だけを型にする
export type KeyValueStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

// 同じ選択かどうか。トグルは並び順を無視して比べる
export function sameSelection(a: Selection, b: Selection): boolean {
  if (a.presetId !== b.presetId) return false
  const toggles = (s: Selection) => [...s.toggleIds].sort().join(',')
  if (toggles(a) !== toggles(b)) return false
  return (Object.keys(a.choices) as ChoiceId[]).every((id) => a.choices[id] === b.choices[id])
}

// 先頭に追加し、同じ内容の古い記録を消して、最大件数に切り詰める（純粋関数）
export function addRecent(
  entries: RecentEntry[],
  selection: Selection,
  savedAt: string,
): RecentEntry[] {
  const rest = entries.filter((entry) => !sameSelection(entry.selection, selection))
  return [{ selection, savedAt }, ...rest].slice(0, RECENT_LIMIT)
}

// 保存されていた選択が、今のマスタデータで復元できるかを確かめる。できなければ null
// 最近使った設定とお気に入り（storage/favorites.ts）の両方が使う
export function parseSelection(selection: unknown, catalog: Catalog): Selection | null {
  if (typeof selection !== 'object' || selection === null) return null
  const { presetId, toggleIds, choices } = selection as {
    presetId?: unknown
    toggleIds?: unknown
    choices?: unknown
  }
  if (typeof presetId !== 'string' || !catalog.presets.some((p) => p.id === presetId)) return null
  if (!Array.isArray(toggleIds)) return null
  const knownToggles = new Set<string>(catalog.toggles.map((t) => t.id))
  if (!toggleIds.every((id) => typeof id === 'string' && knownToggles.has(id))) return null
  if (typeof choices !== 'object' || choices === null) return null
  const picked = choices as Record<string, unknown>
  const validChoices = catalog.choices.every((choice) =>
    choice.options.some((option) => option.id === picked[choice.id]),
  )
  if (!validChoices) return null
  return {
    presetId,
    toggleIds: toggleIds as ToggleId[],
    choices: Object.fromEntries(
      catalog.choices.map((choice) => [choice.id, picked[choice.id] as string]),
    ) as Record<ChoiceId, string>,
  }
}

// 1 件ぶんの値が、今のマスタデータで復元できる記録かを確かめる。できなければ null
function toEntry(value: unknown, catalog: Catalog): RecentEntry | null {
  if (typeof value !== 'object' || value === null) return null
  const { selection, savedAt } = value as { selection?: unknown; savedAt?: unknown }
  if (typeof savedAt !== 'string') return null
  const parsed = parseSelection(selection, catalog)
  return parsed ? { savedAt, selection: parsed } : null
}

// 保存された JSON 文字列を読み、復元できる記録と、捨てた件数を返す（純粋関数）
// 形が壊れていれば例外を投げる。今のマスタデータに無いプリセットなどを含む記録は、1 件ずつ捨てる
export function parseRecent(
  json: string,
  catalog: Catalog = defaultCatalog,
): { entries: RecentEntry[]; dropped: number } {
  const value: unknown = JSON.parse(json)
  if (!Array.isArray(value)) {
    throw new Error('最近使った設定の形が配列ではありません')
  }
  const valid = value
    .map((item) => toEntry(item, catalog))
    .filter((entry): entry is RecentEntry => entry !== null)
  return { entries: valid.slice(0, RECENT_LIMIT), dropped: value.length - valid.length }
}

// ブラウザの保存領域を取り出す。Cookie をすべてブロックした Chrome などでは参照しただけで例外になるので、
// その場合は null を返して「最近使った設定」だけを使えなくする（プロンプト作りの画面は止めない）
export function browserStorage(): KeyValueStorage | null {
  try {
    return window.localStorage
  } catch (error) {
    console.error('保存領域（localStorage）が使えないので、最近使った設定を残せません', error)
    return null
  }
}

// 保存領域から読む。壊れていたら捨てて空にし、console に出す（握りつぶさない）
export function loadRecent(
  storage: KeyValueStorage | null = browserStorage(),
  catalog: Catalog = defaultCatalog,
): RecentEntry[] {
  if (!storage) return []
  // 読み込みそのものの失敗（SecurityError など）と、中身が壊れている場合とで、console の文言を分ける
  let json: string | null
  try {
    json = storage.getItem(RECENT_KEY)
  } catch (error) {
    console.error('最近使った設定を読み込めませんでした（保存領域が使えません）', error)
    return []
  }
  if (json === null) return []
  try {
    const { entries, dropped } = parseRecent(json, catalog)
    if (dropped > 0) {
      console.warn(
        `最近使った設定のうち、今のスタイル・条件で復元できない ${dropped} 件を捨てました`,
      )
    }
    return entries
  } catch (error) {
    console.error('最近使った設定が壊れていたので捨てました', error)
    try {
      storage.removeItem(RECENT_KEY)
    } catch (removeError) {
      console.error('壊れた最近使った設定を消せませんでした', removeError)
    }
    return []
  }
}

// 画面が持っている一覧の先頭に 1 件を足して保存し、足した後の一覧を返す
// 書き込めなかったら console に出し、一覧は画面の中でだけ更新する（続けて失敗しても画面の一覧は減らない）
export function saveRecent(
  entries: RecentEntry[],
  selection: Selection,
  savedAt: string,
  storage: KeyValueStorage | null = browserStorage(),
): RecentEntry[] {
  const next = addRecent(entries, selection, savedAt)
  if (!storage) return next
  try {
    storage.setItem(RECENT_KEY, JSON.stringify(next))
  } catch (error) {
    console.error('最近使った設定を保存できませんでした', error)
  }
  return next
}
