// 固定の保持文。プリセットの subject に応じて必ず付く（SPEC.md「保持は固定」、logs/decisions.md 2026-09-29）
// 2026-09-29 に Claude が作成：3 方向の下書き → 3 人の審査 → 統合 → 2 人の反証で直した。経緯は KNOWLEDGE.md
// 見出し「Preserve from the reference photo:」「Composition:」の下に "- " で並ぶので、名詞句で書く
import type { PreserveSet, Subject } from '../prompt/types'

// 顔立ちの行。そばかすやほくろまで写真のまま残させる
const FACE_AS_IS =
  "Each person's facial features and skin tone as they are, including freckles, moles, and small marks, with no beautifying, skin smoothing, or makeup, and glasses if worn"

// 顔立ちの行の、顔も画風に寄せる版（people-in-scene-drawn）。2026-10-11 に Claude が作成。
// FACE_AS_IS の「そばかすもそのまま」「肌をなめらかにしない」が顔を写実に引っ張り、旅のスタンプ（家族も）の顔がスタンプにならなかった。
// 誰か分かる手がかり（顔の形・目・眉・鼻・口・肌の色・眼鏡）は残し、細かさだけを画風に合わせる（logs/decisions.md 2026-10-04、KNOWLEDGE.md 2026-10-11）
const FACE_DRAWN =
  "Each person's face shape, eyes, eyebrows, nose, mouth, and skin tone, drawn with the same few bold lines and flat colors as the rest of the picture rather than in photographic detail, yet still clearly that person, with no beautifying or makeup, and glasses if worn"

// 人物の保持文のうち、並び（左右・前後の順）を除いた行。people・people-in-scene・people-as-pieces で共通に使う
const PEOPLE_IDENTITY_WITHOUT_ARRANGEMENT = [
  "Every person's identity, recognizable at a glance as the same individual, with the style changing only how people are rendered, not who they are",
  FACE_AS_IS,
  "Each person's hairstyle, hair length, bangs, and hair color",
  "Each person's facial expression, including the shape of the smile, any visible teeth or tooth gaps, and where the eyes are looking",
  "Each person's apparent age exactly as in the photo, with children not made to look older",
  "Each person's build and height compared with the others, with no one made slimmer",
  "Each person's clothing and accessories: the same garments, colors, patterns, and prints, and items such as hats, hair clips, and bags, with nothing swapped, added, or removed",
  'The exact number of people and the mix of adults, children, and babies, with no one added, left out, or merged into someone else',
  // 人数の行と並びの行を隣り合わせない（子どもと身体接触の語が近いと安全フィルタに弾かれやすい）
  "Each person's pose, gestures, hand positions, and the direction they are facing, including anything they are holding",
]

// 人物の保持文。people と people-in-scene で共通に使う（並びの行は最後に置く。人数の行と隣り合わせないため）
const PEOPLE_IDENTITY = [
  ...PEOPLE_IDENTITY_WITHOUT_ARRANGEMENT,
  'How the people are arranged: the same order from left to right and front to back, and who is holding hands with, hugging, or carrying whom',
]

// 人物の保持文の、顔も画風に寄せる版。顔立ちの行だけを差し替える（people-in-scene-drawn）
const PEOPLE_IDENTITY_DRAWN = PEOPLE_IDENTITY.map((line) =>
  line === FACE_AS_IS ? FACE_DRAWN : line,
)

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

// 場所と人物の両方を作り替えるときの構図の保持文。people-in-scene と people-in-scene-drawn で共通に使う
const PEOPLE_IN_SCENE_COMPOSITION = [
  PEOPLE_POSITION,
  'Every person kept in the scene at the same spot, at a true-to-life size compared with the place, and doing the same thing as in the photo (for example, still on the same playground equipment)',
  ...SCENE_COMPOSITION,
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
  // 場所と人物の両方を模型などに作り替える（ジオラマの「家族も」・飛び出す絵本・記念切手）。2026-10-03 に Claude が作成（旅のスタンプの「家族も」は 2026-10-11 に下の people-in-scene-drawn へ移した）
  // people の構図の「元のカメラの角度」「同じ背景」は、ジオラマの斜め上からの見せ方や台座だけの背景とぶつかるので使わない
  'people-in-scene': {
    identity: PEOPLE_IDENTITY,
    composition: PEOPLE_IN_SCENE_COMPOSITION,
  },
  // people-in-scene と同じだが、顔も画風の線と平らな色で描き直す（旅のスタンプの「家族も」）。2026-10-11 に Claude が作成
  // people-in-scene はジオラマ（家族も）・飛び出す絵本・記念切手も使うので、顔立ちの行を変えずに別の被写体にした
  'people-in-scene-drawn': {
    identity: PEOPLE_IDENTITY_DRAWN,
    composition: PEOPLE_IN_SCENE_COMPOSITION,
  },
  // 場面の配置は保たずに、写っている持ち物だけを取り出す（思い出の標本箱）。2026-10-06 に Claude が作成
  // 「Preserve from the reference photo:」の下には人物ではなく物の見た目を置く。人物は写さないので人物の保持文は付けない
  objects: {
    identity: [
      'Each object exactly as it looks in the photo: the same colors, patterns, prints, materials, and shape, with nothing recolored or redesigned',
      'Any signs of use visible in the photo, such as scuffs, creases, or faded spots, so each object is the very one from that day',
    ],
    composition: [
      'Only objects that are clearly visible in the photo, each shown once at most, with nothing invented or merged from several things',
      'Each object at its true size compared with the others, unless the style itself shrinks something large into a small model',
    ],
  },
  // 場所は配置どおりに作り替え、人物は写真の位置から取り出してコマなどにして置く（すごろく盤）。2026-10-10 に Claude が作成
  // people-in-scene の「同じ位置・本物どおりの大きさ」と人物の並び・位置関係の行は、コマを盤のマスに置く見せ方とぶつかるので使わない。
  // 抱っこや肩車は、取り出しても 1 つの姿のまま残す。手をつなぐ・抱き合うまで含めると、全員が手をつないだ写真で
  // 全員が 1 つのコマにまとまりかねないので、抱えている・抱えられている人だけにする（SPEC.md「保持は固定」。PR #26 の受け入れレビュー）
  'people-as-pieces': {
    identity: [
      ...PEOPLE_IDENTITY_WITHOUT_ARRANGEMENT,
      // 子どもと身体接触の語を同じ文に置かない（安全フィルタ対策。KNOWLEDGE.md 2026-09-29）ので、child とは書かない
      "Anyone being carried, whether up on someone's shoulders or in someone's arms, kept together with the person carrying them as one figure",
    ],
    composition: SCENE_COMPOSITION,
  },
}
