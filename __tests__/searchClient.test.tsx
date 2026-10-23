import { getInitialSearchState } from "@/lib/search/initialSearchState";
import { Videos } from "@/types";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

const replace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

vi.mock("embla-carousel-react", () => ({
  default: () => [vi.fn(), { scrollPrev: vi.fn(), scrollNext: vi.fn() }],
}));

import SearchClient from "@/app/search/SearchClient";

const videos: Videos[] = [
  {
    id: "v1",
    youtube_id: "yt1",
    title: "Video 1",
    thumbnail_url: "https://example.com/1.jpg",
    view_count: 10,
    video_groups: [{ groups: { id: "g1", group_name: "IVE" } }],
    video_songs: [{ songs: { id: "s1", song_name: "ATTITUDE" } }],
  },
];

const groups = [
  { id: "g1", group_name: "IVE" },
  { id: "g2", group_name: "aespa" },
];
const songs = [
  { id: "s1", song_name: "ATTITUDE" },
  { id: "s2", song_name: "Whiplash" },
];

function renderSearch(
  query?: { groupIds?: string[]; songIds?: string[] },
  extras?: { total?: number; page?: number; pageSize?: number; pageVideos?: Videos[] }
) {
  const initial = getInitialSearchState({
    videos: extras?.pageVideos ?? videos,
    groups,
    songs,
    groupIds: query?.groupIds,
    songIds: query?.songIds,
  });
  return render(
    <SearchClient
      groups={groups}
      songs={songs}
      total={extras?.total ?? videos.length}
      page={extras?.page ?? 1}
      pageSize={extras?.pageSize ?? 20}
      {...initial}
    />
  );
}

describe("SearchClient", () => {
  beforeEach(() => {
    replace.mockReset();
  });

  test("グループを選ぶと URL を更新する", () => {
    renderSearch();
    screen.getByRole("button", { name: "#IVE" }).click();
    expect(replace).toHaveBeenCalledWith("/search?group=g1", { scroll: false });
  });

  test("選択中のグループをもう一度押すと外れる", () => {
    renderSearch({ groupIds: ["g1"] });
    screen.getByRole("button", { name: "#IVE" }).click();
    expect(replace).toHaveBeenCalledWith("/search", { scroll: false });
  });

  test("同じ種類を複数選ぶと OR の URL になる", () => {
    renderSearch({ groupIds: ["g1"] });
    screen.getByRole("button", { name: "#aespa" }).click();
    expect(replace).toHaveBeenCalledWith("/search?group=g1&group=g2", { scroll: false });
  });

  test("楽曲を足してもグループが残る", () => {
    renderSearch({ groupIds: ["g1"] });
    screen.getByRole("button", { name: "#ATTITUDE" }).click();
    expect(replace).toHaveBeenCalledWith("/search?group=g1&song=s1", { scroll: false });
  });

  test("クリアでクエリが消える", () => {
    renderSearch({ groupIds: ["g1"], songIds: ["s1"] });
    screen.getByRole("button", { name: "クリア" }).click();
    expect(replace).toHaveBeenCalledWith("/search", { scroll: false });
  });

  test("チップを外すとその ID だけ消える", () => {
    renderSearch({ groupIds: ["g1"], songIds: ["s1"] });
    screen.getByRole("button", { name: "IVEを外す" }).click();
    expect(replace).toHaveBeenCalledWith("/search?song=s1", { scroll: false });
  });

  test("次へで page を URL に載せる", () => {
    renderSearch({ groupIds: ["g1"] }, { total: 40, page: 1, pageSize: 20 });
    screen.getByRole("button", { name: "次へ" }).click();
    expect(replace).toHaveBeenCalledWith("/search?group=g1&page=2", { scroll: false });
  });
});
