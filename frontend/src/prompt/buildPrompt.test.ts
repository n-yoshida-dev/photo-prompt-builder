import { describe, expect, it } from 'vitest'
import { HEADING_COMPOSITION, HEADING_NEGATIVE, HEADING_PRESERVE } from '../data/headings'
import { buildPrompt } from './buildPrompt'
import { defaultSelection, switchPreset } from './selection'
import type { Catalog, Selection } from './types'

// 組み立て規則だけを確かめるための小さな架空データ。本物の英文が変わってもこのテストは壊れない
const fixture: Catalog = {
  presets: [
    {
      id: 'people-preset',
      name: 'People',
      descriptionJa: '人物',
      subject: 'people',
      base: 'BASE-P.',
      style: 'STYLE-P.',
      negative: ['preset negative'],
      defaultToggles: ['no-text'],
      source: { kind: 'user', label: 'テスト' },
    },
    {
      id: 'scene-preset',
      name: 'Scene',
      descriptionJa: '風景',
      subject: 'scene',
      base: 'BASE-S.',
      style: 'STYLE-S.',
      negative: [],
      defaultToggles: [],
      source: { kind: 'user', label: 'テスト' },
    },
  ],
  preserve: {
    people: { identity: ['face', 'clothing'], composition: ['positions'] },
    scene: { identity: [], composition: ['layout'] },
  },
  toggles: [
    { id: 'no-text', label: '文字', block: 'negative', text: 'add text' },
    { id: 'no-extra-objects', label: '物', block: 'negative', text: 'add objects' },
    { id: 'one-per-photo', label: '1 枚ずつ', block: 'base', text: 'One per photo.' },
    { id: 'soft-light', label: '光', block: 'style', text: 'Soft light.' },
    { id: 'paper-texture', label: '紙', block: 'style', text: 'Paper.' },
    { id: 'print-quality', label: '印刷', block: 'style', text: 'Print.' },
  ],
  choices: [
    {
      id: 'style-strength',
      label: '強度',
      options: [
        { id: 'standard', label: '標準', text: '' },
        { id: 'photo', label: '写真寄り', text: 'Closer to photo.' },
      ],
    },
    {
      id: 'color-mood',
      label: '色味',
      options: [
        { id: 'original', label: '元のまま', text: '' },
        { id: 'muted', label: '落ち着いた', text: 'Muted.' },
      ],
    },
    {
      id: 'aspect-ratio',
      label: '縦横比',
      options: [
        { id: 'original', label: '元のまま', text: '' },
        { id: 'square', label: '1:1', text: 'Square.' },
      ],
    },
  ],
}

// テスト用の選択状態を作る。既定から一部だけ変える
function selectionWith(presetId: string, overrides: Partial<Selection> = {}): Selection {
  return { ...defaultSelection(presetId, fixture), ...overrides }
}

describe('buildPrompt', () => {
  it('トグルを ON にするとその英文が含まれ、OFF なら含まれない', () => {
    const on = buildPrompt(selectionWith('people-preset', { toggleIds: ['soft-light'] }), fixture)
    const off = buildPrompt(selectionWith('people-preset', { toggleIds: [] }), fixture)
    expect(on).toContain('Soft light.')
    expect(off).not.toContain('Soft light.')
  })

  it('ラジオは既定なら何も足さず、他を選ぶとその英文が含まれる', () => {
    const base = selectionWith('people-preset')
    const standard = buildPrompt(base, fixture)
    const photo = buildPrompt(
      { ...base, choices: { ...base.choices, 'style-strength': 'photo' } },
      fixture,
    )
    expect(standard).not.toContain('Closer to photo.')
    expect(photo).toContain('Closer to photo.')
    // 既定を選んだときは、ラジオ由来の空行も入らない
    expect(standard).toBe(
      buildPrompt({ ...base, choices: { ...base.choices, 'color-mood': 'original' } }, fixture),
    )
  })

  it('people のプリセットには固定の保持文が必ず含まれる', () => {
    const prompt = buildPrompt(selectionWith('people-preset', { toggleIds: [] }), fixture)
    expect(prompt).toContain(`${HEADING_PRESERVE}\n- face\n- clothing`)
    expect(prompt).toContain(`${HEADING_COMPOSITION}\n- positions`)
  })

  it('scene のプリセットには Preserve の見出しが出ない', () => {
    const prompt = buildPrompt(selectionWith('scene-preset'), fixture)
    expect(prompt).not.toContain(HEADING_PRESERVE)
    expect(prompt).toContain(`${HEADING_COMPOSITION}\n- layout`)
  })

  it('ブロックが空なら見出しが出ない（scene で negative のトグルが全部 OFF）', () => {
    const prompt = buildPrompt(selectionWith('scene-preset', { toggleIds: [] }), fixture)
    expect(prompt).not.toContain(HEADING_NEGATIVE)
  })

  it('組み立て規則どおりの順序と区切りで全文を出す', () => {
    const selection = selectionWith('people-preset', {
      toggleIds: ['print-quality', 'one-per-photo', 'no-extra-objects', 'soft-light', 'no-text'],
      choices: { 'style-strength': 'photo', 'color-mood': 'muted', 'aspect-ratio': 'square' },
    })
    expect(buildPrompt(selection, fixture)).toBe(
      [
        'BASE-P.\nOne per photo.',
        'STYLE-P.\nCloser to photo.\nMuted.\nSquare.\nSoft light.\nPrint.',
        `${HEADING_PRESERVE}\n- face\n- clothing`,
        `${HEADING_COMPOSITION}\n- positions`,
        `${HEADING_NEGATIVE}\n- preset negative\n- add text\n- add objects`,
      ].join('\n\n'),
    )
  })

  it('トグルの並びは選んだ順ではなくマスタデータの順になる', () => {
    const a = buildPrompt(
      selectionWith('people-preset', { toggleIds: ['print-quality', 'soft-light'] }),
      fixture,
    )
    const b = buildPrompt(
      selectionWith('people-preset', { toggleIds: ['soft-light', 'print-quality'] }),
      fixture,
    )
    expect(a).toBe(b)
  })

  it('不明なプリセット id は例外にする（保存データの破損を握りつぶさない）', () => {
    expect(() =>
      buildPrompt({ ...selectionWith('people-preset'), presetId: 'nope' }, fixture),
    ).toThrow('nope')
  })

  it('不明な選択肢 id は例外にする', () => {
    const base = selectionWith('people-preset')
    expect(() =>
      buildPrompt({ ...base, choices: { ...base.choices, 'color-mood': 'nope' } }, fixture),
    ).toThrow('color-mood')
  })
})

describe('selection', () => {
  it('defaultSelection はプリセットの既定トグルとラジオの先頭を選ぶ', () => {
    expect(defaultSelection('people-preset', fixture)).toEqual({
      presetId: 'people-preset',
      toggleIds: ['no-text'],
      choices: {
        'style-strength': 'standard',
        'color-mood': 'original',
        'aspect-ratio': 'original',
      },
    })
  })

  it('switchPreset はトグルを新しいプリセットの既定に戻し、ラジオは引き継ぐ', () => {
    const before = selectionWith('people-preset', {
      toggleIds: ['soft-light'],
      choices: { 'style-strength': 'photo', 'color-mood': 'muted', 'aspect-ratio': 'square' },
    })
    expect(switchPreset(before, 'scene-preset', fixture)).toEqual({
      presetId: 'scene-preset',
      toggleIds: [],
      choices: { 'style-strength': 'photo', 'color-mood': 'muted', 'aspect-ratio': 'square' },
    })
  })
})
