# 設計判断とハマりどころ

コードを読めば分かることは書かない。書くのは次の2つだけ。

- **設計判断**：Claude が実装中に複数の選択肢から選んだこと。「なぜそうしたか」を必ず添える。
  ユーザーと合意して決めたことは、ここではなく `logs/decisions.md`（`/decide`）へ
- **ハマったこと**：想定と違った挙動、再発しそうな落とし穴。原因と回避方法をセットで

見出しは `### YYYY-MM-DD：<決めたこと>` の形式。

---

### 2026-10-03：スタイルの見本は、Claude が VS Code 拡張機能の中の codex を `codex exec` で動かして作る

- **やり方**：codex は PATH に無いが、VS Code の拡張機能の中にある：
  `~/.vscode-server/extensions/openai.chatgpt-<版>-linux-x64/bin/linux-x86_64/codex`（拡張機能の更新で `<版>` が変わる。`ls -d ... | sort -V | tail -1` で最新を選ぶ）。
  `codex exec --skip-git-repo-check -s workspace-write -c 'model_reasoning_effort="low"'` で動かし、組み込みの `image_gen` ツールで作らせる。API キーは要らず、ユーザーの ChatGPT の利用枠を使う
- **設計判断**：`~/.codex/config.toml` の既定は `model_reasoning_effort = "ultra"`。画像 1 枚の指示には過剰なので `low` に下げた
  （1 枚あたり 1〜5.5 万トークン・1〜2 分。2026-10-03 の 7 枚で計約 17 万トークン。同じ指示でも回によって幅がある）
- **ハマったこと**：加工する画像を渡す `-i` は複数のファイルを受け取るので、`-i base.png "指示文"` と書くと指示文までファイル名として飲み込まれ、
  「No prompt provided via stdin.」で終わる。`-i base.png -- "指示文"` と `--` で区切る
- 作った画像は `~/.codex/generated_images/<セッション id>/` に保存される。指示文で「作業フォルダに `sample-<id>.png` としてコピーする」と頼む
- 見本はアプリが作るプロンプトそのものの結果にしたいので、`catalog.test.ts` のスナップショット（全プリセット × 既定の条件の出力全文）から取り出して渡し、
  「BEGIN と END の間を一字も変えずに使う」と指示した
- 元の写真は AI で作った架空の写真 2 枚（`logs/decisions.md` 2026-10-03）。人物用は家族 3 人（黄色いニット帽・ボーダーの服・前歯の抜けた笑顔・眼鏡など、
  保持文が効いたかを目で確かめられる特徴を入れた）。風景用（`diorama`）は角地の小さな喫茶店の建物で、人は写さない。どちらの中身も Claude が決めた
- 試作の画像・使った指示文・生成スクリプト（`run-all.sh`）・ログは、リポジトリの外の `~/.cache/photo-prompt-builder/samples-2026-10-03/` に置いた
  （`small/` は幅 900px の JPEG。載せる PR で選んで縮小し、`frontend/public/` に入れる）。画像処理のライブラリが無いので、縮小は Playwright の Chromium の canvas で行った
- 2026-10-03 の試作で見えたこと（架空の写真 1 枚ずつ。子どもの実写真ではない）：人物用の 4 本とも人数・服・前歯の抜けた笑顔・眼鏡が残った。
  `diorama` は建物の写真から台座付きの模型になった。
  `instant-photo` は "Polaroid" を消しても白い縁と色あせが出た。`watercolor` は父のグレーのパーカーに少し青みが入った（原文の "sea blue" の影響かもしれない。2026-10-03 にこの一文を外すと決めた。`logs/decisions.md`）。
  `editorial-poster` は原文の TYPOGRAPHY の指定どおり "Autumn Days" の文字が入った
- 実行時の「bubblewrap が無い」の警告は、同梱の bubblewrap が代わりに使われるので無視してよい

### 2026-10-03：Web 原文のプリセットは「原文＋書き換え表＝presets.ts」をテストで確かめ、出典はカードのラベルの外に出す

