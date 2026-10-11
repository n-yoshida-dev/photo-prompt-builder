# スタイルの見本画像：作り方と利用条件

画面の「1 スタイルを選ぶ」の各カードに出している見本画像の記録。画像は `frontend/public/samples/` にある。

- **何の画像か**：AI で作った架空の写真（実在の人は写っていない）を、そのスタイルでこのアプリが作るプロンプト（**既定の条件のまま**）で AI に加工させた結果。
  作り方は `logs/decisions.md` 2026-10-03「スタイルの見本画像は、AI で作った架空の家族写真を元に、Claude が Codex で作る」で決めた
- **使ったプロンプト**：スタイルごとに [`sample-images/prompts/`](sample-images/prompts/) に全文を置いた。今のアプリのプロンプトと一字一句同じであることを
  `frontend/src/data/samples.test.ts` が確かめる。プリセット・保持文・トグルの文を変えるとこのテストが落ちるので、そのときは下の「作り直す手順」で見本を作り直す
- **どの画像をどのカードに出すか**：`frontend/src/data/samples.ts`

## 見本（11 枚）

作ったのはどれも Claude（Codex を動かした）。Codex は VS Code の拡張機能に入っている `codex exec` で、考える深さは low。
画像は Codex の組み込みの `image_gen` ツールが作った（画像を作るモデルの名前はログに出ない）。下の「Codex のモデル」は、`image_gen` を呼んだ側のモデル。

| スタイル（プリセット id） | 画像 | 元の写真 | 作った日 | Codex のモデル |
|---|---|---|---|---|
| `diorama` | `diorama.webp` | 遊具の子ども | 2026-10-03 | gpt-6-astra |
| `diorama-family` | `diorama-family.webp` | 遊具の子ども | 2026-10-03 | gpt-6-astra |
| `editorial-poster` | `editorial-poster.webp` | 公園の家族 | 2026-10-03 | gpt-6-astra |
| `doodle-friends` | `doodle-friends.webp` | 公園の家族 | 2026-10-06 | gpt-6-astra |
| `sketchbook-extension` | `sketchbook-extension.webp` | 旅先の家族 | 2026-10-06 | gpt-6-astra |
| `pop-up-book` | `pop-up-book.webp` | 公園の家族 | 2026-10-10 | gpt-6.1-sol |
| `commemorative-stamp` | `commemorative-stamp.webp` | 公園の家族 | 2026-10-10 | gpt-6.1-sol |
| `sugoroku-board` | `sugoroku-board.webp` | 旅先の家族 | 2026-10-10 | gpt-6.1-sol |
| `specimen-box` | `specimen-box.webp` | 旅先の家族 | 2026-10-10 | gpt-6.1-sol |
| `travel-stamps` | `travel-stamps.webp` | 旅先の家族 | 2026-10-04 | gpt-6-astra |
| `travel-stamps-family` | `travel-stamps-family.webp` | 旅先の家族 | 2026-10-11 | gpt-6.1-sol |

- `travel-stamps-family` 以外は、今の文で 1 回だけ作った画像をそのまま使った（選び直し・手直し（描き足し・切り抜き）はしていない）。
  スタイルの文を直しながら何回か作ったものは、最後の文（今の文）で作った回の画像を使った
- `travel-stamps-family` は、今の文で作った 2 枚（2026-10-11）のうちの 2 枚目。2 枚とも比較ページでユーザーに見せ、返事は「OK。後の2枚目・3枚目の方がいいね。」だった（`logs/decisions.md` 2026-10-11）。
  2 枚目にしたのは、母の顔の陰影が 1 枚目より少なく、スタンプの線に寄っていたから（Claude の判断）
- 同じプロンプトでも、AI は回ごとに違う画像を作る。見本は「こんな感じになる」の 1 例で、同じ結果になることを約束するものではない

## 元の写真（3 枚。AI で作った架空の写真）

画面では一覧の下に小さく出している（`frontend/public/samples/originals/`）。作ったのは Claude（Codex、gpt-6-astra、考える深さ low、2026-10-03）。
中身（人数・服・小物）は Claude が決めた。保持の指示が効いたかを目で確かめられるように、帽子・眼鏡・前歯の抜けた笑顔・肩車などを入れてある。
Codex に渡した写真の説明は次のとおり（英文は渡したまま）。

### 公園の家族（`originals/family.webp`）

> A casual smartphone snapshot of a fictional Japanese family (not real people): a mother, a father, and a five-year-old child standing together on a gravel path in a city park on a sunny autumn afternoon. The child is in the middle, holding both parents' hands and smiling at the camera with a gap-toothed grin. Everyday clothes: the child wears a mustard-yellow knit cap and a navy-and-white striped long-sleeve shirt; the mother wears a beige trench coat; the father wears a gray hoodie and glasses. Trees with orange leaves and a wooden bench in the background. Natural light, eye-level, slightly imperfect framing like a real family photo, landscape 4:3. No text, no logos, no watermark.

