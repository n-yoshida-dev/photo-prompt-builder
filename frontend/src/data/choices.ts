// ラジオ（いくつかから 1 つ選ぶもの）のマスタデータ（SPEC.md「条件」）
// 先頭の選択肢が既定で、英文を足さない（プリセット原文の指定と喧嘩しないため）
// 2026-09-29 に Claude が作成。経緯は KNOWLEDGE.md
import type { Choice } from '../prompt/types'

// 縦横比の文の共通の後半。背景だけで調整し、主役を切ったり引き伸ばしたりしない
const FIT_WITHOUT_DISTORTION =
  'To fit, extend or trim only plain background at the edges (such as a plain backdrop, ground, floor, walls, or sky) without adding new objects, never cropping the main subjects more than the photo does and never stretching or squashing anything.'

export const choices: Choice[] = [
  {
    id: 'style-strength',
    label: 'スタイル強度',
    options: [
      { id: 'standard', label: '標準', text: '' },
      {
        id: 'photo',
        label: '写真寄り',
        text: 'Apply the style with a light touch so the result stays close to the original photo, especially in key details and any faces.',
      },
      {
        id: 'stylized',
        label: 'スタイル寄り',
        text: 'Apply the style fully and boldly, with clearly stylized shapes and textures, while keeping the subjects recognizable.',
      },
    ],
  },
  {
    id: 'color-mood',
    label: '色味',
    options: [
      { id: 'original', label: '元のまま', text: '' },
      {
        id: 'muted',
        label: '落ち着いた',
        text: 'Give the whole image a calm, muted color palette with softer, less saturated tones than the original photo, without changing which color each thing is and keeping any skin tones as in the photo.',
      },
      {
        id: 'vivid',
        label: '鮮やか',
        text: 'Give the whole image a bright, vivid color palette with richer, more saturated tones than the original photo, without changing which color each thing is and keeping any skin tones as in the photo.',
      },
      {
        id: 'mono',
        label: 'モノクロ',
        text: 'Make the whole image black and white (grayscale with no color tint and no part left in color), with enough contrast to keep details clear.',
      },
    ],
  },
  {
    id: 'aspect-ratio',
    label: '縦横比',
    options: [
      { id: 'original', label: '元のまま', text: '' },
      {
        id: 'square',
        label: '正方形 1:1',
        text: `Make the image square, with a 1:1 aspect ratio. ${FIT_WITHOUT_DISTORTION}`,
      },
      {
        id: 'portrait',
        label: '縦 3:4',
        text: `Make the image vertical (taller than wide), with a 3:4 aspect ratio. ${FIT_WITHOUT_DISTORTION}`,
      },
      {
        id: 'landscape',
        label: '横 16:9',
        text: `Make the image horizontal (wider than tall), with a 16:9 aspect ratio. ${FIT_WITHOUT_DISTORTION}`,
      },
    ],
  },
]
