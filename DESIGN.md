---
name: photo-prompt-builder
description: 子どもの写真を AI で加工するプロンプトを、スタイルと条件を選ぶだけで組み立てる 1 画面の道具。見た目は「写真帳の 1 ページ」
version: alpha
colors:
  primary: "#2f5d4b"
  on-primary: "#f3f4f1"
  paper: "#f3f4f1"
  ink: "#23272a"
  ink-muted: "#5f6460"
  rule: "#d3d2ca"
  album: "#1d211e"
  pen: "#ece9df"
  primary-soft: "#e6ede8"
  corner: "#c6bfa9"
typography:
  title:
    fontFamily: "'Hiragino Mincho ProN', 'BIZ UDPMincho', 'Yu Mincho', 'Noto Serif JP', 'Noto Serif CJK JP', serif"
    fontSize: 2.1rem
    fontWeight: 600
    letterSpacing: 0.02em
  heading:
    fontFamily: "'Hiragino Mincho ProN', 'BIZ UDPMincho', 'Yu Mincho', 'Noto Serif JP', 'Noto Serif CJK JP', serif"
    fontSize: 1.45rem
    fontWeight: 600
  subheading:
    fontFamily: "'Hiragino Mincho ProN', 'BIZ UDPMincho', 'Yu Mincho', 'Noto Serif JP', 'Noto Serif CJK JP', serif"
    fontSize: 1.05rem
    fontWeight: 600
  body:
    fontFamily: "system-ui, -apple-system, 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic UI', sans-serif"
    fontSize: 1rem
    lineHeight: 1.65
  note:
    fontFamily: "system-ui, -apple-system, 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic UI', sans-serif"
    fontSize: 0.85rem
    lineHeight: 1.45
  pen:
    fontFamily: "ui-serif, 'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, serif"
    fontSize: 1rem
    lineHeight: 1.8
rounded:
  none: 0px
  sm: 2px
spacing:
  xs: 0.25rem
  sm: 0.5rem
  md: 1rem
  lg: 2rem
  xl: 2.75rem
components:
  page:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
  note-text:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.note}"
  row-selected:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    rounded: "{rounded.none}"
  row-selected-note:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.ink-muted}"
  row-divider:
    backgroundColor: "{colors.rule}"
  album-page:
    backgroundColor: "{colors.album}"
    textColor: "{colors.pen}"
    typography: "{typography.pen}"
    rounded: "{rounded.sm}"
  photo-corner:
    backgroundColor: "{colors.corner}"
  copy-button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
---

## Overview

**2026-10-11 に確定。** 方向はユーザーが比較ページ（https://claude.ai/artifact/UiTbChwhHrJi2Lir75o6RA ）の 3 案から選んだ A「写真帳の 1 ページ」（`logs/decisions.md` 2026-10-11）。
書式は Google の DESIGN.md（https://github.com/google-labs-code/design.md ）。値の正本は `frontend/src/index.css`。ここと食い違ったら CSS に合わせてここを直す。
画面のファイルを変えるときは、この 1 枚を先に読む。

- **誰が、どんな場面で使うか**：子育て世帯のファミリー（`logs/decisions.md` 2026-10-03）。手元にある子どもの写真を、ChatGPT や Gemini でジオラマや絵本などに作り替えたいとき。
  スマホからも PC からも開く。写真はこのアプリでは扱わない（開いた先の AI の画面で添付する）
- **画面の仕事**：スタイルと条件を選ぶと英語のプロンプトができあがる。できあがったものをコピーして AI の画面へ持っていく。それだけ
- **題材**：家族の写真帳。罫線と余白だけで区切った紙の上で選び、できあがったプロンプトを「黒い台紙に白いペンで書いた 1 ページ」として見せる
- **ユーザーが良いと挙げたこと**：「特に、条件の選択肢を 1 行ずつにしたのが、今回良いと思った。」（2026-10-11）。この形は崩さない
- **雰囲気の言葉 3 つ**（Claude の言葉。ユーザーは A の見本を選んだが、言葉そのものは確かめていない）：静か・紙の手触り・台紙が主役
- **避けたい見た目（ユーザーの言葉）**：このアプリで言われたものは無い。ほかのアプリで言われた言葉（Claude の転記。portfolio と skill-matrix の `logs/decisions.md`）：
  「ブートストラップっぽい」「ウィキペディアみたいで、文章ばっかなのが見る気をなくす。なんかそっけなさすぎる。」「もろ「AIっぽさ」が見える」「ギラギラしすぎ」
  「グラデーション・光るカード・3D・ロゴの羅列、のようなイケイケなSaaSみたいなのはちょっと私のイメージと違うかな。」
