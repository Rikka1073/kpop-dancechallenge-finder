# SeeKPOP

K-POPアイドルの公式ダンスチャレンジ動画を、グループ名や楽曲名から探せる検索サイトです。

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 環境変数

`.env.local` に以下を設定します。

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
YOUTUBE_API_KEY=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
```

- `SUPABASE_SERVICE_ROLE_KEY` はローカル管理画面からの書き込み用です。本番の公開サイトには載せません。
- `YOUTUBE_API_KEY` はサーバー側だけで使います。ブラウザに出さないでください。
- `ADMIN_PASSWORD` は `npm run dev` の `/admin` 用です。本番では `/admin` を出しません。
- `ADMIN_SESSION_SECRET` はセッション署名用です。未設定時は `ADMIN_PASSWORD` を使います。

## 管理画面（ローカル専用）

本番 Cloudflare には載せません。`npm run dev` でだけ開きます。

1. `npm run dev` して [http://localhost:3000/admin/login](http://localhost:3000/admin/login) にアクセスする
2. `ADMIN_PASSWORD` でログインする
3. 週次抽出の候補は「候補一覧」が `data/raw/YYYY-MM-DD/candidate-drafts.json` を自動で開く
4. YouTube を開いて承認 / 却下する。判定は同じ JSON へ書き戻す
5. 手作業の登録も、同じ画面の「動画を登録」からできる

公開サイトには、グループと楽曲が付いた動画だけが表示されます。