- **設計判断**：`docs/web-prompts.md` に原文（出典のファイルから取ったまま）と書き換えた箇所の表を置き、`catalog.test.ts` が
  原文に表を当てた結果を `presets.ts` の `base + ' ' + style` と比べる。表に載せていない書き換えが 1 文字でもあれば落ちる
  （2026-10-03 に 1 語変えて落ちることを確かめた）。書き換えの記録（CC BY 4.0 の「変更点の明示」）と実物がずれない。
  表の 1・2 列目を `` ` `` で囲むのはテストが読むため。Markdown のソースの折り返し（watercolor の原文）は空白 1 つにして比べる
- `base` と `style` の分け方：先頭の「何に変えるか・何を保つか」の文を `base`、残りを `style` にした。原文の段落の区切り（空行）は `style` の中に残す。
  `base` の直後に「1 枚ずつ出力」のトグル文が入るので、段落の途中で改行が入るが、AI への指示としては害が無い
- 書き換えの言葉は Claude が選んだ：`Studio Ghibli-inspired` → `classic Japanese animated film-inspired`（決定の例 "classic hand-drawn animated film-inspired" は
  直後の "hand-drawn anime scene" と重なるので "Japanese" にした）。`Polaroid` は置き換えずに消した（直後が "instant photograph" で、決定の例 "instant-film" を足すと重なる）。
  画風が弱まったら `logs/decisions.md` 2026-10-03 の見直す条件どおり実験して直す
- 出典の行はカードの `<label>` の外に置いた。中に置くと、リンクの文字までラジオの名前として読み上げられる。カードの枠は外側の `<div>` が持つ
- MIT の全文は `frontend/public/third-party-notices.txt` に 1 つだけ置き、README とカードのライセンスのリンクから指す（`public/` はビルドで `dist/` にそのまま入る）。
  ファイルは ASCII だけで書いた（`.txt` を配信するサーバーが文字コードを付けないと、日本語や全角記号が文字化けするため）。
  リンクは相対パス（`third-party-notices.txt`）なので、GitHub Pages で `base` の下に置いても開ける

### 2026-09-29：最近使った設定は、読み込み時に 1 件ずつ今のマスタデータで確かめる

- **設計判断**：SPEC「保存」は「形が壊れていたら捨てて空にする」。それに加えて、形は正しくても今のマスタデータで復元できない記録
  （プリセットを選び直して消えた id、無くなったトグル・選択肢）は、その 1 件だけを捨てて残りは使い、捨てた件数を `console.warn` に出す。
  プリセットの選び直しが控えているため
- 読み込み時に全部捨てた場合（JSON が壊れている・配列でない）は `console.error` に出し、保存領域のキーも消す。保存に失敗した場合（容量不足など）も
  `console.error` に出すが、一覧は画面が持っている分に足して更新し、操作は止めない（続けて失敗しても画面の一覧は減らない）
- **引き換え**：保存は画面が持っている一覧に足して書き込み、保存領域を読み直さない（続けて保存に失敗しても画面の一覧を減らさないため）。
  そのため同じ画面を 2 つのタブで開いて交互にコピーすると、後から保存したタブの一覧が、もう一方のタブの記録を上書きする。
  同じ人が同じブラウザで 2 つのタブを使う場合に限られ、失うのも最近使った設定だけなので許容した
- 読み込みそのものに失敗したとき（SecurityError など）は保存内容を消さない。一時的な失敗でデータを失わないため。
  消すのは中身が壊れていたときだけ（SPEC「保存」の「形が壊れていたら捨てて空にする」）
- 保存のタイミングは SPEC どおり「コピーボタンを押した時点」で、コピーの成否は問わない（失敗したら利用者が欄から手でコピーするので、その選択も残す）
- **ハマりどころ**：Cookie をすべてブロックした Chrome などでは、`window.localStorage` を参照しただけで SecurityError になる。
  起動時に読むので、そのままだと画面ごと白くなる。`browserStorage()` で参照を try に入れ、使えなければ null にして「最近使った設定」だけを諦める
- 同じ内容かどうかはトグルの並び順を無視して比べる（ON にした順が違うだけの記録を別物にしない）
- 広い画面の置き場所：右の列（台紙＋ボタン）は画面の高さに収める必要があるので、左の操作の下に置いた。
  スマホでは HTML の順（操作 → 台紙 → 最近使った設定）に並び、SPEC の画面構成の順になる（CSS の `grid-template-areas`）

### 2026-09-29：画面の見た目は「アルバムの黒い台紙に白いペン」、Web フォントは使わない

- **設計判断**：題材（家族の写真アルバム）から、生成プロンプトの欄だけを黒い台紙＋白いペン＋写真のコーナーに見立て、周りは淡い紙の色で静かにした。
  色は `src/index.css` の `:root` に名前付きで置き、暗い画面設定では値だけを差し替える。広い画面では左に操作・右に台紙（sticky）、スマホでは SPEC の順に縦に並ぶ
- **Web フォントを使わない理由**：Google Fonts などを読むと外部への通信が生まれ、「写真が端末の外に出ない」を通信の記録で確かめるときに紛れる。
  外部への通信を 0 にしておけば、「外への通信が無い」ことがそのまま証拠になる
- スタイルのカードとラジオは中身を本物の `input type="radio"` にし、見た目だけを CSS で変えた（キーボードと読み上げでそのまま使える）

### 2026-09-29：写真が外に出ないことは、Playwright で通信を記録して確かめる

- 完了条件「DevTools の Network で確認」は、Claude からはブラウザの画面を操作できないので、同じことを Playwright で行った：
  ダミー画像（その場で生成。実写真は使わない）を選び、ページの全リクエストを記録して、`localhost` 以外への通信と GET 以外の通信が 0 件、localStorage が空であることを見る
- Playwright はリポジトリに入れず、作業用の一時フォルダに `npm i playwright` して使った。ブラウザは `~/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome` を
  `executablePath` で直接指定する（インストールした Playwright の版が期待するブラウザ版と、ローカルにある版が違うため）
- **ハマったこと**：vitest の `globals` を使っていないので、Testing Library の自動の片付け（cleanup）が働かず、2 つ目のテストで「同じ要素が複数ある」と落ちた。
  `src/setupTests.ts` で `afterEach(cleanup)` を明示した

### 2026-09-29：許可の確認を減らすコマンドの書き方

- **ハマったこと**：2026-09-29 のセッションの途中で、ユーザーから「あまりにもBash実行の許可を求められるんだけど、どうにかならない？」と聞かれた。
  Claude の推定では、原因の多くは Claude の書き方で、(1) PR 本文の書き換えなどを `python3 - <<'EOF'` のようにシェルからスクリプトで行った
  （任意のコード実行として審査される）、(2) `node` のスクリプト・`curl`・`pkill`・`for` ループを混ぜて `cd … && 検査 && commit && push` のように長くつないだ。
  `npm run lint` などの検査は、ユーザー設定（`~/.claude/settings.json`）が既に `Bash(npm run *)` で許可しているので原因ではない
- **回避**：ファイルの変更は Edit / Write で行う（PR 本文は Write で書いてから `gh pr create/edit --body-file`）。コマンドは 1 つずつ、`git -C <dir>` のように
  `cd` を使わずに書く。`.claude/settings.json` の `permissions.allow` に、読むだけのコマンドを足した。
  このうち実際に確認が減るのは `gh search code` と `bd show` の 2 件で、`npm run lint` `npm run format:check` `gh run watch` はユーザー設定で許可済み
  （別の端末やユーザー設定を変えたときも同じに動くよう、プロジェクト側にも重ねて書いた）

### 2026-09-29：固定の英文（保持文・トグル・ラジオ）は 3 案を競わせて作り、組み立て後の全文で反証した

- **設計判断**：`data/preserve.ts` `data/toggles.ts` `data/choices.ts` の英文は出典の無い Claude の自作なので、1 回で書かずに
  「保持の効き目優先／短さ優先／A/B 実験のしやすさ優先」の 3 案 → 審査 3 → 統合 → 反証 2 で作った（どれも Claude のサブエージェント。人間の検証はまだ無い）。
  反証で直した主な点：子どもと身体接触の語（touching）を近くに置かない（安全フィルタ対策。人数の行と並びの行の間にポーズの行を挟む）、
  美化（肌の修整・化粧）を止める、画面上の絶対位置ではなく相対位置を保つ（ポスターの下半分と衝突するため）、
  風景プリセットで「顔」「肌」が並ばないよう any faces のような条件付きの言い方にする
- **文法の約束**：保持文は名詞句（大文字始まり・ピリオド無し）、`Do not:` の下は小文字始まりの動詞句、base・style の文は命令文でピリオド終わり。
  `catalog.test.ts` が機械で見るのは大文字・小文字の始まりとピリオドの有無だけで、名詞句かどうかは見ない
- **SPEC から弱めた点**：風景の保持文で、SPEC「保持は固定」の「元の構図」を "The same main subject as the focus of the image"（主役を同じにする）に留めた。
  diorama の原文がカメラを isometric の 3/4 視点・orthographic に変えるので、元のカメラ位置や画角を保つ文にすると必ずぶつかるため。
  配置・比率・写っている範囲の外を足さない、の 3 点は SPEC どおり
- **文言では消せない衝突**（MVP 後「相性の悪い条件を灰色にする」の候補。文面を読んだうえでの Claude の判断で、実際に AI がぶつかるかは実験で確かめる）：
  - 固定の保持文 × editorial-poster の下半分：人数を保つ・誰も省かない／元のカメラと構図・各人がどこまで写るか／誰も切らない／そばかす・ほくろ、が
    下半分の「The most recognizable subject（主役 1 人）」「Highly simplify … Remove unnecessary details」「small, centered … 10–20% of the bottom half」とぶつかる。
    服の色を保つ行は下半分の「4 色以内」とぶつかる。上半分を 3:4 に合わせる「extend the sky, ground …」は「元の構図」とぶつかる
  - diorama × トグル・ラジオ：スタイル寄り（原文 no exaggerated stylization）、写真寄り（not like … photorealistic photograph）、鮮やか（slightly softened and desaturated）、
    紙の質感（clean isometric architectural model）、モノクロ（Materials should closely match the source photo）
  - editorial-poster × トグル・ラジオ：色味の全選択肢（上半分 original color mood）、モノクロ（下半分の flat color shapes）、柔らかい光（上半分 natural lighting）、
    写真寄り（下半分 Highly simplify）、スタイル寄り（上半分 never … artificially stylized）、紙の質感（上半分 realistic photographic texture）、
    縦横比（Strict 3:4）、文字を入れない（TYPOGRAPHY 節）
  - 人物プリセット全般 × モノクロ：肌の色・服の色を保つ保持文と、白黒にする指示がぶつかる（モノクロ側の「no part left in color」で白黒を優先させている）
- **ユーザー確認に回した点の結論**：名札・表札・車のナンバーなど写真に写った文字を読めなくする一文は入れない（`logs/decisions.md` 2026-10-03「読めたままでよい」）

### 2026-09-29：`buildPrompt` は 2 つ目の引数にマスタデータを受け取れる

- SPEC の形は `buildPrompt(selection)`。2 つ目の引数 `catalog` を省略可能で足した。テストで小さな架空データを渡せば、
  英文を書き換えても組み立て規則のテストが壊れない。画面からは省略して呼ぶ
- トグル文の並びは「選んだ順」ではなく「マスタデータの順」。選んだ順だと同じ選択でも出力が揺れ、スナップショットが不安定になる
- 見出しの英文（`Preserve from the reference photo:` など）も `data/headings.ts` に置いた。CLAUDE.md「英文は data/ に置く」に合わせ、Qiita の実験で言い換えやすくするため
- `switchPreset`（プリセットを切り替えたときの状態）は SPEC に無い挙動を Claude が決めた：トグルは新しいプリセットの既定に戻し、ラジオは引き継ぐ。
  トグルの既定はプリセットごとに違う（editorial-poster は文字を許す）ので引き継ぐと意図しない組み合わせになり、
  色味・縦横比は写真側の好みなのでプリセットを変えても保ちたい、という理由。画面の並びと一緒に、動く画面で見直す

### 2026-09-29：原文照合のテストは Node 環境で `fs` を使う（Vite の `?raw` は frontend/ の外を読めない）

- **ハマったこと**：`import seed from '../../../docs/seed-prompts.md?raw'` は vitest で `Denied ID` になる。Vite の `server.fs` が
  プロジェクトの外のファイルを拒否するため。`server.fs.allow` を広げると開発サーバーの公開範囲まで広がるので使わない
- **回避**：`catalog.test.ts` の先頭に `// @vitest-environment node` を付けて `readFileSync(new URL(..., import.meta.url))` で読む。
  jsdom 環境のままだと `import.meta.url` が `file:` にならず `The URL must be of scheme file` で落ちる

