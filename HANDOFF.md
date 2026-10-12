# 引き継ぎ

`/apps-workflow:handoff` で更新する。**次のセッションが最初に読むファイル。**

**ここには「今どこにいるか」だけを書く。目安 40 行。履歴を積まない。**
超えたら何かが履歴になっている。下の行き先へ移して、ここからは消す。

| 書きたくなったこと | 行き先 |
|---|---|
| 決めたこと・理由・却下した案 | `logs/decisions.md`（`/decide` で追記） |
| ハマったこと・落とし穴・技術的な選択の理由 | `KNOWLEDGE.md` |
| やること・ユーザーへの確認待ち | `TODO.md` |
| やったこと | 書かない。`git log` と PR が持っている |
| 毎回守る手順・環境の注意 | `CLAUDE.md`（短く）か `.claude/rules/` |

この型は 2026-09-04 に「現在地のみ」へ改めた。以前の型（決定事項・申し送り・過去の失敗まで持つ）は、
あるアプリで 23 行が 1 か月で 397 行になり、読むだけでコンテキストを食っていた。

## 進捗

```
進捗（TODO.md より自動集計・2026-10-12）

████████████████████ 100%  残り  0 /  3  フェーズ0：立ち上げ（2026-09-06、apps 直下のセッションで実施）
████████████████████ 100%  残り  0 /  2  フェーズ1：設計の確認
████████████████████ 100%  残り  0 / 10  フェーズ2：MVP 実装
████████████████████ 100%  残り  0 / 10  フェーズ2.5：触ってみた意見の反映（2026-10-03）
████████████████████ 100%  残り  0 /  2  フェーズ2.6：見た目の方向（2026-10-10。apps 全体のデザイン改善の試行。進め方は `~/workspace/ops/docs/2026-10-10-apps-デザイン改善の進め方.md` 5 節と 8 節）
██████░░░░░░░░░░░░░░  33%  残り  2 /  3  フェーズ3：公開
██████████████████░░  93%  残り  2 / 30  合計
公開まで残り 2 件（TODO の上から「フェーズ3：公開」の節までの未完）
あなたの回答待ち：2 件（回答済み 19 件）
公開後（合計に含めない）：3 件（済み 0 件）

前回の区切り（2026-10-12）から：完了 +0 件、新たに見つかったタスク +0 件
```

## 現在地

- フェーズ：フェーズ3（公開）の残り 2 件。題名は PR #40 で直した。デプロイの設定は `chore/deploy-pages` の PR（この PR がマージされた後の状態として書いている）
- リポジトリはまだ Private。ユーザーは「Public でよい」と返したが、Claude の公開設定の変更はフックに止められたので、ユーザーが設定画面で切り替える（TODO.md フェーズ3）
- Pages のワークフロー（`.github/workflows/pages.yml`）は、Pages が無効の間は公開を飛ばす。Public になったら Claude が Pages を有効にして流し直す（KNOWLEDGE.md 2026-10-12）
- 点検の直し方 3 つは Claude が選んだもの（KNOWLEDGE.md 2026-10-11）。前と後の比較ページ https://claude.ai/artifact/G4cpHKvfsRXo8NWpcbqCSL は渡したが、ユーザーの返事はまだ無い
- プリセット・保持文・トグルの文を変えると `samples.test.ts` が落ちる。そのときは見本を作り直す（手順は `docs/sample-images.md`、道具は `~/.cache/photo-prompt-builder/tools/`。KNOWLEDGE.md 2026-10-11）
- 画面を変えるときの点検は `/apps-workflow:look` の B。画面全体を撮るときは `look.mjs shoot --setup ~/.cache/photo-prompt-builder/tools/setup-full.mjs`（お気に入り・最近使った設定を入れて撮る）

## 次セッションで最初にやること

1. `gh repo view --json visibility` で Public になったかを見る。Public なら `gh api -X POST 'repos/{owner}/{repo}/pages' -f build_type=workflow` で Pages を有効にし、
   `gh workflow run pages.yml` で公開して https://n-yoshida-dev.github.io/photo-prompt-builder/ を確かめる（TODO.md フェーズ3「GitHub Pages にデプロイする」の完了条件）。
   Private のままなら、切り替えをユーザーに頼む

`TODO.md` の先頭と一致させる。書くのは最初の一手だけで、一覧は `TODO.md` が持つ。
