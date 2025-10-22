import Header from "@/components/feature/Header";
import formatViewCount from "@/libs/formatViewCount";
import { getAllVideos } from "@/libs/supabase/supabaseFunction";
import { GroupDetail, SongDetail } from "@/types";
import { ArrowLeft, Youtube } from "lucide-react";
import Link from "next/link";

export async function generateStaticParams() {
  const videos = await getAllVideos();

  if (!videos) {
    return [];
  }
  return videos.map((video) => ({
    id: video.id,
  }));
}

const Videos = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  console.log("Fetching video with ID:", id);
  const data = await getAllVideos().then((data) => (data ? data.find((video) => video.id === id) : undefined));

  console.log(data);
  if (!data) {
    return <div>Loading...</div>;
  } else if (data.error) {
    return <div>Error loading video</div>;
  }

  return (
    <div className="text-black">
      <Header />
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Link href="/search" className="link mb-4 flex gap-2 font-bold no-underline hover:text-purple-400">
          <ArrowLeft />
          検索に戻る
        </Link>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="flex justify-center lg:col-span-2">
            <iframe
              src={`https://www.youtube.com/embed/${data.youtube_id}?autoplay=1&mute=1`}
              title={data.title}
              frameBorder="0"
              allow="accelerometer; autoplay 1; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="aspect-[9/16] h-auto w-full max-w-sm rounded-2xl"
            />
          </div>
          <div className="lg:col-span-1">
            <div className="w-full rounded-2xl bg-white p-4 shadow-lg">
              <h2 className="mb-4 text-lg font-bold">動画情報</h2>
              <h3 className="text-md mb-3 font-bold text-gray-600">参加アーティスト</h3>
              <div className="mb-2 flex flex-wrap gap-2">
                {data.video_groups.map((group: GroupDetail) => (
                  <div key={group.groups.id} className="badge border-none bg-fuchsia-100 font-bold text-purple-600">
                    <Link href={`/groups/${group.groups.id}`}>{group.groups.group_name}</Link>
                  </div>
                ))}
              </div>
              <h3 className="text-md mb-3 font-bold text-gray-600">楽曲</h3>
              <div className="mb-2">
                {data.video_songs.map((song: SongDetail) => (
                  <div key={song.songs.id} className="badge border-none bg-red-100 font-bold text-red-600">
                    <Link href={`/songs/${song.songs.id}`}>{song.songs.song_name}</Link>
                  </div>
                ))}
              </div>
              <div className="mb-3 border-b-2 border-b-gray-300 pb-3 text-gray-600">
                {formatViewCount(data.view_count)} viwes
              </div>
              <div>
                このダンスチャレンジ動画は、
                {data.video_groups.map((group: GroupDetail) => group.groups.group_name).join("と")}
                によるコラボレーション作品です。 楽曲「
                {data.video_songs.map((song: SongDetail) => song.songs.song_name)}
                」に合わせた素晴らしいパフォーマンスをお楽しみください。
              </div>
              <div>
                <Link
                  href={`https://www.youtube.com/shorts/${data.youtube_id}/`}
                  target="_blank"
                  className="btn mt-4 w-full bg-red-600 font-bold text-white"
                >
                  <Youtube />
                  YouTubeで視聴
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Videos;