### 2026-09-29：AI サイトの事前入力 URL（`?q=`）は MVP では使わない

- 調査結果（非公式の情報が多い）：ChatGPT の `?q=` はログアウト中だと自動送信されることがある（写真添付の前に送られる）。
  Claude の `claude.ai/new?q=` は入力欄に入るだけ。Gemini には公式の事前入力 URL が無い。URL の実用上限は約 16KB（Cloudflare）で、
  英文 6,000 字は URL エンコード後に約 8KB
- **Claude は画像を生成しない**（公式ヘルプ https://support.claude.com/en/articles/9002504-can-claude-produce-images ）。
  「Claude を開く」ボタンの扱いは範囲の判断なのでユーザー確認に回した
- MVP の方針（Claude の推奨）：「開く」ボタンは URL にプロンプトを載せず、パラメータなしのトップページを開く。3 サイトで同じ動きになり、自動送信・URL 長・仕様変更の心配が無い。
  「開く」ボタンがコピーも同時にするかは SPEC（コピーと開くは別ボタン）に無い挙動なので、ボタンの PR で提案する

### 2026-09-29：apps-workflow の編集後フックが eslint を決め打ちで呼ぶ

- **ハマったこと**：`check-edited.sh` は `package.json` に `lint` スクリプトがあると `npx --no-install eslint <file>` を呼ぶ。
  このアプリの lint は oxlint なので、.ts を編集するたびに「eslint 失敗（npx canceled）」が出る。型チェックの結果は正しい
