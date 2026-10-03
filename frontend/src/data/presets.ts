// プリセットのマスタデータ。英文は原文のまま置き、UI のコードに英文を書かない（CLAUDE.md「守ること」）
// base と style を半角スペースで繋げると原文に戻ることを catalog.test.ts が確かめる
// （ユーザー提供の 2 本は docs/seed-prompts.md、Web 原文の 3 本は docs/web-prompts.md の書き換え版と照合する。Claude の自作には原文が無い）
import type { Preset } from '../prompt/types'

// SeeAPI の 2 本に共通の出典。表示義務は名前・リポジトリとライセンスへのリンク・変更点の明示（docs/web-prompts.md）
const SEEAPI_SOURCE = {
  kind: 'web',
  label: 'SeeAPI — Nano Banana Prompts for Image Editing',
  url: 'https://github.com/SeeAPI/nano-banana-prompts-for-image-editing',
  license: 'CC BY 4.0',
  licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  checkedOn: '2026-10-03',
} as const

// diorama と diorama-family に共通の原文（docs/seed-prompts.md 例①。改変しない）。
// 人物を残すかどうかは、原文ではなくアプリが足すブロック（negative と保持文）で分ける（logs/decisions.md 2026-10-03）
const DIORAMA_BASE =
  'Transform this photo into a precise architectural 3D miniature diorama. Preserve the exact spatial layout, proportions, major architectural forms, facade materials, stairs, walls, pipes, street objects, vegetation, and distinctive landmarks from the reference image.'

const DIORAMA_STYLE =
  'Reconstruct the scene as a clean isometric architectural model, viewed from a slightly elevated 3/4 angle, like a physical scale model placed on a square plinth. Style: high-end architectural visualization, miniature maquette, soft realistic materials, simplified but accurate geometry, subtle bevels, crisp edges, restrained detail, no exaggerated stylization. Materials should closely match the source photo but be slightly softened and desaturated: matte brick, painted metal, concrete, ceramic tile, glass, vegetation. Lighting: soft studio daylight from upper left, diffuse shadows cast onto an off-white background, ambient occlusion in corners and joints, no dramatic contrast. Background: warm off-white / ivory paper texture, minimal editorial presentation. Camera: orthographic or near-orthographic isometric view, approximately 35–45° downward angle, no wide-angle distortion. Composition: isolate only the architecture and immediate surrounding elements visible in the photo. Remove unrelated background buildings, sky, people, cars, signage, clutter, and photographic noise unless they are important to the identity of the scene. The final result should feel like a carefully handcrafted architectural scale model rendered in Blender or Cinema 4D, not like a videogame, cartoon, voxel art, or photorealistic photograph. High geometric fidelity to the reference image. Preserve asymmetry and small imperfections from the real place rather than making the architecture generic. Square base slab under the entire reconstructed scene, with soft contact shadow beneath it. No text, no labels, no typography, no border.'

// travel-stamps と travel-stamps-family に共通の文（Claude の自作。2026-10-03）
// 型（スタンプを並べたコラージュ）にすると固定の保持文の「同じ配置」とぶつかるので、場面全体を 1 つの大きなスタンプにする。
// スタンプによくある地名・日付の文字は入れない（既定の「文字を入れない」と合わせる）。インクの色は写真に合わせ、服の色が変わらないようにする
const TRAVEL_STAMP_BASE =
  'Turn this photo into one large rubber-stamp print of the same scene, stamped by hand onto a page of a travel journal as a keepsake of the trip.'

const TRAVEL_STAMP_STYLE =
  'Render the scene the way a hand-carved rubber stamp prints: bold, simplified shapes and lines, flat areas of ink with the slightly uneven coverage, tiny speckles, and soft edges of real ink pressed onto paper, in a small set of flat ink colors that follow the colors in the photo, slightly out of register where the colors overlap. Give the print a simple frame, such as a scalloped postage-stamp edge or a rounded rectangle, with no lettering, numbers, or emblems inside or around it. Keep the same viewpoint and layout of the scene inside the frame, simplified only as much as a carved stamp needs. Show the print on a slightly textured, warm off-white journal page, photographed flat from directly above in soft daylight, with the page filling the image.'