### 遊具の子ども（`originals/playground.webp`）

> A casual smartphone photo of a fictional Japanese girl (not a real person), about four years old, playing on a small playground structure in a neighborhood park on a sunny spring afternoon. She is at the top of a short red slide attached to a wooden climbing frame with a green roof and a rope ladder, holding the railing with one hand and waving with the other, smiling. She wears a light-blue denim pinafore dress over a white long-sleeve shirt, pink sneakers, and her hair in two low pigtails with yellow hair ties. Sandbox and a few trees behind, other playground structures out of focus. No other people. Eye-level, slightly angled view, landscape 4:3. No readable text, no logos, no watermark.

### 旅先の家族（`originals/travel.webp`）

> A casual smartphone travel snapshot of a fictional Japanese family (not real people) on a summer trip: a father, a mother, and two children (a boy about eight in a green T-shirt and a sun hat, and a girl about three in a yellow sundress, sitting on her father's shoulders), standing on a stone seaside promenade in front of a fictional white-and-red striped lighthouse on a rocky cape, with blue sea and a few sailboats behind. The mother wears a straw hat and a white blouse; the father wears a navy polo shirt and sunglasses pushed up on his head. Everyone smiling at the camera. Bright midday light, eye-level, landscape 4:3. No readable text, no logos, no watermark.

## アプリに入れるときの加工

- Codex が作った PNG（1 枚 3MB 前後）を、ブラウザ（Playwright の Chromium）の canvas で縮め、WebP（品質 0.8）にした。見本は幅 640px、元の写真は幅 320px。14 枚で合計約 900KB
- canvas で描き直したので、元の PNG に入っていた来歴の情報（C2PA など）は残っていない。画像が AI で作ったものであることは、画面の一文（一覧の下）とこの文書で示している
- 画面では `loading="lazy"` にして、カードが画面に近づいてから読み込む

## 利用条件

- **OpenAI の利用規約**（Terms of Use。EEA・スイス・英国以外の利用者向けの版。Effective: January 1, 2026。2026-10-11 に https://openai.com/policies/row-terms-of-use/ で確認）の「Ownership of content」：
  > As between you and OpenAI, and to the extent permitted by applicable law, you (a) retain your ownership rights in Input and (b) own the Output. We hereby assign to you all our right, title, and interest, if any, in and to Output.

  作った画像（Output）は、作った利用者（このリポジトリの持ち主）のものになる。同じ規約の「Similarity of content」のとおり、ほかの利用者が似た画像を受け取ることはある
- 同じ規約の「What you cannot do」に「Represent that Output was human-generated when it was not.」とある。画面には、見本が AI で作ったものだと一覧の下に書いている
- 元の写真は AI で作った架空の写真で、実在の人は写っていない（`CLAUDE.md`「守ること」：架空の写真はダミー画像として扱い、スタイルの見本に使ってよい）。実在の子どもの写真は使っていない
- このリポジトリ全体のライセンスは未定（`README.md`）

## 作り直す手順（プロンプトを変えて `samples.test.ts` が落ちたとき）

1. 今のプロンプト（既定の条件）を取り出す。`buildPrompt(defaultSelection('<プリセット id>'))` の結果で、`frontend/src/data/__snapshots__/catalog.test.ts.snap` にも同じ全文がある
2. 次の依頼文の `<プロンプト>` に 1 の全文を入れ、上の表と同じ元の写真を添えて Codex に渡す（Claude が動かすときの呼び方は、apps の `CLAUDE.md`「Codex を呼ぶときは」と `KNOWLEDGE.md` 2026-10-06）

   ```text
   Use the built-in image_gen tool to create exactly ONE image from the attached photo (the attached photo is the source to transform). Use the prompt between the BEGIN and END lines exactly as written, without adding, removing, or rephrasing anything. Then copy the generated file into the current working directory as <名前>.png. Do not do anything else and do not create or edit any other files.

   BEGIN PROMPT
   <プロンプト>
   END PROMPT
   ```

   2026-10-03・2026-10-06 の回は、1 行目が「Use the built-in image_gen tool to EDIT the attached image (the attached image is the edit target). … Generate exactly ONE image, then copy …」だった（言い回しの違いだけで、BEGIN と END の間はどちらもアプリの文そのまま）
3. できた PNG を幅 640px の WebP にして `frontend/public/samples/<プリセット id>.webp` を置き換える
4. 使ったプロンプトを `sample-images/prompts/<プリセット id>.txt` に貼り替え、この文書の表の日付とモデルを直す
