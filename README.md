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

## プリセットの出典

スタイルのプリセットのうち 3 本は、作者が利用条件を明記して公開しているプロンプトを種にしています。
アプリでも各スタイルのカードに出典を出しています。原文・書き換えた箇所・確認日は `docs/web-prompts.md` にあります。
このアプリは出典の作者とは関係がなく、作者が推薦しているものでもありません。
粘土アニメ風・毛糸の刺しゅうワッペンは、利用条件の確認できる原文が無かったため、開発に使った AI（Claude）が一から書きました（カードには「出典：Claude の自作」と出ます）。

| スタイル | 出典 | ライセンス | 原文からの変更 |
|---|---|---|---|
| 手描きアニメ映画風 | [SeeAPI — Nano Banana Prompts for Image Editing](https://github.com/SeeAPI/nano-banana-prompts-for-image-editing)（README 4.3 節） | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | 実在のアニメスタジオの名前を、一般的な言い方に置き換えた |
| 透明水彩 | [AlbertAZ1992 — Albert’s Imagebook](https://github.com/AlbertAZ1992/albert-imagebook)（`styles/watercolor-light`） | MIT。著作権表示と許諾文の全文は [`frontend/public/third-party-notices.txt`](frontend/public/third-party-notices.txt)（公開物にも同じファイルが入る） | 色の指定（青・黄土・淡い桃色を使う一文）を外した。段落の途中の改行を空白にした |
| インスタント写真風 | [SeeAPI — Nano Banana Prompts for Image Editing](https://github.com/SeeAPI/nano-banana-prompts-for-image-editing)（README 4.1 節） | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | 商標（インスタントカメラのブランド名）を消した |

## ライセンス

未定。公開時に決める
