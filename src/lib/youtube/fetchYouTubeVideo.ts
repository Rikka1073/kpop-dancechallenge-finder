import { parseYouTubeVideoId } from "./parseYouTubeVideoId";

export type YouTubeVideoSnapshot = {
  youtubeId: string;
  title: string;
  thumbnailUrl: string;
  viewCount: number;
  channelId: string;
  channelTitle: string;
};

type YouTubeThumbnail = {
  url?: string;
};

type YouTubeThumbnails = {
  maxres?: YouTubeThumbnail;
  standard?: YouTubeThumbnail;
  high?: YouTubeThumbnail;
  medium?: YouTubeThumbnail;
  default?: YouTubeThumbnail;
};

type YouTubeVideoItem = {
  id?: string;
  snippet?: {
    title?: string;
    channelId?: string;
    channelTitle?: string;
    thumbnails?: YouTubeThumbnails;
  };
  statistics?: {
    viewCount?: string;
  };
};

function pickThumbnailUrl(thumbnails: YouTubeThumbnails | undefined): string {
  return (
    thumbnails?.maxres?.url ||
    thumbnails?.standard?.url ||
    thumbnails?.high?.url ||
    thumbnails?.medium?.url ||
    thumbnails?.default?.url ||
    ""
  );
}

export async function fetchYouTubeVideoSnapshot(input: string): Promise<YouTubeVideoSnapshot> {
  const youtubeId = parseYouTubeVideoId(input);
  if (!youtubeId) {
    throw new Error("YouTube Shorts / 動画のURLまたはIDを正しく入力してください");
  }

  const apiKey = process.env.YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error("YOUTUBE_API_KEY が設定されていません");
  }

  const endpoint = new URL("https://www.googleapis.com/youtube/v3/videos");
  endpoint.searchParams.set("part", "snippet,statistics");
  endpoint.searchParams.set("id", youtubeId);
  endpoint.searchParams.set("key", apiKey);

  const response = await fetch(endpoint.toString());
  if (!response.ok) {
    throw new Error("YouTube APIからの取得に失敗しました");
  }

  const payload = (await response.json()) as { items?: YouTubeVideoItem[] };
  const item = payload.items?.[0];
  if (!item?.id) {
    throw new Error("指定された動画が見つかりませんでした");
  }

  const title = item.snippet?.title?.trim();
  const channelId = item.snippet?.channelId?.trim();
  const channelTitle = item.snippet?.channelTitle?.trim();
  const thumbnailUrl = pickThumbnailUrl(item.snippet?.thumbnails);
  if (!title || !thumbnailUrl) {
    throw new Error("動画タイトルまたはサムネイルを取得できませんでした");
  }
  if (!channelId || !channelTitle) {
    throw new Error("動画のチャンネル情報を取得できませんでした");
  }

  return {
    youtubeId: item.id,
    title,
    thumbnailUrl,
    viewCount: Number.parseInt(item.statistics?.viewCount || "0", 10) || 0,
    channelId,
    channelTitle,
  };
}
