import { absoluteUrl } from "@/lib/seo/site";
import { getAllVideos } from "@/lib/supabase/supabaseFunction";
import type { MetadataRoute } from "next";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/search"), changeFrequency: "hourly", priority: 0.9 },
    { url: absoluteUrl("/terms"), changeFrequency: "yearly", priority: 0.3 },
  ];

  let videos: { id: string }[] = [];
  try {
    videos = await getAllVideos();
  } catch {
    videos = [];
  }

  return [
    ...staticRoutes,
    ...videos.map((video) => ({
      url: absoluteUrl(`/videos/${video.id}`),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];
}
