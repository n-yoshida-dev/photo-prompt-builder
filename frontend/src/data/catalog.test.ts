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

// Web 原文の記録（原文・書き換えた箇所・書き換え版）。presets.ts の英文と照合する
const webMarkdown = readFileSync(new URL('../../../docs/web-prompts.md', import.meta.url), 'utf-8')

// 公開物に入る第三者の表示（frontend/public/ はビルドで dist/ にそのまま入る）
const publicDir = new URL('../../public/', import.meta.url)
const noticesText = readFileSync(new URL('third-party-notices.txt', publicDir), 'utf-8')

// Markdown から、指定した書き出しで始まる段落を 1 つ取り出す
function paragraphStartingWith(markdown: string, head: string): string {
  const found = markdown.split(/\r?\n\r?\n/).find((paragraph) => paragraph.startsWith(head))
  if (!found) {
    throw new Error(`seed-prompts.md に「${head}」で始まる段落がありません`)
  }
  return found
}

// web-prompts.md から、見出し「## {id}（…」の節を取り出す
function webSection(id: string): string {
  const found = webMarkdown.split(/^## /m).find((section) => section.startsWith(`${id}（`))
  if (!found) {
    throw new Error(`web-prompts.md に「## ${id}（」の節がありません`)
  }
  return found
}

// 節の中で「### {heading}」の直後に置いた text のコードブロックの中身を取り出す
function codeBlockAfter(section: string, heading: string): string {
  const match = new RegExp(`^### ${heading}\\n\\n\`\`\`text\\n([\\s\\S]*?)\\n\`\`\``, 'm').exec(
    section,
  )
  if (!match?.[1]) {
    throw new Error(`web-prompts.md の節に「### ${heading}」のコードブロックがありません`)
  }
  return match[1]
}

// 「### 書き換えた箇所」の表から [原文の語句, 書き換え後] の組を読む。1・2 列目は ` で囲む約束（web-prompts.md 冒頭）
function replacementsIn(section: string): [string, string][] {
  const table = section.split(/^### 書き換えた箇所$/m)[1]?.split(/^### /m)[0]
  if (table === undefined) {
    throw new Error('web-prompts.md の節に「### 書き換えた箇所」がありません')
  }
  return [...table.matchAll(/^\| `([^`]+)` \| `([^`]*)` \|/gm)].map((m) => [m[1] ?? '', m[2] ?? ''])
}

// 段落の途中の改行（Markdown のソースの折り返し。表示では空白になる）を空白 1 つにする
function unwrapParagraphs(text: string): string {
  return text
    .split('\n\n')
    .map((paragraph) => paragraph.replace(/\n/g, ' '))
    .join('\n\n')
}

// Web で公開された原文を種にしたプリセット（出典の URL を持つもの）
const webPresets = catalog.presets.filter((p) => p.source.url !== undefined)

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

describe('Web 原文のプリセットは、書き換えた箇所の表に載せた語句以外は原文のまま', () => {
  it('Web 原文のプリセットが 3 本ある', () => {
    expect(webPresets.map((p) => p.id)).toEqual(['painted-anime', 'watercolor', 'instant-photo'])
  })

  it.each(webPresets.map((p) => p.id))(
    '%s：原文に書き換え表を当てると書き換え版になり、presets.ts と一字一句一致する',
    (id) => {
      const preset = catalog.presets.find((p) => p.id === id)
      if (!preset) {
        throw new Error(`プリセット ${id} がありません`)
      }
      const section = webSection(id)
      let expected = unwrapParagraphs(codeBlockAfter(section, '原文'))
      for (const [from, to] of replacementsIn(section)) {
        // 書き換える語句は原文にちょうど 1 回だけ出る（どこを書き換えたかが一意に決まる）
        expect(expected.split(from).length - 1, `${id}: ${from}`).toBe(1)
        expected = expected.replace(from, to)
      }
      expect(codeBlockAfter(section, '書き換え版')).toBe(expected)
      expect(`${preset.base} ${preset.style}`).toBe(expected)
    },
  )

  it('実在のスタジオ名・商標がプロンプトに残っていない（logs/decisions.md 2026-10-03）', () => {
    for (const preset of catalog.presets) {
      for (const name of ['Ghibli', 'Polaroid']) {
        expect(`${preset.base} ${preset.style}`, preset.id).not.toContain(name)
      }
    }
  })

  it.each(webPresets.map((p) => p.id))(
    '%s：出典の表示に要るもの（作者・URL・ライセンスとそのリンク・確認日）が揃い、公開物の表示に載っている',
    (id) => {
      const source = catalog.presets.find((p) => p.id === id)?.source
      expect(source?.label, id).toMatch(/ — /) // 「作者 — 作品名」
      expect(source?.license, id).toBeTruthy()
      expect(source?.licenseUrl, id).toBeTruthy()
      expect(source?.checkedOn, id).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(noticesText, id).toContain(source?.url)
      expect(noticesText, id).toContain(`"${id}"`)
    },
  )

  it('MIT のプリセットは、著作権表示と許諾文の全文を公開物に同梱し、ライセンスのリンクがそれを指す', () => {
    const mitPresets = webPresets.filter((p) => p.source.license === 'MIT')
    expect(mitPresets.length).toBeGreaterThan(0)
    for (const preset of mitPresets) {
      const licenseUrl = preset.source.licenseUrl ?? ''
      // アプリ内のファイルを相対パスで指す（GitHub Pages の base の下でも開ける）
      expect(licenseUrl, preset.id).not.toMatch(/^https?:/)
      expect(readFileSync(new URL(licenseUrl, publicDir), 'utf-8'), preset.id).toBe(noticesText)
    }
    expect(noticesText).toContain('Copyright (c) 2026 Albert')
    expect(noticesText).toContain('Permission is hereby granted, free of charge')
    expect(noticesText).toContain('The above copyright notice and this permission notice')
    expect(noticesText).toContain('THE SOFTWARE IS PROVIDED "AS IS"')
  })
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
