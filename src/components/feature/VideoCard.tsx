import { VideoCardProps } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const VideoCard = ({ video }: VideoCardProps) => {
  const { title, thumbnail_url, view_count, video_groups, video_songs } = video;

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
    <Link href={`/videos/${video.id}`}>
      <div className="rounded-2xl transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105">
        <div className="card rounded-2xl">
          <div className="relative">
            <figure>
              <Image src={thumbnail_url || "https://via.placeholder.com/360x640"} alt={title} width={360} height={640} className="w-full aspect-[9/16] object-cover rounded-t-2xl" />
            </figure>
            <div className="absolute bottom-2 left-2 badge badge-xs md:badge-sm font-bold badge-neutral">{formatViewCount(view_count)} viwes</div>
          </div>

          <div className="card-body rounded-2xl p-3 md:p-5">
            <h2 className="card-title mb-6 line-clamp-2 text-sm md:text-lg">{title}</h2>
            <div className="card-actions">
              <div className="flex items-center gap-2 mb-2">
                {video_groups.map((badge) => (
                  <div className="bg-fuchsia-100 text-purple-600 font-bold badge badge-xs md:badge-md" key={badge.groups.id}>
                    <span>{badge.groups.group_name}</span>
                  </div>
                ))}
              </div>
              {video_songs.map((badge) => (
                <div className="bg-red-100 text-red-600 font-bold badge badge-xs md:badge-md" key={badge.songs.id}>
                  <span>#{badge.songs.song_name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
