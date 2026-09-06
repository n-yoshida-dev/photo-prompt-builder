# 仕様（設計案・未確認）

> **この内容は 2026-09-06 に Claude が下書きした設計案で、ユーザーの確認を経ていない。**
> 確認が取れたら、この注記を消して「確定仕様」にする。それまでは実装の正本ではない。
> 確認したい要点は `TODO.md`「確認待ち」にある。検討中の事項・やらないことは `PLAN.md`。

## 全体像

写真・スタイル・条件を画面で選ぶと、英語のプロンプトが「ブロック」を組み合わせて即時に出来上がる。
ブロックは 5 種類：**Base**（何をするか）／ **Style**（見た目の指定）／ **Identity**（人物の保持）／
**Composition**（構図の保持）／ **Negative**（〜しない）。
巨大な固定文字列を持たず、選択内容からブロックを組み立てる。バックエンド無し・API 無し。

## 画面構成（1 画面、上から順）

1. **写真**：ファイル選択（複数可）。サムネイルと枚数を表示。「写真はこの端末の外に出ません」と明記
2. **スタイル**：プリセットをカードで選ぶ（1 つだけ）
3. **条件**：3 グループのトグル。人物 / 背景・構図 / 出力
4. **生成プロンプト**：読み取り専用のテキスト欄。選択を変えると即時更新
5. **ボタン**：コピー ／ ChatGPT を開く ／ Claude を開く ／ Gemini を開く
6. **最近使った設定**：直近 5 件。クリックで復元

## プリセット（8 本）

依頼の 7 本＋プロンプト例②から 1 本。

| id | 表示名 | 種 |
|---|---|---|
| `diorama` | 3D Miniature Diorama | `docs/seed-prompts.md` 例①（検証済み） |
| `editorial-poster` | Editorial Poster（写真＋紙のイラスト） | `docs/seed-prompts.md` 例②（検証済み） |
| `travel-journal` | Travel Journal | Claude が下書き |
| `storybook` | Storybook | Claude が下書き |
| `storyboard` | Storyboard | Claude が下書き |
| `claymation` | Claymation | Claude が下書き |
| `background-illust` | Background Illustration | Claude が下書き |
| `memory-box` | Memory Box | Claude が下書き |

## トグル（11 個）と、どのブロックに入るか

| グループ | id | ラベル | 入るブロック |
|---|---|---|---|
| 人物 | `keep-face` | 顔を保持 | Identity |
| 人物 | `keep-clothing` | 服装を保持 | Identity |
| 人物 | `keep-pose` | ポーズを保持 | Identity |
| 人物 | `keep-family` | 家族構成を保持（人数・体格を変えない） | Identity |
| 背景・構図 | `keep-layout` | 建物や物の配置を保持 | Composition |
| 背景・構図 | `keep-framing` | 元の構図を保持 | Composition |
| 背景・構図 | `no-extra-objects` | 不要な物体を追加しない | Negative |
| 出力 | `no-text` | テキストを追加しない | Negative |
| 出力 | `muted-colors` | 色味を落ち着かせる | Style |
| 出力 | `high-realism` | 写実性を高くする | Style |
| 出力 | `strong-style` | スタイルを強くする | Style |

注意：`editorial-poster` は文字を入れる設計なので `no-text` と相性が悪い。
プリセットごとに「既定で ON のトグル」を持たせ、editorial-poster では `no-text` を既定 OFF にする。
「相性の悪いトグルを灰色にする」は MVP 後。

## データ構造（TypeScript）

```ts
// プリセット。base と style は英文。negative はそのプリセット固有の禁止事項
type Preset = {
  id: string
  name: string // 表示名
  descriptionJa: string // 日本語の一行説明
  base: string // 何をするか（Base Prompt）
  style: string // 見た目の指定（Style）
  negative: string[] // プリセット固有の「〜しない」
  defaultToggles: ToggleId[]
}

// トグル。text は英文。block でどこに差し込むかを決める
type Toggle = {
  id: ToggleId
  group: 'identity' | 'composition' | 'output' // 画面上の見出し
  label: string // 日本語ラベル
  block: 'identity' | 'composition' | 'negative' | 'style' // プロンプト上の位置
  text: string
}

// 純粋関数。画面にも localStorage にも触らない
function buildPrompt(preset: Preset, activeToggles: ToggleId[]): string
```

配置（`frontend/src/` 以下）：

| 場所 | 中身 | 触ってよいもの |
|---|---|---|
| `data/presets.ts` `data/toggles.ts` | マスタデータ。英文はここだけに置く | 定数のみ |
| `prompt/buildPrompt.ts` | プロンプト組み立ての純粋関数 | React・DOM・localStorage を import しない |
| `storage/recent.ts` | 最近使った設定の保存・復元 | localStorage を触るのはここだけ |
| `components/` | 画面 | 上の 3 つを呼ぶだけ |

Qiita の実験で英文を差し替えるとき、UI を触らずに済むように分ける。

## プロンプトの組み立て規則

```
{base}

{style}
{style ブロックのトグル文（ON のものだけ、順に）}

Preserve from the reference photo:
- {identity ブロックのトグル文}

Composition:
- {composition ブロックのトグル文}

Do not:
- {preset.negative}
- {negative ブロックのトグル文}
```

- ブロックに入る文が 0 個なら、その見出しごと出さない
- 見出し付きの「構造化」形式が既定。Qiita の「短い / 構造化」比較のため、見出し無しで文を繋ぐ「短文」形式は MVP 後に追加

## 保存（最近使った設定）

- localStorage（ブラウザが持つ小さな保存領域。サイトごとに分かれ、閉じても残る）に JSON で保存
- 保存するのは `{ presetId, toggleIds, savedAt }` だけ。**写真は保存しない**
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
  - トグルを ON にするとその英文が含まれ、OFF なら含まれない
  - ブロックが空なら見出しが出ない
  - 8 プリセット × 既定トグルの出力全文を保存しておき、次回と比較する（意図せぬ変更を検出）
- 最近使った設定：保存→復元の往復、壊れた JSON の読み込み
- CI：typecheck / lint / format:check / test / build

## MVP 後（Qiita の実験に向けて）

- 出力形式の切り替え（短文 / 構造化）
- スタイル強度を 3 段階に（弱・標準・強）。`strong-style` トグルの発展形
- 写真の枚数で Base の文言を切り替える（1 枚：this photo ／ 複数：one output per photo, do not combine）
- A/B 比較モード：2 つの設定を並べて両方コピー
- 相性の悪いトグルを灰色にする
- 画像をクリップボードへコピー（ブラウザ差あり）
- 実験結果の記録先 `docs/experiments.md`
