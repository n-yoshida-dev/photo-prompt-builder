# プリセット候補：Web で公開されているプロンプト（収集結果）

2026-09-07 に Claude が Web 調査で集めた、写真をアップロードしてスタイル加工するための公開プロンプト。
「子どもの思い出写真を素敵に加工して残す」用途に合わせ、**顔・体型・服装・ポーズを保つ**方向のものを優先し、
有名人や別人に変えるものは除外した。

- 英文は**原文のまま**転記した（「（中略）」とある箇所は調査時に省略されたもので、採用するときは出典から全文を取り直す）
- 採用が決まったものは `web-prompts.md` に移し（原文・書き換え版・書き換えた箇所・出典を並べる。`logs/decisions.md` 2026-09-29）、
  `frontend/src/data/presets.ts` から参照する。ここは候補の置き場。`seed-prompts.md` はユーザー提供の原文専用で、改変しない
- 出典ごとの利用条件を「ライセンス」に書いた。**CC BY 4.0 は「出典を明記すれば再配布・改変可」**。
  アプリ内とリポジトリの README に出典を載せれば使える。それ以外は利用条件の明記が無いので、採用時に再確認する
- 確認日：2026-09-07（すべて）

## 2026-10-03 の選び直しの結果（いちばん新しい。下の 2026-09-07 の候補より優先する）

ユーザーの依頼（2026-09-29「再度、新たなモデル（Opus5.5）で再検討してみて」）を受けて、Claude が候補を集め直し、
3 つの観点の案を Claude のサブエージェント 3 人が採点して統合した。採った Web 原文は、出典を開いて利用条件を確かめ直した（2026-10-02）。
採否はユーザーが 2026-10-03 に 2 段階で答えた：自作 2 枠は「自作で作る」、Claude が質問で前提に置いた 4 本は聞き直して「まあ、一旦採用でいいよ。
このあたりは使いながらどんどんブラッシュアップしよう。」（`logs/decisions.md` 2026-10-03）。本文の全文は、data に入れるときに出典から取り直して `web-prompts.md` に置く。

### 採用した Web 原文 3 本

| id | 出典 | 利用条件と根拠 | 表示義務 | 書き換え |
|---|---|---|---|---|
| `painted-anime` | SeeAPI「nano-banana-prompts-for-image-editing」README 4.3 節（`prompts/ghibli-anime/prompt.txt`。確認時の main は `0f832f2`） https://github.com/SeeAPI/nano-banana-prompts-for-image-editing | CC BY 4.0。`LICENSE.md` の "SeeAPI’s original prompts and documentation in this repository are licensed under ... CC BY 4.0"、節末尾の "Prompt by SeeAPI"、`catalog.json` の P20 が `source.kind=original` | 名前「SeeAPI」、リポジトリとライセンスへのリンク、変更点の明示、SeeAPI が推薦していると受け取れる書き方をしない。推奨表記 "Source: SeeAPI — Nano Banana Prompts for Image Editing, CC BY 4.0." | 冒頭の "Studio Ghibli-inspired" を一般的な言い方へ（CC BY 4.0 は商標を許諾しない。`logs/decisions.md` 2026-10-03） |
| `watercolor` | AlbertAZ1992「albert-imagebook」`styles/watercolor-light/prompt.md` の「## Prompt」節（確認時のコミット `277f38d`） https://github.com/AlbertAZ1992/albert-imagebook | MIT。`LICENSE` の "MIT License / Copyright (c) 2026 Albert's Imagebook contributors"。作者は `docs/sources.md` で第三者の原文をそのまま入れていないと書いている | 著作権表示と MIT の許諾文の全文を配布物に入れる | なし（色の一文 "Use sea blue, ochre and faint peach selectively" が服の色を引っ張るなら、外すかをユーザーに確認する） |
| `instant-photo` | SeeAPI 同リポジトリ README 4.1 節（`cases/polaroid.md`、`catalog.json` の P18） | CC BY 4.0。根拠は `painted-anime` と同じ 3 つ | `painted-anime` と同じ | 商標 "Polaroid" を "instant-film" など一般的な言い方へ（`logs/decisions.md` 2026-10-03） |

