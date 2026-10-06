import { useId } from 'react'
import type { Choice, ChoiceOption, ChoiceId, Selection, Toggle, ToggleId } from '../prompt/types'

type Props = {
  choices: Choice[]
  toggles: Toggle[]
  selection: Selection
  onChoiceChange: (choiceId: ChoiceId, optionId: string) => void
  onToggleChange: (toggleId: ToggleId, on: boolean) => void
}

// 縦横比の選択肢に付ける小さな形の図。形を持たない選択肢（元のまま）は、点線の枠で「写真の形のまま」を表す
function ShapeIcon({ shape }: { shape: ChoiceOption['shape'] }) {
  if (!shape) {
    return <span className="option-shape option-shape-free" aria-hidden="true" />
  }
  return (
    <span
      className="option-shape"
      style={{ aspectRatio: `${shape.width} / ${shape.height}` }}
      aria-hidden="true"
    />
  )
}

// 仕上がりの調整。ラジオ（1 つ選ぶ）と ON/OFF を並べる。人物・構図の保持は固定なのでここには出さない（SPEC.md「条件」）
// ラジオは選択肢ごとのカードにし、下に何が変わるかの一文を置く（logs/decisions.md 2026-10-03）
export function ConditionPanel({
  choices,
  toggles,
  selection,
  onChoiceChange,
  onToggleChange,
}: Props) {
  const baseId = useId()

  return (
    <fieldset className="step">
      <legend className="step-heading">
        <span className="step-number">2</span>仕上がりを調整する
      </legend>
      <p className="step-note">顔・服装・ポーズ・人数を変えない指示は、いつも自動で入ります。</p>

      {choices.map((choice) => {
        // 形の図は、形を持つ選択肢があるラジオ（縦横比）だけに付ける
        const showShapes = choice.options.some((option) => option.shape)
        return (
          <fieldset key={choice.id} className="choice">
            <legend className="choice-label">{choice.label}</legend>
            <div className="option-list">
              {choice.options.map((option) => {
                const noteId = `${baseId}-${choice.id}-${option.id}-note`
                return (
                  <div key={option.id} className="option-card">
                    {/* 説明の一文はラベルの外に置き、ラジオの名前を短く保つ（説明は aria-describedby で読む） */}
                    <label className="option-choice">
                      <input
                        type="radio"
                        name={`choice-${choice.id}`}
                        value={option.id}
                        checked={selection.choices[choice.id] === option.id}
                        onChange={() => onChoiceChange(choice.id, option.id)}
                        aria-describedby={noteId}
                      />
                      {showShapes && <ShapeIcon shape={option.shape} />}
                      <span className="option-name">{option.label}</span>
                    </label>
                    <p id={noteId} className="option-note">
                      {option.note}
                    </p>
                  </div>
                )
              })}
            </div>
          </fieldset>
        )
      })}

      <ul className="toggle-list">
        {toggles.map((toggle) => (
          <li key={toggle.id}>
            <label className="toggle">
              <input
                type="checkbox"
                checked={selection.toggleIds.includes(toggle.id)}
                onChange={(event) => onToggleChange(toggle.id, event.target.checked)}
              />
              <span>{toggle.label}</span>
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  )
}
