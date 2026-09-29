import { useState } from 'react'
import type { AiSite } from '../data/aiSites'

type Props = {
  prompt: string
  sites: AiSite[]
  onCopied?: () => void // コピーに成功したとき（最近使った設定の保存に使う）
  onCopyFailed?: () => void // コピーできなかったとき（手動でコピーできるよう欄を選ぶ）
}

type CopyState = 'idle' | 'copied' | 'failed'

// コピーボタンと、各 AI のサイトを新しいタブで開くボタン
export function PromptActions({ prompt, sites, onCopied, onCopyFailed }: Props) {
  const [copyState, setCopyState] = useState<CopyState>('idle')

  // クリップボードへ書き込む。使えない・拒否されたときは失敗を画面に出す（握りつぶさない）
  async function handleCopy() {
    try {
      if (!navigator.clipboard) {
        throw new Error('このブラウザではクリップボードに書き込めません')
      }
      await navigator.clipboard.writeText(prompt)
      setCopyState('copied')
      onCopied?.()
    } catch (error) {
      console.error('プロンプトのコピーに失敗しました', error)
      setCopyState('failed')
      onCopyFailed?.()
    }
  }

  return (
    <div className="actions">
      <button type="button" className="copy-button" onClick={handleCopy}>
        プロンプトをコピー
      </button>
      <p className="copy-status" role="status">
        {copyState === 'copied' && 'コピーしました。開いた先の入力欄に貼り付けてください。'}
        {copyState === 'failed' &&
          'コピーできませんでした。上の欄の文字を選んであるので、手動でコピーしてください。'}
      </p>
      <p className="open-note">写真は、開いた先の画面で自分で添付します。</p>
      <ul className="open-list">
        {sites.map((site) => (
          <li key={site.id}>
            <a className="open-link" href={site.url} target="_blank" rel="noopener noreferrer">
              {site.name} を開く
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
