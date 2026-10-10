import { useId, type Ref } from 'react'

type Props = {
  prompt: string
  textareaRef?: Ref<HTMLTextAreaElement> // コピーに失敗したとき、呼び出し側が文字を全選択するため
}

// 英語の語数を数える（長さの目安として見せる）
function countWords(text: string): number {
  return text.split(/\s+/).filter((word) => word !== '').length
}

// 生成したプロンプトを、アルバムの黒い台紙に白いペンで書いたように見せる。読み取り専用
export function PromptView({ prompt, textareaRef }: Props) {
  const headingId = useId()
  return (
    <section className="album-page" aria-labelledby={headingId}>
      <div className="album-head">
        <h2 id={headingId} className="album-heading">
          できあがったプロンプト
        </h2>
        <p className="album-meta">英語 {countWords(prompt).toLocaleString('ja-JP')} 語</p>
      </div>
      {/* 中身は英文なので lang="en" を付ける（読み上げソフトが英語の声で読むように） */}
      <textarea
        ref={textareaRef}
        className="album-text"
        lang="en"
        aria-labelledby={headingId}
        value={prompt}
        readOnly
        spellCheck={false}
      />
    </section>
  )
}
