"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import { adminRequest } from "@/lib/admin/client";

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    adminRequest<{ configured: boolean }>("/api/admin/login")
      .then((data) => setConfigured(data.configured))
      .catch(() => setConfigured(false));
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await adminRequest("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      const nextPath = searchParams.get("next") || "/admin";
      router.replace(nextPath.startsWith("/admin") ? nextPath : "/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "ログインに失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
      <div className="mb-6 flex justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600">
          <Lock className="text-white" />
        </div>
      </div>
      <h1 className="mb-2 text-center text-2xl font-bold">管理者ログイン</h1>
      <p className="mb-6 text-center text-gray-600">ローカルの npm run dev 専用です。本番には出しません</p>
      {configured === false && (
        <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
          ADMIN_PASSWORD がサーバーに設定されていません。環境変数を追加してください。
        </p>
      )}
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="管理者パスワード"
          className="input input-lg w-full focus:outline-purple-600"
          autoComplete="current-password"
          required
        />
        {error && <p className="text-sm font-bold text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="btn-lg w-full rounded-2xl border-none bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-lg text-white disabled:opacity-60"
        >
          {submitting ? "確認中..." : "ログイン"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
