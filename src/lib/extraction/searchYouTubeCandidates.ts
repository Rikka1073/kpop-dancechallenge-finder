export type YouTubeSearchHit = {
  youtubeId: string;
  title: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: number;
  url: string;
};

type SearchItem = {
  id?: { videoId?: string };
  snippet?: {
    title?: string;
    channelId?: string;
    channelTitle?: string;
    publishedAt?: string;
  };
};

type VideoItem = {
  id?: string;
  snippet?: {
    title?: string;
    channelId?: string;
    channelTitle?: string;
    publishedAt?: string;
  };
  statistics?: {
    viewCount?: string;
  };
  contentDetails?: {
    duration?: string;
  };
};

type ChannelItem = {
  contentDetails?: {
    relatedPlaylists?: {
      uploads?: string;
    };
  };
};

type PlaylistItem = {
  contentDetails?: {
    videoId?: string;
  };
};

export const MAX_SHORTS_SECONDS = 60;

function parseIsoDurationSeconds(duration: string | undefined): number | null {
  if (!duration) {
    return null;
  }

  const match = duration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!match) {
    return null;
  }

  const hours = Number.parseInt(match[1] || "0", 10);
  const minutes = Number.parseInt(match[2] || "0", 10);
  const seconds = Number.parseInt(match[3] || "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
}

function isYouTubeShort(duration: string | undefined): boolean {
  const seconds = parseIsoDurationSeconds(duration);
  return seconds !== null && seconds > 0 && seconds <= MAX_SHORTS_SECONDS;
}

function videoUrl(youtubeId: string): string {
  return `https://www.youtube.com/shorts/${youtubeId}`;
}

async function readYoutubeJson(url: URL, fetchImpl: typeof fetch): Promise<unknown> {
  const response = await fetchImpl(url.toString());
  if (!response.ok) {
    throw new Error("YouTube APIからの取得に失敗しました");
  }
  return response.json();
}

function toShortHit(
  item: VideoItem,
  channelId: string,
  publishedAfterMs: number
): YouTubeSearchHit | null {
  const youtubeId = item.id?.trim();
  const title = item.snippet?.title?.trim();
  const itemChannelId = item.snippet?.channelId?.trim();
  const channelTitle = item.snippet?.channelTitle?.trim();
  const publishedAt = item.snippet?.publishedAt?.trim();
  if (!youtubeId || !title || !channelTitle || !publishedAt) {
    return null;
  }
  if (itemChannelId !== channelId) {
    return null;
  }
  if (!isYouTubeShort(item.contentDetails?.duration)) {
    return null;
  }
  if (!Number.isNaN(publishedAfterMs) && Date.parse(publishedAt) < publishedAfterMs) {
    return null;
  }

  return {
    youtubeId,
    title,
    channelTitle,
    publishedAt,
    viewCount: Number.parseInt(item.statistics?.viewCount || "0", 10) || 0,
    url: videoUrl(youtubeId),
  };
}

async function listVideosByIds(
  videoIds: string[],
  apiKey: string,
  fetchImpl: typeof fetch
): Promise<VideoItem[]> {
  const uniqueIds = [...new Set(videoIds.map((id) => id.trim()).filter(Boolean))];
  const items: VideoItem[] = [];

  for (let index = 0; index < uniqueIds.length; index += 50) {
    const chunk = uniqueIds.slice(index, index + 50);
    const videosUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
    videosUrl.searchParams.set("part", "snippet,statistics,contentDetails");
    videosUrl.searchParams.set("id", chunk.join(","));
    videosUrl.searchParams.set("key", apiKey);
    const videosPayload = (await readYoutubeJson(videosUrl, fetchImpl)) as { items?: VideoItem[] };
    items.push(...(videosPayload.items || []));
  }

  return items;
}

