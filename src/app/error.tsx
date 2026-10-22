"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container mx-auto px-4 py-16 text-center" data-testid="error">
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="mb-3 text-2xl font-bold text-purple-600 md:text-3xl">エラーが起きました</h1>
        <p className="mb-8 text-gray-600">時間をおいてから、もう一度お試しください。</p>
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white"
        >
          やり直す
        </button>
      </div>
    </div>
  );
}
