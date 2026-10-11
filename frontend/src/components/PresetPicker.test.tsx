import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { PresetSample, SampleOriginal } from '../data/samples'
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

// テスト用の架空の見本と元の写真
const testSamples: Record<string, PresetSample> = {
  'test-web': {
    file: 'test-web.webp',
    width: 640,
    height: 853,
    originalId: 'family',
    alt: '見本：テスト用の見本の説明',
  },
}
const testOriginals: SampleOriginal[] = [
  {
    id: 'family',
    file: 'originals/test.webp',
    label: 'テストの写真',
    alt: 'テスト用の元の写真の説明',
  },
]

describe('PresetPicker', () => {
  it('Web の原文を種にしたスタイルのカードに、出典とライセンスのリンクと書き換えたことが出る', () => {
    render(
      <PresetPicker
        presets={[webPreset]}
        samples={{}}
        originals={[]}
        selectedId="test-web"
        onSelect={() => {}}
      />,
    )
    const { label, url, license, licenseUrl, modified } = webPreset.source
    expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', url)
    expect(screen.getByRole('link', { name: license })).toHaveAttribute('href', licenseUrl)
    expect(screen.getByText(`変更：${modified}`)).toBeInTheDocument()
    // 出典はラベルの外にあるので、ラジオの名前には入らない
    expect(
      screen.getByRole('radio', { name: new RegExp(webPreset.name) }),
    ).not.toHaveAccessibleName(/出典/)
  })

  it('カードに見本の画像が出て、一覧の下に元の写真が出る。見本の説明はラジオの名前に入らない', () => {
    render(
      <PresetPicker
        presets={[webPreset]}
        samples={testSamples}
        originals={testOriginals}
        selectedId="test-web"
        onSelect={() => {}}
      />,
    )
    // 公開先のパスが変わっても届くように、Vite の BASE_URL（テストでは /）を頭に付けている
    const sample = screen.getByRole('img', { name: '見本：テスト用の見本の説明' })
    expect(sample).toHaveAttribute('src', '/samples/test-web.webp')
    // 読み込む前から実際の形で場所を取るように、データの横と縦をそのまま渡す
    expect(sample).toHaveAttribute('width', '640')
    expect(sample).toHaveAttribute('height', '853')
    expect(screen.getByRole('img', { name: 'テスト用の元の写真の説明' })).toHaveAttribute(
      'src',
      '/samples/originals/test.webp',
    )
    expect(screen.getByText('テストの写真')).toBeInTheDocument()
    expect(screen.getByText(/AI で作った架空の写真/)).toBeInTheDocument()
    expect(
      screen.getByRole('radio', { name: new RegExp(webPreset.name) }),
    ).not.toHaveAccessibleName(/見本/)
  })

  it('見本が無いスタイルでも画面は出る（画像を出さないだけ）', () => {
    render(
      <PresetPicker
        presets={[webPreset]}
        samples={{}}
        originals={[]}
        selectedId="test-web"
        onSelect={() => {}}
      />,
    )
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByRole('radio', { name: new RegExp(webPreset.name) })).toBeChecked()
  })
})