export async function searchYouTubeCandidates(options: {
  query: string;
  channelId: string;
  apiKey: string;
  maxResults?: number;
  publishedAfter?: string;
  fetchImpl?: typeof fetch;
}): Promise<YouTubeSearchHit[]> {
  const channelId = options.channelId.trim();
  if (!channelId) {
    throw new Error("確認済みの公式チャンネルがありません。先にグループへ公式チャンネルを保存してください。");
  }

  const fetchImpl = options.fetchImpl ?? fetch;
  const maxResults = Math.min(Math.max(options.maxResults ?? 25, 1), 50);
  const publishedAfter = options.publishedAfter?.trim();
  const publishedAfterMs = publishedAfter ? Date.parse(publishedAfter) : Number.NaN;

  const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
  searchUrl.searchParams.set("part", "snippet");
  searchUrl.searchParams.set("type", "video");
  searchUrl.searchParams.set("videoDuration", "short");
  searchUrl.searchParams.set("maxResults", String(maxResults));
  searchUrl.searchParams.set("order", "date");
  searchUrl.searchParams.set("channelId", channelId);
  searchUrl.searchParams.set("q", options.query);
  searchUrl.searchParams.set("key", options.apiKey);
  if (publishedAfter) {
    searchUrl.searchParams.set("publishedAfter", publishedAfter);
  }

  const searchPayload = (await readYoutubeJson(searchUrl, fetchImpl)) as { items?: SearchItem[] };
  const videoIds = (searchPayload.items || []).map((item) => item.id?.videoId).filter(Boolean) as string[];
  if (videoIds.length === 0) {
    return [];
  }

  const videos = await listVideosByIds(videoIds, options.apiKey, fetchImpl);
  return videos
    .map((item) => toShortHit(item, channelId, publishedAfterMs))
    .filter((item): item is YouTubeSearchHit => item !== null);
}

export async function listChannelShorts(options: {
  channelId: string;
  apiKey: string;
  publishedAfter?: string;
  fetchImpl?: typeof fetch;
}): Promise<YouTubeSearchHit[]> {
  const channelId = options.channelId.trim();
  if (!channelId) {
    throw new Error("確認済みの公式チャンネルがありません。先にグループへ公式チャンネルを保存してください。");
  }

  const fetchImpl = options.fetchImpl ?? fetch;
  const publishedAfter = options.publishedAfter?.trim();
  const publishedAfterMs = publishedAfter ? Date.parse(publishedAfter) : Number.NaN;

  const channelUrl = new URL("https://www.googleapis.com/youtube/v3/channels");
  channelUrl.searchParams.set("part", "contentDetails");
  channelUrl.searchParams.set("id", channelId);
  channelUrl.searchParams.set("key", options.apiKey);
  const channelPayload = (await readYoutubeJson(channelUrl, fetchImpl)) as { items?: ChannelItem[] };
  const uploadsPlaylistId = channelPayload.items?.[0]?.contentDetails?.relatedPlaylists?.uploads?.trim();
  if (!uploadsPlaylistId) {
    throw new Error("公式チャンネルのアップロード一覧が取れませんでした");
  }

  const videoIds: string[] = [];
  let pageToken = "";
  do {
    const playlistUrl = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
    playlistUrl.searchParams.set("part", "contentDetails");
    playlistUrl.searchParams.set("playlistId", uploadsPlaylistId);
    playlistUrl.searchParams.set("maxResults", "50");
    playlistUrl.searchParams.set("key", options.apiKey);
    if (pageToken) {
      playlistUrl.searchParams.set("pageToken", pageToken);
    }
    const playlistPayload = (await readYoutubeJson(playlistUrl, fetchImpl)) as {
      items?: PlaylistItem[];
      nextPageToken?: string;
    };
    for (const item of playlistPayload.items || []) {
      const videoId = item.contentDetails?.videoId?.trim();
      if (videoId) {
        videoIds.push(videoId);
      }
    }
    pageToken = playlistPayload.nextPageToken?.trim() || "";
  } while (pageToken);

  if (videoIds.length === 0) {
    return [];
  }

  const videos = await listVideosByIds(videoIds, options.apiKey, fetchImpl);
  return videos
    .map((item) => toShortHit(item, channelId, publishedAfterMs))
    .filter((item): item is YouTubeSearchHit => item !== null);
}
