import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import AdminDashboard from "@/components/admin/AdminDashboard";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock("next/image", () => ({
  default: (props: { alt: string }) => <span role="img" aria-label={props.alt} />,
}));

const ive = {
  id: "group-ive",
  group_name: "IVE",
  display: true,
  youtube_channel_id: "UCxxxxxxxxxxxxxxxxxxxxxx",
  youtube_channel_title: "IVE",
};

const unconfirmed = {
  id: "group-new",
  group_name: "NewJeans",
  display: true,
  youtube_channel_id: null,
  youtube_channel_title: null,
};

const hiddenSong = {
  id: "song-eleven",
  song_name: "ELEVEN",
  display: false,
};

const visibleSong = {
  id: "song-love-dive",
  song_name: "LOVE DIVE",
  display: true,
};

const visibleVideo = {
  id: "video-visible",
  youtube_id: "abcdefghijk",
  title: "IVE dance",
  thumbnail_url: "",
  view_count: 12,
  display: true,
  video_groups: [{ groups: { id: "group-ive", group_name: "IVE" } }],
  video_songs: [],
};

const hiddenVideo = {
  id: "video-hidden",
  youtube_id: "hiddenvideo1",
  title: "hidden challenge",
  thumbnail_url: "",
  view_count: 1,
  display: false,
  video_groups: [],
  video_songs: [],
};

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("管理画面の公式チャンネル", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo, init?: RequestInit) => {
        const url = String(input);
        if (url.includes("/api/admin/videos") && init?.method === "POST") {
          return {
            ok: true,
            json: async () => ({
              ok: true,
              data: { id: "video-1", youtube_id: "abcdefghijk", title: "IVE dance", thumbnail_url: "", view_count: 1 },
            }),
          } as Response;
        }
        if (url.includes("/api/admin/videos") && init?.method === "PATCH") {
          const body = JSON.parse(String(init.body)) as { id?: string; display?: boolean; all?: boolean };
          if (body.all) {
            return {
              ok: true,
              json: async () => ({
                ok: true,
                data: [visibleVideo, hiddenVideo].map((video) => ({ ...video, display: body.display })),
              }),
            } as Response;
          }
          const source = body.id === hiddenVideo.id ? hiddenVideo : visibleVideo;
          return {
            ok: true,
            json: async () => ({
              ok: true,
              data: {
                ...source,
                id: body.id,
                ...(typeof body.display === "boolean" ? { display: body.display } : {}),
              },
            }),
          } as Response;
        }
        if (url.includes("/api/admin/videos")) {
          return {
            ok: true,
            json: async () => ({ ok: true, data: [visibleVideo, hiddenVideo] }),
          } as Response;
        }
        if (url.includes("/api/admin/youtube/channel")) {
          return {
            ok: true,
            json: async () => ({
              ok: true,
              data: { channelId: "UCxxxxxxxxxxxxxxxxxxxxxx", title: "IVE" },
            }),
          } as Response;
        }
        if (url.includes("/api/admin/youtube?")) {
          const channelId = url.includes("fan") ? "UCyyyyyyyyyyyyyyyyyyyyyy" : "UCxxxxxxxxxxxxxxxxxxxxxx";
          return {
            ok: true,
            json: async () => ({
              ok: true,
              data: {
                youtubeId: "abcdefghijk",
                title: "IVE dance challenge",
                thumbnailUrl: "https://example.com/thumb.jpg",
                viewCount: 12,
                channelId,
                channelTitle: channelId.startsWith("UCfan") ? "fan" : "IVE",
              },
            }),
          } as Response;
        }
        if (url.includes("/api/admin/catalog") && init?.method === "POST") {
          const body = JSON.parse(String(init.body)) as {
            name?: string;
            confirmOfficial?: boolean;
            channelUrl?: string;
          };
          return {
            ok: true,
            json: async () => ({
              ok: true,
              data: {
                id: "group-created",
                group_name: body.name,
                display: true,
                youtube_channel_id: body.confirmOfficial ? "UCxxxxxxxxxxxxxxxxxxxxxx" : null,
                youtube_channel_title: body.confirmOfficial ? "IVE" : null,
              },
            }),
          } as Response;
        }
        if (url.includes("/api/admin/catalog") && init?.method === "PATCH") {
          const body = JSON.parse(String(init.body)) as {
            id?: string;
            type?: string;
            confirmOfficial?: boolean;
            display?: boolean;
            all?: boolean;
          };
          if (body.all) {
            if (body.type === "song") {
              return {
                ok: true,
                json: async () => ({
                  ok: true,
                  data: [visibleSong, hiddenSong].map((song) => ({ ...song, display: body.display })),
                }),
              } as Response;
            }
            return {
              ok: true,
              json: async () => ({
                ok: true,
                data: [ive, unconfirmed].map((group) => ({ ...group, display: body.display })),
              }),
            } as Response;
          }
          if (body.type === "song") {
            const source = body.id === visibleSong.id ? visibleSong : hiddenSong;
            return {
              ok: true,
              json: async () => ({
                ok: true,
                data: {
                  ...source,
                  id: body.id,
                  ...(typeof body.display === "boolean" ? { display: body.display } : {}),
                },
              }),
            } as Response;
          }
          const source = body.id === ive.id ? ive : unconfirmed;
          return {
            ok: true,
            json: async () => ({
              ok: true,
              data: {
                ...source,
                id: body.id,
                ...(typeof body.display === "boolean" ? { display: body.display } : {}),
                youtube_channel_id: body.confirmOfficial ? "UCxxxxxxxxxxxxxxxxxxxxxx" : source.youtube_channel_id,
                youtube_channel_title: body.confirmOfficial ? "IVE" : source.youtube_channel_title,
              },
            }),
          } as Response;
        }
        if (url.includes("/api/admin/catalog")) {
          return {
            ok: true,
            json: async () => ({
              ok: true,
              data: { groups: [ive, unconfirmed], songs: [visibleSong, hiddenSong] },
            }),
          } as Response;
        }
        return { ok: false, json: async () => ({ ok: false, error: "unknown" }) } as Response;
      })
    );
  });

  test("プレビュー前は公式として保存できない", async () => {
    render(<AdminDashboard />);
    fireEvent.click(await screen.findByRole("button", { name: "公式チャンネル" }));
    expect(
      await screen.findByText(/公式チャンネルかどうかは、先に YouTube で自分で確認してください/)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "このチャンネルを公式として保存" })).toBeDisabled();
  });

  test("チャンネル情報を取得したあと、人が確認してから公式として保存する", async () => {
    render(<AdminDashboard />);
    fireEvent.click(await screen.findByRole("button", { name: "公式チャンネル" }));
    fireEvent.change(await screen.findByPlaceholderText("グループ名"), { target: { value: "IVE" } });
    fireEvent.change(screen.getByPlaceholderText("https://www.youtube.com/@..."), {
      target: { value: "@IVEstarship" },
    });
    fireEvent.click(screen.getByRole("button", { name: "チャンネル情報を取得" }));
    expect(await screen.findByText("UCxxxxxxxxxxxxxxxxxxxxxx")).toBeInTheDocument();
    expect(screen.getByText("表示用です。公式かどうかは人が確認したものだけ保存します。")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "このチャンネルを公式として保存" }));
    expect(await screen.findByText("確認済みの公式チャンネルをグループに保存しました")).toBeInTheDocument();

    const posts = vi.mocked(fetch).mock.calls.filter(([, init]) => init?.method === "POST");
    const catalogPost = posts.find(([url]) => String(url).includes("/api/admin/catalog"));
    expect(JSON.parse(String(catalogPost?.[1]?.body))).toMatchObject({
      type: "group",
      name: "IVE",
      channelUrl: "@IVEstarship",
      confirmOfficial: true,
    });
  });

  test("未設定のグループは公式チャンネルと表示しない", async () => {
    render(<AdminDashboard />);
    fireEvent.click(await screen.findByRole("button", { name: "公式チャンネル" }));
    const missingRow = (await screen.findByText("NewJeans")).closest("li");
    const configuredLink = await screen.findByRole("link", { name: "IVEの公式チャンネル" });
    const configuredRow = configuredLink.closest("li");
    expect(missingRow).not.toBeNull();
    expect(configuredRow).not.toBeNull();
    expect(within(missingRow as HTMLElement).getByText("未設定")).toBeInTheDocument();
    expect(within(missingRow as HTMLElement).getByRole("button", { name: "NewJeansのチャンネルを設定" })).toBeInTheDocument();
    expect(within(configuredRow as HTMLElement).getByText("設定済み")).toBeInTheDocument();
    expect(configuredLink).toHaveAttribute("href", "https://www.youtube.com/channel/UCxxxxxxxxxxxxxxxxxxxxxx");
    expect(screen.queryByRole("button", { name: "非表示" })).not.toBeInTheDocument();
  });

  test("表示切替はチャンネル設定と別メニュー", async () => {
    render(<AdminDashboard />);
    fireEvent.click(await screen.findByRole("button", { name: "表示切替" }));
    const iveRow = (await screen.findByRole("checkbox", { name: "IVEを表示" })).closest("li");
    const missingRow = (await screen.findByRole("checkbox", { name: "NewJeansを表示" })).closest("li");
    expect(iveRow).not.toBeNull();
    expect(missingRow).not.toBeNull();
    expect(within(iveRow as HTMLElement).getByText("設定済み")).toBeInTheDocument();
    expect(within(missingRow as HTMLElement).getByText("未設定")).toBeInTheDocument();
    expect(within(iveRow as HTMLElement).getByRole("checkbox", { name: "IVEを表示" })).toBeChecked();
    expect(screen.queryByPlaceholderText("https://www.youtube.com/@...")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "このチャンネルを公式として保存" })).not.toBeInTheDocument();
  });

  test("表示中の項目はチェック済み、非表示は未チェック", async () => {
    render(<AdminDashboard />);
    fireEvent.click(await screen.findByRole("button", { name: "表示切替" }));
    expect(await screen.findByRole("checkbox", { name: "IVEを表示" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "NewJeansを表示" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "LOVE DIVEを表示" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "ELEVENを表示" })).not.toBeChecked();
  });

  test("チェックを外すと非表示になる", async () => {
    render(<AdminDashboard />);
    fireEvent.click(await screen.findByRole("button", { name: "表示切替" }));
    fireEvent.click(await screen.findByRole("checkbox", { name: "IVEを表示" }));
    await waitFor(() => {
      const patches = vi.mocked(fetch).mock.calls.filter(([, init]) => init?.method === "PATCH");
      const displayPatch = patches.find(([url, init]) => {
        if (!String(url).includes("/api/admin/catalog")) return false;
        const body = JSON.parse(String(init?.body)) as { type?: string; display?: boolean };
        return body.type === "group" && body.display === false;
      });
      expect(displayPatch).toBeDefined();
    });
    expect(screen.getByRole("checkbox", { name: "IVEを表示" })).not.toBeChecked();
  });

  test("全非表示でグループをまとめて隠す", async () => {
    render(<AdminDashboard />);
    fireEvent.click(await screen.findByRole("button", { name: "表示切替" }));
    fireEvent.click(await screen.findByRole("button", { name: "グループをすべて非表示" }));
    await waitFor(() => {
      const patches = vi.mocked(fetch).mock.calls.filter(([, init]) => init?.method === "PATCH");
      const bulkPatch = patches.find(([url, init]) => {
        if (!String(url).includes("/api/admin/catalog")) return false;
        const body = JSON.parse(String(init?.body)) as { type?: string; display?: boolean; all?: boolean };
        return body.type === "group" && body.all === true && body.display === false;
      });
      expect(bulkPatch).toBeDefined();
    });
    expect(screen.getByRole("checkbox", { name: "IVEを表示" })).not.toBeChecked();
    expect(screen.getByRole("checkbox", { name: "NewJeansを表示" })).not.toBeChecked();
    expect(await screen.findByText("グループをすべて非表示にしました")).toBeInTheDocument();
  });

  test("全表示で楽曲をまとめて出す", async () => {
    render(<AdminDashboard />);
    fireEvent.click(await screen.findByRole("button", { name: "表示切替" }));
    fireEvent.click(await screen.findByRole("button", { name: "楽曲をすべて表示" }));
    await waitFor(() => {
      const patches = vi.mocked(fetch).mock.calls.filter(([, init]) => init?.method === "PATCH");
      const bulkPatch = patches.find(([url, init]) => {
        if (!String(url).includes("/api/admin/catalog")) return false;
        const body = JSON.parse(String(init?.body)) as { type?: string; display?: boolean; all?: boolean };
        return body.type === "song" && body.all === true && body.display === true;
      });
      expect(bulkPatch).toBeDefined();
    });
    expect(screen.getByRole("checkbox", { name: "LOVE DIVEを表示" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "ELEVENを表示" })).toBeChecked();
  });

  test("表示切替で動画の公開状態が分かる", async () => {
    render(<AdminDashboard />);
    fireEvent.click(await screen.findByRole("button", { name: "表示切替" }));
    expect(await screen.findByRole("checkbox", { name: "IVE danceを表示" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "hidden challengeを表示" })).not.toBeChecked();
  });

  test("動画のチェックを外すと非表示になる", async () => {
    render(<AdminDashboard />);
    fireEvent.click(await screen.findByRole("button", { name: "表示切替" }));
    fireEvent.click(await screen.findByRole("checkbox", { name: "IVE danceを表示" }));
    await waitFor(() => {
      const patches = vi.mocked(fetch).mock.calls.filter(([, init]) => init?.method === "PATCH");
      const displayPatch = patches.find(([url, init]) => {
        if (!String(url).includes("/api/admin/videos")) return false;
        const body = JSON.parse(String(init?.body)) as { id?: string; display?: boolean; all?: boolean };
        return body.id === visibleVideo.id && body.display === false && !body.all;
      });
      expect(displayPatch).toBeDefined();
    });
    expect(screen.getByRole("checkbox", { name: "IVE danceを表示" })).not.toBeChecked();
  });

  test("全非表示で動画をまとめて隠す", async () => {
    render(<AdminDashboard />);
    fireEvent.click(await screen.findByRole("button", { name: "表示切替" }));
    fireEvent.click(await screen.findByRole("button", { name: "動画をすべて非表示" }));
    await waitFor(() => {
      const patches = vi.mocked(fetch).mock.calls.filter(([, init]) => init?.method === "PATCH");
      const bulkPatch = patches.find(([url, init]) => {
        if (!String(url).includes("/api/admin/videos")) return false;
        const body = JSON.parse(String(init?.body)) as { display?: boolean; all?: boolean };
        return body.all === true && body.display === false;
      });
      expect(bulkPatch).toBeDefined();
    });
    expect(screen.getByRole("checkbox", { name: "IVE danceを表示" })).not.toBeChecked();
    expect(screen.getByRole("checkbox", { name: "hidden challengeを表示" })).not.toBeChecked();
    expect(await screen.findByText("動画をすべて非表示にしました")).toBeInTheDocument();
  });

  test("未設定フィルタは公式チャンネルがあるグループを隠す", async () => {
    render(<AdminDashboard />);
    fireEvent.click(await screen.findByRole("button", { name: "公式チャンネル" }));
    fireEvent.click(await screen.findByRole("button", { name: "未設定 1" }));
    expect(screen.getByText("NewJeans")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "IVEの公式チャンネル" })).not.toBeInTheDocument();
  });

  test("確認済み公式チャンネルの動画だけ登録できる", async () => {
    render(<AdminDashboard />);
    await screen.findByRole("heading", { name: "1. YouTube URLを入力" });
    fireEvent.change(screen.getByPlaceholderText("https://www.youtube.com/shorts/..."), {
      target: { value: "https://www.youtube.com/shorts/abcdefghijk" },
    });
    fireEvent.click(screen.getByRole("button", { name: "動画情報を取得" }));
    expect(await screen.findByText("確認済み公式チャンネル: IVE")).toBeInTheDocument();
    expect(submitVideoButton()).toBeEnabled();
  });

  test("未確認チャンネルの動画は登録ボタンを押せない", async () => {
    render(<AdminDashboard />);
    await screen.findByRole("heading", { name: "1. YouTube URLを入力" });
    fireEvent.change(screen.getByPlaceholderText("https://www.youtube.com/shorts/..."), {
      target: { value: "https://www.youtube.com/shorts/fanvideo123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "動画情報を取得" }));
    expect(
      await screen.findByText("確認済みの公式チャンネルではありません。先にグループへ公式チャンネルを保存してください。")
    ).toBeInTheDocument();
    expect(submitVideoButton()).toBeDisabled();
  });
});

const submitVideoButton = () => {
  const buttons = screen.getAllByRole("button", { name: "動画を登録" });
  return buttons[buttons.length - 1];
};
