import { getVideoById } from "@/lib/supabase/supabaseFunction";
import { notFound } from "next/navigation";
import VideoDetail from "./VideoDetail";

export const revalidate = 60;
export const dynamicParams = true;

type VideoPageProps = {
  params: Promise<{ id: string }>;
};

export default async function Videos({ params }: VideoPageProps) {
  const { id } = await params;
  const video = await getVideoById(id);

  if (!video) {
    notFound();
  }

  return <VideoDetail video={video} />;
}