どれも作者自身が `tested: false` としているか、子どもの写真での作例が無い。「実績のある原文」とは書かない。

### 自作する 3 本（雰囲気だけを参考に一から書く。下の原文は写さない）

- `clay-animation`（粘土アニメ風、人物）：粘土の公開プロンプトによくある頭身を変える語（"chunky, rounded proportions" など）を入れず、場所や背景を差し替えない。
  表示名にも本文にも "Claymation"・Aardman・Play-Doh を使わない。子どもの顔が不気味に寄りやすいので、`preserve.ts` と同じく複数案と反証を通して書く
- `yarn-embroidery`（毛糸の刺しゅうワッペン、人物）：参考にした SeeAPI の 4.6 節（P28）は、@ai_suxiaole の X 投稿をもとに SeeAPI が書き直したもので、
  CC BY が書き直し版まで覆うか確かめられなかった（2026-10-02）。上に元の写真・下に刺しゅうという型は `editorial-poster` と同じ並べ方になる点、
  刺しゅう文字を入れるなら既定トグルの `no-text` との関係を決める点に注意
- `travel-stamps`（旅のスタンプ）：参考にした AlbertAZ1992 の `styles/rubber-stamp-travel-journal` は、作者自身が「利用者から回収した第三者のプロンプトを
  組み合わせて書き直した。元の作者・利用条件は記録していない」と書いており採れなかった（2026-10-02）。
  人物を消すかは、ユーザーの「人物を消すかどうか、選択できるようにすればいいのでは？」を受けて、選べる形を確かめてから書く（`TODO.md`「確認待ち」）

### 見送ったもの

- `pixar-3d`・2026-09-07 版の `painted-anime`：出典 techpresso（Dupple）の購読規約 12 条が複製と配布を禁じている
- `brick-minifig`：原作者（X の投稿）の利用条件が不明。収集者 YouMind の CC BY 表示は原作者の許諾ではない
- `photo-booth`：利用条件（aimikoda、CC BY 4.0）は問題ないが、8 コマの別ポーズ・場面の差し替え・人物をプリントの中にだけ写す、が本質で保持文と根本的にぶつかる
- 絵本風：写真を入力にする原文は X の投稿 4 本だけで、どれも利用条件の記載が無い。やわらかい手描きの役は透明水彩とアニメ風が受け持つ
- 補欠の 1 番目：雪の夕暮れ（Apache-2.0）。季節を雪に固定するので思い出の中身が変わる

## 2026-09-07 の結論の要約

| テーマ | 結果 |
|---|---|
| Travel Journal | 候補あり（ただし写真加工ではなく都市名から生成する型。人物保持の一文を足す必要あり） |
| Storybook | 写真向けの信頼できる原文は**見つからず**。自作する |
| Storyboard | 候補あり（人物・衣装の保持を明記した強いプロンプト） |
| Claymation | 信頼できる原文は**見つからず**。自作する |
| Background Illustration | **見つからず**。自作する |
| Memory Box | **見つからず**。自作する |
| （新規）Pixar 風 3D | 候補あり。短く、家族向け・顔保持を明言 |
| （新規）Photo Booth（プリントストリップ） | 候補あり。"preserve strict facial identity" を明記 |
| （新規）LEGO ミニフィグ | 候補あり。顔の再現への配慮が最も詳細 |
| （新規）Studio Ghibli 風 | 候補あり。スタジオ名を使う点は要注意 |
| （新規）3D フィギュア＆パッケージ箱 | 候補あり。子どもを箱に入れる演出は要調整 |
| （新規）Y2K スクラップブック | 候補あり。対象年齢が合わない可能性 |

見つからなかった 4 テーマの検索語は末尾「見つからなかったテーマ」に残した。

---

## 1. Pixar 風 3D アニメキャラクター

- 出典：AI Academy by Techpresso「30 Best ChatGPT Cartoon Prompts (2026)」 https://academy.techpresso.co/prompts/chatgpt-prompts-cartoon （著者 Louis Corneloup、2026-01-15 公開、2026-08-25 更新）
- 検証 AI：ChatGPT（GPT-4o 系の画像生成）
- ライセンス：明記なし（要確認）
- 人物保持：あり。"Keep the exact face shape, hairstyle and clothing recognizable"。記事の補足に「'keep my glasses and freckles' のように特徴を書き足すと同一性が残る」とある

