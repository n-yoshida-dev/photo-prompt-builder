import type { Preset } from '../prompt/types'

type Props = {
  presets: Preset[]
  selectedId: string
  onSelect: (presetId: string) => void
}

// 被写体の区別を利用者の言葉で表す
const SUBJECT_LABEL: Record<Preset['subject'], string> = {
  people: '人物を残す',
  scene: '建物・風景が主役（人物は消える）',
}

// スタイル（プリセット）を 1 つだけ選ぶ。見た目はカードだが、中身はラジオボタンなのでキーボードでも選べる
export function PresetPicker({ presets, selectedId, onSelect }: Props) {
  return (
    <fieldset className="step">
      <legend className="step-heading">
        <span className="step-number">2</span>スタイルを選ぶ
      </legend>
      <div className="preset-list">
        {presets.map((preset) => (
          <label key={preset.id} className="preset-card">
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
        ))}
      </div>
    </fieldset>
  )
}