- **回避**：フックの eslint 失敗は無視し、`npm run lint`（oxlint）を自分で回す。直すならプラグイン側（claude-plugins の `check-edited.sh`）で
  `lint` スクリプトの中身を見て oxlint を呼び分ける


### 2026-09-06：jsdom は 29 系に固定（30 系は Node 24.15 以上を要求）

- **設計判断**：`frontend/package.json` の jsdom を `^29.1.1` にした。create-vite 直後に入れた 30.0.1 は
  `engines.node` が `^22.22.2 || ^24.15.0 || >=26` で、ローカルの Node 24.13.1 では `npm install` のたびに
  EBADENGINE 警告が出る（テスト自体は通る）。既存アプリ（skill-matrix）も 29 系なので揃えた
- **上げるとき**：ローカルの Node を 24.15 以上にしてから。CI（`node-version: 24` は最新の 24.x）は先に通る可能性があるので、
  ローカルの警告が消えたことを確認してから上げる

### 2026-09-06：tsconfig に `strict: true` を明示

- create-vite 9 の react-ts テンプレート（TypeScript 6 系）は `tsconfig.app.json` に `strict` を書かない。
  既定値に頼らず、`../CLAUDE.md` の「TypeScript（strict）」を満たしていることが読んで分かるように明示した
