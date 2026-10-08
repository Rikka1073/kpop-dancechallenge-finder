const CHANNEL_ID_PATTERN = /^UC[a-zA-Z0-9_-]{22}$/;
const YOUTUBE_HOSTS = new Set(["youtube.com", "m.youtube.com", "music.youtube.com", "youtube-nocookie.com"]);
const VIDEO_PATHS = ["/watch", "/shorts/", "/embed/", "/live/"];

export type ParsedYouTubeChannel =
  | { kind: "id"; channelId: string }
  | { kind: "handle"; handle: string }
  | { kind: "username"; username: string };

function asHandle(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const handle = trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
  if (handle.length < 4) {
    return null;
  }
  return handle;
}

export function parseYouTubeChannelInput(input: string): ParsedYouTubeChannel | null {
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  if (CHANNEL_ID_PATTERN.test(trimmed)) {
    return { kind: "id", channelId: trimmed };
  }

  if (trimmed.startsWith("@")) {
    const handle = asHandle(trimmed);
    return handle ? { kind: "handle", handle } : null;
  }

  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const url = new URL(withProtocol);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return null;
    }

    if (!YOUTUBE_HOSTS.has(host)) {
      return null;
    }

    const segments = url.pathname.split("/").filter(Boolean);
    const first = segments[0] || "";
    const second = segments[1] || "";

    if (VIDEO_PATHS.some((path) => url.pathname === path || url.pathname.startsWith(path))) {
      return null;
    }

    if (first.startsWith("@")) {
      const handle = asHandle(first);
      return handle ? { kind: "handle", handle } : null;
    }

    if (first === "channel" && CHANNEL_ID_PATTERN.test(second)) {
      return { kind: "id", channelId: second };
    }

    if ((first === "c" || first === "user") && second) {
      return { kind: "username", username: second };
    }
  } catch {
    return null;
  }

  return null;
}
