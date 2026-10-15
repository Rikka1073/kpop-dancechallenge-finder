---
name: publish
description: Deploys SeeKPOP to Cloudflare with the cf CLI. Use when the user says 公開して or deploy to Cloudflare. Not for Origin git push, candidate extraction, or marking official.
---

# 公開

人が「公開して」と言ったあと、手元から `cf deploy` する。Origin への push では出さない。実装の commit と push は承認不要。

## 前提（欠けていたら停止）

1. 人が「公開して」と言っている。言われるまで公開しない。
2. 載せる動画は人が承認した公式だけ。ここで `official` を付けない。
3. `cf auth whoami` がログイン済み。未ログインなら止めて `cf auth login` を案内する。

## 手順

```bash
npm test
npm run deploy
```

`npm run deploy` は静的エクスポートのあと `cf deploy --prebuilt` する。Git 連携は足さない。管理画面 `/admin` は本番に載せない。

成功したら公開 URL を開いて確認する。ドメイン設定の正は `cloudflare.config.ts`。
