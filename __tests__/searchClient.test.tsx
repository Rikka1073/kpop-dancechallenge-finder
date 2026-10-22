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

const groups = [{ id: "g1", group_name: "IVE" }];
const songs = [{ id: "s1", song_name: "ATTITUDE" }];

function renderSearch(queryType?: string, queryId?: string) {
  const initial = getInitialSearchState({ videos, groups, songs, queryType, queryId });
  return render(<SearchClient groups={groups} songs={songs} {...initial} />);
}

describe("SearchClient", () => {
  beforeEach(() => {
    replace.mockReset();
  });

  test("グループを選ぶと URL を更新する", () => {
    renderSearch();
    screen.getByRole("button", { name: "#IVE" }).click();
    expect(replace).toHaveBeenCalledWith("/search?type=group&id=g1", { scroll: false });
  });

  test("選択中のグループをもう一度押すと id が外れてタブだけ残る", () => {
    renderSearch("group", "g1");
    screen.getByRole("button", { name: "#IVE" }).click();
    expect(replace).toHaveBeenCalledWith("/search?type=group", { scroll: false });
  });

  test("グループタブで URL を更新する", () => {
    renderSearch("song");
    screen.getByRole("button", { name: "グループで検索" }).click();
    expect(replace).toHaveBeenCalledWith("/search?type=group", { scroll: false });
  });

  test("楽曲タブで URL を更新する", () => {
    renderSearch();
    screen.getByRole("button", { name: "楽曲で検索" }).click();
    expect(replace).toHaveBeenCalledWith("/search?type=song", { scroll: false });
  });

  test("クリアでクエリが消える", () => {
    renderSearch("group", "g1");
    screen.getByRole("button", { name: "クリア" }).click();
    expect(replace).toHaveBeenCalledWith("/search", { scroll: false });
  });
});
