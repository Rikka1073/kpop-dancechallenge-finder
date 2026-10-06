type AdminResponse<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

export async function adminRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  const payload = (await response.json().catch(() => null)) as AdminResponse<T> | null;
  if (!response.ok || !payload?.ok) {
    throw new Error(payload?.error || "リクエストに失敗しました");
  }
  return payload.data as T;
}
