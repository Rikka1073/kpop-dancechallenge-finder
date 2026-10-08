import { fireEvent, render, screen, within } from "@testing-library/react";
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
        if (url.includes("/api/admin/videos")) {
          return { ok: true, json: async () => ({ ok: true, data: [] }) } as Response;
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
          const body = JSON.parse(String(init.body)) as { id?: string; confirmOfficial?: boolean };
          return {
            ok: true,
            json: async () => ({
              ok: true,
              data: {
                ...unconfirmed,
                id: body.id,
                youtube_channel_id: body.confirmOfficial ? "UCxxxxxxxxxxxxxxxxxxxxxx" : null,
                youtube_channel_title: body.confirmOfficial ? "IVE" : null,
              },
            }),
          } as Response;
        }
        if (url.includes("/api/admin/catalog")) {
          return {
            ok: true,
            json: async () => ({ ok: true, data: { groups: [ive, unconfirmed], songs: [] } }),
          } as Response;
        }
        return { ok: false, json: async () => ({ ok: false, error: "unknown" }) } as Response;
      })
    );
  });

  test("プレビュー前は公式として保存できない", async () => {
    render(<AdminDashboard />);
    fireEvent.click(await screen.findByRole("button", { name: "グループ / 楽曲" }));
    expect(
      await screen.findByText(/公式チャンネルかどうかは、先に YouTube で自分で確認してください/)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "このチャンネルを公式として保存" })).toBeDisabled();
  });

  test("チャンネル情報を取得したあと、人が確認してから公式として保存する", async () => {
    render(<AdminDashboard />);
    fireEvent.click(await screen.findByRole("button", { name: "グループ / 楽曲" }));
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
    fireEvent.click(await screen.findByRole("button", { name: "グループ / 楽曲" }));
    const row = (await screen.findByText("NewJeans")).closest("li");
    expect(row).not.toBeNull();
    expect(within(row as HTMLElement).getByText("公式チャンネル未設定")).toBeInTheDocument();
    expect(screen.getByText("確認済み: IVE")).toBeInTheDocument();
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
