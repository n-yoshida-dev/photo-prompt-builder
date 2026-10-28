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
進捗（TODO.md より自動集計・2026-10-29） / Progress from TODO.md

                     完了率  残り/全体  フェーズ   (done %, open/total, phase)
████████████████████  100%     0 / 3     フェーズ0：立ち上げ（2026-09-06、apps 直下のセッションで実施）
████████████████████  100%     0 / 2     フェーズ1：設計の確認
████████████████████  100%     0 / 10    フェーズ2：MVP 実装
████████████████████  100%     0 / 10    フェーズ2.5：触ってみた意見の反映（2026-10-03）
████████████████████  100%     0 / 2     フェーズ2.6：見た目の方向（2026-10-10。apps 全体のデザイン改善の試行。進め方は `~/workspace/ops/docs/2026-10-10-apps-デザイン改善の進め方.md` 5 節と 8 節）
████████████████████  100%     0 / 4     フェーズ3：公開
████████████████████  100%     0 / 31    合計 / Total
公開まで残り 0 件（上から「フェーズ3：公開」の節まで） / 0 open until release
回答待ち：0 件（回答済み 21 件） / Waiting: 0 open, 21 answered
公開後（合計に含めない）：5 件（済み 5 件） / After release (not in total): 5 open, 5 done

前回の区切り（2026-10-24）から：完了 +0 件、タスクの数 +0 件 / Since last checkpoint (2026-10-24): done +0, tasks +0
```

## 現在地

- フェーズ：公開まで完了。https://n-yoshida-dev.github.io/photo-prompt-builder/ （リポジトリは Public。main に入るたびに `pages.yml` が公開し直す）。ここからは TODO.md「公開後」
- 公開版の iPhone での確かめは 2026-10-18 に済んだ（ChatGPT のアプリが開きプロンプトが全文入る、2 列のスタイル。ユーザーの「1, 3はOK」）
- スマホの 2 列のスタイルで下のカードがずれる件は、今のままにすると決めた（ユーザーの「Aで」。`logs/decisions.md` 2026-10-19）
- 点検の直し方 3 つは Claude が選んだもの（KNOWLEDGE.md 2026-10-11）。前と後の比較ページ https://claude.ai/artifact/G4cpHKvfsRXo8NWpcbqCSL は渡したが、ユーザーの返事はまだ無い
- 幅 280px のはみ出しは直した（PR #49）。280px で名前が 1〜2 字落ちるのは受け入れた（Claude の判断。DESIGN.md「Typography」）。
  前と後の比較ページ https://claude.ai/artifact/CRJemoNKTzHpwtvKd28SdG は渡したが、ユーザーの返事はまだ無い
- 子どもの写真の試しは済んだ（ChatGPT「問題なかった」、Gemini「画像編集もできた。」）。宣伝してよい状態
- Gemini の開くボタンは `/app/download/mobile`（PR #52 で公開。iPhone ではアプリ、PC では今までと同じ `/app`。KNOWLEDGE.md 2026-10-20）。公開版のボタンで iPhone のアプリが開くのは、ユーザーが 2026-10-20 に確かめた
- X（SNS）の宣伝文の案は 2026-10-20 に会話で渡した（リポジトリには置いていない）
- 住所はこのアプリ専用のドメイン `omoide-prompt.com` にすると決めた（`logs/decisions.md` 2026-10-24）。置き場所は Cloudflare Workers にする案を 2026-10-24 に会話で説明した（Claude の設計）。収入の仕組みは今すぐは入れず、住所を移したあとに決める。X の宣伝は住所を移してから
- 「確認待ち」は空になった。Claude が足した細かい形・要素は 2026-10-29 に答えをもらい、「出典：Claude の自作」を外す 1 件だけが「公開後」のタスクになった（`logs/decisions.md` 2026-10-29）。Claude だけで進められる
- 「公開後」の残りのうち、ユーザーが決めることはアプリの無いスマホで Gemini の Web 版を開くか・ライセンス・広告
- プリセット・保持文・トグルの文を変えると `samples.test.ts` が落ちる。そのときは見本を作り直す（手順は `docs/sample-images.md`、道具は `~/.cache/photo-prompt-builder/tools/`。KNOWLEDGE.md 2026-10-11）
- 画面を変えるときの点検は `/apps-workflow:look` の B。画面全体を撮るときは `look.mjs shoot --setup ~/.cache/photo-prompt-builder/tools/setup-full.mjs`（お気に入り・最近使った設定を入れて撮る）

## 次セッションで最初にやること

1. TODO.md「公開後」の先頭「このアプリ専用のドメインを取り、サイトをその住所で開けるようにする」。ドメイン名は `omoide-prompt.com`。2026-10-24 に Cloudflare で買う手順を会話で渡し、ユーザーが買うのを待っている。
   買えたら、`feat/cloudflare-hosting` で `wrangler.jsonc` を置き、ユーザーに Cloudflare の画面でリポジトリをつないでもらい、住所を付け、`pages.yml` を転送のページに変える（形は KNOWLEDGE.md 2026-10-24）
   まだ買えていなければ、待つ間に「公開後」の「Claude の自作のカードから「出典：Claude の自作」の行を外す」を `fix/remove-claude-credit` で進める（画面を変えるので `apps-workflow:look` の B を通す）

`TODO.md` の先頭と一致させる。書くのは最初の一手だけで、一覧は `TODO.md` が持つ。
