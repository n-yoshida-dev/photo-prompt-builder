// ラジオ（いくつかから 1 つ選ぶもの）のマスタデータ（SPEC.md「条件」）
// 先頭の選択肢が既定で、英文を足さない（プリセット原文の指定と喧嘩しないため）
// 2026-09-29 に Claude が作成。経緯は KNOWLEDGE.md
// 画面の言葉（label・note）は 2026-10-03 にユーザーと決めた（logs/decisions.md「仕上がりを調整する」の言葉を直し、縦横比に形の図を付ける）。
// id は最近使った設定に保存されているので、言葉を変えても id は変えない
import type { Choice } from '../prompt/types'

// 縦横比の文の共通の後半。背景だけで調整し、主役を切ったり引き伸ばしたりしない
const FIT_WITHOUT_DISTORTION =
  'To fit, extend or trim only plain background at the edges (such as a plain backdrop, ground, floor, walls, or sky) without adding new objects, never cropping the main subjects more than the photo does and never stretching or squashing anything.'

// 縦横比の選択肢の下の一文の共通部分
const FIT_NOTE = '人物は切らず、背景を広げるか削って合わせる'

export const choices: Choice[] = [
  {
    id: 'style-strength',
    label: '加工の強さ',
    options: [
      { id: 'standard', label: '標準', note: 'スタイルの文のままの強さ', text: '' },
      {
        id: 'photo',
        label: '控えめ（写真に近い）',
        note: '元の写真の質感や顔つきを多く残す',
        text: 'Apply the style with a light touch so the result stays close to the original photo, especially in key details and any faces.',
      },
      {
        id: 'stylized',
        label: 'しっかり（イラストらしく）',
        note: '形や質感をはっきりスタイルに寄せる。顔は誰か分かる範囲で',
        text: 'Apply the style fully and boldly, with clearly stylized shapes and textures, while keeping the subjects recognizable.',
      },
    ],
  },
  {
    id: 'color-mood',
    label: '色味',
    options: [
      { id: 'original', label: '元のまま', note: '色の指示を足さない', text: '' },
      {
        id: 'muted',
        label: '淡く',
        note: '全体の色をやわらかく控えめに。肌の色は変えない',
        text: 'Give the whole image a calm, muted color palette with softer, less saturated tones than the original photo, without changing which color each thing is and keeping any skin tones as in the photo.',
      },
      {
        id: 'vivid',
        label: '鮮やかに',
        note: '全体の色を明るく濃く。肌の色は変えない',
        text: 'Give the whole image a bright, vivid color palette with richer, more saturated tones than the original photo, without changing which color each thing is and keeping any skin tones as in the photo.',
      },
      {
        id: 'mono',
        label: '白黒',
        note: '色を抜いてモノクロにする',
        text: 'Make the whole image black and white (grayscale with no color tint and no part left in color), with enough contrast to keep details clear.',
      },
    ],
  },
  {
    id: 'aspect-ratio',
    label: '縦横比',
    options: [
      { id: 'original', label: '元のまま', note: '写真と同じ形のまま', text: '' },
      {
        id: 'square',
        label: '正方形 1:1',
        note: FIT_NOTE,
        shape: { width: 1, height: 1 },
        text: `Make the image square, with a 1:1 aspect ratio. ${FIT_WITHOUT_DISTORTION}`,
      },
      {
        id: 'portrait',
        label: '縦 3:4',
        note: FIT_NOTE,
        shape: { width: 3, height: 4 },
        text: `Make the image vertical (taller than wide), with a 3:4 aspect ratio. ${FIT_WITHOUT_DISTORTION}`,
      },
      {
        id: 'landscape',
        label: '横 16:9',
        note: FIT_NOTE,
        shape: { width: 16, height: 9 },
        text: `Make the image horizontal (wider than tall), with a 16:9 aspect ratio. ${FIT_WITHOUT_DISTORTION}`,
      },
    ],
  },
]
