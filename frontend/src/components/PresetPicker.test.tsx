import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Preset } from '../prompt/types'
import { PresetPicker } from './PresetPicker'

// テスト用の架空の Web 原文のプリセット。今のマスタデータには Web 原文が無い（2026-10-04 に外した）ので、
// 出典の表示（CC BY 4.0 や MIT の表示義務を満たす部品）はこれで確かめる
const webPreset: Preset = {
  id: 'test-web',
  name: 'テスト用の Web 原文',
  descriptionJa: 'カードの表示を確かめるための架空のスタイル',
  subject: 'people',
  base: 'Test base.',
  style: 'Test style.',
  negative: [],
  defaultToggles: [],
  source: {
    kind: 'web',
    label: 'Test Author — Test Prompts',
    url: 'https://example.com/test-prompts',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    checkedOn: '2026-10-05',
    modified: 'テストのために語句を置き換えた',
  },
}

describe('PresetPicker', () => {
  it('Web の原文を種にしたスタイルのカードに、出典とライセンスのリンクと書き換えたことが出る', () => {
    render(<PresetPicker presets={[webPreset]} selectedId="test-web" onSelect={() => {}} />)
    const { label, url, license, licenseUrl, modified } = webPreset.source
    expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', url)
    expect(screen.getByRole('link', { name: license })).toHaveAttribute('href', licenseUrl)
    expect(screen.getByText(`変更：${modified}`)).toBeInTheDocument()
    // 出典はラベルの外にあるので、ラジオの名前には入らない
    expect(
      screen.getByRole('radio', { name: new RegExp(webPreset.name) }),
    ).not.toHaveAccessibleName(/出典/)
  })
})
