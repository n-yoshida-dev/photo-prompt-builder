# スタイル候補 9 案の試作（2026-10-04）

調査レポート `docs/style-research-2026-10-04.md` の推薦 9 案を、Codex で 1 枚ずつ試作した記録。
ユーザーの言葉「一度Codexで作ってみてもらえる？作ってみてもらった実際のものを見て判断してみる」を受けた
（`logs/decisions.md` 2026-10-04「Claude が Codex で画像を作るときの了承は、タスクごとに 1 回取る」、`../CLAUDE.md`「了承はタスクごとに 1 回」）。

- 比較ページ（非公開）：https://claude.ai/artifact/XjjCK2AYeKm1X5i5Ze1ko8
- 作り方：Codex（GPT-6 Astra、思考の深さ low）の組み込みの画像機能。元の写真を添付し、下の文を一字も変えずに使うよう指示した。10 枚（寝相アート用の元の写真 1 枚を含む）で約 19 万トークン
- 文は **アプリに組み込む前の試作**。アプリの固定の保持文・条件・「Do not:」は付けていない（各文の中に、顔や人数を変えない指示を短く入れた）。アプリに入れるときは、被写体の種類と保持文の組み合わせを設計し直す
- 元の写真はどれも AI で作った架空の写真（実在の人ではない。`CLAUDE.md`「守ること」）。画像はリポジトリに入れず、`~/.cache/photo-prompt-builder/samples-2026-10-03/` の `trial-<id>.png` に置いた
- どれも 1 回だけ作った結果で、作り直すと仕上がりは変わる。文はすべて Claude が一から書いた（Web の原文は写していない。
  採るときは、調査で着想元に挙がった原文と連続 3 語の並びが重ならないことを確かめる。刺しゅうのときと同じ。KNOWLEDGE.md 2026-10-03）
- 各節の「良かった点・気になる点」は、Claude が画像を見て書いたもの。ユーザーの評価ではない（ユーザーはまだ判断していない）

## 1. 写真とらくがきの小人（`doodle-friends`）

- 元の写真：公園の家族 3 人（`base-family.png`）
- 良かった点：写真はそのままで、ペンの小人が落ち葉を運んだり頭の上で喜んだりしている。顔にはかからない
- 気になる点：小人が小さく、遠目には元の写真とあまり変わらない

```text
Keep the photo exactly as it is: the same people, faces, expressions, clothing, poses, background, and framing. Add a playful layer of simple hand-drawn ink doodles on top of it, as if someone drew on a printed photo with a fine black pen. Draw a handful of tiny cartoon helpers (small round-bodied characters with stick arms and legs) interacting with what is in the photo: cheering, carrying a fallen leaf, peeking from behind the bench, and copying a person's pose. Use only thin black ink lines with at most one accent color, keep the doodles small and light so the photo stays the main subject, and never draw over any face or hand. Do not redraw or stylize the people or the background; they must remain a real photograph, and children must keep their real age. No speech bubbles, words, letters, or numbers.
```

## 2. 写真の続きを描いたスケッチブック（`sketchbook-extension`）

- 元の写真：旅先の家族 4 人（`base-travel.png`）
- 良かった点：写真のプリントの外へ、色鉛筆で海と岩場が広がる。家族 4 人は写真のまま
- 気になる点：灯台がプリントの中と絵の中に 2 本出た

```text
Create a photo of an open spiral sketchbook lying on a wooden table, seen from directly above in soft daylight. In the center of the spread, the uploaded photo is attached as a printed photograph with two strips of washi tape. Keep everything inside the print exactly as in the original photo, including every person's face, expression, clothing, pose, apparent age, and the number of people. Around the print, continue the scenery beyond the photo's edges as a hand-drawn pencil and colored-pencil sketch on the paper: the sea, the sky, the rocky coast, and the lighthouse's surroundings extended outward with lines that connect seamlessly to the edges of the print, gradually fading into loose, unfinished sketch strokes toward the page edges. Do not draw any additional people in the sketch area. No words, dates, letters, or numbers on the page.
```

## 3. 飛び出す絵本（`pop-up-book`）

- 元の写真：公園の家族 3 人（`base-family.png`）
- 良かった点：紙細工の景色が立ち上がり、家族は写真の顔のまま切り抜きのカードとして立っている。中央の折り目は顔を避けた
- 気になる点：特になし（1 回だけの結果）

```text
Turn this photo into a handmade pop-up book, photographed open on a wooden table in soft daylight. The two-page spread rises into layered paper cutouts that rebuild the scene from the photo: the trees, the path, the bench, and the sky as stacked cardstock layers with visible paper edges, folds, and tabs. The people are printed from the original photo onto stiff card, cut out along their outlines, and stand up in the front layer at the same positions and in the same order as in the photo, so their faces, expressions, clothing, poses, and apparent ages look exactly as in the photo. Keep the center fold of the book away from anyone's face. Use the warm, gentle colors of the original photo. No title, words, letters, or numbers on the book.
```

## 4. 記念切手（`commemorative-stamp`）

- 元の写真：公園の家族 3 人（`base-family.png`）
- 良かった点：ギザギザの縁の切手が封筒に貼られ、消印の波線が入る。文字は額面の数字「84」だけ
- 気になる点：切手の絵が写真にかなり近い。名前が「旅のスタンプ」と紛らわしい

