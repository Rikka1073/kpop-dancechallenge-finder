import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

const getVideoById = vi.fn();
const notFound = vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});

vi.mock("@/lib/supabase/supabaseFunction", () => ({
  getVideoById: (...args: unknown[]) => getVideoById(...args),
}));

vi.mock("next/navigation", () => ({
  notFound: () => notFound(),
}));

import Videos from "@/app/videos/[id]/page";

const video = {
  id: "video-1",
  youtube_id: "yt-abc",
  title: "公式ダンスチャレンジ",
  thumbnail_url: "https://example.com/thumb.jpg",
  view_count: 1200,
  video_groups: [{ groups: { id: "g1", group_name: "IVE" } }],
  video_songs: [{ songs: { id: "s1", song_name: "ATTITUDE" } }],
};

describe("動画詳細ページ", () => {
  beforeEach(() => {
    getVideoById.mockReset();
    notFound.mockClear();
  });

  test("HTML にタイトルと埋め込みが入る", async () => {
    getVideoById.mockResolvedValue(video);

    const ui = await Videos({ params: Promise.resolve({ id: "video-1" }) });
    render(ui);

    expect(getVideoById).toHaveBeenCalledWith("video-1");
    expect(screen.getByTitle("公式ダンスチャレンジ")).toBeInTheDocument();
    expect(screen.getByTitle("公式ダンスチャレンジ")).toHaveAttribute(
      "src",
      "https://www.youtube.com/embed/yt-abc?autoplay=1&mute=1",
    );
    expect(screen.getByText("IVE")).toBeInTheDocument();
    expect(screen.getByText("ATTITUDE")).toBeInTheDocument();
  });

  test("無い ID は notFound する", async () => {
    getVideoById.mockResolvedValue(undefined);

    await expect(Videos({ params: Promise.resolve({ id: "missing" }) })).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalled();
  });
});
