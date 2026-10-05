// プリセットのマスタデータ。英文は原文のまま置き、UI のコードに英文を書かない（CLAUDE.md「守ること」）
// base と style を半角スペースで繋げると原文に戻ることを catalog.test.ts が確かめる
// （ユーザー提供の 2 本は docs/seed-prompts.md と照合する。Claude の自作には原文が無い。
// Web 原文の 3 本は 2026-10-04 に外した（logs/decisions.md「パッとしない 5 本は外す」）。記録は docs/web-prompts.md に残っている）
import type { Preset } from '../prompt/types'

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
  // ここから 2 本は、写真を写真のまま残して手描きを足す（Claude の自作。2026-10-06。試作は docs/style-trials-2026-10-04.md）。
  // 写真の人物はそのままなので被写体は people。試作で小人が小さすぎたので、大きさと数を言葉で決めた
  {
    id: 'doodle-friends',
    name: '写真とらくがきの小人',
    descriptionJa: '写真はそのままに、ペンで描いた小人たちが写真の中で遊んでいるようにする',
    subject: 'people',
    base: 'Keep this picture a real photograph and bring it to life with a crowd of little doodle characters drawn by hand, as if someone had drawn on the printed picture with markers.',
    style:
      "Draw five to eight doodle helpers: simple round-bodied characters with dot eyes, a tiny smile, and stick arms and legs, each roughly as tall as a person's head in the picture, so they are easy to spot at first glance. Give each helper a small job that plays with what is really there in the picture, such as carrying a leaf, peeking out from behind something, waving from the ground, or copying a person's pose right beside them. Draw them with confident black marker lines, add a white outline around them wherever the photo behind is dark so they stay visible, and fill them with one cheerful accent color that all helpers share. A few short motion marks around a helper may show what it is doing. Leave the people and the place untouched as a real photograph: nothing redrawn, nothing painted over, and nobody made older or younger.",
    // 小人を足すスタイルなので「写っていない物を足さない」は既定で OFF（editorial-poster の no-text と同じ考え方）
    negative: [
      'turn the people or the place into a drawing or an illustration',
      'let any doodle cover a face or a hand',
      'add speech bubbles',
    ],
    defaultToggles: ['no-text', 'one-per-photo'],
    source: { kind: 'claude', label: 'Claude の自作' },
  },
  {
    id: 'sketchbook-extension',
    name: '写真の続きを描いたスケッチブック',
    descriptionJa: 'スケッチブックに貼った写真の外へ、景色の続きを鉛筆と色鉛筆で描き広げる',
    subject: 'people',
    // 保持文は写真のプリントの中に効かせる（スケッチブックを真上から撮る絵なので、画像全体のカメラの角度は変わる）
    base: "Show this photo as a printed snapshot taped into an open sketchbook, with the scene carried on past the print's edges as a pencil sketch on the paper.",
    style:
      "Photograph the sketchbook from directly above, lying open on a wooden desk in soft daylight, with both pages taking up nearly the whole frame. Fix the print near the middle of the pages with two pieces of washi tape at its corners, small enough to leave plenty of paper around it. The print shows the whole photo, uncropped and with nothing moved, so its four edges are the photo's own edges; inside it nothing changes, it remains the real photo, and the lists below about the people and the place apply to the print. On the paper around the print, draw only what would lie just outside the photo's frame, treating the print like a window set into a larger drawing of that view: carry on the sky, ground, water, or path that reaches each edge, and finish any tree or building that an edge cuts through, in graphite pencil with light colored-pencil shading. Line up each sketched line with the spot where it leaves the photo so the drawing flows on from the print without a jump, and let the strokes get looser and lighter until they fade into blank paper near the page edges.",
    // 試作で灯台がプリントの中と絵の中に 2 本出た。プリントの写真を切り取って狭め、絵の側に元の写真全体を描いたのが原因と Claude は見た。
    // そこで、プリントは写真を切らずに全部入れ、絵の側には写真に写っている物を繰り返さないと書く
    negative: [
      'redraw, paint over, or restyle anything inside the printed photo',
      'crop the photo inside the print or shift anything within it',
      'draw a second copy of any building, landmark, tree, or object that already appears inside the print, since each one appears only once in the whole image',
      'draw any people or animals in the sketched area',
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
