# 仕様

> 2026-09-06 に Claude が下書きし、2026-09-07・2026-09-29・2026-10-03 にユーザーの回答を反映した確定仕様。
> 合意した判断は `logs/decisions.md`、検討中の事項・やらないことは `PLAN.md`、まだ聞いていない点は `TODO.md`「確認待ち」。

## 全体像

スタイル・条件を画面で選ぶと、英語のプロンプトが「ブロック」を組み合わせて即時に出来上がる。
写真はこのアプリでは扱わない。開いた先の AI の画面で利用者が添付する（`logs/decisions.md` 2026-10-03）。
ブロックは 5 種類：**Base**（何をするか）／ **Style**（見た目の指定）／ **Identity**（人物の保持）／
**Composition**（構図の保持）／ **Negative**（〜しない）。
巨大な固定文字列を持たず、選択内容からブロックを組み立てる。バックエンド無し・API 無し。

## 画面構成（1 画面）

上から順に次の 5 つ。広い画面では左に操作、右に生成プロンプトの 2 列（`logs/decisions.md` 2026-10-03「2 列」）。スマホでは上から順に縦に並ぶ。
細部（最近使った設定 5 を左の列に置く、右の列をスクロールしても残す）は Claude が実装した形で、`TODO.md`「確認待ち」で確かめている。

1. **スタイル**：プリセットをカードで選ぶ（1 つだけ）。外部由来のプリセットは、カードに出典（作者名・ライセンス・リンク）を出す
   （`logs/decisions.md` 2026-10-03「出典をアプリの画面に出す」）。原文を書き換えたものは、書き換えたことも一行で出す（CC BY 4.0 の「変更点の明示」。Claude が足した要素）
2. **条件**：仕上がりの調整だけ。3 つの選択（加工の強さ・色味・縦横比）と 6 つのトグル。
   人物・構図の保持はここには出さず、プリセットが固定で持つ（下の「保持は固定」）
3. **生成プロンプト**：読み取り専用のテキスト欄。選択を変えると即時更新
4. **ボタン**：プロンプトをコピー ／ ChatGPT を開く ／ Gemini を開く。開くボタンはコピーも同時に行う
   （`logs/decisions.md` 2026-10-03）。「写真は開いた先の画面で添付します」と書く
5. **最近使った設定**：直近 5 件。クリックで復元。あわせて、名前を付けたお気に入りとして保存・呼び出しできるようにする
   （`logs/decisions.md` 2026-10-03。形は実装時に案を出して確かめる）

## プリセット（10 本）

届ける相手は子育て世帯のファミリー（`logs/decisions.md` 2026-10-03）。子どもの写真を加工する場面を基準に選ぶ・見直す。

作者が公開しているプロンプト（作者自身が未検証としているものを含む）を種にし、作者本人が利用条件（CC BY 4.0 / MIT など）を明記しているものだけを採る。
それが無いテーマは Claude が自作する（`logs/decisions.md` 2026-09-07、2026-10-03「プリセット残り 6 本の顔ぶれ」）。
2026-10-03 の顔ぶれはユーザーの言葉で「一旦採用」。使いながら入れ替えていく。
人物を残すか消すかで仕上がりが分かれるスタイル（ジオラマ・旅のスタンプ）は、カードを 2 枚に分ける（`logs/decisions.md` 2026-10-03）。

| id | 表示名 | 種 | 被写体 |
|---|---|---|---|
| `diorama` | 3D Miniature Diorama（建物だけ） | `docs/seed-prompts.md` 例①（ユーザー提供、検証済み） | 風景 |
| `diorama-family` | 3D Miniature Diorama（家族も） | 同じ例①の原文のまま。人物を残す指示はアプリが足すブロックで付ける（ユーザーは同じ原文で子どもと遊具のジオラマを作った） | 人物と場所（新設。ジオラマを分ける PR で足す） |
| `editorial-poster` | Editorial Poster（写真＋紙のイラスト） | `docs/seed-prompts.md` 例②（ユーザー提供、検証済み） | 人物 |
| `painted-anime` | 手描きアニメ映画風 | SeeAPI「nano-banana-prompts-for-image-editing」README 4.3 節（CC BY 4.0）。実在のスタジオ名を一般的な言い方に置き換える。ChatGPT の組み込みの「アニメ」と似るが残す（`logs/decisions.md` 2026-10-03） | 人物 |
| `watercolor` | 透明水彩 | AlbertAZ1992「albert-imagebook」styles/watercolor-light（MIT）。服の色を引っ張る色の一文を外す（`logs/decisions.md` 2026-10-03） | 人物 |
| `instant-photo` | インスタント写真風 | SeeAPI 同リポジトリ README 4.1 節（CC BY 4.0）。商標 "Polaroid" を消し、直後の一般的な言い方 "instant photograph" だけを残す | 人物 |
| `clay-animation` | 粘土アニメ風 | Claude が自作（利用条件の明記された原文なし） | 人物 |
| `yarn-embroidery` | 毛糸の刺しゅうワッペン | Claude が自作（Web の原文は利用条件が不明なので、雰囲気だけを参考に一から書く） | 人物 |
| `travel-stamps` | 旅のスタンプ（風景だけ） | Claude が自作（同上） | 風景 |
| `travel-stamps-family` | 旅のスタンプ（家族も） | Claude が自作（風景だけの版と同じ画風で、人物を残す） | 人物と場所 |

