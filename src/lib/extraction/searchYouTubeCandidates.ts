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
    channelTitle?: string;
    publishedAt?: string;
  };
};

type VideoItem = {
  id?: string;
  snippet?: {
    title?: string;
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

function videoUrl(youtubeId: string, duration?: string): string {
  const seconds = parseIsoDurationSeconds(duration);
  if (seconds !== null && seconds > 0 && seconds <= 60) {
    return `https://www.youtube.com/shorts/${youtubeId}`;
  }
  return `https://www.youtube.com/watch?v=${youtubeId}`;
}

async function readYoutubeJson(url: URL, fetchImpl: typeof fetch): Promise<unknown> {
  const response = await fetchImpl(url.toString());
  if (!response.ok) {
    throw new Error("YouTube APIからの取得に失敗しました");
  }
  return response.json();
}

export async function searchYouTubeCandidates(options: {
  query: string;
  apiKey: string;
  maxResults?: number;
  fetchImpl?: typeof fetch;
}): Promise<YouTubeSearchHit[]> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const maxResults = Math.min(Math.max(options.maxResults ?? 5, 1), 10);

  const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
  searchUrl.searchParams.set("part", "snippet");
  searchUrl.searchParams.set("type", "video");
  searchUrl.searchParams.set("videoDuration", "short");
  searchUrl.searchParams.set("maxResults", String(maxResults));
  searchUrl.searchParams.set("order", "date");
  searchUrl.searchParams.set("q", options.query);
  searchUrl.searchParams.set("key", options.apiKey);

  const searchPayload = (await readYoutubeJson(searchUrl, fetchImpl)) as { items?: SearchItem[] };
  const videoIds = [...new Set((searchPayload.items || []).map((item) => item.id?.videoId).filter(Boolean))] as string[];

  if (videoIds.length === 0) {
    return [];
  }

  const videosUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
  videosUrl.searchParams.set("part", "snippet,statistics,contentDetails");
  videosUrl.searchParams.set("id", videoIds.join(","));
  videosUrl.searchParams.set("key", options.apiKey);

  const videosPayload = (await readYoutubeJson(videosUrl, fetchImpl)) as { items?: VideoItem[] };

  return (videosPayload.items || [])
    .map((item) => {
      const youtubeId = item.id?.trim();
      const title = item.snippet?.title?.trim();
      const channelTitle = item.snippet?.channelTitle?.trim();
      const publishedAt = item.snippet?.publishedAt?.trim();
      if (!youtubeId || !title || !channelTitle || !publishedAt) {
        return null;
      }

      return {
        youtubeId,
        title,
        channelTitle,
        publishedAt,
        viewCount: Number.parseInt(item.statistics?.viewCount || "0", 10) || 0,
        url: videoUrl(youtubeId, item.contentDetails?.duration),
      } satisfies YouTubeSearchHit;
    })
    .filter((item): item is YouTubeSearchHit => item !== null);
}
