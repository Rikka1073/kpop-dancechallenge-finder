export const SITE_URL = "https://seekpop.jp";
export const SITE_NAME = "SeeKPOP";
export const SITE_TITLE = "SeeKPOP | K-POPダンスチャレンジ検索";
export const SITE_DESCRIPTION =
  "推しのダンスチャレンジが一瞬で見つかる。グループ名や楽曲名をタップするだけで、アイドル公式コラボ動画を検索できます。";

export function absoluteUrl(path = "/"): string {
  if (!path || path === "/") {
    return SITE_URL;
  }
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function videoJsonLd(video: {
  id: string;
  title: string;
  thumbnail_url: string;
  youtube_id: string;
  view_count: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    thumbnailUrl: video.thumbnail_url,
    url: absoluteUrl(`/videos/${video.id}`),
    embedUrl: `https://www.youtube.com/embed/${video.youtube_id}`,
    contentUrl: `https://www.youtube.com/shorts/${video.youtube_id}`,
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/WatchAction",
      userInteractionCount: video.view_count,
    },
  };
}
