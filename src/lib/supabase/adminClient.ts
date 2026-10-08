import { createClient, SupabaseClient } from "@supabase/supabase-js";

export function createAdminSupabaseClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL が設定されていません");
  }
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY がありません。管理画面の書き込みは service role が必要です。Supabase の Settings → API から service_role をコピーして .env に足し、npm run dev を再起動してください。"
    );
  }

  if (!/^https?:\/\//.test(url)) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL は https://xxxx.supabase.co の形式です");
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
