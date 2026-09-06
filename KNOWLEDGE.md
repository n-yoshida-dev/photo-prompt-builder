# 設計判断とハマりどころ

コードを読めば分かることは書かない。書くのは次の2つだけ。

- **設計判断**：Claude が実装中に複数の選択肢から選んだこと。「なぜそうしたか」を必ず添える。
  ユーザーと合意して決めたことは、ここではなく `logs/decisions.md`（`/decide`）へ
- **ハマったこと**：想定と違った挙動、再発しそうな落とし穴。原因と回避方法をセットで

見出しは `### YYYY-MM-DD：<決めたこと>` の形式。

---

### 2026-09-06：jsdom は 29 系に固定（30 系は Node 24.15 以上を要求）

- **設計判断**：`frontend/package.json` の jsdom を `^29.1.1` にした。create-vite 直後に入れた 30.0.1 は
  `engines.node` が `^22.22.2 || ^24.15.0 || >=26` で、ローカルの Node 24.13.1 では `npm install` のたびに
  EBADENGINE 警告が出る（テスト自体は通る）。既存アプリ（skill-matrix）も 29 系なので揃えた
- **上げるとき**：ローカルの Node を 24.15 以上にしてから。CI（`node-version: 24` は最新の 24.x）は先に通る可能性があるので、
  ローカルの警告が消えたことを確認してから上げる

### 2026-09-06：tsconfig に `strict: true` を明示

- create-vite 9 の react-ts テンプレート（TypeScript 6 系）は `tsconfig.app.json` に `strict` を書かない。
  既定値に頼らず、`../CLAUDE.md` の「TypeScript（strict）」を満たしていることが読んで分かるように明示した
