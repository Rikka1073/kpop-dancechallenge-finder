const VIDEO_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

const YOUTUBE_HOSTS = new Set(["youtube.com", "m.youtube.com", "music.youtube.com", "youtube-nocookie.com"]);

export function parseYouTubeVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  if (VIDEO_ID_PATTERN.test(trimmed)) {
    return trimmed;
  }

  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const url = new URL(withProtocol);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return VIDEO_ID_PATTERN.test(id || "") ? id : null;
    }

    if (YOUTUBE_HOSTS.has(host)) {
      if (
        url.pathname.startsWith("/shorts/") ||
        url.pathname.startsWith("/embed/") ||
        url.pathname.startsWith("/live/")
      ) {
        const id = url.pathname.split("/").filter(Boolean)[1];
        return VIDEO_ID_PATTERN.test(id || "") ? id : null;
      }

      const videoId = url.searchParams.get("v");
      return VIDEO_ID_PATTERN.test(videoId || "") ? videoId : null;
    }
  } catch {
    return null;
  }

  return null;
}
