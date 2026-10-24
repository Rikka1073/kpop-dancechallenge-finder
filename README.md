# SeeKPOP

K-POPアイドルの公式ダンスチャレンジ動画を、グループ名や楽曲名から探せる検索サイトです。

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 環境変数

`.env` または `.env.local` に以下を設定します。`npm run dev` と `npm run extract:candidates` が読みます。

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
YOUTUBE_API_KEY=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
```

- `SUPABASE_SERVICE_ROLE_KEY` はローカル管理画面からの書き込み用です。未設定だとグループ更新が0件で終わります。`extract:candidates` が確認済み公式チャンネルを読むときにも使います。本番の公開サイトには載せません。
- `YOUTUBE_API_KEY` はサーバー側だけで使います。ブラウザに出さないでください。月次抽出は確認済み公式チャンネルの直近1ヶ月のショート（60秒以内）だけを検索します。
- `ADMIN_PASSWORD` は `npm run dev` の `/admin` 用です。本番では `/admin` を出しません。
- `ADMIN_SESSION_SECRET` はセッション署名用です。未設定時は `ADMIN_PASSWORD` を使います。

## 管理画面（ローカル専用）

本番 Cloudflare には載せません。`npm run dev` でだけ開きます。

1. `npm run dev` して [http://localhost:3000/admin/login](http://localhost:3000/admin/login) にアクセスする
2. `ADMIN_PASSWORD` でログインする
3. 公式チャンネルは YouTube で自分で確認してから、「公式チャンネル」に URL を貼る。表示/非表示は「表示切替」。API はチャンネルIDを取るだけで、公式とは判定しない
4. 確認したチャンネルを保存したあとに、「動画を登録」から公式チャンネルの動画だけを載せる
5. 月次抽出は確認済み公式チャンネルの直近1ヶ月のショート（60秒以内）だけ取る。チャンネル全ショートは `--all-channel-shorts`。候補は「候補一覧」が `data/raw/YYYY-MM-DD/candidate-drafts.json` を自動で開く
6. YouTube を開いて承認 / 却下する。判定は同じ JSON へ書き戻す

`groups.youtube_channel_id` を足す SQL は `supabase/migrations/` にあります。Supabase に適用してから公式チャンネルを保存してください。

公開サイトには、グループと楽曲が付いた動画だけが表示されます。

## 公開

公開は Cloudflare の `cf deploy` です。GitHub への push では出ません。出すのは人がマージした `main` の先端だけです。作業ブランチからは出しません。初回だけ Cloudflare にログインします。

```bash
git checkout main
git pull --ff-only origin main
npx cf auth login
npm run deploy
```

`npm run deploy` は `@opennextjs/cloudflare` で Next のサーバを Worker に載せてから `cf deploy --prebuilt` します。`cf deploy` 単体は使いません。本番ビルドから `/admin` は除きます。

公開ドメインは `https://seekpop.jp` です。`cloudflare.config.ts` の `domains` にあります。Cloudflare Pages は使いません。Worker の `cf deploy` だけです。
