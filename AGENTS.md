# SeeKPOP エージェント手順

このファイルと `.cursor/` は git 管理。課題の正本は Linear の [運用ルール](https://linear.app/masafumi/document/運用ルール-61dcac6eef12)。
Linear プロジェクト: [SeeKPOP](https://linear.app/masafumi/project/seekpop-d3444f6bdcd0)

人が再指示しなくても、下の git / チャット報告 / 公開は毎回やる。Obsidian 報告は1日の終わりに、許可を取ってからまとめて書く。

## 正本

- 課題と運用手順 → Linear
- 仕様とコード、エージェント手順（このファイルと `.cursor/`） → git
- 作業ログ → チャット（タスクごと）と Obsidian `SeeKPOP/報告/`（1日の終わり。書く前に許可）

## git

- 作業ブランチは必ず `main` から切る
- Linear 課題ごとにブランチを分ける。名前は課題番号だけ（例: `mas-14`）。1課題1PR
- PR は **draft にしない**。Ready で作る。作成は承認不要。base は `main`
- Linear 課題の作成・更新・コメントは承認不要。切る前にチャットで許可を求めない
- `subscribe_linear_issue` など購読ツールは呼ばない。課題の作成・更新・コメントだけで進める。購読は承認カードが出て作業が止まる
- `main` へのマージは人が手動で行う。エージェントはマージしない
- 1つの PR に複数課題を混ぜない

## 報告（省略しない）

### チャット（タスクごと）

人が「報告して」と言わなくても書く。マージ待ちにしない。結論と次の一手だけ。チャットの全文は置かない。

タイミング:

- 単発改修 / SEO改善 / 再生数同期 — PR を出して、その課題の実装が終わったとき。マージ前でよい
- 月次抽出 — JSON を手元に書いて件数を課題に出したとき
- 公式判定 — 人が判定し、承認分の DB 反映まで終わったとき

### Obsidian（1日の終わり）

パス: `/Users/masafumi/Documents/Obsidian Vault/SeeKPOP/報告/【MAS-n】種類-日付.md`  
書き方の正本: `/Users/masafumi/Documents/Obsidian Vault/SeeKPOP/置き方.md`

タスク完了のたびに書かない。人が「今日の終わり」「今日の報告」などと言ったときに、その日分のパスと要約を出して許可を求める。OK が出るまで Obsidian へは書き込まない。

書いたら Linear 課題にはパスだけコメントする。本文は載せない。Slack には送らない。

ファイル名がタイトル。本文は `Linear: [MAS-n](url)` から始め、先頭に `#` の題は置かない。

## データの鮮度

AI は確認済み公式チャンネルの直近1ヶ月のショート（60秒以内）から候補を集めるだけ。過去分は取らない。タイトルがチャレンジ以外に見えるものは取らない。ダンスチャレンジとして載せるかは人が YouTube を開いて判定する。公式チャンネル未保存のグループは取らない。

1. 抽出前に対象グループを Linear 課題へ書く。OK が出るまで取らない
2. 候補は `data/raw/YYYY-MM-DD/candidate-drafts.json`（git 管理外）
3. 人は `npm run dev` の `/admin` 「候補一覧」で判定する
4. 人が承認するまで `official` を true にしない。DB に入れない
5. 公開は人が「公開して」と言うまでしない
6. Linear の Done を公式判定の代用にしない

## 仕事の振り分け

| 依頼の例 | スキル |
|---|---|
| 「月次抽出して」「候補を集めて」 | `.cursor/skills/monthly-extract` |
| 「公開して」 | `.cursor/skills/publish`（`main` の先端だけ。作業ブランチからは出さない） |
