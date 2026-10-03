// 固定の保持文。プリセットの subject に応じて必ず付く（SPEC.md「保持は固定」、logs/decisions.md 2026-09-29）
// 2026-09-29 に Claude が作成：3 方向の下書き → 3 人の審査 → 統合 → 2 人の反証で直した。経緯は KNOWLEDGE.md
// 見出し「Preserve from the reference photo:」「Composition:」の下に "- " で並ぶので、名詞句で書く
import type { PreserveSet, Subject } from '../prompt/types'

// 人物の保持文。people と people-in-scene で共通に使う
const PEOPLE_IDENTITY = [
  "Every person's identity, recognizable at a glance as the same individual, with the style changing only how people are rendered, not who they are",
  "Each person's facial features and skin tone as they are, including freckles, moles, and small marks, with no beautifying, skin smoothing, or makeup, and glasses if worn",
  "Each person's hairstyle, hair length, bangs, and hair color",
  "Each person's facial expression, including the shape of the smile, any visible teeth or tooth gaps, and where the eyes are looking",
  "Each person's apparent age exactly as in the photo, with children not made to look older",
  "Each person's build and height compared with the others, with no one made slimmer",
  "Each person's clothing and accessories: the same garments, colors, patterns, and prints, and items such as hats, hair clips, and bags, with nothing swapped, added, or removed",
  'The exact number of people and the mix of adults, children, and babies, with no one added, left out, or merged into someone else',
  // 人数の行と並びの行を隣り合わせない（子どもと身体接触の語が近いと安全フィルタに弾かれやすい）
  "Each person's pose, gestures, hand positions, and the direction they are facing, including anything they are holding",
  'How the people are arranged: the same order from left to right and front to back, and who is holding hands with, hugging, or carrying whom',
]

// 人物どうしと周りとの位置関係。people と people-in-scene で共通に使う
const PEOPLE_POSITION =
  "Each person's position relative to the others and to the surroundings, with no one cropped out"

// 場所の構図の保持文。scene と people-in-scene で共通に使う
const SCENE_COMPOSITION = [
  'The same layout of the place: where the buildings, structures, and objects that are kept sit relative to one another (left, right, front, and back)',
  'The same proportions and scale: relative sizes, heights, and spacing, and the same number of floors, windows, doors, and steps',
  'The same main subject as the focus of the image',
  "Nothing invented beyond the photo's edges: no extra buildings, rooms, streets, or landmarks",
]

export const preserve: Record<Subject, PreserveSet> = {
  people: {
    identity: PEOPLE_IDENTITY,
    composition: [
      'The original camera angle and framing, including how much of each person is visible',
      PEOPLE_POSITION,
      'The same place and background, restyled to fit the look and simplified only as much as the style needs, never replaced with a different scene',
    ],
  },
  scene: {
    identity: [],
    composition: SCENE_COMPOSITION,
  },
  // 場所と人物の両方を模型などに作り替える（ジオラマ・旅のスタンプの「家族も」）。2026-10-03 に Claude が作成
  // people の構図の「元のカメラの角度」「同じ背景」は、ジオラマの斜め上からの見せ方や台座だけの背景とぶつかるので使わない
  'people-in-scene': {
    identity: PEOPLE_IDENTITY,
    composition: [
      PEOPLE_POSITION,
      'Every person kept in the scene at the same spot, at a true-to-life size compared with the place, and doing the same thing as in the photo (for example, still on the same playground equipment)',
      ...SCENE_COMPOSITION,
    ],
  },
}
