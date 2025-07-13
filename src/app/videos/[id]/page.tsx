import Header from "@/components/feature/Header";
import { getAllVideos } from "@/libs/supabaseFunction";
import { GroupDetail, SongDetail } from "@/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const Videos = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  console.log("Fetching video with ID:", id);
  const data = await getAllVideos().then((data) => (data ? data.find((video) => video.id === id) : undefined));

  console.log(data);
  if (!data) {
    return <div>Loading...</div>;
  } else if (data.error) {
    return <div>Error loading video</div>;
  }

  // view_countのフォーマット関数
  const formatViewCount = (views: number) => {
    if (views >= 1000000) {
      const formattedViews = (views / 1000000).toFixed(1) + "M";
      return formattedViews;
    } else if (views >= 1000) {
      const formattedViews = (views / 1000).toFixed(1) + "K";
      return formattedViews;
    } else {
      return views.toString();
    }
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Link href="/search" className="link flex gap-2 no-underline font-bold hover:text-purple-400 mb-4">
          <ArrowLeft />
          検索に戻る
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex justify-center">
            {/* <div className="flex flex-col md:flex-row justify-center gap-4"> */}
            <iframe
              src={`https://www.youtube.com/embed/${data.youtube_id}`}
              title={data.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="rounded-2xl w-full max-w-sm h-auto aspect-[9/16]"
            />
            {/* </div> */}
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white p-4 rounded-2xl shadow-lg w-full">
              <h2 className="text-lg font-bold mb-4">動画情報</h2>
              <h3 className="text-md font-bold text-gray-600 mb-3">参加アーティスト</h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {data.video_groups.map((group: GroupDetail) => (
                  <div key={group.groups.id} className="badge bg-fuchsia-100 text-purple-600 font-bold">
                    {group.groups.group_name}
                  </div>
                ))}
              </div>
              <h3 className="text-md font-bold text-gray-600 mb-3">楽曲</h3>
              <div className="mb-2">
                {data.video_songs.map((song: SongDetail) => (
                  <div key={song.songs.id} className="badge bg-red-100 text-red-600 font-bold">
                    {song.songs.song_name}
                  </div>
                ))}
              </div>
              <div className="text-gray-600 border-b-2 border-b-gray-300 pb-3 mb-3">{formatViewCount(data.view_count)} viwes</div>
              <div>
                このダンスチャレンジ動画は、{data.video_groups.map((group: GroupDetail) => group.groups.group_name).join("と")}によるコラボレーション作品です。 楽曲「
                {data.video_songs.map((song: SongDetail) => song.songs.song_name)}」に合わせた素晴らしいパフォーマンスをお楽しみください。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Videos;
