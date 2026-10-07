import { VIDEO_STATIC_PLACEHOLDER_ID } from "@/lib/video/videoIdFromPath";
import VideoDetail from "./VideoDetail";

export function generateStaticParams() {
  return [{ id: VIDEO_STATIC_PLACEHOLDER_ID }];
}

export default function Videos() {
  return <VideoDetail />;
}
