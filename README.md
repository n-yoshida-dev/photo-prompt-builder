# photo-prompt-builder

子どもの思い出写真を ChatGPT / Gemini などの AI で加工するときの英語プロンプトを、
スタイルと条件を選ぶだけで組み立てる Web ツール。

- **写真は端末の外に出ません。** このツールは写真を扱いません（選ぶ欄もありません）。写真は、開いた先の AI のサイトで添付します
- **各 AI への画像添付は手動です。** このツールが作るのはプロンプト（文章）だけです。コピーして各 AI のサイトに貼り、写真はそのサイトで添付してください
- AI との API 連携はありません。生成は各 AI のサイトで行います

## 使い方（MVP）

1. スタイルのプリセットを選ぶ（各カードに、そのスタイルで加工した見本の画像があります）
2. 仕上がり（加工の強さ・色味・縦横比、文字を入れない など）を調整する。顔・服装・ポーズ・人数を変えない指示は、いつも自動で入ります
3. 「コピーして ChatGPT を開く」か「コピーして Gemini を開く」を押す（プロンプトがコピーされ、そのサイトが新しいタブで開きます）
4. 開いたサイトの入力欄にプロンプトを貼り、写真を添付して送る

## 開発

```bash
# フロントエンド
cd frontend
npm ci
npm run dev
```

CI と同じ検査：

```bash
npm run format:check && npm run lint && npm run typecheck && npm run test && npm run build
```

## ドキュメント

- 開発ドキュメント（AI 向け）：`PLAN.md` / `SPEC.md` / `TODO.md` / `KNOWLEDGE.md` / `HANDOFF.md` / `logs/decisions.md`
- 設計の解説・プロンプト原文（人間向け）：`docs/`

## プリセットの出典

3D Miniature Diorama と Editorial Poster は、開発者が実際に使って良い結果が出たプロンプトです（原文は [`docs/seed-prompts.md`](docs/seed-prompts.md)）。
写真とらくがきの小人・写真の続きを描いたスケッチブック・飛び出す絵本・記念切手・すごろく盤・思い出の標本箱・旅のスタンプ（風景だけ・家族も）は、開発に使った AI（Claude）が一から書きました（カードには「出典：Claude の自作」と出ます）。

以前は、作者が利用条件を明記して公開しているプロンプトを種にしたスタイルが 3 本ありましたが、2026-10-04 に外しました。
その原文・書き換えた箇所・出典の記録は [`docs/web-prompts.md`](docs/web-prompts.md)、作者の著作権表示と許諾文は
[`docs/third-party-notices.txt`](docs/third-party-notices.txt) に残しています。このアプリは、それらの作者とは関係がありません。

## 見本画像

各スタイルの見本は、AI で作った架空の写真（実在の人は写っていません）を、このツールのプロンプト（既定の条件のまま）で AI に加工させたものです。
作った日・使ったプロンプト・利用条件は [`docs/sample-images.md`](docs/sample-images.md) にあります。

## ライセンス

未定。公開時に決める