```
Transform [YOUR PHOTO] into a Pixar-style 3D animated character. Keep the exact face shape, hairstyle and clothing recognizable, but render with soft subsurface-scattering skin, large expressive eyes, gently exaggerated proportions and a warm rounded nose. Use cinematic three-point studio lighting, a softly blurred pastel background, glossy hair highlights and a polished CGI finish. Bright, family-friendly color palette, ultra-detailed, 4k render.
```

評価：短く明快。「家族向け」と「顔を保持」を明言しており、思い出写真の定番として最有力。

## 2. Photo Booth（プリントストリップを手に持つ写真）

- 出典：GitHub `aimikoda/nano-banana-pro-prompts` 10.1 節 https://github.com/aimikoda/nano-banana-pro-prompts （著者 X: @aimikoda）
- 検証 AI：Nano Banana Pro（Gemini）。作例画像 2 点
- ライセンス：CC BY 4.0（README 末尾に明記）
- 人物保持：あり。"preserve strict facial identity"

```
Make a single-frame ultra-photorealistic photo at high resolution.

Use the person from the uploaded reference photo exclusively inside the photo booth prints and preserve strict facial identity.

Set the capture in front of a shopping mall photo booth with the booth clearly visible in the background.
Set the moment as entering the year 2026 using only visual New Year cues without any visible text or numbers.
Avoid showing the person anywhere outside the printed photos.

Place exactly one physical 2x4 photo booth print strip centered in the frame and make the print filling most of the frame for close inspection.
Show the strip containing eight small frames of the same person wearing New Year-themed outfits and accessories, including variations with a festive 2026 crown, a party hat, a party accessory, a clean normal pose, hand gestures and playful goofy expressions.
Place a single hand holding the enlarged print strip clearly and naturally.

Set very close framing consistent with a phone-captured photo perspective and add slight handheld imperfection with shallow, natural depth behavior.

Use soft indoor lighting with gentle holiday warmth consistent with photo booth flash behavior and ambient mall lighting.

Preserve photographic realism with accurate paper texture, believable enlarged print scale, crisp ink detail, and mild smartphone-style compression.

Avoid all text, logos, UI elements, watermarks, overlays, phones, visible numbers, showing the person outside the prints, and any artificial effects.
```

評価：丁寧で写実的。「2026 年の新年」の部分は任意のイベントに差し替えられる。誕生日・入園などの記念写真に転用しやすい。

## 3. LEGO ミニフィグ

- 出典：YouMind「Photo-to-LEGO Minifigure Transformation」 https://youmind.com/prompts/personal-lego-minifigure-portrait-19650
- 検証 AI：GPT Image 系
- ライセンス：明記なし（要確認）
- 人物保持：あり。"Preserve the subject's facial likeness as much as possible within LEGO minifigure design limits"

```
Use the user uploaded image as the only subject reference. Transform the person in the uploaded image into a realistic LEGO style minifigure while preserving their recognizable identity and outfit. Preserve the subject's facial likeness as much as possible within LEGO minifigure design limits, maintaining the same hairstyle and hair color adapted into a LEGO hairpiece, facial expression, clothing colors, clothing design and patterns, and any visible accessories. The result should clearly represent the same person translated into LEGO form. The character must follow authentic LEGO minifigure proportions, including a cylindrical yellow or skin tone LEGO style head, simple printed facial features adapted from the subject, a block shaped torso with printed clothing details, standard LEGO minifigure arms with curved hands, short LEGO minifigure legs, and a distinct molded plastic hairpiece matching the subject's hairstyle.
Render the figure using realistic LEGO plastic material with a slight glossy sheen, subtle molded seams, and natural toy surface reflections. The face and torso should include printed details typical of LEGO minifigures, and the hairpiece should appear as molded plastic. The final image should be a high quality realistic 3D toy render with soft diffused studio lighting, subtle shadows that emphasize shape and plastic texture, and clean sharp focus with crisp detail. The framing must show the full body minifigure from head to feet in a centered composition with the entire figure fully visible. Use a plain white background with no scenery, no props, and no additional elements. The final style should feel like a photorealistic LEGO minifigure toy render with highly detailed plastic texture and studio lighting.
```

