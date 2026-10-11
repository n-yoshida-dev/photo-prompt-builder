import type { PresetSample, SampleOriginal } from '../data/samples'
import type { Preset, PresetSource } from '../prompt/types'

type Props = {
  presets: Preset[]
  samples: Record<string, PresetSample>
  originals: SampleOriginal[]
  selectedId: string
  onSelect: (presetId: string) => void
}

// 被写体の区別を利用者の言葉で表す
const SUBJECT_LABEL: Record<Preset['subject'], string> = {
  people: '人物が主役',
  scene: '建物・風景が主役',
  'people-in-scene': '人物と場所が主役',
  objects: '写っている持ち物が主役',
  'people-as-pieces': '人物と場所が主役',
  'people-in-scene-drawn': '人物と場所が主役',
}

// 見本の画像の URL。公開先のパス（Vite の base）が変わっても届くように、BASE_URL を頭に付ける
function sampleUrl(file: string): string {
  return `${import.meta.env.BASE_URL}samples/${file}`
}

// スタイル（プリセット）を 1 つだけ選ぶ。見た目は罫線で区切った行だが、中身はラジオボタンなのでキーボードでも選べる
export function PresetPicker({ presets, samples, originals, selectedId, onSelect }: Props) {
  return (
    <fieldset className="step">
      <legend className="step-heading">
        <span className="step-number">1</span>スタイルを選ぶ
      </legend>
      <div className="preset-list">
        {presets.map((preset) => {
          const sample = samples[preset.id]
          // 行の幅で見本の置き方を変える（index.css）。幅を測る入れ物（.preset-card）と、並べる中身（.preset-card-body）を分ける
          return (
            <div key={preset.id} className="preset-card">
              <div className="preset-card-body">
                <label className="preset-choice">
                  <input
                    type="radio"
                    name="preset"
                    value={preset.id}
                    checked={preset.id === selectedId}
                    onChange={() => onSelect(preset.id)}
                  />
                  <span className="preset-name">{preset.name}</span>
                  <span className="preset-description">{preset.descriptionJa}</span>
                  <span className="preset-subject">{SUBJECT_LABEL[preset.subject]}</span>
                </label>
                {/* 見本もラベルの外に置く（画像の説明までラジオの名前に入らないように）。押すと行の覆いに当たり、このスタイルが選ばれる */}
                {sample && (
                  <img
                    className="preset-sample"
                    src={sampleUrl(sample.file)}
                    alt={sample.alt}
                    width={sample.width}
                    height={sample.height}
                    loading="lazy"
                    decoding="async"
                  />
                )}
                {/* 出典はラベルの外に置く（中に置くとリンクの文字までラジオの名前として読み上げられる） */}
                {preset.source.kind !== 'user' && <PresetCredit source={preset.source} />}
              </div>
            </div>
          )
        })}
      </div>
      {originals.length > 0 && <SampleOriginals originals={originals} />}
    </fieldset>
  )
}

// 見本の元にした架空の写真。見本が AI で作ったものだと分かるように、元の写真と一緒に一覧の下へ 1 回だけ出す
function SampleOriginals({ originals }: { originals: SampleOriginal[] }) {
  return (
    <figure className="sample-originals">
      <figcaption className="sample-originals-note">
        {`見本の画像は、AI で作った架空の写真（下の ${originals.length} 枚。実在の人ではありません）を、このアプリのプロンプト（既定の条件のまま）で AI に加工させたものです。`}
      </figcaption>
      <ul className="sample-originals-list">
        {originals.map((original) => (
          <li key={original.id} className="sample-original">
            <img
              src={sampleUrl(original.file)}
              alt={original.alt}
              width={320}
              height={240}
              loading="lazy"
              decoding="async"
            />
            <span className="sample-original-label">{original.label}</span>
          </li>
        ))}
      </ul>
    </figure>
  )
}

// Web 原文と Claude の自作のプリセットの出典。ユーザー提供のものには出さない
// Web 原文は作者・ライセンス・書き換えたことを出し、CC BY 4.0 と MIT の表示を、アプリを使う人の目に届く形で満たす（logs/decisions.md 2026-10-03）
function PresetCredit({ source }: { source: PresetSource }) {
  if (source.kind !== 'web' || source.url === undefined) {
    return <p className="preset-credit">出典：{source.label}</p>
  }
  return (
    <p className="preset-credit">
      出典：
      <a href={source.url} target="_blank" rel="noreferrer">
        {source.label}
      </a>
      {source.license && (
        <>
          （
          {source.licenseUrl ? (
            <a href={source.licenseUrl} target="_blank" rel="noreferrer">
              {source.license}
            </a>
          ) : (
            source.license
          )}
          ）
        </>
      )}
      {source.modified && <span className="preset-credit-modified">変更：{source.modified}</span>}
    </p>
  )
}
