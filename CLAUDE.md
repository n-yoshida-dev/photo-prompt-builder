# photo-prompt-builder

子どもの思い出写真を ChatGPT / Claude / Gemini で加工するときの英語プロンプトを、スタイルと条件を画面で選ぶだけで組み立てる Web ツール。
バックエンド無し・API 連携無しの静的サイト。写真はブラウザ内でプレビューするだけで、端末の外に出さない。

## セッション開始時にすること

1. **`HANDOFF.md` を読む** — 現在地と次の一手だけがある（決定事項や履歴は持たない）
2. **設計・方針を提案する前に `logs/decisions.md` を読む** — ユーザーと合意済みの判断。蒸し返さない

未完タスクは SessionStart フックが `TODO.md` から自動で提示する。
セッションの区切りには `/apps-workflow:handoff` を実行して引き継ぎを書く。

## ドキュメントの役割

| ファイル | 役割 | 読み手 |
|---|---|---|
| `HANDOFF.md` | 現在地と次の一手だけ。履歴は持たない | AI |
| `logs/decisions.md` | ユーザーと合意した判断の台帳。`/decide` で追記 | AI |
| `PLAN.md` | 何を作るか・なぜ作るか | AI |
| `SPEC.md` | 確定仕様。実装が参照する正本 | AI |
| `TODO.md` | タスクと進捗 | AI |
| `KNOWLEDGE.md` | 技術的な設計判断・ハマりどころ | AI |
| `docs/` | 要件定義・アーキテクチャの解説、ユーザー提供のプロンプト原文 | 人間 |

**同じ事実を AI 用と人間用の両方に書かない。** AI 用から人間用へリンクする。

## 守ること

- **写真をリポジトリに入れない。** 動作確認や Qiita の実験に使った写真も含む。サンプルが要るときはダミー画像を生成して使う
- **写真を端末の外に出さない設計を崩さない。** 写真はこのアプリでは扱わない（2026-10-03 に画面の「写真を選ぶ」を外すと決めた。外すまではブラウザ内でプレビューするだけ）。
  サーバー送信・localStorage 保存・URL への埋め込みをしない。
  localStorage に保存するのは「最近使った設定」と「お気に入り（名前を付けて保存した設定）」の選択（プリセット id・トグル id・選択肢 id と名前）だけ
  （お気に入りは `logs/decisions.md` 2026-10-03 で追加）
- **`frontend/src/prompt/` は純粋関数のみ。** React・DOM・localStorage を import しない。プロンプトを組み立てる `buildPrompt` はここに置く
- **英文プロンプト（プリセット・トグルの文）は `frontend/src/data/` にマスタデータとして置く。** UI のコードに英文を書かない。
  ユーザー提供の原文は `docs/seed-prompts.md` にあり、data に持ち込むときは原文を改変しない
- ロジックを変更したら、対応する単体テストを同時に更新する
- 秘密情報をリポジトリに入れない（API キーはそもそも使わない設計）

## Claude Code の設定

共通のフック3種・スキル3種・エージェント1種は [apps-workflow プラグイン](https://github.com/n-yoshida-dev/claude-plugins)から来る（`.claude/settings.json` の `enabledPlugins`）。
**`enabledPlugins` だけでは install されない。アプリごとに project スコープで install が要る**（反映は次のセッションから）。手順は `../CLAUDE.md`「新しいアプリを作るとき」を参照。

| 種別 | 中身 | 出どころ |
|---|---|---|
| `/apps-workflow:handoff` | HANDOFF / TODO / KNOWLEDGE を更新して次のセッションへ渡す | プラグイン |
| `/apps-workflow:pr-check` | CI と同じ検査をローカルでまとめて実行する（コミット・PR の前） | プラグイン |
| `/apps-workflow:pr-flow` | PR の作成からマージまでの手順（完了条件と証拠、CI の待ち方、acceptance-reviewer の呼び方） | プラグイン |
| `/decide` | 議論で決めたことを `logs/decisions.md` に 1 件追記する | ユーザー設定（`~/.claude/commands/decide.md`。全リポジトリ共通） |
| `apps-workflow:acceptance-reviewer` | マージ前に差分を「完了条件：」・SPEC.md・「守ること」に照らして検品する読み取り専用エージェント。PR を作って CI を待つ間に Agent ツールで呼ぶ | プラグイン |
| `guard-secrets.sh` | 秘密情報・ローカル専用ファイルのコミットを阻止（PreToolUse） | プラグイン |
| `check-edited.sh` | frontend の typecheck / lint、backend の go vet（PostToolUse） | プラグイン |
| `session-briefing.sh` | TODO.md の未完タスクを起動時に提示（SessionStart） | プラグイン |

このアプリ固有のフック・スキルは `.claude/` に置く。固有のルールが増えたら `.claude/rules/` に切り出し、CLAUDE.md からはリンクだけにする。

## 共通ルール

自作プロダクト共通の開発ルール（技術スタック・Git運用・コーディング規則）は `../CLAUDE.md` にある。
上位ディレクトリの CLAUDE.md は自動でロードされる。