Web 原文を書き換えるとき（保持文とぶつかる箇所、実在のスタジオ名・商標）は、原文・書き換え版・書き換えた箇所・出典を
`docs/web-prompts.md` に並べて記録する（`logs/decisions.md` 2026-09-29、2026-10-03）。ユーザー提供の 2 本は改変しない。
スタジオ名・商標の置き換えは `painted-anime` と `instant-photo` について決まっている。保持文とぶつかる箇所の書き換えを
2026-09-29 の 2 本以外にも当てるのは Claude の推定で、当てるときは確認する。
選び直しで見送った候補と理由は `logs/decisions.md` 2026-10-03 にある。

「被写体」は、そのプリセットが人物を残すか（人物）、建物や風景を主役にして人物を消すか（風景）の区別。
下の「保持は固定」で、どの保持文を付けるかがこれで決まる。
3 つ目の「人物と場所」（ジオラマ・旅のスタンプの「家族も」）に何の保持文を付けるかは、ジオラマを分ける PR で決める（Claude の案：人物の保持文に、
模型やスタンプの見せ方とぶつからない構図の文を組み合わせる。今の「人物」の構図の文の「元のカメラの角度」はジオラマの斜め上からの見せ方とぶつかる）。
`diorama`（建物だけ）に「写真の人物を入れない」をアプリのブロックで足すのも Claude の案で、同じ PR で確かめる

## 保持は固定（トグルにしない）

思い出写真の加工では、顔・服装・ポーズ・家族の人数が変わってはいけない。これは「選ぶ条件」ではなく前提なので、
**プリセットが固定で持つ**。画面には出さない。

「顔を保持」を OFF にしたら顔が変わるのか、という疑問への答え：OFF は「変えろ」ではなく「何も指示しない」。
ただし AI は、粘土や絵本のようにスタイルを変えるとき、指示が無いと顔立ちや人数を平気で変える。
だから指示は常に入れておくのが安全で、ON/OFF させる意味がない。

| 被写体 | 常に付ける保持文（英文は `data/preserve.ts` に置く） |
|---|---|
| 人物 | 顔立ち・表情・体格・年齢の印象／服装／ポーズ／人数と並び（家族構成）／人物どうしの位置関係 |
| 風景 | 建物や物の配置・比率／元の構図／写真に写っている範囲の外を勝手に足さない |

`editorial-poster` の原文は既に同じ趣旨の文（"Keep the main composition, subjects, identity, facial features … unchanged"）を含む。
重複は害が少ないので MVP では許容し、実験で効果を見る（`docs/seed-prompts.md` のメモ）。

Qiita の実験「preserve 系あり／なし」のために、固定の保持文を外す **実験モード** を MVP 後に付ける（画面の隅の小さなスイッチ）。
通常利用では常に付く。

## 条件（仕上がりの調整）

依頼の原文にあった「人物」「背景・構図」のグループは上の固定化で消え、「出力」だけが残る。ここを充実させる。
形は 2 種類：**いくつかの選択肢から 1 つ選ぶもの**（ラジオ）と **ON/OFF**（トグル）。

「スタイル」とは、プリセットが決める見た目のこと（粘土っぽさ、絵本っぽさ、紙のイラストっぽさ）。
「加工の強さ」（2026-10-03 に「スタイル強度」から改名を決めた。画面の実装はフェーズ2.5）は、その見た目をどれだけ強く出すか。強いほど写真から離れ、弱いほど写真に近づく。
元の案の `high-realism`（写真に寄せる）と `strong-style`（スタイルに寄せる）は同じ軸の両端だったので、
同時 ON は矛盾する。1 つのラジオにまとめて、排他の問題ごと無くす。

### 選択（ラジオ 3 種類。選択肢の数は種類ごとに違う）