評価：顔の再現度への配慮が最も詳細で、子どもが喜ぶ遊び心のあるスタイル。「LEGO」は商標なので、表示名は「ブロックのミニフィグ」のように言い換える案がある（プロンプト本文は原文のまま）。

## 4. Studio Ghibli 風（手描きアニメ映画の質感）

- 出典：候補 1 と同じ記事 https://academy.techpresso.co/prompts/chatgpt-prompts-cartoon
- 検証 AI：ChatGPT
- ライセンス：明記なし（要確認）
- 人物保持：直接の文言なし。"warm naturalistic skin tones" "simplified yet expressive eyes" で人物性を保つ設計。アプリの固定保持文で補う

```
Transform [YOUR PHOTO] into a hand-painted Studio Ghibli style portrait. Soft watercolor textures, gentle cel shading, warm naturalistic skin tones, simplified yet expressive eyes, and a lush painted background of rolling green hills under a big cloud-filled sky. Nostalgic golden afternoon light, muted pastel palette, dreamy hand-drawn anime-film aesthetic, delicate brush detail.
```

評価：郷愁のある水彩調で「思い出」のコンセプトと相性が良い。**スタジオ名を公開アプリで使う点は要注意。** 表示名は「手描きアニメ映画風」にし、プロンプト本文も "Studio Ghibli" を "classic hand-drawn Japanese animated film" に置き換える案がある（置き換えると原文改変になるので、採用時に決める）。

## 5. Storyboard（3×3 の絵コンテ）

- 出典：GitHub `aimikoda/nano-banana-pro-prompts` 5.1 節「Parallel Storyboard Grid」 https://github.com/aimikoda/nano-banana-pro-prompts
- 検証 AI：Nano Banana Pro。作例画像 4 点
- ライセンス：CC BY 4.0
- 人物保持：あり。"Lock the identity of all primary subjects and environments to remain consistent with the reference image." ほか
- `[DIRECTOR]` `[DURATION]` は差し替え箇所

```
Create a 3x3 cinematic storyboard grid from the uploaded reference image.
Arrange the grid as three vertical columns and three horizontal rows.
Treat each column as a separate, self-contained storyline.
Within each column, the three panels form a top-to-bottom narrative sequence.
Ensure all nine panels fit on a single continuous canvas with no borders, gaps, or spacing.
Ensure every panel is a true 16:9 frame with no cropping or distortion.

Use the uploaded reference image strictly as an environment, lighting, character, material, and atmosphere reference.
Do not recreate, replicate, or directly derive any panel composition from the reference image.
Do not treat the reference image as the starting frame for any panel or storyline.

Preserve the original visual medium, realism level, color science, texture fidelity, sharpness, grain, and noise characteristics of the reference image.
Keep lighting conditions, weather, materials, and atmosphere continuous across all panels.

Use cinematic camera language in the exact visual style of [DIRECTOR].

For each column, assign clear narrative roles:
- Top panel establishes an initial situation that is compositionally distinct from the reference image.
- Middle panel introduces a clear change through action, interaction, or reaction.
- Bottom panel presents an irreversible outcome that cannot visually or narratively resemble the top panel.

Ensure each panel within a column represents a later moment than the one above it, unfolding within [DURATION].
Ensure camera framing and distance progress forward within each column and never return to an earlier composition.
Ensure visible story progression comes from changes in action, behavior, orientation, or spatial relationship, not from zoom alone.
Ensure the final panel in each column does not visually echo or reset to the first panel.

Ensure the three columns depict three different storylines, decisions, or outcomes, not variations of the same sequence.
Prevent visual or narrative repetition across columns.

Lock the identity of all primary subjects and environments to remain consistent with the reference image.
Preserve all visually distinctive attributes that contribute to the identity of any subject, object, or environment when they appear in the reference image.

Maintain strict continuity in materials, surfaces, clothing, accessories, and physical details.
Avoid text, captions, labels, UI elements, frames, borders, graphic overlays, and including [DIRECTOR] as a character.
Ensure the final image reads clearly as three parallel cinematic micro-stories and feels iconic, coherent, and cinematically powerful
```

