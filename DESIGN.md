---
name: photo-prompt-builder
description: 子どもの写真を AI で加工するプロンプトを、スタイルと条件を選ぶだけで組み立てる 1 画面の道具。家族の写真アルバムを題材にした見た目
version: alpha
colors:
  primary: "#2e5e4e"
  on-primary: "#f3f4f1"
  paper: "#f3f4f1"
  ink: "#1e2326"
  ink-muted: "#5f6763"
  rule: "#d5d9d4"
  album: "#1f2420"
  pen: "#eeece4"
  primary-soft: "#e3ece7"
  corner: "#c9c3b3"
typography:
  title:
    fontFamily: system-ui, 'Hiragino Sans', 'Noto Sans JP', 'Yu Gothic UI', sans-serif
    fontSize: 1.75rem
    fontWeight: 700
    letterSpacing: -0.01em
  heading:
    fontFamily: system-ui, 'Hiragino Sans', 'Noto Sans JP', 'Yu Gothic UI', sans-serif
    fontSize: 1.2rem
    fontWeight: 700
  body:
    fontFamily: system-ui, 'Hiragino Sans', 'Noto Sans JP', 'Yu Gothic UI', sans-serif
    fontSize: 1rem
    lineHeight: 1.6
  note:
    fontFamily: system-ui, 'Hiragino Sans', 'Noto Sans JP', 'Yu Gothic UI', sans-serif
    fontSize: 0.85rem
    lineHeight: 1.45
  pen:
    fontFamily: ui-serif, 'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, serif
    fontSize: 0.98rem
    lineHeight: 1.75
rounded:
  sm: 3px
  md: 6px
spacing:
  xs: 0.25rem
  sm: 0.5rem
  md: 1rem
  lg: 1.5rem
  xl: 2rem
components:
  preset-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
  album-page:
    backgroundColor: "{colors.album}"
    textColor: "{colors.pen}"
    typography: "{typography.pen}"
    rounded: "{rounded.sm}"
  copy-button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
---

## Overview

**下書き（2026-10-10）。「未定」と書いた箇所はユーザーが選ぶまで空けてある。** 書式は Google の DESIGN.md（https://github.com/google-labs-code/design.md ）。
値の出どころは `frontend/src/index.css`・`SPEC.md`・`logs/decisions.md`。ここに無い細部は CSS が正本。

- **誰が、どんな場面で使うか**：子育て世帯のファミリー（`logs/decisions.md` 2026-10-03）。手元にある子どもの写真を、ChatGPT や Gemini でジオラマや絵本などに作り替えたいとき。
  スマホからも PC からも開く。写真はこのアプリでは扱わない（開いた先の AI の画面で添付する）
- **画面の仕事**：スタイルと条件を選ぶと英語のプロンプトができあがる。できあがったものをコピーして AI の画面へ持っていく。それだけ
- **題材**：家族の写真アルバム。淡い紙の上で選び、できあがったプロンプトを「黒い台紙に白いペンで書いた 1 ページ」として見せる（CSS 冒頭のコメント。Claude の設計、ユーザーは 2026-10-03 に「問題なし」）
- **雰囲気の言葉 3 つ**：未定（ユーザーが見本を見て選ぶ）
- **避けたい見た目（ユーザーの言葉）**：このアプリで言われたものは無い。ほかのアプリで言われた言葉（Claude の転記。portfolio と skill-matrix の `logs/decisions.md`）：
  「ブートストラップっぽい」「ウィキペディアみたいで、文章ばっかなのが見る気をなくす。なんかそっけなさすぎる。」「もろ「AIっぽさ」が見える」「ギラギラしすぎ」
  「グラデーション・光るカード・3D・ロゴの羅列、のようなイケイケなSaaSみたいなのはちょっと私のイメージと違うかな。」
- **手本の実在の画面と借りる点**：未定
- **このアプリだけの見どころ 1 つ**：黒い台紙に白いペンで書いたプロンプト（2026-10-10 の Claude の見立て。同じ日の全アプリの比較で「6 つの中ではいちばん個性がある」）。確定は未定

## Colors

今の値（`frontend/src/index.css` の `:root`）。名前は CSS の変数と同じ。

| 名前 | 値 | 役割 |
|---|---|---|
| paper | #f3f4f1 | 画面の紙（やや緑がかった白） |
| ink | #1e2326 | 本文の文字 |
| ink-muted | #5f6763 | 補足の文字 |
| rule | #d5d9d4 | 区切り線・枠 |
| album | #1f2420 | アルバムの黒い台紙 |
| pen | #eeece4 | 台紙に書く白いペン |
| primary（CSS では `--cloth`） | #2e5e4e | アルバムの布表紙の緑。選択中の印・主ボタン |
| primary-soft（`--cloth-soft`） | #e3ece7 | 選択中の背景 |
| corner | #c9c3b3 | 写真を留めるコーナー |

- ダークモードあり（`prefers-color-scheme: dark` で同じ名前の値を差し替える。紙 #181b19、台紙 #0f1210、緑 #8cc3ad）
- グラフの色：なし（グラフを使わない画面）
- 差し色は緑 1 色。赤・青は使っていない（エラーの文も文字色のまま）

