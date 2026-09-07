# 仕様（一部が設計案・未確認）

> 2026-09-06 に Claude が下書きし、2026-09-07 にユーザーの回答を反映した。確定した点と、まだ案の点がある。
> **確定**：画面構成（並びは実装後に見直す）・組み立て規則・最近使った設定の保存方式・`diorama` と `editorial-poster` の英文。
> **案（未確認）**：「条件」の再編（人物・構図の保持を固定化し、出力の調整を増やす）と、Web 収集で決めるプリセットの顔ぶれ。
> 確認が取れたら、この注記を消して「確定仕様」にする。確認したい要点は `TODO.md`「確認待ち」にある。
> 検討中の事項・やらないことは `PLAN.md`、合意した判断は `logs/decisions.md`。

## 全体像

写真・スタイル・条件を画面で選ぶと、英語のプロンプトが「ブロック」を組み合わせて即時に出来上がる。
ブロックは 5 種類：**Base**（何をするか）／ **Style**（見た目の指定）／ **Identity**（人物の保持）／
**Composition**（構図の保持）／ **Negative**（〜しない）。
巨大な固定文字列を持たず、選択内容からブロックを組み立てる。バックエンド無し・API 無し。

## 画面構成（1 画面、上から順）

1. **写真**：ファイル選択（複数可）。サムネイルと枚数を表示。「写真はこの端末の外に出ません」と明記
2. **スタイル**：プリセットをカードで選ぶ（1 つだけ）
3. **条件**：仕上がりの調整だけ。3 つの選択（スタイル強度・色味・縦横比）と 6 つのトグル。
   人物・構図の保持はここには出さず、プリセットが固定で持つ（下の「保持は固定」）
4. **生成プロンプト**：読み取り専用のテキスト欄。選択を変えると即時更新
5. **ボタン**：コピー ／ ChatGPT を開く ／ Claude を開く ／ Gemini を開く
6. **最近使った設定**：直近 5 件。クリックで復元

## プリセット（8 本を目安。顔ぶれは Web 収集の結果で決める）

確定しているのは検証済みの 2 本だけ。残りは Web で実績のあるプロンプトを集めて種にし、無いテーマだけ自作する
（`logs/decisions.md` 2026-09-07）。依頼の原文にあった 7 テーマは仮で、収集結果で入れ替えてよい。

| id | 表示名 | 種 | 被写体 |
|---|---|---|---|
| `diorama` | 3D Miniature Diorama | `docs/seed-prompts.md` 例①（検証済み） | 風景（人物は消す） |
| `editorial-poster` | Editorial Poster（写真＋紙のイラスト） | `docs/seed-prompts.md` 例②（検証済み） | 人物 |
| `pixar-3d` | Pixar 風 3D キャラクター | `docs/prompt-candidates.md` 1（Web 収集） | 人物 |
| `photo-booth` | Photo Booth（プリントストリップ） | `docs/prompt-candidates.md` 2（Web 収集、CC BY 4.0） | 人物 |
| `brick-minifig` | ブロックのミニフィグ | `docs/prompt-candidates.md` 3（Web 収集） | 人物 |
| `painted-anime` | 手描きアニメ映画風 | `docs/prompt-candidates.md` 4（Web 収集。スタジオ名の扱いは要確認） | 人物 |
| `storybook` | Storybook（絵本風） | Claude が自作（Web に信頼できる原文なし） | 人物 |
| `claymation` | Claymation（粘土アニメ風） | Claude が自作（同上） | 人物 |

上の 6 本は Claude の採用案で、`TODO.md`「確認待ち」でユーザーが決める。候補の全文と出典は `docs/prompt-candidates.md`。
採用時に決めることが 2 つある。(1) `photo-booth` の原文は服装を変え、`painted-anime` の原文は背景を差し替えるので、
「保持は固定」の保持文と矛盾する。原文の改変を許すか、見送るか。(2) `pixar-3d` `brick-minifig` `painted-anime` は
出典にライセンスの明記がない。再配布不可と分かれば自作に切り替える（`logs/decisions.md` 2026-09-07）。
見送り案：`storyboard`（9 コマで映画寄り）、`travel-journal`（写真加工でなく都市名から生成する型）、
`figure-box`（子どもを箱に入れる演出、服装・ポーズを変える指示を含む）、`background-illust` `memory-box`（原文なし。自作 2 本で枠が埋まる）。

「被写体」は、そのプリセットが人物を残すか（人物）、建物や風景を主役にして人物を消すか（風景）の区別。
下の「保持は固定」で、どの保持文を付けるかがこれで決まる。

## 保持は固定（トグルにしない）【案】

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

## 条件（仕上がりの調整）【案】

依頼の原文にあった「人物」「背景・構図」のグループは上の固定化で消え、「出力」だけが残る。ここを充実させる。
形は 2 種類：**いくつかの選択肢から 1 つ選ぶもの**（ラジオ）と **ON/OFF**（トグル）。

「スタイル」とは、プリセットが決める見た目のこと（粘土っぽさ、絵本っぽさ、紙のイラストっぽさ）。
「スタイル強度」は、その見た目をどれだけ強く出すか。強いほど写真から離れ、弱いほど写真に近づく。
元の案の `high-realism`（写真に寄せる）と `strong-style`（スタイルに寄せる）は同じ軸の両端だったので、
同時 ON は矛盾する。1 つのラジオにまとめて、排他の問題ごと無くす。

### 選択（ラジオ 3 種類。選択肢の数は種類ごとに違う）

| id | ラベル | 選択肢（既定は先頭） | 入るブロック |
|---|---|---|---|
| `style-strength` | スタイル強度 | 標準（何も足さない）／ 写真寄り ／ スタイル寄り | Style |
| `color-mood` | 色味 | 元のまま（何も足さない）／ 落ち着いた ／ 鮮やか ／ モノクロ | Style |
| `aspect-ratio` | 縦横比 | 元のまま（何も足さない）／ 正方形 1:1 ／ 縦 3:4 ／ 横 16:9 | Style |

既定の選択肢は英文を足さない。プリセットの原文が持つ指定（`editorial-poster` の 3:4 など）と喧嘩しないため。

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
  negative: string[] // プリセット固有の「〜しない」
  defaultToggles: ToggleId[]
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

// 純粋関数。画面にも localStorage にも触らない
function buildPrompt(selection: Selection): string
```

配置（`frontend/src/` 以下）：

| 場所 | 中身 | 触ってよいもの |
|---|---|---|
| `data/presets.ts` `data/preserve.ts` `data/toggles.ts` `data/choices.ts` | マスタデータ。英文はここだけに置く | 定数のみ |
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

- MVP は 3 サイトへの単純なリンク（新しいタブ）
- ChatGPT と Claude は URL のクエリで本文を事前入力できる可能性がある（`chatgpt.com/?q=` / `claude.ai/new?q=`）。
  **要検証。** 動けば「コピー→貼り付け」の手間が減る。Gemini には無い
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
- 写真の枚数で `one-per-photo` の既定を切り替える（1 枚なら OFF）
- A/B 比較モード：2 つの設定を並べて両方コピー
- 相性の悪い条件を灰色にする（`editorial-poster` の縦横比など）
- 画像をクリップボードへコピー（ブラウザ差あり）
- 実験結果の記録先 `docs/experiments.md`
