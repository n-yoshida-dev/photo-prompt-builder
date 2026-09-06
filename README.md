# photo-prompt-builder

子どもの思い出写真を ChatGPT / Claude / Gemini などの AI で加工するときの英語プロンプトを、
スタイルと条件を選ぶだけで組み立てる Web ツール。

- **写真は端末の外に出ません。** ブラウザ内でプレビューするだけで、サーバーにも localStorage にも保存しません
- **各 AI への画像添付は手動です。** このツールが作るのはプロンプト（文章）だけです。コピーして各 AI のサイトに貼り、写真はそのサイトで添付してください
- AI との API 連携はありません。生成は各 AI のサイトで行います

## 使い方（MVP）

1. 写真を選ぶ（プレビュー用。どこにも送られない）
2. スタイルのプリセットを選ぶ
3. 条件（顔を保持する・テキストを入れない など）を ON / OFF する
4. 組み上がったプロンプトをコピーし、ChatGPT / Claude / Gemini を開いて貼る

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

## ライセンス

未定。公開時に決める
