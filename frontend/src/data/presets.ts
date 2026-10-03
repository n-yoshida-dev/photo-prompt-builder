// プリセットのマスタデータ。英文は原文のまま置き、UI のコードに英文を書かない（CLAUDE.md「守ること」）
// base と style を半角スペースで繋げると原文に戻ることを catalog.test.ts が確かめる
// （ユーザー提供の 2 本は docs/seed-prompts.md、Web 原文の 3 本は docs/web-prompts.md の書き換え版と照合する）
import type { Preset } from '../prompt/types'

// SeeAPI の 2 本に共通の出典。表示義務は名前・リポジトリとライセンスへのリンク・変更点の明示（docs/web-prompts.md）
const SEEAPI_SOURCE = {
  label: 'SeeAPI — Nano Banana Prompts for Image Editing',
  url: 'https://github.com/SeeAPI/nano-banana-prompts-for-image-editing',
  license: 'CC BY 4.0',
  licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  checkedOn: '2026-10-03',
} as const

export const presets: Preset[] = [
  {
    id: 'diorama',
    name: '3D Miniature Diorama',
    descriptionJa: '写真の建物を、台座に載った精密な建築模型にする。人物は消える',
    subject: 'scene',
    base: 'Transform this photo into a precise architectural 3D miniature diorama. Preserve the exact spatial layout, proportions, major architectural forms, facade materials, stairs, walls, pipes, street objects, vegetation, and distinctive landmarks from the reference image.',
    style:
      'Reconstruct the scene as a clean isometric architectural model, viewed from a slightly elevated 3/4 angle, like a physical scale model placed on a square plinth. Style: high-end architectural visualization, miniature maquette, soft realistic materials, simplified but accurate geometry, subtle bevels, crisp edges, restrained detail, no exaggerated stylization. Materials should closely match the source photo but be slightly softened and desaturated: matte brick, painted metal, concrete, ceramic tile, glass, vegetation. Lighting: soft studio daylight from upper left, diffuse shadows cast onto an off-white background, ambient occlusion in corners and joints, no dramatic contrast. Background: warm off-white / ivory paper texture, minimal editorial presentation. Camera: orthographic or near-orthographic isometric view, approximately 35–45° downward angle, no wide-angle distortion. Composition: isolate only the architecture and immediate surrounding elements visible in the photo. Remove unrelated background buildings, sky, people, cars, signage, clutter, and photographic noise unless they are important to the identity of the scene. The final result should feel like a carefully handcrafted architectural scale model rendered in Blender or Cinema 4D, not like a videogame, cartoon, voxel art, or photorealistic photograph. High geometric fidelity to the reference image. Preserve asymmetry and small imperfections from the real place rather than making the architecture generic. Square base slab under the entire reconstructed scene, with soft contact shadow beneath it. No text, no labels, no typography, no border.',
    negative: [],
    defaultToggles: ['no-text', 'no-extra-objects', 'one-per-photo'],
    source: {
      label: 'ユーザー提供（検証済み。docs/seed-prompts.md 例①）',
      checkedOn: '2026-09-06',
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
]