- **手本の画面**：実在のサイトは無い。比較ページの A の見本が手本
- **このアプリだけの見どころ 1 つ**：黒い台紙に白いペンで書いたプロンプト（四隅に写真のコーナー）。ほかは静かにして、ここだけを目立たせる
- **題名**：「子ども・家族写真の加工プロンプトメーカー」（`logs/decisions.md` 2026-10-12）。タブの名前も同じ。
  狭い画面では「子ども・家族写真の／加工プロンプトメーカー」の位置だけで折り返す（`<wbr>` と `word-break: keep-all`）

## Colors

名前は CSS の変数と同じ（`primary` は CSS では `--cloth`、`primary-soft` は `--cloth-soft`、`on-primary` は `--paper`）。

| 名前 | 明るい画面 | 暗い画面 | 役割 |
|---|---|---|---|
| paper | #f3f4f1 | #171a18 | 画面の紙（緑の布表紙に寄せた、やや緑がかった白。クリーム色にしない。これは Claude が点検の結果で決めた。`logs/decisions.md` 2026-10-11） |
| ink | #23272a | #e4e5df | 本文の文字・題名の下の線・名前の欄の下線・開くボタンの枠 |
| ink-muted | #5f6460 | #a3a9a4 | 補足の文字（説明の一文・出典・名前の欄の例文）。台紙の上の語数は、この色ではなく `pen` を不透明度 0.75 にしたもの（台紙の上では ink-muted は読めないため） |
| rule | #d3d2ca | #3a3f3b | 行を区切る罫線 |
| album | #1d211e | #0d100e | アルバムの黒い台紙（暗い画面では紙より一段暗く。紙との差が小さいので、縁にペンの色を 16% 混ぜた 1px の線を引く） |
| pen | #ece9df | #ece9df | 台紙に書く白いペン |
| primary（`--cloth`） | #2f5d4b | #8cc3ad | アルバムの布表紙の緑。選択中の印・選択中の名前・主ボタン・フォーカスの枠 |
| primary-soft（`--cloth-soft`） | #e6ede8 | #22302a | 選択中の行の背景（押せる行の hover はこれを半分に薄めたもの） |
| corner | #c6bfa9 | #6f6a5e | 写真を留めるコーナー |
| （CSS の `--button` / `--on-button`） | primary / paper と同じ | #2f5d4b / #e4e5df | 塗りのボタン（コピー・保存）の地と字。暗い画面では primary の明るい緑を使わない。明るい緑の塗りだと紙との差（8.79）が台紙と紙の差（1.09）より大きく、「ここだけを目立たせる」台紙より先に目が行ったため。暗い画面の字と地の差は 5.94。これは 2026-10-11 の点検役の指摘に、Claude が選んだ直し方（KNOWLEDGE.md 2026-10-11） |

- 差し色は緑 1 色だけ。赤・青・グラデーションは使わない
- 文字と背景の濃さの差（WCAG 2 のコントラスト比）は、明暗どちらの画面でも 4.5 以上（2026-10-11 に計算。いちばん低いのは明るい画面の「選択中の行の上の補足の文字」で 5.07）。
  例外は押せない状態のボタン（名前が空のときの「保存」。不透明度 0.45 で、明るい画面 2.08・暗い画面 2.70）。WCAG でも無効の部品は対象外
  ブラウザ任せの色を残さない（名前の欄の例文はブラウザの既定の灰色だと 4.1 だった）
- hover の色はマウスのある端末だけで付ける（`@media (hover: hover)`。スマホでは触ったあとに色が残るため）
- グラフの色：なし（グラフを使わない画面）
- 上の YAML は明るい画面の値だけ（書式に暗い画面の欄が無いため）。暗い画面の値はこの表と CSS が持つ

## Typography

- **Web フォントは読み込まない**（外部への通信を 0 にして「写真が端末の外に出ない」を確かめやすくするため）。使えるのは OS の書体か、アプリに同梱する書体だけ。
  この決まりを変えるときはユーザーに聞く
- 見出し（題名・手順の見出し・選択の名前・台紙の見出し・お気に入りの見出し）：明朝。`'Hiragino Mincho ProN', 'BIZ UDPMincho', 'Yu Mincho', 'Noto Serif JP', 'Noto Serif CJK JP', serif`。
  端末によって字の形が変わる（Mac・iPhone はヒラギノ明朝、Windows は BIZ UD 明朝か游明朝）
