# 設計判断とハマりどころ

コードを読めば分かることは書かない。書くのは次の2つだけ。

- **設計判断**：Claude が実装中に複数の選択肢から選んだこと。「なぜそうしたか」を必ず添える。
  ユーザーと合意して決めたことは、ここではなく `logs/decisions.md`（`/decide`）へ
- **ハマったこと**：想定と違った挙動、再発しそうな落とし穴。原因と回避方法をセットで

見出しは `### YYYY-MM-DD：<決めたこと>` の形式。

---

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
- **未決（ユーザー確認に回した）**：名札・表札・車のナンバーなど写真に写った文字を読めなくする一文を固定で入れるか（服のロゴ文字も消える）

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
