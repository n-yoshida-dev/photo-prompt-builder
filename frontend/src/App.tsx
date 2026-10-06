import { useMemo, useRef, useState } from 'react'
import { ConditionPanel } from './components/ConditionPanel'
import { PresetPicker } from './components/PresetPicker'
import { PromptActions } from './components/PromptActions'
import { PromptView } from './components/PromptView'
import { RecentList } from './components/RecentList'
import { aiSites } from './data/aiSites'
import { catalog } from './data/catalog'
import { buildPrompt } from './prompt/buildPrompt'
import { defaultSelection, switchPreset } from './prompt/selection'
import type { ChoiceId, Selection, ToggleId } from './prompt/types'
import { loadRecent, saveRecent, type RecentEntry } from './storage/recent'

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
  const [recent, setRecent] = useState<RecentEntry[]>(() => loadRecent())

  // 「コピー」を押した時点の選択を「最近使った設定」に残す（SPEC.md「保存」。コピーの成否は問わない）
  function rememberSelection() {
    setRecent(saveRecent(recent, selection, new Date().toISOString()))
  }

  // コピーできなかったとき、欄の文字を全選択して手動でコピーできるようにする。選択は成功時と同じく残す
  function handleCopyFailed() {
    promptRef.current?.focus()
    promptRef.current?.select()
    rememberSelection()
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
          <PromptActions
            prompt={prompt}
            sites={aiSites}
            onCopied={rememberSelection}
            onCopyFailed={handleCopyFailed}
          />
        </div>
        <div className="history">
          <RecentList entries={recent} catalog={catalog} onRestore={setSelection} />
        </div>
      </main>
    </div>
  )
}

export default App
