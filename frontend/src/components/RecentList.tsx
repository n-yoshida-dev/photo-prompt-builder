import type { Catalog, Selection } from '../prompt/types'
import type { RecentEntry } from '../storage/recent'

type Props = {
  entries: RecentEntry[]
  catalog: Catalog
  onRestore: (selection: Selection) => void
}

// 1 件の選択を「スタイル名」と「既定から変えた点」の短い言葉にする。一覧で見分けるため
function describeSelection(
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

// 保存した日時を「9/29 23:05」の形にする
function formatSavedAt(savedAt: string): string {
  const date = new Date(savedAt)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('ja-JP', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 最近使った設定（コピーした時点の選択）を直近 5 件まで並べ、クリックで復元する
export function RecentList({ entries, catalog, onRestore }: Props) {
  return (
    <section className="recent" aria-labelledby="recent-heading">
      <h2 id="recent-heading" className="recent-heading">
        最近使った設定
      </h2>
      {entries.length === 0 ? (
        <p className="recent-empty">プロンプトをコピーすると、そのときの選択がここに残ります。</p>
      ) : (
        <ul className="recent-list">
          {entries.map((entry) => {
            const { presetName, changes } = describeSelection(entry.selection, catalog)
            return (
              <li key={entry.savedAt}>
                <button
                  type="button"
                  className="recent-item"
                  onClick={() => onRestore(entry.selection)}
                >
                  <span className="recent-name">{presetName}</span>
                  <span className="recent-changes">
                    {changes.length === 0 ? '既定のまま' : changes.join('・')}
                  </span>
                  <span className="recent-time">{formatSavedAt(entry.savedAt)}</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