export const presets: Preset[] = [
  {
    id: 'diorama',
    name: '3D Miniature Diorama（建物だけ）',
    descriptionJa: '写真の建物や遊具を、台座に載った精密な模型にする。人物は入れない',
    subject: 'scene',
    base: DIORAMA_BASE,
    style: DIORAMA_STYLE,
    // 原文は「場面の特徴に大事でなければ人物を消す」なので、主役の人物は残ることがある。建物だけの版では人物を入れないとはっきり足す（Claude の案）
    negative: ['include any of the people from the photo, even those in the foreground'],
    defaultToggles: ['no-text', 'no-extra-objects', 'one-per-photo'],
    source: {
      kind: 'user',
      label: 'ユーザー提供（検証済み。docs/seed-prompts.md 例①）',
      checkedOn: '2026-09-06',
    },
  },
  {
    id: 'diorama-family',
    name: '3D Miniature Diorama（家族も）',
    descriptionJa: '写真の建物や遊具と人物をいっしょに、台座に載った精密な模型にする',
    subject: 'people-in-scene',
    base: DIORAMA_BASE,
    style: DIORAMA_STYLE,
    // 原文の "Remove ... people ... unless they are important to the identity of the scene" の例外に当たると明示する（Claude の案）
    negative: [
      'remove any of the people in the photo, since they are important to the identity of this scene',
    ],
    defaultToggles: ['no-text', 'no-extra-objects', 'one-per-photo'],
    source: {
      kind: 'user',
      label: 'ユーザー提供（検証済み。docs/seed-prompts.md 例①。人物を残す指示はアプリが足す）',
      checkedOn: '2026-10-03',
    },
  },
  {
    id: 'editorial-poster',
    name: 'Editorial Poster',
    descriptionJa: '上半分に元の写真、下半分に手描きの紙のイラストを置いた縦長のポスターにする',
    subject: 'people',
    base: 'Create one independent high-end editorial poster for each uploaded photo. Do not combine multiple photos into a collage. Each photo must be processed and output as a separate poster.',
    style:
      'OVERALL FORMAT Strict 3:4 vertical composition. Divide the canvas horizontally into two exactly equal sections, with a precise 1:1 height ratio. The top half occupies exactly 50% of the canvas. The bottom half occupies exactly 50% of the canvas. The two sections should feel visually connected as one refined art publication cover. TOP HALF — ORIGINAL PHOTOGRAPH Preserve the original photograph as faithfully as possible. Keep the main composition, subjects, identity, facial features, body proportions, poses, expressions, clothing, objects, and spatial relationships unchanged. Preserve the realistic photographic texture, natural lighting, shadows, atmosphere, and original color mood. Apply only subtle, sophisticated editorial color grading, creating the feeling of a premium magazine photograph, contemporary art book, or high-end independent publication. The image should remain photorealistic and authentic, never overly retouched or artificially stylized. If necessary to fit the 3:4 composition naturally, extend the sky, ground, walls, or surrounding environmental background. Background extension must feel seamless and photographic. Never stretch, distort, reshape, replace, or alter the main subject. BOTTOM HALF — MINIMAL HAND-DRAWN PAPER ILLUSTRATION Extract the most recognizable visual elements from the original photograph and reinterpret them as a minimalist hand-drawn paper-cover illustration. Preserve: The most recognizable subject Essential silhouette and proportions Key pose or gesture Important objects The core narrative relationship between people and objects Highly simplify the image. Remove unnecessary details and retain only the visual information needed for immediate recognition. Use: Delicate, slightly imperfect hand-drawn lines A small number of bold, clearly defined acrylic-style flat color shapes Rough paper texture Visible handmade brush marks Slightly irregular, organic edges Subtle imperfections that make it feel genuinely handmade The main illustrated subject should be small, centered, and carefully composed, occupying approximately 10–20% of the bottom half. Leave a large amount of negative space around the illustration. The background should primarily resemble: Rough white paper Warm off-white paper Pale natural paper Minimal editorial book-cover stock Use only a few lines or small color shapes to suggest the surrounding environment. COLOR PALETTE Extract the dominant colors directly from the original photograph. Compress the palette into no more than 4 main colors. Keep the colors restrained, sophisticated, and harmonious. Use bold but controlled flat color blocks. Avoid excessive color variation. Preserve subtle paper grain and handmade brush texture. The illustration should visually feel like a simplified color interpretation of the photograph. TYPOGRAPHY A small amount of simple typography may be included when appropriate. Possible elements: A short title Keyword Object name Location Year Number Short phrase Text should be minimal, understated, and editorial. Typography should naturally interact with the large areas of negative space and the small illustration, evoking: Art book covers Independent publishing Contemporary editorial design Thoughtful children\'s picture books Do not force text into the composition if it does not naturally fit the photograph. VISUAL LANGUAGE The final poster should feel: Quiet · Poetic · Refined · Minimal · Innocent · Relaxed · Artistic · Thoughtful · High-recognition · Premium The visual concept should be: "A small subject surrounded by a large amount of empty space." The result should resemble a carefully designed independent art publication cover, rather than a commercial advertisement.',
    negative: [],
    // TYPOGRAPHY の指定があるため no-text は既定 OFF（docs/seed-prompts.md のメモ）
    defaultToggles: ['no-extra-objects', 'one-per-photo'],
    source: {
      kind: 'user',
      label: 'ユーザー提供（検証済み。docs/seed-prompts.md 例②）',
      checkedOn: '2026-09-06',
    },
  },
  {
    id: 'painted-anime',
    name: '手描きアニメ映画風',
    descriptionJa: '繊細な線と水彩のような背景で、手描きのアニメ映画の一場面にする',
    subject: 'people',
    base: 'Reinterpret the uploaded image as a classic Japanese animated film-inspired hand-drawn anime scene. Preserve the recognizable identities, expressions, pose, composition, and relationships between the subjects.',
    style:
      'Use delicate expressive linework, softly painted watercolor-like backgrounds, gentle cel shading, warm natural colors, and atmospheric light.\n\nTranslate real details into a cohesive illustrated world with lush, carefully observed surroundings and a calm, heartfelt everyday mood. Keep the main facial features recognizable without making everyone look identical. Preserve the original setting rather than introducing existing film characters or replacing the scene. Output one complete illustration with no captions, logos, or borders.',
    negative: [],
    defaultToggles: ['no-text', 'no-extra-objects', 'one-per-photo'],
    source: {
      ...SEEAPI_SOURCE,
      modified: '原文にある実在のアニメスタジオの名前を、一般的な言い方に置き換えた',
    },
  },
  {
    id: 'watercolor',
    name: '透明水彩',
    descriptionJa: '透明水彩と細い鉛筆の線で、紙の白さが透ける淡い絵にする',
    subject: 'people',
    base: 'Read the source photo for its defining subject, pose and relationships. Preserve those facts.',
    style:
      'Adapt the material and graphic language to the supplied scene; do not import motifs that do not belong to the source.\n\nUse transparent watercolor washes with delicate pencil structure, watery pigment and dry broken outer edges. Let paper shine through. Avoid opaque digital paint, hard vector edges and a filled rectangular background.',
    negative: [],
    defaultToggles: ['no-text', 'no-extra-objects', 'one-per-photo'],
    source: {
      kind: 'web',
      label: 'AlbertAZ1992 — Albert’s Imagebook',
      url: 'https://github.com/AlbertAZ1992/albert-imagebook',
      license: 'MIT',
      // MIT は著作権表示と許諾文の全文を配布物に入れる義務があるので、同梱したファイルを指す（frontend/public/）
      licenseUrl: 'third-party-notices.txt',
      checkedOn: '2026-10-03',
      modified:
        '原文にある色の指定（青・黄土・淡い桃色を使う一文）を外した。子どもの服の色が変わらないように',
    },
  },
  {
    id: 'instant-photo',
    name: 'インスタント写真風',
    descriptionJa: '白い縁のついた、少し色あせた昔のインスタント写真にする',
    subject: 'people',
    base: 'Transform the uploaded image into a believable vintage instant photograph. Preserve the identities, expressions, subject arrangement, and main scene.',
    style:
      'Apply soft direct-flash illumination, gently muted colors, warm highlights, slightly faded shadows, subtle film grain, mild lens softness, and natural instant-film imperfections without obscuring faces.\n\nPresent the image inside a clean off-white instant-photo border with a slightly deeper bottom margin. Fit the full main subject within the photo area; do not crop out important features. Keep the effect restrained and photographic. Do not add handwriting, dates, captions, extra people, or heavy damage.',
    negative: [],
    defaultToggles: ['no-text', 'no-extra-objects', 'one-per-photo'],
    source: {
      ...SEEAPI_SOURCE,
      modified: '原文にある商標（インスタントカメラのブランド名）を消した',
    },
  },
  // ここから Claude の自作。利用条件の確認できる原文が無いテーマを、雰囲気だけを参考に一から書いた（docs/prompt-candidates.md「自作する 3 本」）
  {
    id: 'clay-animation',
    name: '粘土アニメ風',
    descriptionJa: '人物も場所も粘土でこねて作った、コマ撮りアニメの一場面にする',
    subject: 'people',
    base: 'Recreate this photo as a single still frame from a handmade stop-motion clay animation, as if the people and the place had been sculpted from modeling clay and photographed on a small, carefully built set.',
    style:
      "Sculpt every person, object, and surface from soft, matte modeling clay, with gently rounded edges, faint fingerprints and tool marks, and slightly uneven, hand-pressed surfaces. The whole image must clearly read as a photograph of handmade clay figures on a model set, not as a photograph of real people and not as a smooth computer-rendered image: faces, hands, and hair are made of the same matte clay as everything else, with simplified, sculpted shapes and hair formed from pressed clay strands. Keep each person's body proportions and head-to-body ratio as they are in the photo. Shape faces simply and warmly in clay, keeping each face's outline, eye shape, eyebrows, nose, and smile recognizable, with natural-sized, calm eyes. Build the background as a handmade miniature set of the same place, using clay, felt, card, and painted wood, simplified only as much as the material needs. Light it like a small animation set, with a soft key light, gentle fill, and a slightly shallow depth of field that keeps the people in sharp focus. Match the colors of the photo with solid, slightly muted clay colors.",
    // 粘土の公開プロンプトによくある頭身の誇張と、子どもの顔が不気味に寄る原因（ガラス玉の目・人形の肌）を止める
    negative: [
      "make anyone's head bigger, body shorter, or arms and legs thicker than in the photo",
      'give anyone glassy, staring, oversized, or doll-like eyes, glossy plastic skin, or realistic skin pores',
    ],
    defaultToggles: ['no-text', 'no-extra-objects', 'one-per-photo'],
    source: { kind: 'claude', label: 'Claude の自作' },
  },
  {
    id: 'yarn-embroidery',
    name: '毛糸の刺しゅうワッペン',
    descriptionJa: '写真全体を、毛糸で刺しゅうした 1 枚のワッペンにする',
    subject: 'people',
    base: 'Turn this photo into one hand-embroidered yarn patch that shows the whole scene, as if it had been stitched by hand and photographed lying flat.',
    style:
      "Stitch everything in soft wool yarn and cotton embroidery thread: satin stitch and long-and-short stitch for skin, clothing, and large areas, chain stitch and backstitch for outlines and hair, and small French knots for tiny details such as buttons and leaves. Keep the stitches visible, with the soft fuzz of the yarn and the slight unevenness of handwork. Follow the photo's colors with matching thread colors, using a limited palette. Simplify the background into fewer, larger stitched shapes while keeping the same place recognizable. Stitch faces simply but recognizably, following each person's eye shape, eyebrows, and smile. Finish the patch with a thick, raised merrow-stitched border that follows the outline of the photo with softly rounded corners, and lay it flat on a plain natural linen backdrop under soft, even light, with a gentle shadow along the patch edge.",
    // 人物だけを切り抜いたワッペンは固定の保持文（同じ場所と背景）とぶつかる。ボタンの目は誰だか分からなくなる
    negative: [
      'give anyone button eyes, blank faces, or faces left unstitched',
      'cut the people out as separate patches without their background',
    ],
    defaultToggles: ['no-text', 'no-extra-objects', 'one-per-photo'],
    source: { kind: 'claude', label: 'Claude の自作' },
  },
  // 旅のスタンプは「風景だけ」と「家族も」で同じ文を使い、ジオラマと同じくアプリが足すブロックで人物の有無を分ける（logs/decisions.md 2026-10-03）
  {
    id: 'travel-stamps',
    name: '旅のスタンプ（風景だけ）',
    descriptionJa: '旅先の景色を、旅日記に押した大きなゴム印のスタンプにする。人物は入れない',
    subject: 'scene',
    base: TRAVEL_STAMP_BASE,
    style: TRAVEL_STAMP_STYLE,
    negative: ['include any of the people from the photo, even those in the foreground'],
    defaultToggles: ['no-text', 'no-extra-objects', 'one-per-photo'],
    source: { kind: 'claude', label: 'Claude の自作' },
  },
  {
    id: 'travel-stamps-family',
    name: '旅のスタンプ（家族も）',
    descriptionJa: '旅先の景色と家族をいっしょに、旅日記に押した大きなゴム印のスタンプにする',
    subject: 'people-in-scene',
    base: TRAVEL_STAMP_BASE,
    style: TRAVEL_STAMP_STYLE,
    // スタンプは線が単純になるので、顔を塗りつぶしや影絵にしない（誰だか分からなくなる）
    negative: [
      'remove any of the people in the photo, since they are the main subject of this keepsake',
      "carve anyone's face as a blank shape or a silhouette",
    ],
    defaultToggles: ['no-text', 'no-extra-objects', 'one-per-photo'],
    source: { kind: 'claude', label: 'Claude の自作' },
  },
]
