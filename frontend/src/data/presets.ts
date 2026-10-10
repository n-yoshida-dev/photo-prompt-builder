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
      "Photograph the sketchbook from directly above, lying open on a wooden desk in soft daylight, with both pages taking up nearly the whole frame. Fix the print near the middle of the pages with two pieces of washi tape at its corners, small enough to leave plenty of paper around it. The print shows the whole photo, uncropped and with nothing moved, so its four edges are the photo's own edges; inside it nothing changes, it remains the real photo, and the lists below about the people and the place apply to the print. On the paper around the print, sketch new scenery that the camera never captured: the view beside, above, and below the frame that a much wider lens would have caught, such as more of the coastline, more sky, the far end of the street, or more of the park. Keep the print and the sketch at one shared scale, so a horizon, shoreline, road, or fence that meets the photo's border carries straight on into the sketch at the same height and angle, and finish any tree that an edge cuts through. Treat each building and landmark in the photo as one of a kind: the sketch may add plainer things such as rocks, trees, fences, hills, and clouds, but never another building, tower, or landmark like it. Use graphite pencil with light colored-pencil shading, and let the strokes get looser and lighter until they fade into blank paper near the page edges.",
    // 2026-10-06 の試作で、プリントの写真が切り取られて狭まり、絵の側は写真の切り落とした端をなぞっただけになった（灯台が 2 本出たのも同じ原因と Claude は見た）。
    // AI が元の写真をページ全体に引き伸ばし、真ん中だけを写真のまま残していた。そこで、プリントは写真を切らずに全部入れ、
    // 絵の側には写真に写らなかった外側の景色を新しく描き、写真の一部を写したり拡大したりしないと書く
    negative: [
      'redraw, paint over, or restyle anything inside the printed photo',
      'crop the photo inside the print or shift anything within it',
      'copy, enlarge, or trace the photo or pieces of it into the sketched area, or draw a second copy of any building, landmark, tree, or object that already appears inside the print',
      'draw any people or animals in the sketched area',
    ],
    // 続きの景色は写真に写っていない物なので、「写っていない物を足さない」は既定で OFF（doodle-friends と同じ考え方）
    defaultToggles: ['no-text', 'one-per-photo'],
    source: { kind: 'claude', label: 'Claude の自作' },
  },
  // ここから 2 本は、写真の場面が紙の物・印刷物になる（Claude の自作。2026-10-06。試作は docs/style-trials-2026-10-04.md）。
  // 場所と人物の両方を作り替えるので被写体は people-in-scene（ジオラマ・旅のスタンプの「家族も」と同じ。元のカメラの角度は求めない）
  {
    id: 'pop-up-book',
    name: '飛び出す絵本',
    descriptionJa:
      '写真の場面を、机の上で開いた紙細工の飛び出す絵本にする。家族は写真から切り抜いた紙で立つ',
    subject: 'people-in-scene',
    base: "Rebuild this snapshot's scene as a handmade pop-up storybook spread open, with the place rising off its pages in cut and folded card.",
    // 人物は写真を厚紙に刷って切り抜いた形にする。顔を紙の絵に描き直さないので、うちの子と分かる顔が残る（試作で確かめた形）
    style:
      "Show the opened storybook lying across an oak desk in soft daylight, viewed slightly from above and straight ahead, so the depth of its card layers is plain to see and the book nearly fills the picture. Build the place from stacked layers of colored cardstock with crisp cut edges, small folds, hinges, and pull tabs: ground and paths lie flat on the pages, trees, buildings, and play equipment stand up as cut-out layers at their real places, and the sky curves up behind them in one sheet of paper. Print every family member straight from the snapshot onto stiff card, trim each figure along its outline leaving a narrow white edge, and stand each one up in the layer matching where it stands in the snapshot, so faces remain exactly as photographed. Keep the book's central fold clear of every face. Match the paper colors to the snapshot's own colors, and cast soft shadows from one layer onto the next.",
    negative: [
      "redraw anyone's face as paper art or a drawing",
      "let the central fold run across anyone's face",
    ],
    defaultToggles: ['no-text', 'no-extra-objects', 'one-per-photo'],
    source: { kind: 'claude', label: 'Claude の自作' },
  },
  {
    // 表示名は旅のスタンプと紛らわしくない案をユーザーに確かめる（TODO.md）。今は仮の名前
    id: 'commemorative-stamp',
    name: '封筒に貼った記念切手',
    descriptionJa:
      '写真の場面を絵にした記念切手を、消印を押した封筒に貼る。額面の数字と、場面に合った短い英語の題名が入る',
    subject: 'people-in-scene',
    base: 'Make this snapshot the artwork of one commemorative stamp, stuck on an envelope that has been through the post.',
    // 試作では切手の絵が写真に近かった（docs/style-trials-2026-10-04.md）。保持文が顔を写実に引っ張ると Claude は推定し、
    // 絵は「描いた挿絵を印刷したもの」とはっきり書く。細い線の版画調は子どもの顔が老けやすい（調査レポート）ので、平らな色面の挿絵にする
    style:
      "Paint the stamp's artwork as an illustration, never as a photograph: gouache-style painting with flat, softly shaded areas of color, clean simple outlines, and gently simplified shapes, printed with a fine dot screen as real stamps are. Paint faces in that same illustrated manner, with soft, simple features that still let each person be recognized at once. Everything listed below about people and place refers to the stamp's artwork. Give the stamp a white perforated border with evenly spaced round teeth. Print two things on the stamp besides the artwork: one small numeral for the value in one corner, and along the bottom edge a short English title of two to four words naming what the artwork shows, for example the season, the place, or what the family is doing, printed in neat capital letters. Nothing else is written anywhere: no country names, personal names, dates, or other words on the stamp, postmark, or envelope. Stick the stamp near the upper corner of a cream-colored envelope, with a round postmark of plain rings and wavy lines partly over its edge. Shoot it flat from directly above in soft daylight, framed close so the stamp fills the shot almost entirely and its faces are easy to see.",
    negative: [
      "render the stamp's artwork as a photograph or a filtered photo",
      'draw faces with fine engraved lines or cross-hatching that make anyone look older',
      'show more than one stamp',
      'copy the emblem, logo, or postmark design of any real postal service',
    ],
    // 額面の数字と短い英語の題名を入れるので「文字を入れない」は既定で OFF（editorial-poster と同じ考え方）。
    // ユーザーの答え「数字入れていいよ。あとは、画像に沿った英文を入れるとか？」（logs/decisions.md 2026-10-10）。ON にすると「Do not:」の文が数字も題名も止める
    defaultToggles: ['no-extra-objects', 'one-per-photo'],
    source: { kind: 'claude', label: 'Claude の自作' },
  },
  // ここから 2 本は、写真の場所や持ち物が遊び道具・展示物になる（Claude の自作。2026-10-06。試作は docs/style-trials-2026-10-04.md）
  {
    // 家族を入れる版を作るかはユーザーに確かめる（TODO.md）。今は試作と同じく人物を入れない
    id: 'sugoroku-board',
    name: 'すごろく盤',
    descriptionJa: '写真の場所の地形をそのまま盤面にした、手作りのすごろくにする。人物は入れない',
    subject: 'scene',
    base: 'Remake the place in this snapshot as a handmade family race game played with a die and counters, so that the real landscape itself becomes the board.',
    // マスに数字や「スタート」の文字が入りやすい（調査レポート）ので、マスは無地と文の中で決める
    style:
      'Paint the board on a sheet of thick card spread out on a living-room floor, shown from a little above in soft daylight with the whole board in view and a strip of floor around it. Ground, paths, water, buildings, and landmarks keep their real shapes and positions, painted in a cheerful, simplified gouache style, so anyone who was there knows the place at once. A winding track of round spaces starts in one corner, follows the real paths and shorelines, and ends at the most memorable landmark as the goal; a few spaces may be tinted differently, and every space stays plain, with no numbers or words. Set a few small wooden counters and one die on the board.',
    negative: [
      'include any of the people from the photo, even those in the foreground',
      'turn the place into a generic fantasy map that no longer looks like the real spot',
    ],
    // コマとサイコロはスタイルが求める小道具なので、「写っていない物を足さない」は既定で OFF（doodle-friends と同じ考え方）。
    // 写真に無い建物や名所は、風景の保持文の "Nothing invented beyond the photo's edges" が止める
    defaultToggles: ['no-text', 'one-per-photo'],
    source: { kind: 'claude', label: 'Claude の自作' },
  },
  {
    id: 'specimen-box',
    name: '思い出の標本箱',
    descriptionJa: '写真に写った帽子や靴などの持ち物だけを、木の標本箱の仕切りに 1 つずつ並べる',
    // 場面の配置は保たずに物だけを取り出すので、風景の保持文（同じ配置）とぶつかる。持ち物の保持文を付ける
    subject: 'objects',
    base: 'Collect the things visible in this snapshot into a wooden specimen box as mementos from that day, leaving the scene itself out.',
    // 試作では写真に無いシュシュが入った（女の子のワンピースの柄から作ったと Claude は推定）。数を少なくてよいと書き、服の柄から物を作らせない
    style:
      'Make the box shallow, with a glass lid and a grid of small square compartments lined with cream paper, set flat on a table and shown from directly above in soft daylight. Each compartment holds one real object, carefully set out: things such as hats, shoes, bags, toys, shells, stones, leaves, or a small model of a landmark, each matching its colors, patterns, and shape in the snapshot. Choose only things that anyone could point to in the snapshot; five to nine items are plenty, and leaving compartments empty is better than filling them when the snapshot shows only a few things.',
    negative: [
      "make up an object from a pattern or print on someone's clothing",
      'show any people, faces, or body parts',
      // 生き物を標本にする見せ方とピンを刺す見せ方は止める（調査レポート）。ぬいぐるみなどのおもちゃは残してよい
      'display real insects or other living creatures as specimens, or push pins through anything',
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
