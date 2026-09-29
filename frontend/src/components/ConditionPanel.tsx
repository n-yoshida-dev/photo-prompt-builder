import type { Choice, ChoiceId, Selection, Toggle, ToggleId } from '../prompt/types'

type Props = {
  choices: Choice[]
  toggles: Toggle[]
  selection: Selection
  onChoiceChange: (choiceId: ChoiceId, optionId: string) => void
  onToggleChange: (toggleId: ToggleId, on: boolean) => void
}

// 仕上がりの調整。ラジオ（1 つ選ぶ）と ON/OFF を並べる。人物・構図の保持は固定なのでここには出さない（SPEC.md「条件」）
export function ConditionPanel({
  choices,
  toggles,
  selection,
  onChoiceChange,
  onToggleChange,
}: Props) {
  return (
    <fieldset className="step">
      <legend className="step-heading">
        <span className="step-number">3</span>仕上がりを調整する
      </legend>
      <p className="step-note">顔・服装・ポーズ・人数を変えない指示は、いつも自動で入ります。</p>

      {choices.map((choice) => (
        <fieldset key={choice.id} className="choice">
          <legend className="choice-label">{choice.label}</legend>
          <div className="segmented">
            {choice.options.map((option) => (
              <label key={option.id} className="segment">
                <input
                  type="radio"
                  name={`choice-${choice.id}`}
                  value={option.id}
                  checked={selection.choices[choice.id] === option.id}
                  onChange={() => onChoiceChange(choice.id, option.id)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}

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
