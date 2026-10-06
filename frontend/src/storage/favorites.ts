// お気に入り（名前を付けて保存した設定）の保存・復元（SPEC.md「保存（お気に入り）」、logs/decisions.md 2026-10-03）
// 保存するのは名前・選択状態・保存時刻だけで、写真は保存しない（CLAUDE.md「守ること」）
// 最近使った設定と違い、利用者が自分で残したものなので、保存できなかったことは画面にも知らせる
import { catalog as defaultCatalog } from '../data/catalog'
import type { Catalog, Selection } from '../prompt/types'
import { browserStorage, parseSelection, type KeyValueStorage } from './recent'

export const FAVORITES_KEY = 'photo-prompt-builder:favorites'
export const FAVORITES_LIMIT = 20
export const FAVORITE_NAME_MAX = 30

export type FavoriteEntry = {
  name: string
  selection: Selection
  savedAt: string // ISO 8601
}

// 名前を付けて保存した結果。added＝新しく足した、replaced＝同じ名前を上書きした
export type AddFavoriteResult =
  | { kind: 'added'; name: string; entries: FavoriteEntry[] }
  | { kind: 'replaced'; name: string; entries: FavoriteEntry[] }
  | { kind: 'empty-name' }
  | { kind: 'too-long' }
  | { kind: 'full' }

// 名前を付けて先頭に足す。同じ名前があれば上書きして先頭に上げる（純粋関数）
// 名前は前後の空白を外して比べる。空・長すぎる・件数の上限なら、一覧は変えずに理由を返す
export function addFavorite(
  entries: FavoriteEntry[],
  rawName: string,
  selection: Selection,
  savedAt: string,
): AddFavoriteResult {
  const name = rawName.trim()
  if (name === '') return { kind: 'empty-name' }
  if (name.length > FAVORITE_NAME_MAX) return { kind: 'too-long' }
  const exists = entries.some((entry) => entry.name === name)
  if (!exists && entries.length >= FAVORITES_LIMIT) return { kind: 'full' }
  const rest = entries.filter((entry) => entry.name !== name)
  return {
    kind: exists ? 'replaced' : 'added',
    name,
    entries: [{ name, selection, savedAt }, ...rest],
  }
}

// 名前で 1 件を外す（純粋関数）
export function removeFavorite(entries: FavoriteEntry[], name: string): FavoriteEntry[] {
  return entries.filter((entry) => entry.name !== name)
}

// 1 件ぶんの値が、今のマスタデータで復元できるお気に入りかを確かめる。できなければ null
function toFavorite(value: unknown, catalog: Catalog): FavoriteEntry | null {
  if (typeof value !== 'object' || value === null) return null
  const { name, selection, savedAt } = value as {
    name?: unknown
    selection?: unknown
    savedAt?: unknown
  }
  if (typeof name !== 'string' || name.trim() === '' || typeof savedAt !== 'string') return null
  const parsed = parseSelection(selection, catalog)
  return parsed ? { name, savedAt, selection: parsed } : null
}

// 保存された JSON 文字列を読み、復元できるお気に入りと、捨てた件数を返す（純粋関数）
// 形が壊れていれば例外を投げる。今のマスタデータに無いプリセットなどを含むものは、1 件ずつ捨てる
export function parseFavorites(
  json: string,
  catalog: Catalog = defaultCatalog,
): { entries: FavoriteEntry[]; dropped: number } {
  const value: unknown = JSON.parse(json)
  if (!Array.isArray(value)) {
    throw new Error('お気に入りの形が配列ではありません')
  }
  const valid = value
    .map((item) => toFavorite(item, catalog))
    .filter((entry): entry is FavoriteEntry => entry !== null)
  return { entries: valid.slice(0, FAVORITES_LIMIT), dropped: value.length - valid.length }
}

// 保存領域から読む。読めない・壊れているときは空の一覧で動き続け、console に出す（握りつぶさない）
// 壊れていても保存領域のキーは消さない（利用者が自分で残したものなので、直せる余地を残す）
export function loadFavorites(
  storage: KeyValueStorage | null = browserStorage(),
  catalog: Catalog = defaultCatalog,
): FavoriteEntry[] {
  if (!storage) return []
  let json: string | null
  try {
    json = storage.getItem(FAVORITES_KEY)
  } catch (error) {
    console.error('お気に入りを読み込めませんでした（保存領域が使えません）', error)
    return []
  }
  if (json === null) return []
  try {
    const { entries, dropped } = parseFavorites(json, catalog)
    if (dropped > 0) {
      console.warn(`お気に入りのうち、今のスタイル・条件で復元できない ${dropped} 件を除きました`)
    }
    return entries
  } catch (error) {
    console.error('お気に入りが壊れていて読めませんでした', error)
    return []
  }
}

// 一覧をまるごと書き込む。書き込めたら true。書き込めなかったら console に出して false を返す（画面で知らせるため）
export function writeFavorites(
  entries: FavoriteEntry[],
  storage: KeyValueStorage | null = browserStorage(),
): boolean {
  if (!storage) return false
  try {
    storage.setItem(FAVORITES_KEY, JSON.stringify(entries))
    return true
  } catch (error) {
    console.error('お気に入りを保存できませんでした', error)
    return false
  }
}
