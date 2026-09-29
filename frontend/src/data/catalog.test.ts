// @vitest-environment node
// 画面を使わないテストなので Node 環境で動かす（jsdom では import.meta.url が file: にならず原文を読めない）
/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { buildPrompt } from '../prompt/buildPrompt'
import { defaultSelection } from '../prompt/selection'
import { catalog } from './catalog'

// ユーザー提供の原文。data に持ち込んだ英文が改変されていないことをこのファイルと照合する
// Vite の ?raw は frontend/ の外を読めない（server.fs の制限）ので、テストでは Node の fs で読む
const seedMarkdown = readFileSync(
  new URL('../../../docs/seed-prompts.md', import.meta.url),
  'utf-8',
)

// Markdown から、指定した書き出しで始まる段落を 1 つ取り出す
function paragraphStartingWith(markdown: string, head: string): string {
  const found = markdown.split(/\r?\n\r?\n/).find((paragraph) => paragraph.startsWith(head))
  if (!found) {
    throw new Error(`seed-prompts.md に「${head}」で始まる段落がありません`)
  }
  return found
}

describe('確定 2 本のプリセットは原文のまま', () => {
  it.each(['diorama', 'editorial-poster'])(
    '%s の base と style を繋ぐと原文と一字一句一致する',
    (id) => {
      const preset = catalog.presets.find((p) => p.id === id)
      if (!preset) {
        throw new Error(`プリセット ${id} がありません`)
      }
      const original = paragraphStartingWith(seedMarkdown, preset.base.slice(0, 40))
      expect(`${preset.base} ${preset.style}`).toBe(original)
    },
  )
})

describe('マスタデータの形', () => {
  it('ラジオ 3 種・トグル 6 つ・保持文 2 組がある', () => {
    expect(catalog.choices.map((c) => c.id)).toEqual([
      'style-strength',
      'color-mood',
      'aspect-ratio',
    ])
    expect(catalog.toggles).toHaveLength(6)
    expect(Object.keys(catalog.preserve).sort()).toEqual(['people', 'scene'])
  })

  it('ラジオは先頭（既定）の英文が空で、それ以外は空でない', () => {
    for (const choice of catalog.choices) {
      const [first, ...rest] = choice.options
      expect(first?.text, choice.id).toBe('')
      expect(rest.length, choice.id).toBeGreaterThan(0)
      for (const option of rest) {
        expect(option.text, `${choice.id}.${option.id}`).not.toBe('')
      }
    }
  })

  it('id に重複が無い', () => {
    const presetIds = catalog.presets.map((p) => p.id)
    expect(new Set(presetIds).size).toBe(presetIds.length)
    const toggleIds = catalog.toggles.map((t) => t.id)
    expect(new Set(toggleIds).size).toBe(toggleIds.length)
    for (const choice of catalog.choices) {
      const optionIds = choice.options.map((o) => o.id)
      expect(new Set(optionIds).size, choice.id).toBe(optionIds.length)
    }
  })

  it('プリセットの既定トグルはすべて実在するトグル', () => {
    const toggleIds = new Set(catalog.toggles.map((t) => t.id))
    for (const preset of catalog.presets) {
      for (const id of preset.defaultToggles) {
        expect(toggleIds.has(id), `${preset.id}: ${id}`).toBe(true)
      }
    }
  })

  it('people は identity を持ち、scene は identity を持たない', () => {
    expect(catalog.preserve.people.identity.length).toBeGreaterThan(0)
    expect(catalog.preserve.scene.identity).toEqual([])
  })

  it('英文の文法の約束を守る（Do not に続く句は小文字始まり、命令文はピリオドで終わる）', () => {
    for (const toggle of catalog.toggles) {
      expect(toggle.text, toggle.id).toBe(toggle.text.trim())
      if (toggle.block === 'negative') {
        expect(toggle.text, toggle.id).toMatch(/^[a-z]/)
      } else {
        expect(toggle.text, toggle.id).toMatch(/^[A-Z].*\.$/)
      }
    }
    for (const choice of catalog.choices) {
      for (const option of choice.options.slice(1)) {
        expect(option.text, `${choice.id}.${option.id}`).toMatch(/^[A-Z].*\.$/)
      }
    }
    for (const preset of catalog.presets) {
      for (const text of preset.negative) {
        expect(text, preset.id).toMatch(/^[a-z]/)
      }
    }
  })

  it('保持文は大文字始まり・ピリオド無しの箇条（名詞句かどうかまでは機械で見ない）', () => {
    for (const [subject, set] of Object.entries(catalog.preserve)) {
      for (const text of [...set.identity, ...set.composition]) {
        expect(text, subject).toMatch(/^[A-Z]/)
        expect(text, subject).not.toMatch(/\.$/)
        expect(text, subject).toBe(text.trim())
      }
    }
  })
})

describe('全プリセット × 既定の条件の出力全文', () => {
  // 出力全文をスナップショットに保存し、次回と比較する（意図せぬ変更の検出。SPEC.md「検算の手段」）
  // 英文を意図して変えたときは `npx vitest run -u` で更新し、差分を PR で確かめる
  it.each(catalog.presets.map((p) => p.id))('%s', (id) => {
    expect(buildPrompt(defaultSelection(id))).toMatchSnapshot()
  })
})
