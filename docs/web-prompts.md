# Web 原文のプリセット：原文・書き換えた箇所・書き換え版・出典

Web で公開されている原文を種にして `frontend/src/data/presets.ts` に入れたプリセットの記録。
決まりごとは `logs/decisions.md` の 2026-09-29「Web 原文と固定の保持文がぶつかる箇所の扱い」と、
2026-10-03「プリセット残り 6 本の顔ぶれ」「採用する Web 原文の実在のスタジオ名・商標を一般的な言い方に置き換える」。

- **原文**：出典のリポジトリの、下に書いたコミットのファイルから取ったまま（改行もそのまま）
- **書き換えた箇所**：原文から変えた語句の一覧。ここに無い部分は原文と一字一句同じ
- **書き換え版**：`presets.ts` の `base` と `style` を半角スペース 1 つで繋いだものと同じ文
- 原文の段落の途中にある改行（Markdown のソースの折り返し。表示では空白になる）は、書き換え版では空白 1 つにした。書き換えた箇所の表には載せない
- `frontend/src/data/catalog.test.ts` が、原文に書き換えた箇所の表を当てると書き換え版になること、書き換え版が `presets.ts` と一致することを確かめる。
  表の 1 列目と 2 列目はテストが読むので、`` ` `` で囲んだ形を崩さない
- 確認日：2026-10-03（3 本とも。出典を開いて利用条件と本文を取り直した）
- どれも作者自身が `tested: false` としているか、子どもの写真での作例が無い。仕上がりは未検証

アプリでの出典の表示は、スタイルのカード（作者名・ライセンス・リンク・書き換えたこと）、`README.md`「プリセットの出典」、
公開物に入る `frontend/public/third-party-notices.txt`（MIT の著作権表示と許諾文の全文）の 3 か所。

## painted-anime（手描きアニメ映画風）

| 項目 | 内容 |
|---|---|
| 出典 | SeeAPI「Nano Banana Prompts for Image Editing」README 4.3 節（`catalog.json` の P20） |
| ファイル | https://github.com/SeeAPI/nano-banana-prompts-for-image-editing/blob/0f832f28983d3c82bcc1b8862377d89cb1cef858/prompts/ghibli-anime/prompt.txt （README 4.3 節の本文と同じ） |
| コミット | `0f832f28983d3c82bcc1b8862377d89cb1cef858`（2026-09-17） |
| 利用条件 | CC BY 4.0。`LICENSE.md` の "SeeAPI’s original prompts and documentation in this repository are licensed under ... CC BY 4.0"、節末尾の "Prompt by SeeAPI"、`catalog.json` の P20 が `source.kind: original` |
| 表示義務 | 名前「SeeAPI」、リポジトリとライセンスへのリンク、変更点の明示。SeeAPI が推薦していると受け取れる書き方をしない。`LICENSE.md` の著作権表示 "Copyright © 2026 SeeAPI." も残す（CC BY 4.0 3(a)(1)(A)(ii)。`third-party-notices.txt` に ASCII で "Copyright (c) 2026 SeeAPI." と書いた） |
| 作者の検証 | `catalog.json` の P20 が `tested: false` |

### 原文

```text
Reinterpret the uploaded image as a Studio Ghibli-inspired hand-drawn anime scene. Preserve the recognizable identities, expressions, pose, composition, and relationships between the subjects. Use delicate expressive linework, softly painted watercolor-like backgrounds, gentle cel shading, warm natural colors, and atmospheric light.

Translate real details into a cohesive illustrated world with lush, carefully observed surroundings and a calm, heartfelt everyday mood. Keep the main facial features recognizable without making everyone look identical. Preserve the original setting rather than introducing existing film characters or replacing the scene. Output one complete illustration with no captions, logos, or borders.
```

### 書き換えた箇所

| 原文 | 書き換え後 | 理由 |
|---|---|---|
| `Studio Ghibli-inspired` | `classic Japanese animated film-inspired` | 実在のスタジオ名を公開アプリのプロンプトに残さない（`logs/decisions.md` 2026-10-03）。CC BY 4.0 は商標を許諾しない。後ろに "hand-drawn anime scene" が続くので、決定の例 "classic hand-drawn animated film-inspired" の "hand-drawn" は重ねず、"Japanese" で手描きアニメ映画の画風を残した |

原文には、2026-09-29 の決定が想定していた「背景を差し替える」一文が無い（"Preserve the original setting rather than ... replacing the scene" と逆のことを言っている）。
保持文とぶつかる箇所は無いので、書き換えたのはスタジオ名だけ。

### 書き換え版

```text
Reinterpret the uploaded image as a classic Japanese animated film-inspired hand-drawn anime scene. Preserve the recognizable identities, expressions, pose, composition, and relationships between the subjects. Use delicate expressive linework, softly painted watercolor-like backgrounds, gentle cel shading, warm natural colors, and atmospheric light.

