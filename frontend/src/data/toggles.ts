// トグル（ON/OFF）のマスタデータ。並び順が画面の表示順とプロンプト内の順になる（SPEC.md「条件」）
// 2026-09-29 に Claude が作成。経緯は KNOWLEDGE.md
// negative は見出し「Do not:」に続く動詞句（小文字始まり）、base と style は命令文（ピリオド終わり）
import type { Toggle } from '../prompt/types'

export const toggles: Toggle[] = [
  {
    id: 'no-text',
    label: '文字を入れない',
    block: 'negative',
    text: 'add any new text, letters, numbers, captions, labels, logos, signatures, or watermarks that are not in the photo',
  },
  {
    id: 'no-extra-objects',
    label: '写っていない物を足さない',
    block: 'negative',
    text: 'add people, animals, objects, props, decorations, or effects such as sparkles or confetti that are not in the photo, other than a display base or backdrop that the style itself calls for',
  },
  {
    id: 'one-per-photo',
    label: '複数枚を 1 枚にまとめない（1 枚ずつ出力）',
    block: 'base',
    text: 'If more than one photo is uploaded, process each photo separately and output one image per photo, without combining photos into a collage or mixing content from different photos.',
  },
  {
    id: 'soft-light',
    label: '柔らかい自然光にする',
    block: 'style',
    text: 'Use soft, diffused, natural-looking light with gentle shadows and no harsh highlights on any faces.',
  },
  {
    id: 'paper-texture',
    label: '紙や画材の質感を出す',
    block: 'style',
    text: 'Add a visible texture of paper or art materials that suits the style, such as paper grain, brush strokes, or pencil lines, while keeping the texture off faces so they stay clear.',
  },
  {
    id: 'print-quality',
    label: '印刷向けの高精細にする',
    block: 'style',
    text: 'Make the image high resolution and sharp enough for printing, with any faces, eyes, and hands clearly defined, no unintended blur or compression artifacts, and no smoothing or airbrushing of skin.',
  },
]
