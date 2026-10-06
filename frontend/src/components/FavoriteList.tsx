import { useId, useState, type SubmitEvent } from 'react'
import type { Catalog, Selection } from '../prompt/types'
import {
  FAVORITE_NAME_MAX,
  FAVORITES_LIMIT,
  type AddFavoriteResult,
  type FavoriteEntry,
} from '../storage/favorites'
import { changesText, describeSelection } from './selectionSummary'

// 名前を付けて保存した結果。保存できたときは、ブラウザに書き込めたか（persisted）も持つ
export type FavoriteSaveOutcome =
  | (Extract<AddFavoriteResult, { kind: 'added' | 'replaced' }> & { persisted: boolean })
  | Exclude<AddFavoriteResult, { kind: 'added' | 'replaced' }>

type Props = {
  entries: FavoriteEntry[]
  catalog: Catalog
  onSave: (name: string) => FavoriteSaveOutcome // 今の設定を名前を付けて保存する
  onRestore: (selection: Selection) => void
  onDelete: (name: string) => boolean // 1 件を消す。ブラウザに書き込めたら true
}

// 保存の結果を、利用者に見せる一文にする
function saveMessage(outcome: FavoriteSaveOutcome): string {
  switch (outcome.kind) {
    case 'empty-name':
      return '名前を入れてください。'
    case 'too-long':
      return `名前は ${FAVORITE_NAME_MAX} 字までです。`
    case 'full':
      return `お気に入りは ${FAVORITES_LIMIT} 件までです。使わないものを削除してから保存してください。`
    case 'added':
    case 'replaced': {
      if (!outcome.persisted) {
        return `「${outcome.name}」は、このブラウザに保存できませんでした。画面を閉じると消えます。`
      }
      return outcome.kind === 'added'
        ? `「${outcome.name}」を保存しました。`
        : `「${outcome.name}」を今の設定で上書きしました。`
    }
  }
}

// お気に入り（名前を付けて保存した設定）。今の設定を名前を付けて残し、一覧から呼び出す（logs/decisions.md 2026-10-03）
// 保存されるのは選択と名前だけで、写真は残らない（CLAUDE.md「守ること」）
export function FavoriteList({ entries, catalog, onSave, onRestore, onDelete }: Props) {
  const inputId = useId()
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  // 保存ボタン（Enter でも押せる）。保存できたら名前の欄を空にする
  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const outcome = onSave(name)
    setMessage(saveMessage(outcome))
    if (outcome.kind === 'added' || outcome.kind === 'replaced') setName('')
  }

  // 消す前に確かめる（消したお気に入りは戻せないため）
  function handleDelete(target: string) {
    if (!window.confirm(`お気に入り「${target}」を削除しますか？`)) return
    const persisted = onDelete(target)
    setMessage(
      persisted
        ? `「${target}」を削除しました。`
        : `「${target}」を一覧から外しましたが、このブラウザには書き込めませんでした。`,
    )
  }

  return (
    <section className="favorites" aria-labelledby="favorites-heading">
      <h2 id="favorites-heading" className="recent-heading">
        お気に入り
      </h2>
      <form className="favorite-form" onSubmit={handleSubmit}>
        <label htmlFor={inputId} className="favorite-label">
          今の設定に名前を付けて保存
        </label>
        <div className="favorite-row">
          <input
            id={inputId}
            className="favorite-input"
            type="text"
            value={name}
            maxLength={FAVORITE_NAME_MAX}
            placeholder="例：七五三用"
            onChange={(event) => setName(event.target.value)}
          />
          <button type="submit" className="favorite-save" disabled={name.trim() === ''}>
            保存
          </button>
        </div>
        <p className="favorite-status" role="status">
          {message}
        </p>
      </form>
      {entries.length === 0 ? (
        <p className="recent-empty">
          よく使う組み合わせに名前を付けて残せます。残るのは選択と名前だけで、写真は残りません。
        </p>
      ) : (
        <ul className="recent-list">
          {entries.map((entry) => {
            const { presetName, changes } = describeSelection(entry.selection, catalog)
            return (
              <li key={entry.name} className="favorite-entry">
                <button
                  type="button"
                  className="recent-item"
                  onClick={() => onRestore(entry.selection)}
                >
                  <span className="recent-name">{entry.name}</span>
                  <span className="recent-changes">
                    {presetName}・{changesText(changes)}
                  </span>
                </button>
                <button
                  type="button"
                  className="favorite-delete"
                  aria-label={`「${entry.name}」を削除`}
                  onClick={() => handleDelete(entry.name)}
                >
                  削除
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
