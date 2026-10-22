import formatViewCount from "@/lib/formatViewCount";
import { videoJsonLd } from "@/lib/seo/site";
import { getVideoById } from "@/lib/supabase/supabaseFunction";
import { GroupDetail, SongDetail } from "@/types";
import { ArrowLeft, Youtube } from "lucide-react";
import Link from "next/link";

type VideoDetailProps = {
  video: NonNullable<Awaited<ReturnType<typeof getVideoById>>>;
};

export default function VideoDetail({ video }: VideoDetailProps) {
  const jsonLd = videoJsonLd(video);

  return (
    <div className="text-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Link href="/search" className="link mb-4 flex gap-2 font-bold no-underline hover:text-purple-400">
          <ArrowLeft />
          検索に戻る
        </Link>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="flex justify-center lg:col-span-2">
            <iframe
              src={`https://www.youtube.com/embed/${video.youtube_id}?autoplay=1&mute=1`}
              title={video.title}
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
                {video.video_groups.map((group: GroupDetail) => (
                  <div key={group.groups.id} className="badge border-none bg-fuchsia-100 font-bold text-purple-600">
                    <Link href={`/search?type=group&id=${group.groups.id}`}>{group.groups.group_name}</Link>
                  </div>
                ))}
              </div>
              <h3 className="text-md mb-3 font-bold text-gray-600">楽曲</h3>
              <div className="mb-2">
                {video.video_songs.map((song: SongDetail) => (
                  <div key={song.songs.id} className="badge border-none bg-red-100 font-bold text-red-600">
                    <Link href={`/search?type=song&id=${song.songs.id}`}>{song.songs.song_name}</Link>
                  </div>
                ))}
              </div>
              <div className="mb-3 border-b-2 border-b-gray-300 pb-3 text-gray-600">
                {formatViewCount(video.view_count)} views
              </div>
              <div>
                このダンスチャレンジ動画は、
                {video.video_groups.map((group: GroupDetail) => group.groups.group_name).join("と")}
                によるコラボレーション作品です。 楽曲「
                {video.video_songs.map((song: SongDetail) => song.songs.song_name)}
                」に合わせた素晴らしいパフォーマンスをお楽しみください。
              </div>
              <div>
                <Link
                  href={`https://www.youtube.com/shorts/${video.youtube_id}/`}
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
}
