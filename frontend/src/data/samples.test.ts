// @vitest-environment node
// 画面を使わないテストなので Node 環境で動かす（catalog.test.ts と同じく、frontend/ の外のファイルを fs で読む）
/// <reference types="node" />
import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { buildPrompt } from '../prompt/buildPrompt'
import { defaultSelection } from '../prompt/selection'
import { presets } from './presets'
import { presetSamples, sampleOriginals } from './samples'

// 見本の画像の置き場（ビルドで dist/ にそのまま入る）
const samplesDir = new URL('../../public/samples/', import.meta.url)

// 見本を作ったときに使ったプロンプトの記録（docs/sample-images.md）
const promptsDir = new URL('../../../docs/sample-images/prompts/', import.meta.url)

// WebP のファイルの頭から、画像の横と縦（px）を読む。画像処理のライブラリを入れずに済むよう、RIFF の最初のチャンクだけを見る
// （VP8X は拡張形式。Chromium の canvas で書き出すと色の情報を付けるのでこれになる。VP8 は非可逆、VP8L は可逆の単純形式）
function webpSize(bytes: Buffer): { width: number; height: number } {
  if (bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.toString('ascii', 8, 12) !== 'WEBP') {
    throw new Error('WebP のファイルではありません')
  }
  const chunk = bytes.toString('ascii', 12, 16)
  if (chunk === 'VP8X') {
    return { width: bytes.readUIntLE(24, 3) + 1, height: bytes.readUIntLE(27, 3) + 1 }
  }
  if (chunk === 'VP8 ') {
    return { width: bytes.readUInt16LE(26) & 0x3fff, height: bytes.readUInt16LE(28) & 0x3fff }
  }
  if (chunk === 'VP8L') {
    const bits = bytes.readUInt32LE(21)
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 }
  }
  throw new Error(`知らない WebP の形式です: ${chunk}`)
}

describe('スタイルの見本画像', () => {
  it('すべてのプリセットに見本が 1 枚ずつあり、見本だけが余っていない', () => {
    expect(Object.keys(presetSamples).sort()).toEqual(presets.map((p) => p.id).sort())
  })

  it.each(presets.map((p) => p.id))('%s の見本の画像と元の写真のファイルがある', (id) => {
    const sample = presetSamples[id]!
    expect(existsSync(new URL(sample.file, samplesDir))).toBe(true)
    const original = sampleOriginals.find((o) => o.id === sample.originalId)
    expect(original).toBeDefined()
    expect(existsSync(new URL(original!.file, samplesDir))).toBe(true)
  })

  // データの横と縦が違うと、読み込む前と後で行の幅や高さがずれる（KNOWLEDGE.md 2026-10-11）
  it.each(presets.map((p) => p.id))('%s の見本のデータの横と縦が、画像のファイルと同じ', (id) => {
    const sample = presetSamples[id]!
    const size = webpSize(readFileSync(new URL(sample.file, samplesDir)))
    expect({ width: sample.width, height: sample.height }).toEqual(size)
  })

  // 元の写真は、画面で 4:3 の枠（index.css の .sample-original img）と <img> の 320×240 に入れる
  it.each(sampleOriginals.map((o) => o.id))('元の写真 %s が 320×240 である', (id) => {
    const original = sampleOriginals.find((o) => o.id === id)!
    expect(webpSize(readFileSync(new URL(original.file, samplesDir)))).toEqual({
      width: 320,
      height: 240,
    })
  })

  // 見本は「アプリが作るプロンプト（既定の条件）そのまま」で作る（SPEC.md「スタイルの見本画像」）。
  // プリセット・保持文・トグルの文を変えてここが落ちたら、見本を作り直して記録も差し替える（手順は docs/sample-images.md）
  it.each(presets.map((p) => p.id))(
    '%s の見本を作ったプロンプトが、今のアプリのプロンプト（既定の条件）と一字一句同じ',
    (id) => {
      const recorded = readFileSync(new URL(`${id}.txt`, promptsDir), 'utf-8').trim()
      expect(buildPrompt(defaultSelection(id)).trim()).toBe(recorded)
    },
  )

  it('画像の説明（alt）が空でない', () => {
    for (const item of [...Object.values(presetSamples), ...sampleOriginals]) {
      expect(item.alt.trim()).not.toBe('')
    }
  })
})
