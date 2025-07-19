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
      <div className="transform rounded-2xl shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl">
        <div className="card rounded-2xl">
          <div className="relative">
            <figure>
              <Image
                src={thumbnail_url || "https://via.placeholder.com/360x640"}
                alt={title}
                width={360}
                height={640}
                className="aspect-[9/16] w-full rounded-t-2xl object-cover"
              />
            </figure>
            <div className="badge badge-xs md:badge-sm badge-neutral absolute bottom-2 left-2 font-bold">
              {formatViewCount(view_count)} viwes
            </div>
          </div>
          <div className="card-body rounded-b-2xl bg-white p-3 md:p-5">
            <h2 className="card-title mb-6 line-clamp-2 text-sm md:text-lg">{title}</h2>
            <div className="card-actions">
              <div className="mb-2 flex items-center gap-2">
                {video_groups.map((badge) => (
                  <div
                    className="badge badge-xs md:badge-md border-none bg-fuchsia-100 font-bold text-purple-600"
                    key={badge.groups.id}
                  >
                    <span>{badge.groups.group_name}</span>
                  </div>
                ))}
              </div>
              {video_songs.map((badge) => (
                <div
                  className="badge badge-xs md:badge-md border-none bg-red-100 font-bold text-red-600"
                  key={badge.songs.id}
                >
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