Translate real details into a cohesive illustrated world with lush, carefully observed surroundings and a calm, heartfelt everyday mood. Keep the main facial features recognizable without making everyone look identical. Preserve the original setting rather than introducing existing film characters or replacing the scene. Output one complete illustration with no captions, logos, or borders.
```

`base` は先頭の 2 文（何に変えるかと、何を保つか）、`style` はそれ以降。

## watercolor（透明水彩）

| 項目 | 内容 |
|---|---|
| 出典 | AlbertAZ1992「albert-imagebook」の `styles/watercolor-light/prompt.md`、「## Prompt」節 |
| ファイル | https://github.com/AlbertAZ1992/albert-imagebook/blob/277f38d1f12a90296d11b7dc4954155821a66e6e/styles/watercolor-light/prompt.md |
| コミット | `277f38d1f12a90296d11b7dc4954155821a66e6e`（2026-09-13） |
| 利用条件 | MIT。`LICENSE` の "MIT License / Copyright (c) 2026 Albert's Imagebook contributors"。作者は `docs/sources.md` で "No raw third-party prompt was added" と書いている |
| 表示義務 | 著作権表示と MIT の許諾文の全文を配布物に入れる（`frontend/public/third-party-notices.txt`。ビルドで `dist/` にそのまま入る） |
| 作者の検証 | 作例は大人と風景の写真だけ（`docs/sources.md`）。子どもの写真での作例は無い |

### 原文

```text
Read the source photo for its defining subject, pose and relationships. Preserve those facts.
Adapt the material and graphic language to the supplied scene; do not import motifs that do
not belong to the source.

Use transparent watercolor washes with delicate pencil structure, watery pigment and dry broken
outer edges. Let paper shine through. Use sea blue, ochre and faint peach selectively, preserving
the source subject and relationships. Avoid opaque digital paint, hard vector edges and a filled
rectangular background.
```

### 書き換えた箇所

| 原文 | 書き換え後 | 理由 |
|---|---|---|
| `Let paper shine through. Use sea blue, ochre and faint peach selectively, preserving the source subject and relationships.` | `Let paper shine through.` | 色の指定（青・黄土・淡い桃色）が、固定の保持文の「服の色を変えない」と引っ張り合う。2026-10-03 の試作で父のグレーのパーカーに少し青みが入った。子どもの服の色が変わらないように一文ごと外した（`logs/decisions.md` 2026-10-03）。後半の "preserving the source subject and relationships" は `base` の "Preserve those facts." と固定の保持文が受け持つ |

ほかは段落の途中の折り返しを空白にしただけ。

### 書き換え版

```text
Read the source photo for its defining subject, pose and relationships. Preserve those facts. Adapt the material and graphic language to the supplied scene; do not import motifs that do not belong to the source.

Use transparent watercolor washes with delicate pencil structure, watery pigment and dry broken outer edges. Let paper shine through. Avoid opaque digital paint, hard vector edges and a filled rectangular background.
```

`base` は先頭の 2 文（写真から何を読み取り、何を保つか）、`style` はそれ以降。

## instant-photo（インスタント写真風）

| 項目 | 内容 |
|---|---|
| 出典 | SeeAPI「Nano Banana Prompts for Image Editing」README 4.1 節（`catalog.json` の P18） |
| ファイル | https://github.com/SeeAPI/nano-banana-prompts-for-image-editing/blob/0f832f28983d3c82bcc1b8862377d89cb1cef858/cases/polaroid.md の「Full Prompt」（README 4.1 節の本文と同じ） |
| コミット | `0f832f28983d3c82bcc1b8862377d89cb1cef858`（2026-09-17） |
| 利用条件 | CC BY 4.0。根拠は `painted-anime` と同じ（`catalog.json` の P18 が `source.kind: original`） |
| 表示義務 | `painted-anime` と同じ |
| 作者の検証 | `catalog.json` の P18 が `tested: false` |

### 原文

```text
Transform the uploaded image into a believable vintage Polaroid instant photograph. Preserve the identities, expressions, subject arrangement, and main scene. Apply soft direct-flash illumination, gently muted colors, warm highlights, slightly faded shadows, subtle film grain, mild lens softness, and natural instant-film imperfections without obscuring faces.

Present the image inside a clean off-white instant-photo border with a slightly deeper bottom margin. Fit the full main subject within the photo area; do not crop out important features. Keep the effect restrained and photographic. Do not add handwriting, dates, captions, extra people, or heavy damage.
```

### 書き換えた箇所

| 原文 | 書き換え後 | 理由 |
|---|---|---|
| `vintage Polaroid instant photograph` | `vintage instant photograph` | 商標 "Polaroid" を公開アプリのプロンプトに残さない（`logs/decisions.md` 2026-10-03）。後ろの "instant photograph" がすでに一般的な言い方なので、置き換えずに消した。後の文の "instant-film imperfections" "instant-photo border" が画風の手がかりとして残る |

### 書き換え版

```text
Transform the uploaded image into a believable vintage instant photograph. Preserve the identities, expressions, subject arrangement, and main scene. Apply soft direct-flash illumination, gently muted colors, warm highlights, slightly faded shadows, subtle film grain, mild lens softness, and natural instant-film imperfections without obscuring faces.

Present the image inside a clean off-white instant-photo border with a slightly deeper bottom margin. Fit the full main subject within the photo area; do not crop out important features. Keep the effect restrained and photographic. Do not add handwriting, dates, captions, extra people, or heavy damage.
```

`base` は先頭の 2 文（何に変えるかと、何を保つか）、`style` はそれ以降。