- 本文・操作：ゴシック（OS 任せ）。`system-ui, -apple-system, 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic UI', sans-serif`
- できあがったプロンプト（英語）と手順の番号・語数：ペンの字（serif）。`ui-serif, 'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, serif`
- 日本語を斜体にしない（日本語の書体には斜体が無く、端末が字を傾けて作るので崩れて見える）。斜体は手順の番号（数字）だけ
- 文字の大きさの段：題名 2.1rem（狭い画面では 1.5rem まで縮む）／手順の見出し 1.45rem／お気に入りの見出し 1.2rem／台紙の見出し 1.1rem／
  選択の名前 1.05rem／本文 1rem／説明 0.925rem／補足 0.85rem／出典 0.8rem
- 行間：本文 1.65、プロンプト 1.8。補足のうち、条件の一文（`.option-note`）と見本の説明の一文（`.sample-originals-note`）だけ 1.45（ほかの補足は本文と同じ 1.65。上の YAML の `typography.note` の 1.45 は、この 2 つの値）
- 折り返し：短い文（手順の見出しの下の一文・スタイルの説明・条件の一文・トグル・コピーの結果の文・開くボタンの上の案内・見本の説明の一文・お気に入りと最近使った設定の変えた条件）は、各行の長さをそろえ（`text-wrap: balance`）、文節の切れ目で折り返す（`word-break: auto-phrase`。Chromium だけで効き、ほかのブラウザでは無視される）。
  `text-wrap: pretty` では、日本語の文の最後の 1〜2 字だけが次の行に落ちた。これは 2026-10-11 の点検役の指摘に、Claude が選んだ直し方（KNOWLEDGE.md 2026-10-11）

## Layout

- 1 画面。上から、1 スタイルを選ぶ → 2 仕上がりを調整する → できあがったプロンプト → ボタン → お気に入り → 最近使った設定（`SPEC.md`「画面構成」）
- 広い画面（60rem 以上）は左に操作と履歴、右に台紙の 2 列（`logs/decisions.md` 2026-10-03「2 列でよい」）。右の列はスクロールしても残る。
  右の列は、スクロールして上に止まったときに画面の高さに収まるよう、台紙の欄の高さを画面の高さから決める
  （1280×800 と 1024×700 で、止まった状態といちばん下までスクロールした状態で収まることを 2026-10-11 に確かめた。スクロールする前は題名の分だけ下にあるので、開くボタンが画面の外に出ることがある）。
  台紙やボタンの余白を増やすと収まらなくなる。増やしたら欄の高さの式（`.album-text`）も直す
- 全体の幅は最大 76rem、左右の余白 1.25rem
- **箱を作らない。** 部品のまとまりは罫線（上と下の 1px）と余白で分ける。枠線で囲むのは開くボタンだけ（台紙の縁の 1px の線は、暗い画面で台紙と紙を分けるためのもので、箱の枠線とは扱わない）
- **条件の選択肢は 1 行ずつ。** 名前の右に何が変わるかの一文。1 つの選択の中で一文の書き出しを縦にそろえる。
  欄が 26rem より狭いとき（スマホ）は一文を名前の下に回す。行のどこを押してもその選択肢が選ばれる
- スタイルは罫線で区切った行を 2 列（欄が広ければ）。行の高さは中身で決まる。行のどこ（出典の帯・見本の画像も）を押してもそのスタイルが選ばれる。出典のリンクはリンクとして押せる
- スタイルの見本画像は、行の幅が 26rem より狭いとき（2 列の PC とスマホ）は文の上に、文の書き出しと左をそろえて置く（高さ 10rem）。広いとき（1 列で広い画面）は右に置く（高さ 6.75rem、右端をそろえる）。
  見本は高さだけをそろえ、横幅は画像の形のまま（正方形・縦長・横長が混ざるため。横長の枠に収めると小さくなり、まわりに余白の箱ができた）。これは Claude が決め（KNOWLEDGE.md 2026-10-11）、ユーザーが前と後の比較ページを見て「すべてOKで」と返した（`logs/decisions.md` 2026-10-11）
- スタイルの一覧の下に、見本の元にした架空の写真 3 枚を小さく（幅 6.5rem）並べ、その上に、見本が AI で作った架空の写真から作ったものだと説明する一文（文面は `PresetPicker.tsx`）を補足の文字で書く
- トグルは文字まで含めた行全体が押せる。押せる高さは約 38px
- 手順の見出しに番号（1・2）を付ける。選ぶ順が決まっているため（番号は順番の意味があるときだけ）
- 余白：段（決まった値の並び）はまだ決めていない。上の YAML の `spacing` は、CSS でよく使う値を 5 つ挙げたもので、段として決めたものではない。
  CSS には部品ごとの値が 20 種類ほどある（2026-10-11 の点検で数えた）。新しい部品は、近くの部品と同じ値を使い、新しい値を増やさない。
  段に整理するかは、画面を大きく変えるときに決める

## Elevation & Depth