評価：非常によく構造化されている。9 コマ・3 本のストーリーは思い出写真にはやや複雑で、映画寄り。
同じリポジトリ元の別候補「Cinematic Keyframe Generator」（`ZeroLu/awesome-nanobanana-pro` 2.16 節、X: @underwoodxie96）は役割設定付きの長文で、調査時に省略された。採用するなら出典から全文を取り直す。

## 6. Travel Journal（クレヨン画の旅日記）

- 出典：GitHub `ZeroLu/awesome-nanobanana-pro` 3.2 節 https://github.com/ZeroLu/awesome-nanobanana-pro （X 投稿元：@dotey https://x.com/dotey/status/1994908289813880915 ）
- 検証 AI：Nano Banana Pro。作例画像あり
- ライセンス：CC BY 4.0
- 人物保持：**なし**。都市名と日数からルート地図と落書きを生成する型で、写真のアップロードを前提にしていない
- 調査時に I・II 節が省略された。採用するなら出典から全文を取り直す

```
Please create a vibrant, child-like crayon-style vertical (9:16) illustration titled "{City Name} Travel Journal."
The artwork should look as if it were drawn by a curious child using colorful crayons, featuring a soft, warm light-toned background (such as pale yellow), combined with bright reds, blues, greens, and other cheerful colors to create a cozy, playful travel atmosphere.

I. Main Scene: Travel-Journal Style Route Map
（中略：{Number of Days} に応じたルート・立ち寄りスポットの自動生成ルール）

II. Surrounding Playful Elements (Auto-adapt to the City)
（中略：旅キャラクターの落書き、ランドマーク、看板、ステッカー風フレーズ、名物料理アイコン、子どもらしい感嘆文）

III. Overall Art Style Requirements
- Crayon / children's hand-drawn travel diary style
- Bright, warm, colorful palette
- Cozy but full and lively composition
- Emphasize the joy of exploring
- All text should be in a cute handwritten font
- Make the entire page feel like a young child's fun travel-journal entry
```

評価：雰囲気はテーマどおりだが、写真加工ではない。使うなら「アップロードした写真の人物と場面を中心に置き、顔・ポーズは変えない」という一文を足す改変が要る。

## 7. 3D フィギュア＆パッケージ箱

- 出典：GitHub `aimikoda/nano-banana-pro-prompts` 3.1 節「Life-Size Collectible Box」
- 検証 AI：Nano Banana Pro。作例画像 4 点
- ライセンス：CC BY 4.0
- 人物保持：体型のみ。"Preserve realistic human body proportions, scale, and anatomy for [SUBJECT] with no stylization or exaggeration."（顔への言及なし）

```
[SUBJECT] = the person shown in the uploaded reference image
[BOX_TYPE] = Barbie Box

Make a high-resolution lifestyle photograph in 9:16 aspect ratio.
Use a full-frame camera at eye level with a perfectly straight-on, front-facing perspective.
Set the scene in a studio environment designed to match the color palette and mood of [BOX_TYPE].
Place the life-size immersive [BOX_TYPE] centered in the studio, facing the camera directly with no rotation or angle.
Define the box structure, color palette, surface materials, branding style, and decorative elements according to the visual language of [BOX_TYPE].
Include the box's own characteristic packaging texts and branding details, consistent with [BOX_TYPE].
Include visible text reading "LIMITED EDITION" integrated naturally into the box design.
Position [SUBJECT] centered inside the box as the sole focal figure.
Preserve realistic human body proportions, scale, and anatomy for [SUBJECT] with no stylization or exaggeration.
Show a playful, confident full-body pose that fits naturally within the spatial limits of the box.
Keep the torso open, posture expressive, and facial expression joyful and relaxed.
Style wardrobe, accessories, and footwear to harmonize with the aesthetic implied by [BOX_TYPE].
Use soft, even studio lighting consistent with the box tone and materials.
Maintain clean edges, clear separation between subject, box, and background.
Ensure the final image feels iconic, immersive, and immediately recognizable as a themed display box concept.
```

