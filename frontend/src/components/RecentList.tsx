import type { Catalog, Selection } from '../prompt/types'
import type { RecentEntry } from '../storage/recent'
import { changesText, describeSelection, formatSavedAt } from './selectionSummary'

type Props = {
  entries: RecentEntry[]
  catalog: Catalog
  onRestore: (selection: Selection) => void
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
                  <span className="recent-changes">{changesText(changes)}</span>
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