| id | ラベル | 選択肢（既定は先頭） | 入るブロック |
|---|---|---|---|
| `style-strength` | 加工の強さ | 標準（何も足さない）／ 控えめ（写真に近い）／ しっかり（イラストらしく） | Style |
| `color-mood` | 色味 | 元のまま（何も足さない）／ 淡く ／ 鮮やかに ／ 白黒 | Style |
| `aspect-ratio` | 縦横比 | 元のまま（何も足さない）／ 正方形 1:1 ／ 縦 3:4 ／ 横 16:9 | Style |

既定の選択肢は英文を足さない。プリセットの原文が持つ指定（`editorial-poster` の 3:4 など）と喧嘩しないため。
各選択肢の下に、何が変わるかを短い一文で添える。縦横比の選択肢には形の小さな図を付ける（`logs/decisions.md` 2026-10-03）。

### トグル（6 つ）

| id | ラベル | 入るブロック | 既定 |
|---|---|---|---|
| `no-text` | 文字を入れない | Negative | ON（`editorial-poster` は OFF） |
| `no-extra-objects` | 写っていない物を足さない | Negative | ON |
| `one-per-photo` | 複数枚を 1 枚にまとめない（1 枚ずつ出力） | Base | ON |
| `soft-light` | 柔らかい自然光にする | Style | OFF |
| `paper-texture` | 紙や画材の質感を出す | Style | OFF |
| `print-quality` | 印刷向けの高精細にする | Style | OFF |

プリセットごとに「既定で ON のトグル」を持たせる。「相性の悪い条件を灰色にする」は MVP 後。

## データ構造（TypeScript）

```ts
// プリセット。base と style は英文。negative はそのプリセット固有の禁止事項
type Preset = {
  id: string
  name: string // 表示名
  descriptionJa: string // 日本語の一行説明
  subject: 'people' | 'scene' // 被写体。どの固定保持文を付けるかが決まる
  base: string // 何をするか（Base Prompt）
  style: string // 見た目の指定（Style）
  negative: string[] // プリセット固有の「〜しない」（「Do not:」に続く小文字始まりの動詞句）
  defaultToggles: ToggleId[]
  source: { label: string; url?: string; license?: string; licenseUrl?: string; checkedOn?: string; modified?: string } // 英文の出典（外部由来は「作者 — 作品名」・URL・ライセンスとそのリンク・確認日、書き換えたら箇所）。url を持つものはカードに出典を出す
}

// 固定の保持文。subject ごとに 1 組。実験モード（MVP 後）以外では常に付く
type PreserveSet = {
  identity: string[] // Identity ブロック（people のみ）
  composition: string[] // Composition ブロック
}

// トグル。text は英文。block でどこに差し込むかを決める
type Toggle = {
  id: ToggleId
  label: string // 日本語ラベル
  block: 'base' | 'style' | 'negative' // プロンプト上の位置
  text: string
}

// ラジオ。options の先頭が既定で、既定の text は空文字（何も足さない）
type Choice = {
  id: ChoiceId
  label: string
  options: { id: string; label: string; text: string }[]
}

// 画面の選択状態。localStorage に保存するのもこの形（写真は含まない）
type Selection = {
  presetId: string
  toggleIds: ToggleId[]
  choices: Record<ChoiceId, string> // ChoiceId → 選んだ option の id
}

// buildPrompt が参照するマスタデータ一式（data/catalog.ts）
type Catalog = {
  presets: Preset[]
  preserve: Record<'people' | 'scene', PreserveSet>
  toggles: Toggle[]
  choices: Choice[]
}

// 純粋関数。画面にも localStorage にも触らない
// 2 つ目の引数（マスタデータ一式）は省略可能。テストで架空データを渡すためのもので、画面からは省略する
function buildPrompt(selection: Selection, catalog?: Catalog): string
```

配置（`frontend/src/` 以下）：

| 場所 | 中身 | 触ってよいもの |
|---|---|---|
| `data/presets.ts` `data/preserve.ts` `data/toggles.ts` `data/choices.ts` `data/headings.ts` `data/catalog.ts` | マスタデータ。英文（見出しを含む）はここだけに置く。`catalog.ts` は一式をまとめるだけ | 定数のみ |
| `data/aiSites.ts` | 「開く」ボタンの行き先（サイト名と URL）。URL にプロンプトは載せない | 定数のみ |
| `prompt/buildPrompt.ts` | プロンプト組み立ての純粋関数 | React・DOM・localStorage を import しない |
| `storage/recent.ts` | 最近使った設定の保存・復元 | localStorage を触るのはここだけ |
| `components/` | 画面 | 上の 3 つを呼ぶだけ |