## Typography

- **Web フォントは読み込まない**（外部への通信を 0 にして「写真が端末の外に出ない」を確かめやすくするため。CSS 冒頭のコメント）。
  使えるのは OS の書体か、アプリに同梱する書体だけ。この決まりを変えるときはユーザーに聞く
- 日本語・UI：`system-ui, 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic UI', sans-serif`（OS 任せ）
- できあがったプロンプト（英語）：`ui-serif, 'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, serif`（台紙に書いたペンの字）
- 文字の大きさの段：題名 1.75rem ／ 手順の見出し 1.2rem ／ 小見出し 1.05rem ／ 本文 1rem ／ 説明 0.925rem ／ 補足 0.85rem ／ 出典 0.8rem
- 行間：本文 1.6、補足 1.45、プロンプト 1.75
- 見出しに明朝や丸ゴシックを使うか：未定

## Layout

- 1 画面。上から、1 スタイルを選ぶ → 2 仕上がりを調整する → できあがったプロンプト → ボタン → お気に入り → 最近使った設定（`SPEC.md`「画面構成」）
- 広い画面（60rem 以上）は左に操作と履歴、右に台紙の 2 列（`logs/decisions.md` 2026-10-03「2 列でよい」）。右の列はスクロールしても残る（Claude の実装。確認待ち ops-ixl.9）
- 全体の幅は最大 76rem、左右の余白 1rem、上 1.5rem
- 余白の段：0.25 / 0.5 / 0.75 / 1 / 1.5 / 2 / 2.25rem（CSS に散らばっている値。段として整理するかは未定）
- スタイルのカードは `minmax(15rem, 1fr)` で自動折返し（広い画面で 2 列）。条件の選択肢は `minmax(16rem, 1fr)`
- 手順の見出しに丸囲みの番号（1・2）を付ける。選ぶ順が決まっているため（番号は順番の意味があるときだけ）

## Elevation & Depth

- 影は使わない。選択中の印は `box-shadow: inset 4px 0 0` の左の色帯（カードの内側）だけ
- 重なりは、右の列の sticky と、台紙の四隅のコーナー（擬似要素）だけ

## Shapes

- 角丸：カード・ボタン・入力欄 6px、台紙 3px、手順の番号は円
- 枠線：1.5px の `rule` 色。選択中は `primary` 色。「開く」ボタンは 1.5px の `ink` 色
- 縦横比の選択肢には、比に合わせた小さな長方形の図（高さ 1.4rem、2px の線）。「元のまま」には図を付けない（`logs/decisions.md` 2026-10-10）

## Components

| 部品 | 今の形 |
|---|---|
| スタイルのカード（`.preset-card`） | 枠線の箱。左上にラジオ、名前（太字）、一文、「人物が主役」などの補足、出典。選択中は緑の枠・淡い緑の背景・左の色帯 |
| 条件の選択肢（`.option-card`） | 枠線の箱。ラジオと名前、下に何が変わるかの一文（`logs/decisions.md` 2026-10-03）。選択中はカードと同じ印 |
| トグル（`.toggle`） | OS のチェックボックスと文字。箱なし |
| 台紙（`.album-page`） | 黒い台紙、白いペンの英文（serif）、左上と右下に写真のコーナー。欄は読み取り専用の textarea で縦に伸ばせる |
| コピーのボタン（`.copy-button`） | 幅いっぱいの緑の塗り。白文字 |
| 開くボタン（`.open-link`） | 黒い枠線のリンク（新しいタブ） |
| お気に入り・最近使った設定（`.recent-item`） | 枠線の 1 行。「写真の裏に鉛筆でメモしたような 1 行」（CSS のコメント） |
| 入力欄（`.favorite-input`） | 枠線、透明な背景 |

## Do's and Don'ts

守ること（`CLAUDE.md`「守ること」と CSS の決まり）：

- Web フォントを読み込まない。画像を外部から読まない（通信 0）
- 写真を画面に出さない（扱わない）。スタイルの見本画像を載せるときは AI で作った架空の家族写真だけ
- 文字の色の濃さの差は WCAG AA（4.5:1）。フォーカスは 3px の `primary` 色の枠で見える
- `prefers-reduced-motion` で動きを止める（今は動き自体が無い）

避ける形（2026-10-10 の点検で見つけたもの。Anthropic の frontend-design の「AI がよく作る形」の一覧に照らした）：

- 同じ角丸・同じ枠線の箱をすべての部品に使う（今の左の列がこれ。カードと選択肢と履歴が同じ顔）
- 選択中の印に「左の色帯」を使う（AI がよく作る形。life-plan-simulator の結果画面と同じ）
- 題名がリポジトリの名前のまま（`photo-prompt-builder`）。利用者向けの名前にするかは未定
- 小さなラベルを英大文字で組む、ラベルの中点つなぎ（A · B · C）、リンク末尾の「→」、等幅の数字ラベル（今は無い。足さない）
- グラデーション・光るカード・影の重なり（ユーザーの言葉「イケイケな SaaS」）

点検で見つけたら、ここに足していく。
