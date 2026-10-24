---
name: monthly-extract
description: Extracts YouTube dance-challenge candidates into a local JSON draft. Use for 月次抽出 (last month) and for first-time group video registration (all channel shorts). Triggers include 週次抽出, 候補を集めて, 新規登録, 全ショート抽出, extract candidates. Not for publishing or marking official.
---

# 月次抽出

確認済み公式チャンネル（`groups.youtube_channel_id`）の中だけ、公開日が直近1ヶ月のショート（60秒以内）を YouTube から集め、手元 JSON に書いて止まる。過去分と長尺（MV・ダンスプラクティスなど）は取らない。過去ドラフトで却下・承認した youtubeId は再抽出しない。タイトルが vlog / concert / teasing などチャレンジ以外に見えるものは取らない。challenge / 챌린지 はヒントで、確定は人がする。公式チャンネル未保存のグループは取らない。公式判定も DB 投入も公開もしない。依頼に Linear の課題 ID があるときは開始時に読む。

停止点では Linear を `In Review` にし、チャットに結論だけ書く。Obsidian 報告は1日の終わりに、許可を取ってからまとめて書く。

## 停止点（省略しない）

1. 抽出前。対象グループ / 検索クエリを Linear 課題に書き、チャットで OK が出るまで `extract:candidates` しない。
2. JSON を書いたあと。DB に入れない。`official` を true にしない。公開しない。

## 手順

1. 課題が無ければ切る（タイトル `月次抽出 YYYY-MM-DD`）。プロジェクトは SeeKPOP。
2. 対象グループを課題へ書く。OK 待ち。
3. OK のあと:

```bash
npm run extract:candidates -- --issue MAS-n --group グループ名 --date YYYY-MM-DD
```

公開日の下限は実行日から1ヶ月前。変えるときは `--published-after YYYY-MM-DD`。

グループの動画を初めてカタログに載せるときは `--all-channel-shorts`。新人に限らない。検索クエリも直近1ヶ月も使わない。チャンネル開設以降（デビュー前を含む）を取る。タイトルでは落とさない。60秒以下と却下済みスキップだけ残す。月次のデフォルトは変えない。月次は、すでに載っているグループの増分用。

候補は `data/raw/YYYY-MM-DD/candidate-drafts.json`。git に入れない。DB に入れない。JSON 全文はチャットに貼らない。

4. 件数と JSON の場所を Linear 課題に書く。
5. チャットに件数と JSON の場所を報告する。Obsidian にはこの時点では書かない。
6. 判定は人が `npm run dev` の `/admin` 「候補一覧」で行う。エージェントはここで止まってよい。