Qiita の実験で英文を差し替えるとき、UI を触らずに済むように分ける。

## プロンプトの組み立て規則

```
{base}
{base ブロックのトグル文（ON のものだけ）}

{style}
{ラジオで選んだ文（既定以外のものだけ、順に）}
{style ブロックのトグル文（ON のものだけ、順に）}

Preserve from the reference photo:
- {subject に応じた固定の identity 文}

Composition:
- {subject に応じた固定の composition 文}

Do not:
- {preset.negative}
- {negative ブロックのトグル文}
```

- ブロックに入る文が 0 個なら、その見出しごと出さない（`scene` では Preserve の見出しが出ない）
- 見出し付きの「構造化」形式が既定。Qiita の「短い / 構造化」比較のため、見出し無しで文を繋ぐ「短文」形式は MVP 後に追加

## 保存（最近使った設定）

- localStorage（ブラウザが持つ小さな保存領域。サイトごとに分かれ、閉じても残る）に JSON で保存
- 保存するのは `Selection`（`presetId` / `toggleIds` / `choices`）と `savedAt` だけ。**写真は保存しない**
- 「コピー」ボタンを押した時点で保存。最大 5 件、同じ内容は 1 件にまとめる
- キー名は `photo-prompt-builder:recent`。読み込み時に形が壊れていたら捨てて空にする（例外を握りつぶさず console に出す）

## AI を開くボタン

- ChatGPT と Gemini の 2 サイト。押すとプロンプトをクリップボードへコピーしてから、トップページを新しいタブで開く
  （`logs/decisions.md` 2026-10-03。Claude は画像を生成しないので外した）
- URL のクエリでの本文の事前入力（`chatgpt.com/?q=` / `claude.ai/new?q=`）は 2026-09-29 に調べ、MVP では使わない
  （ChatGPT はログアウト中だと写真を添付する前に自動送信されることがある。Gemini には無い。KNOWLEDGE.md 2026-09-29）
- 画像の添付は各サイトで手動。画面にその旨を書く

## API

無し。バックエンドを持たない（`PLAN.md`「技術的な方針」）。

## 検算の手段（機械にやらせる）

- `buildPrompt` の単体テスト：
  - トグルを ON にするとその英文が含まれ、OFF なら含まれない。ラジオは既定なら何も足さず、他を選ぶとその英文が含まれる
  - `people` のプリセットには固定の保持文が必ず含まれ、`scene` には Preserve の見出しが出ない
  - ブロックが空なら見出しが出ない
  - 全プリセット × 既定の条件の出力全文を保存しておき、次回と比較する（意図せぬ変更を検出）
- 最近使った設定：保存→復元の往復、壊れた JSON の読み込み
- CI：typecheck / lint / format:check / test / build

## MVP 後（Qiita の実験に向けて）

- 出力形式の切り替え（短文 / 構造化）
- 実験モード：固定の保持文を外せるスイッチ（Qiita の「preserve 系あり／なし」比較用）
- A/B 比較モード：2 つの設定を並べて両方コピー
- 相性の悪い条件を灰色にする（`editorial-poster` の縦横比など）
- 実験結果の記録先 `docs/experiments.md`
- 写真の枚数で `one-per-photo` の既定を切り替える案と、画像をクリップボードへコピーする案は、写真の選択を外した（2026-10-03）ので取りやめ

## これから足すもの（2026-10-03 のユーザーの意見から。中身は確認しながら決める）

- **スタイルの見本画像**：ユーザーの言葉「文字だけじゃわからん。「こんな感じになるよ」って参考画像を貼ってほしい。」。
  見本は実際に AI で作った結果でないと意味がない。作り方は「AI で作った架空の家族写真を元に、Claude が Codex で作る」と決めた（`logs/decisions.md` 2026-10-03）。
  見本はアプリが作るプロンプト（既定の条件）そのままで作る（Claude が選んだ作り方。KNOWLEDGE.md 2026-10-03）
- **設定をお気に入りとして保存**：ユーザーの言葉「設定を保存とかできるといいんじゃない？」。名前を付けて保存する形を足すと決めた（`logs/decisions.md` 2026-10-03）。
  保存先はブラウザの中だけ（localStorage）で、写真は保存しない
- **旅のスタンプで人物を消すかを選べるようにする**：ユーザーの言葉「人物を消すかどうか、選択できるようにすればいいのでは？」。
  ジオラマと合わせて「カードを分ける」と決めた（`logs/decisions.md` 2026-10-03）。上の「プリセット」の表を参照
