import { SITE_NAME } from "@/lib/seo/site";
import { getVideoById } from "@/lib/supabase/supabaseFunction";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import VideoDetail from "./VideoDetail";

export const revalidate = 60;
export const dynamicParams = true;

type VideoPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: VideoPageProps): Promise<Metadata> {
  const { id } = await params;
  const video = await getVideoById(id);

  if (!video) {
    return { title: "ページが見つかりませんでした" };
  }

  const title = video.title;
  const description = `${title} の公式ダンスチャレンジを SeeKPOP で見る`;

  return {
    title: { absolute: `${title} | ${SITE_NAME}` },
    description,
    alternates: { canonical: `/videos/${id}` },
    openGraph: {
      type: "video.other",
      title,
      description,
      url: `/videos/${id}`,
      images: video.thumbnail_url ? [{ url: video.thumbnail_url }] : undefined,
    },
  };
}

export default async function Videos({ params }: VideoPageProps) {
  const { id } = await params;
  const video = await getVideoById(id);

  if (!video) {
    notFound();
  }

  return <VideoDetail video={video} />;
}
