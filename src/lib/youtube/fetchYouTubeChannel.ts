import { parseYouTubeChannelInput } from "./parseYouTubeChannel";

export type YouTubeChannelSnapshot = {
  channelId: string;
  title: string;
};

type ChannelItem = {
  id?: string;
  snippet?: {
    title?: string;
  };
};

function getYouTubeApiKey(): string {
  const apiKey = process.env.YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error("YOUTUBE_API_KEY が設定されていません");
  }
  return apiKey;
}

export async function fetchYouTubeChannelSnapshot(
  input: string,
  fetchImpl: typeof fetch = fetch
): Promise<YouTubeChannelSnapshot> {
  const parsed = parseYouTubeChannelInput(input);
  if (!parsed) {
    throw new Error("チャンネルのURLまたは@ハンドルを入力してください");
  }

  const endpoint = new URL("https://www.googleapis.com/youtube/v3/channels");
  endpoint.searchParams.set("part", "snippet");
  endpoint.searchParams.set("key", getYouTubeApiKey());

  if (parsed.kind === "id") {
    endpoint.searchParams.set("id", parsed.channelId);
  } else if (parsed.kind === "handle") {
    endpoint.searchParams.set("forHandle", parsed.handle);
  } else {
    endpoint.searchParams.set("forUsername", parsed.username);
  }

  const response = await fetchImpl(endpoint.toString());
  if (!response.ok) {
    throw new Error("YouTube APIからの取得に失敗しました");
  }

  const payload = (await response.json()) as { items?: ChannelItem[] };
  const item = payload.items?.[0];
  const channelId = item?.id?.trim();
  const title = item?.snippet?.title?.trim();
  if (!channelId || !title) {
    throw new Error("指定されたチャンネルが見つかりませんでした");
  }

  return { channelId, title };
}
