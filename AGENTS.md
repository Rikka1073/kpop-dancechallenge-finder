# SeeKPOP エージェント手順

Linear プロジェクト: SeeKPOP（https://linear.app/masafumi/project/seekpop-d3444f6bdcd0）
運用ドキュメント: https://linear.app/masafumi/document/運用ルール-61dcac6eef12

トレンド日韓（kpop-trend）と同じ。

## 正本

- 課題は Linear
- 仕様とコードは git
- 作業ログは Obsidian `SeeKPOP/報告/MAS-n 種類-日付.md`

## データ鮮度

AI は候補を集めるだけ。公式かどうかは人が YouTube を開いて判定する。

1. 抽出前に `ops/extraction-targets.json` を人へ渡す。OK が出るまで取らない
2. 候補は `data/raw/YYYY-MM-DD/candidate-drafts.json`（git 管理外）。形式は `ops/templates/candidate-drafts.json`
3. URL 一覧をチャットと Linear 課題に出す
4. 人が承認するまで `official` を true にしない。DB に入れない
5. 承認後だけ `status: approved` / `official: true` にして登録する
6. 公開は人が「公開して」と言うまでしない
7. Linear の Done を公式判定の代用にしない

## git

- 作業ブランチは必ず `main` から切る
- Linear 課題ごとにブランチを分ける。ブランチ名に課題番号を入れる（例: `cursor/mas-20-branch-from-main-6bc5`）
- PR の作成は承認不要。エージェントが作ってよい。base は `main`
- `main` へのマージは人が手動で行う。エージェントはマージしない
- 1つの PR に複数課題を混ぜない

## Obsidian

人が vault を使えるとき、報告は `SeeKPOP/報告/MAS-n 種類-日付.md`。
テンプレは `ops/templates/obsidian-report.md`。Slack には送らない。