評価：話題性は高いが、子どもを箱に閉じ込める演出は不気味に映る可能性がある。ポーズや服装を変える指示（"Show a playful ... pose" "Style wardrobe ..."）も含むので、アプリの方針（服装・ポーズを保つ）と合わない。採用するなら改変が要る。

## 8. Y2K スクラップブック（ステッカー・ポラロイド・複数ポーズ）

- 出典：GitHub `ZeroLu/awesome-nanobanana-pro` 10.3 節（X 投稿元：@ShreyaYadav___ https://x.com/ShreyaYadav___/status/1995760655018942720 ）
- 検証 AI：Nano Banana Pro
- ライセンス：CC BY 4.0
- 人物保持：あり。`"facelock_identity": "true", "accuracy": "100%"`
- JSON 混じりの半構造化プロンプト。調査時に後半が省略された

```
facelock_identity": "true",
"accuracy": "100%",
scene"Colorful Y2K scrapbook poster aesthetic, vibrant stickers, multiple subjects wearing the same outfit and hairstyle with different poses and cutouts, colorful strokes and lines, frameless collage style. Includes: close-up shot with heart-shape fingers, full-body squatting pose supporting chin while holding a white polaroid camera, mid-shot touching cheek while blowing pink bubblegum, mid-shot smiling elegantly while holding a cat ,seated elegantly with one eye winking and peace sign, and mid-shot holding daisy flowers. Holographic textures, pastel gradients, glitter accents, playful doodles, magazine cut-out graphics, chaotic yet balanced layout, extremely artistic and visually engaging"
（中略：outfit / hairstyle / additional_visuals / photography_rendering / negative_prompt の JSON 断片）
```

評価：ポーズを複数生成する（＝ポーズを保たない）設計で、対象年齢も 10〜20 代向け。ステッカー・ポラロイドの要素だけ参考にする。

## 参考：Storybook に近いが写真向けではないもの

- 出典：Tom's Guide「I used Google's Nano Banana to transform my kids' artwork」 https://www.tomsguide.com/ai/i-used-googles-nano-banana-to-transform-my-kids-artwork-here-are-the-5-prompts-that-worked-best
- 入力が「子どもの描いた絵」であって写真ではない。絵本風の語彙（"soft colors, textures, and a dreamy atmosphere"）の参考にだけ使う

```
Turn this child's drawing into a whimsical illustration for a children's storybook. Keep the playful spirit of the original lines but polish it with soft colors, textures, and a dreamy atmosphere.
```

## 見つからなかったテーマ（自作する）

| テーマ | 使った検索語 | 状況 |
|---|---|---|
| Storybook（写真→絵本） | `"turn this photo into" storybook illustration prompt "keep the face"` ほか | AI 検索の要約に文が出たが出典ページを特定できず、捏造の可能性を排除できないため不採用 |
| Claymation | `nano banana claymation Aardman full prompt` `claymation prompt "preserve" face pose Aardman reddit` | まとめサイトの断片（"Preserve key facial features and pose, but render all skin, hair, and clothing as if hand-sculpted from clay"）は一次ソース不明。PromptBase は有料、ツール系サイトは本文を静的に持たない |
| Background Illustration | `"keep the person" OR "keep the subject" photorealistic background illustrated` ほか | 要約止まりで原文ページを特定できず |
| Memory Box | `"shadow box" OR "memory box" OR "keepsake box" AI photo prompt`（Reddit 併用） | 物販サイトと実物の紹介記事のみ。近縁の「Flat-Lay Outfit Builder」は人体を描かない設計で転用不可 |

## 出典一覧

- https://github.com/ZeroLu/awesome-nanobanana-pro （CC BY 4.0）
- https://github.com/aimikoda/nano-banana-pro-prompts （CC BY 4.0）
- https://academy.techpresso.co/prompts/chatgpt-prompts-cartoon （ライセンス明記なし）
- https://youmind.com/prompts/personal-lego-minifigure-portrait-19650 （ライセンス明記なし）
- https://www.tomsguide.com/ai/i-used-googles-nano-banana-to-transform-my-kids-artwork-here-are-the-5-prompts-that-worked-best （参考のみ）
