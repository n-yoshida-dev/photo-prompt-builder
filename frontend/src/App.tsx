import { useMemo, useRef, useState } from 'react'
import { ConditionPanel } from './components/ConditionPanel'
import { PhotoPicker } from './components/PhotoPicker'
import { PresetPicker } from './components/PresetPicker'
import { PromptActions } from './components/PromptActions'
import { PromptView } from './components/PromptView'
import { aiSites } from './data/aiSites'
import { catalog } from './data/catalog'
import { buildPrompt } from './prompt/buildPrompt'
import { defaultSelection, switchPreset } from './prompt/selection'
import type { ChoiceId, Selection, ToggleId } from './prompt/types'

// 起動時に選んでおくプリセット（マスタデータの先頭）。空なら設定の誤りなので起動時に止める
function initialSelection(): Selection {
  const first = catalog.presets[0]
  if (!first) {
    throw new Error('プリセットが 1 つもありません（src/data/presets.ts を確認してください）')
  }
  return defaultSelection(first.id)
}

// アプリのルート。選択状態を 1 か所で持ち、プロンプトは選択から毎回組み立て直す
function App() {
  const [selection, setSelection] = useState<Selection>(initialSelection)
  const prompt = useMemo(() => buildPrompt(selection), [selection])
  const promptRef = useRef<HTMLTextAreaElement>(null)

  // コピーできなかったとき、欄の文字を全選択して手動でコピーできるようにする
  function selectPromptText() {
    promptRef.current?.focus()
    promptRef.current?.select()
  }

  // ラジオの選択を変える
  function handleChoiceChange(choiceId: ChoiceId, optionId: string) {
    setSelection((current) => ({
      ...current,
      choices: { ...current.choices, [choiceId]: optionId },
    }))
  }

  // トグルの ON/OFF を変える
  function handleToggleChange(toggleId: ToggleId, on: boolean) {
    setSelection((current) => ({
      ...current,
      toggleIds: on
        ? [...current.toggleIds.filter((id) => id !== toggleId), toggleId]
        : current.toggleIds.filter((id) => id !== toggleId),
    }))
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">photo-prompt-builder</h1>
        <p className="app-lead">
          子どもの写真を AI で加工するための英語のプロンプトを、選ぶだけで組み立てます。
        </p>
      </header>
      <main className="workspace">
        <div className="controls">
          <PhotoPicker />
          <PresetPicker
            presets={catalog.presets}
            selectedId={selection.presetId}
            onSelect={(presetId) => setSelection((current) => switchPreset(current, presetId))}
          />
          <ConditionPanel
            choices={catalog.choices}
            toggles={catalog.toggles}
            selection={selection}
            onChoiceChange={handleChoiceChange}
            onToggleChange={handleToggleChange}
          />
        </div>
        <div className="output">
          <PromptView prompt={prompt} textareaRef={promptRef} />
          <PromptActions prompt={prompt} sites={aiSites} onCopyFailed={selectPromptText} />
        </div>
      </main>
    </div>
  )
}

export default App
