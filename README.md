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

- `SUPABASE_SERVICE_ROLE_KEY` は管理画面からの書き込み用です。未設定の場合は anon key にフォールバックしますが、本番では service role + RLS を推奨します。
- `YOUTUBE_API_KEY` はサーバー側だけで使います。ブラウザに出さないでください。
- `ADMIN_PASSWORD` を設定すると `/admin` で動画・グループ・楽曲を管理できます。
- `ADMIN_SESSION_SECRET` はセッション署名用です。未設定時は `ADMIN_PASSWORD` を使います。

## 管理画面

1. `/admin/login` にアクセスする
2. `ADMIN_PASSWORD` でログインする
3. YouTube Shorts URL を貼り付けて動画情報を取得する
4. 参加グループと楽曲を選んで登録する

公開サイトには、グループと楽曲が付いた動画だけが表示されます。

## 課題と作業ログ

kpop-trend（トレンド日韓）と同じ分担。

- 課題: Linear プロジェクト [SeeKPOP](https://linear.app/masafumi/project/seekpop-d3444f6bdcd0)
- 運用ルール: [Linear ドキュメント](https://linear.app/masafumi/document/運用ルール-61dcac6eef12)
- 手順の正本: [`ops/README.md`](ops/README.md)
- 作業ログ: Obsidian `SeeKPOP/報告/MAS-n 種類-日付.md`

データの鮮度は AI が候補を抽出し、公式かどうかは人が YouTube を開いて判定する。Linear の完了では代用しない。

