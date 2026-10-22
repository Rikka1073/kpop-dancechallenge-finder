import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { beforeEach, describe, expect, test, vi } from "vitest";

const getAllVideos = vi.fn();
const fetchGroups = vi.fn();
const fetchSongs = vi.fn();

vi.mock("@/lib/supabase/supabaseFunction", () => ({
  getAllVideos: (...args: unknown[]) => getAllVideos(...args),
  fetchGroups: (...args: unknown[]) => fetchGroups(...args),
  fetchSongs: (...args: unknown[]) => fetchSongs(...args),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
}));

import SearchPage from "@/app/search/page";

const video = {
  id: "video-1",
  youtube_id: "yt-abc",
  title: "公式ダンスチャレンジ",
  thumbnail_url: "https://example.com/thumb.jpg",
  view_count: 1200,
  video_groups: [{ groups: { id: "g1", group_name: "IVE" } }],
  video_songs: [{ songs: { id: "s1", song_name: "ATTITUDE" } }],
};

describe("検索ページ", () => {
  beforeEach(() => {
    getAllVideos.mockReset();
    fetchGroups.mockReset();
    fetchSongs.mockReset();
  });

  test("初回 HTML に動画カードが入る", async () => {
    getAllVideos.mockResolvedValue([video]);
    fetchGroups.mockResolvedValue([{ id: "g1", group_name: "IVE" }]);
    fetchSongs.mockResolvedValue([{ id: "s1", song_name: "ATTITUDE" }]);

    const ui = await SearchPage({ searchParams: Promise.resolve({}) });
    const html = renderToString(ui);

    expect(html).toContain("ダンスチャレンジ検索");
    expect(html).toContain('data-testid="video-card"');
    expect(html).toContain("公式ダンスチャレンジ");
  });

  test("グループクエリなら絞り込んだカードを出す", async () => {
    getAllVideos.mockResolvedValue([
      video,
      {
        ...video,
        id: "video-2",
        title: "別グループ",
        video_groups: [{ groups: { id: "g2", group_name: "aespa" } }],
      },
    ]);
    fetchGroups.mockResolvedValue([
      { id: "g1", group_name: "IVE" },
      { id: "g2", group_name: "aespa" },
    ]);
    fetchSongs.mockResolvedValue([{ id: "s1", song_name: "ATTITUDE" }]);

    const ui = await SearchPage({
      searchParams: Promise.resolve({ type: "group", id: "g1" }),
    });
    const html = renderToString(ui);

    const readable = html.replace(/<!-- -->/g, "");
    expect(readable).toContain("公式ダンスチャレンジ");
    expect(readable).not.toContain("別グループ");
    expect(readable).toContain("#IVE");
  });

  test("type=song なら楽曲タブの HTML になる", async () => {
    getAllVideos.mockResolvedValue([video]);
    fetchGroups.mockResolvedValue([{ id: "g1", group_name: "IVE" }]);
    fetchSongs.mockResolvedValue([{ id: "s1", song_name: "ATTITUDE" }]);

    const ui = await SearchPage({
      searchParams: Promise.resolve({ type: "song" }),
    });
    const html = renderToString(ui).replace(/<!-- -->/g, "");

    expect(html).toContain("楽曲で検索");
    expect(html).toContain("#ATTITUDE");
  });

  test("取得に失敗したらエラーを出す", async () => {
    getAllVideos.mockRejectedValue(new Error("network"));
    fetchGroups.mockResolvedValue([]);
    fetchSongs.mockResolvedValue([]);

    const ui = await SearchPage({ searchParams: Promise.resolve({}) });
    render(ui);

    expect(screen.getByText("データを読み込めませんでした")).toBeInTheDocument();
  });
});
