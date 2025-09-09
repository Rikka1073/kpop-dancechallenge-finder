import VideoCard from "@/components/feature/VideoCard";
import { render, screen } from "@testing-library/react";

describe("カードコンポーネントのテスト", () => {
  test("正常にレンダリングされること", () => {
    render(
      <VideoCard
        video={{
          id: "test-id",
          youtube_id: "test-youtube-id",
          title: "Test Video",
          thumbnail_url: "http://example.com/video.mp4",
          view_count: 1000,
          video_groups: [],
          video_songs: [],
        }}
      />
    );
    expect(screen.getByTestId("video-card")).toBeInTheDocument();
    expect(screen.getByTestId("video-thumbnail")).toBeInTheDocument();
    expect(screen.getByTestId("view-count")).toBeInTheDocument();
    expect(screen.getByTestId("video-title")).toBeInTheDocument();
  });
});
