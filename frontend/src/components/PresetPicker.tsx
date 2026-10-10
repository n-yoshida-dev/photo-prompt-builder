import type { Preset, PresetSource } from '../prompt/types'

type Props = {
  presets: Preset[]
  selectedId: string
  onSelect: (presetId: string) => void
}

// 被写体の区別を利用者の言葉で表す
const SUBJECT_LABEL: Record<Preset['subject'], string> = {
  people: '人物が主役',
  scene: '建物・風景が主役',
  'people-in-scene': '人物と場所が主役',
  objects: '写っている持ち物が主役',
  'people-as-pieces': '人物と場所が主役',
}

// スタイル（プリセット）を 1 つだけ選ぶ。見た目はカードだが、中身はラジオボタンなのでキーボードでも選べる
export function PresetPicker({ presets, selectedId, onSelect }: Props) {
  return (
    <fieldset className="step">
      <legend className="step-heading">
        <span className="step-number">1</span>スタイルを選ぶ
      </legend>
      <div className="preset-list">
        {presets.map((preset) => (
          <div key={preset.id} className="preset-card">
            <label className="preset-choice">
              <input
                type="radio"
                name="preset"
                value={preset.id}
                checked={preset.id === selectedId}
                onChange={() => onSelect(preset.id)}
              />
              <span className="preset-name">{preset.name}</span>
              <span className="preset-description">{preset.descriptionJa}</span>
              <span className="preset-subject">{SUBJECT_LABEL[preset.subject]}</span>
            </label>
            {/* 出典はラベルの外に置く（中に置くとリンクの文字までラジオの名前として読み上げられる） */}
            {preset.source.kind !== 'user' && <PresetCredit source={preset.source} />}
          </div>
        ))}
      </div>
    </fieldset>
  )
}

// Web 原文と Claude の自作のプリセットの出典。ユーザー提供のものには出さない
// Web 原文は作者・ライセンス・書き換えたことを出し、CC BY 4.0 と MIT の表示を、アプリを使う人の目に届く形で満たす（logs/decisions.md 2026-10-03）
function PresetCredit({ source }: { source: PresetSource }) {
  if (source.kind !== 'web' || source.url === undefined) {
    return <p className="preset-credit">出典：{source.label}</p>
  }
  return (
    <p className="preset-credit">
      出典：
      <a href={source.url} target="_blank" rel="noreferrer">
        {source.label}
      </a>
      {source.license && (
        <>
          （
          {source.licenseUrl ? (
            <a href={source.licenseUrl} target="_blank" rel="noreferrer">
              {source.license}
            </a>
          ) : (
            source.license
          )}
          ）
        </>
      )}
      {source.modified && <span className="preset-credit-modified">変更：{source.modified}</span>}
    </p>
  )
}