```text
Turn this photo into a commemorative postage stamp. The stamp shows the scene from the photo as a finely printed illustration in soft, slightly muted colors, with the same people, faces, expressions, clothing, poses, and arrangement; keep the children looking their real age. Give the stamp a classic perforated white border. The stamp is stuck on the corner of a cream-colored envelope, with a round postmark made of simple wavy lines partly overlapping its edge, photographed flat from above in soft daylight. Allow only a small numeral for the stamp's value in one corner; no words, country names, personal names, dates, or other letters anywhere.
```

## 5. すごろく盤（`sugoroku-board`）

- 元の写真：旅先の家族 4 人（`base-travel.png`）
- 良かった点：石畳から岩場を通って灯台までマスの道が続き、コマとサイコロが置かれている。文字なし
- 気になる点：家族は入らない（入れる版は人物の置き方を考える必要がある）

```text
Turn the place in this photo into a handmade family board game (a simple race game), photographed from slightly above on a living-room floor in soft daylight. The terrain of the photo, including the stone promenade, the rocks, the cape, the striped lighthouse, and the sea with sailboats, becomes the game board itself, painted on a sheet of thick card, with a winding path of round spaces that follows the real shapes of the place from one corner of the board to the lighthouse. Add a few small wooden player pieces and one die on the board. Keep the layout and landmarks recognizable as the same place. Remove the people from the photo. No words, numbers, labels, or letters on the board or its spaces.
```

## 6. 思い出の標本箱（`specimen-box`）

- 元の写真：旅先の家族 4 人（`base-travel.png`）
- 良かった点：帽子・サングラス・サンダル・灯台の模型・ヨット・石が、木の箱の仕切りに並ぶ
- 気になる点：写真に無い黄色いシュシュが入った（女の子のワンピースの柄から作ったと Claude は推定）

```text
Create a photo of a wooden specimen box (a shallow display box with a glass lid and small square compartments lined with off-white paper), photographed from directly above in soft daylight. In the compartments, place only objects that actually appear in the uploaded photo, one per compartment, shown as real, carefully arranged keepsakes that match their colors and shapes in the photo: for example the straw hat, the green sun hat, the sunglasses, the white sandal, a small stone from the promenade, a tiny model of the striped lighthouse, and a toy sailboat. It is fine to leave some compartments empty. Do not show any people, animals, insects, or pins. No labels, words, letters, or numbers.
```

## 7. 風景にかざしたスケッチ（`held-up-sketch`）

- 元の写真：遊具で遊ぶ女の子（`base-playground.png`）
- 良かった点：手で持った画用紙の中だけ、桜の木がツリーハウスに、雲がくじらになる。女の子は写真のまま
- 気になる点：紙を持つ大人の手が左端に写る

```text
Keep the photo exactly as it is, with the same girl, face, expression, clothing, pose, slide, trees, and background, and add only one element: an adult hand holding up a sheet of white drawing paper in the upper left part of the frame, against the sky and the cherry tree, without covering the girl. Inside the paper only, continue the real scenery behind it as a gentle hand-drawn colored-pencil fantasy, with the lines of the drawing lining up with the real background around the paper edges: for example, the cherry branches turn into a playful tree house and a cloud turns into a friendly whale. Everything outside the paper stays a real, unchanged photograph. No words, letters, or numbers.
```

## 8. 寝相アート（`sleeping-pose-art`）

- 元の写真：寝ている赤ちゃん（真上から。今回作った）（`base-baby.png`）
- 良かった点：赤ちゃんは写真のまま眠り、まわりに布の夜空・フェルトの月と星・雲・ぬいぐるみ。顔のまわりは空いている
- 気になる点：使えるのは真上から撮った寝姿の写真だけ

```text
Turn this top-down photo of a sleeping baby into sleeping-pose art. Keep the baby exactly as in the photo: the same face, closed eyes, expression, pose, outfit, and size, still peacefully asleep. Arrange colorful felt, fabric, ribbons, and small soft toys on the sheet around the baby to build a storybook scene, as if the baby were floating among soft clouds and stars in a night sky with a crescent moon. Keep a clear, generous empty space around the baby's face and head; nothing may touch or cover the face. Photographed from directly above in soft daylight. No words, letters, or numbers.
```

## 9. うちの子アクリルスタンド（`acrylic-stand`）

- 元の写真：公園の家族 3 人（`base-family.png`）
- 良かった点：透明なアクリル板に家族が写真のまま刷られ、棚に飾られている
- 気になる点：背景も同じ板に刷られて、切り抜いたスタンドらしさが弱い（板が 2 枚にならなかった）

```text
Create a photo of a clear acrylic stand displayed on a white wooden shelf at home, photographed at a slight angle in soft daylight. The family from the uploaded photo is printed on one transparent acrylic piece, cut out along the outline of the whole group as a single shape, standing in a small clear base. Print them exactly as they look in the photo, with the same faces, expressions, clothing, poses, apparent ages, number of people, and left-to-right order, as a sharp photographic print, not a drawing. Behind them stands a second, slightly larger acrylic panel printed with a soft, simplified version of the park background from the photo. Show subtle reflections and the thickness of the acrylic edges, without any glare across faces. No words, letters, or numbers.
```
