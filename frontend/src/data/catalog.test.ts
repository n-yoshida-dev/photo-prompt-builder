// @vitest-environment node
// 画面を使わないテストなので Node 環境で動かす（jsdom では import.meta.url が file: にならず原文を読めない）
/// <reference types="node" />
import { existsSync, readFileSync } from 'node:fs'
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

// Web 原文の記録（原文・書き換えた箇所・書き換え版）。プリセットからは外したが、記録として残している
const webMarkdown = readFileSync(new URL('../../../docs/web-prompts.md', import.meta.url), 'utf-8')

// 記録に残した原文の著作権表示と許諾文（リポジトリの中だけに置く。公開物には入れない）
const noticesText = readFileSync(
  new URL('../../../docs/third-party-notices.txt', import.meta.url),
  'utf-8',
)

// frontend/public/ はビルドで dist/ にそのまま入る（公開物）
const publicDir = new URL('../../public/', import.meta.url)

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

// Web で公開された原文を種にしたプリセット
const webPresets = catalog.presets.filter((p) => p.source.kind === 'web')

describe('ユーザー提供の原文のプリセットは原文のまま', () => {
  // diorama-family は diorama と同じ原文を使い、人物を残す指示はアプリが足すブロックで付ける（logs/decisions.md 2026-10-03）
  it.each(['diorama', 'diorama-family', 'editorial-poster'])(
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

// Web 原文の 3 本（painted-anime・watercolor・instant-photo）は 2026-10-04 に外した（logs/decisions.md「パッとしない 5 本は外す」）。
// Web 原文のプリセットを戻すときは、出典の表示と presets.ts との照合のテストを、外す前の版（git 履歴）から戻す
describe('Web 原文の扱い', () => {
  it('Web 原文のプリセットは今は無く、公開物に第三者の表示を入れていない', () => {
    expect(webPresets).toEqual([])
    expect(existsSync(new URL('third-party-notices.txt', publicDir))).toBe(false)
  })

  // web-prompts.md の「## {id}（…」の見出しから、記録に残っている id を読む
  const recordedIds = [...webMarkdown.matchAll(/^## ([a-z-]+)（/gm)].map((m) => m[1] ?? '')

  it('外した 3 本の記録が web-prompts.md に残っている', () => {
    expect(recordedIds).toEqual(['painted-anime', 'watercolor', 'instant-photo'])
  })

  it.each(recordedIds)('%s：記録の原文に書き換え表を当てると書き換え版になる', (id) => {
    const section = webSection(id)
    let expected = unwrapParagraphs(codeBlockAfter(section, '原文'))
    for (const [from, to] of replacementsIn(section)) {
      // 書き換える語句は原文にちょうど 1 回だけ出る（どこを書き換えたかが一意に決まる）
      expect(expected.split(from).length - 1, `${id}: ${from}`).toBe(1)
      expected = expected.replace(from, to)
    }
    expect(codeBlockAfter(section, '書き換え版')).toBe(expected)
  })

  it('記録に残した原文の著作権表示と MIT の許諾文の全文が、リポジトリに残っている', () => {
    expect(noticesText).toContain('Copyright (c) 2026 Albert')
    // CC BY 4.0 も、作者が付けた著作権表示を残す（3(a)(1)(A)(ii)）
    expect(noticesText).toContain('Copyright (c) 2026 SeeAPI.')
    expect(noticesText).toContain('Permission is hereby granted, free of charge')
    expect(noticesText).toContain('The above copyright notice and this permission notice')
    expect(noticesText).toContain('THE SOFTWARE IS PROVIDED "AS IS"')
  })

  it('実在のスタジオ名・商標がプロンプトに残っていない（logs/decisions.md 2026-10-03）', () => {
    for (const preset of catalog.presets) {
      for (const name of ['Ghibli', 'Polaroid']) {
        expect(`${preset.base} ${preset.style}`, preset.id).not.toContain(name)
      }
    }
  })
})

describe('人物を残す版と消す版のペア（logs/decisions.md 2026-10-03「カードを分ける」）', () => {
  it.each([
    ['diorama', 'diorama-family'],
    ['travel-stamps', 'travel-stamps-family'],
  ])('%s と %s は同じ文で、被写体と Do not だけが違う', (sceneId, familyId) => {
    const scene = catalog.presets.find((p) => p.id === sceneId)
    const family = catalog.presets.find((p) => p.id === familyId)
    if (!scene || !family) {
      throw new Error(`${sceneId} か ${familyId} がありません`)
    }
    expect(family.base).toBe(scene.base)
    expect(family.style).toBe(scene.style)
    expect(family.defaultToggles).toEqual(scene.defaultToggles)
    expect(scene.subject).toBe('scene')
    // 旅のスタンプ（家族も）は、顔もスタンプの線で描く版の被写体を使う（logs/decisions.md 2026-10-04）
    expect(['people-in-scene', 'people-in-scene-drawn']).toContain(family.subject)
    expect(scene.negative.join(' ')).toMatch(/include any of the people/)
    expect(family.negative.join(' ')).toMatch(/remove any of the people/)
  })
})

describe('出典の種類', () => {
  it('Web 原文だけが出典の URL を持ち、ユーザー提供と自作は持たない', () => {
    for (const preset of catalog.presets) {
      expect(preset.source.url !== undefined, preset.id).toBe(preset.source.kind === 'web')
    }
  })

  it('Claude の自作は、カードに出る出典名が「Claude の自作」', () => {
    const selfMade = catalog.presets.filter((p) => p.source.kind === 'claude')
    expect(selfMade.map((p) => p.id)).toEqual([
      'doodle-friends',
      'sketchbook-extension',
      'pop-up-book',
      'commemorative-stamp',
      'sugoroku-board',
      'specimen-box',
      'travel-stamps',
      'travel-stamps-family',
    ])
    for (const preset of selfMade) {
      expect(preset.source.label, preset.id).toBe('Claude の自作')
    }
  })
})

describe('マスタデータの形', () => {
  it('ラジオ 3 種・トグル 6 つ・保持文 6 組がある', () => {
    expect(catalog.choices.map((c) => c.id)).toEqual([
      'style-strength',
      'color-mood',
      'aspect-ratio',
    ])
    expect(catalog.toggles).toHaveLength(6)
    expect(Object.keys(catalog.preserve).sort()).toEqual([
      'objects',
      'people',
      'people-as-pieces',
      'people-in-scene',
      'people-in-scene-drawn',
      'scene',
    ])
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

  // 画面の言葉は SPEC.md「条件」の表（logs/decisions.md 2026-10-03「仕上がりを調整する」の言葉を直す）
  it('ラジオの名前と選択肢の言葉が SPEC の表どおり', () => {
    expect(catalog.choices.map((c) => [c.label, c.options.map((o) => o.label)])).toEqual([
      ['加工の強さ', ['標準', '控えめ（写真に近い）', 'しっかり（イラストらしく）']],
      ['色味', ['元のまま', '淡く', '鮮やかに', '白黒']],
      ['縦横比', ['元のまま', '正方形 1:1', '縦 3:4', '横 16:9']],
    ])
  })

  it('どの選択肢にも、何が変わるかの一文がある', () => {
    for (const choice of catalog.choices) {
      for (const option of choice.options) {
        expect(option.note.trim(), `${choice.id}.${option.id}`).not.toBe('')
      }
    }
  })

  it('縦横比の形の図は、名前の比と同じ形を持つ（元のままは形を持たない）', () => {
    const aspect = catalog.choices.find((c) => c.id === 'aspect-ratio')
    expect(aspect).toBeDefined()
    for (const option of aspect?.options ?? []) {
      const ratio = /(\d+):(\d+)/.exec(option.label)
      if (!ratio) {
        expect(option.shape, option.id).toBeUndefined()
        continue
      }
      expect(option.shape, option.id).toEqual({ width: Number(ratio[1]), height: Number(ratio[2]) })
    }
    // 形を持つのは縦横比だけ
    for (const choice of catalog.choices.filter((c) => c.id !== 'aspect-ratio')) {
      expect(
        choice.options.some((o) => o.shape),
        choice.id,
      ).toBe(false)
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

  it('people-in-scene は人物の保持文と場所の構図を併せ持ち、元のカメラの角度は求めない', () => {
    const mixed = catalog.preserve['people-in-scene']
    expect(mixed.identity).toEqual(catalog.preserve.people.identity)
    for (const line of catalog.preserve.scene.composition) {
      expect(mixed.composition).toContain(line)
    }
    // people の構図の 1 行目（元のカメラの角度）は、ジオラマの斜め上からの見せ方とぶつかる
    const cameraLine = catalog.preserve.people.composition[0]
    expect(cameraLine).toMatch(/camera angle/)
    expect(mixed.composition).not.toContain(cameraLine)
  })

  // 顔も画風に寄せる版は、顔立ちの行だけが違う。そばかすまで残す・肌をなめらかにしない、が顔を写実に引っ張るため（KNOWLEDGE.md 2026-10-11）
  it('people-in-scene-drawn は people-in-scene と顔立ちの行だけが違い、顔も画風の線で描く', () => {
    const mixed = catalog.preserve['people-in-scene']
    const drawn = catalog.preserve['people-in-scene-drawn']
    expect(drawn.composition).toEqual(mixed.composition)
    expect(drawn.identity).toHaveLength(mixed.identity.length)
    const changed = drawn.identity.filter((line, i) => line !== mixed.identity[i])
    expect(changed).toHaveLength(1)
    expect(changed[0]).toMatch(/same few bold lines and flat colors/)
    expect(changed[0]).not.toMatch(/freckles|skin smoothing/)
    // 誰か分かる手がかり（肌の色・眼鏡）と、美化しないことは残す
    expect(changed[0]).toMatch(/skin tone/)
    expect(changed[0]).toMatch(/glasses if worn/)
    expect(changed[0]).toMatch(/no beautifying or makeup/)
  })

  // 標本箱は物を仕切りに並べ直すので、場所の配置を保つ文とぶつかる。人物も写さない
  it('objects は人物の保持文も場所の構図の文も持たない', () => {
    const objects = catalog.preserve.objects
    expect(objects.identity.length).toBeGreaterThan(0)
    for (const line of [
      ...catalog.preserve.people.identity,
      ...catalog.preserve.scene.composition,
    ]) {
      expect(objects.identity).not.toContain(line)
      expect(objects.composition).not.toContain(line)
    }
  })

  // すごろく盤は家族をコマにして盤のマスに置くので、写真と同じ位置・並び・本物どおりの大きさを求める文を付けない
  it('people-as-pieces は人物の顔立ちと場所の構図を持ち、写真と同じ位置や並びは求めない', () => {
    const pieces = catalog.preserve['people-as-pieces']
    expect(pieces.composition).toEqual(catalog.preserve.scene.composition)
    for (const line of catalog.preserve['people-in-scene'].composition) {
      if (!catalog.preserve.scene.composition.includes(line)) {
        expect(pieces.composition, line).not.toContain(line)
      }
    }
    const arrangement = catalog.preserve.people.identity.find((l) =>
      l.startsWith('How the people are arranged'),
    )
    expect(arrangement).toBeDefined()
    expect(pieces.identity).not.toContain(arrangement)
    // 並び以外の人物の保持文（顔・髪・表情・年齢・体格・服・人数・ポーズ）はすべて持つ
    for (const line of catalog.preserve.people.identity.filter((l) => l !== arrangement)) {
      expect(pieces.identity).toContain(line)
    }
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
