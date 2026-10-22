---
name: publish
description: Deploys SeeKPOP to Cloudflare with the cf CLI. Use when the user says 公開して or deploy to Cloudflare. Not for Origin git push, candidate extraction, or marking official.
---

# 公開

人が「公開して」と言ったあと、手元から `cf deploy` する。Origin への push では出さない。実装の commit と push は承認不要。出すのは人がマージした `main` の先端だけ。作業ブランチからは出さない。

## 前提（欠けていたら停止）

1. 人が「公開して」と言っている。言われるまで公開しない。
2. 載せる動画は人が承認した公式だけ。ここで `official` を付けない。
3. `cf auth whoami` がログイン済み。未ログインなら止めて `cf auth login` を案内する。
4. いまのブランチが `main` で、`origin/main` と一致している。作業ブランチにいる、または `main` が遅れている／先行しているときは止める。`git checkout main` と `git pull --ff-only origin main` で揃えてから出す。

## 手順

```bash
git checkout main
git pull --ff-only origin main
npm test
npm run deploy
```

`npm run deploy` は OpenNext で Next のサーバを Worker に載せたあと `cf deploy --prebuilt` する。Git 連携は足さない。管理画面 `/admin` は本番に載せない。

成功したら公開 URL を開いて確認する。ドメイン設定の正は `cloudflare.config.ts`。
