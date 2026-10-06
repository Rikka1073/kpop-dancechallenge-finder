# SeeKPOP 運用（git 側）

課題の置き場は Linear プロジェクト [SeeKPOP](https://linear.app/masafumi/project/seekpop-d3444f6bdcd0)。
作業ログは Obsidian `SeeKPOP/報告/`。ここのファイルは **形式と手順の正本**。

トレンド日韓（kpop-trend）と同じ分担。

| 置き場 | 正とするもの |
| --- | --- |
| Linear | 課題。何をやるか |
| git | 仕様・コード・候補の形式 |
| Obsidian `SeeKPOP/報告/` | 作業ログ。`MAS-n 種類-日付.md` |

`candidate.official` と公開は Linear の Done では代用しない。

## データの鮮度

1. AI が YouTube から候補を集める
2. `data/raw/YYYY-MM-DD/candidate-drafts.json` に書く（git 管理外）
3. 人が根拠 URL を開いてチャットで承認 / 却下する
4. 承認分だけ DB に入れて公開する

## 人が確認するファイル

2回だけ。チャットで返す。

1. **抽出前** `ops/extraction-targets.json`
2. **判定** `data/raw/YYYY-MM-DD/candidate-drafts.json`

承認前に `official: true` を付けない。公開は人が「公開して」と言うまでしない。