- 影は使わない。重なりは、右の列の sticky と、台紙の四隅のコーナーだけ
- 選択中は、背景を薄い緑にし、名前を緑の字にする。スタイルの行だけ、左上に緑のコーナー（三角）も付ける（条件の行には付けない）

## Shapes

- 角：選択の行は角なし（罫線の行）。台紙・コピーのボタン・保存のボタン・開くボタンは 2px
- 写真のコーナー：直角三角形。台紙の四隅と、選択中のスタイルの左上
- 線：行の罫線は 1px の `rule` 色。題名の下と名前の欄の下線は 1px の `ink` 色。台紙の見出しの下は `pen` を 30% に薄めた 1px。台紙の縁は `pen` を 16% 混ぜた 1px
- 縦横比の選択肢には、比に合わせた小さな長方形の図（高さ 1.1rem、1.5px の線、角 1px）。「元のまま」には図を付けない（`logs/decisions.md` 2026-10-10）

## Components

| 部品 | 形 |
|---|---|
| スタイルの行（`.preset-card`） | 罫線で区切った行。左にラジオ、名前（太字）、一文、「人物が主役」などの補足、出典。見本の画像（狭い行は上、広い行は右）。選択中は薄い緑の背景・緑の名前・左上のコーナー |
| 見本の画像（`.preset-sample`） | 枠線・角丸・影を付けない（写真そのものを紙に置く）。高さをそろえ、横幅は画像の形のまま |
| 元の写真（`.sample-originals`） | 一覧の下に 1 回だけ。補足の文字の一文と、小さな写真 3 枚と短い名前（出典と同じ 0.8rem） |
| 条件の選択肢（`.option-card`） | 罫線で区切った 1 行。ラジオと名前、右に一文（狭い欄では下）。選択中はスタイルの行と同じ背景と名前の色 |
| トグル（`.toggle`） | OS のチェックボックスと文字。箱なし |
| 台紙（`.album-page`） | 黒い台紙、四隅に写真のコーナー。見出しは明朝、本文は白いペンの英文（serif）。欄は読み取り専用で縦に伸ばせる |
| コピーのボタン（`.copy-button`） | 幅いっぱいの緑の塗り。紙の色の字。暗い画面では明るい緑にせず、明るい画面と同じ布表紙の緑（#2f5d4b）に `ink`（#e4e5df）の字（下の「Colors」） |
| 開くボタン（`.open-link`） | 墨の 1px の枠のリンク（新しいタブ） |
| お気に入り・最近使った設定（`.recent-item`） | 罫線で区切った 1 件。押すと呼び出す。1 行目に名前と時刻、2 行目に変えた条件を折り返して全部見せる。条件の名前の中では改行しない（「縦 3:4」）。1 行に詰めると、スマホと 1024px の画面で条件が 1 字か「…」だけになった。2026-10-11 の点検役の指摘に Claude が選んだ形（KNOWLEDGE.md 2026-10-11） |
| 名前の欄（`.favorite-input`） | 記入欄のような下線だけ |
| 削除（`.favorite-delete`） | 下線付きの文字のボタン |
| キーボードのフォーカス | 3px の緑の枠。行の部品は行の内側に引く。例外はプロンプトの欄で、台紙の上では緑が見えないので 2px の白い点線 |

## Do's and Don'ts

守ること：

- Web フォントを読み込まない。画像を外部から読まない（通信 0）
- 写真を画面に出さない（扱わない）。スタイルの見本画像を載せるときは AI で作った架空の家族写真だけ。見本が AI で作ったものだと画面に書く（`docs/sample-images.md`「利用条件」）
- 見本の画像はアプリに同梱する（`frontend/public/samples/`）。外部から読まない
- 文字と背景の濃さの差は明暗どちらも 4.5 以上。フォーカスは 3px の緑の枠で見える
- `prefers-reduced-motion` で動きを止める（今は動き自体が無い）
- 色を足すときは、暗い画面の値も同時に決める

避ける形（点検で見つけたら足していく。2026-10-10 に今の画面を Anthropic の frontend-design の「AI がよく作る形」の一覧に照らして見つけたものから）：

- 同じ角丸・同じ枠線の箱をすべての部品に使う（2026-10-10 までの画面。カードと選択肢と履歴が同じ顔だった）
- 選択中の印に「左の色帯」を使う
- 日本語の斜体
- 小さなラベルを英大文字で組む、ラベルの中点つなぎ（A · B · C）、リンク末尾の「→」、等幅の書体の数字ラベル。
  日本語で物を並べるときの「・」（お気に入りの「スタイル名・既定のまま」）は普通の書き方なので対象外。数字の幅だけをそろえる指定（`tabular-nums`）も対象外
- グラデーション・光るカード・影の重なり（ユーザーの言葉「イケイケな SaaS」）
