import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center" data-testid="not-found">
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="mb-3 text-2xl font-bold text-purple-600 md:text-3xl">ページが見つかりませんでした</h1>
        <p className="mb-8 text-gray-600">URL が間違っているか、動画が公開されていません。</p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="link rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white no-underline hover:text-white"
          >
            ホームへ戻る
          </Link>
          <Link
            href="/search"
            className="link rounded-2xl border border-purple-600 px-6 py-3 font-semibold text-purple-600 no-underline hover:bg-purple-600 hover:text-white"
          >
            検索へ
          </Link>
        </div>
      </div>
    </div>
  );
}
