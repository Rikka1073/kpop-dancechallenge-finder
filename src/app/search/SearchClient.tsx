"use client";

import VideoCard from "@/components/feature/VideoCard";
import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";
import CarouselButton from "@/components/ui/CarouselButton";
import { InitialSearchState, searchPath } from "@/lib/search/initialSearchState";
import { GroupRecord, Record, SongRecord, Videos } from "@/types";
import useEmblaCarousel from "embla-carousel-react";
import { Music, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useMemo } from "react";

function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

function toggleId(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id];
}

const buttonStyles = [
  "bg-primary!",
  "bg-secondary!",
  "bg-accent!",
  "bg-info!",
  "bg-success!",
  "bg-warning!",
  "bg-error!",
];

type SearchClientProps = InitialSearchState & {
  groups: Pick<GroupRecord, "id" | "group_name">[];
  songs: Pick<SongRecord, "id" | "song_name">[];
  total: number;
  page: number;
  pageSize: number;
};

export default function SearchClient({
  groups,
  songs,
  selectedGroups,
  selectedSongs,
  filteredData,
  total,
  page,
  pageSize,
}: SearchClientProps) {
  const router = useRouter();
  const [groupEmblaRef, groupEmblaApi] = useEmblaCarousel({ loop: false });
  const [songEmblaRef, songEmblaApi] = useEmblaCarousel({ loop: false });

  const groupChunks = useMemo(() => chunkArray(groups, 10), [groups]);
  const songChunks = useMemo(() => chunkArray(songs, 10), [songs]);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const groupIds = selectedGroups.map((item) => item.id);
  const songIds = selectedSongs.map((item) => item.id);
  const hasSelection = selectedGroups.length > 0 || selectedSongs.length > 0;

  const go = (next: { groupIds?: string[]; songIds?: string[]; page?: number | null }) => {
    router.replace(
      searchPath({
        groupIds: next.groupIds ?? groupIds,
        songIds: next.songIds ?? songIds,
        page: next.page,
      }),
      { scroll: false }
    );
  };

  return (
    <div className="text-black">
      <Layout>
        <div className="mb-8 text-center">
          <h2 className="mb-3 text-2xl font-bold text-purple-600 md:text-4xl" data-testid="title">
            ダンスチャレンジ検索
          </h2>
          <div className="text-lg md:text-xl">
            グループと楽曲を選んで
            <br className="md:hidden" />
            検索しよう！
          </div>
          <p className="mt-2 text-sm text-gray-600 md:text-base">
            同じ種類はいずれか（OR）、グループと楽曲は両方（AND）
          </p>
        </div>

        <TagCarousel
          title="グループで検索"
          name="groups"
          chunks={groupChunks}
          selectedIds={groupIds}
          getId={(item) => item.id}
          getLabel={(item) => item.group_name}
          onToggle={(id) => go({ groupIds: toggleId(groupIds, id) })}
          emblaRef={groupEmblaRef}
          emblaApi={groupEmblaApi}
        />

        <TagCarousel
          title="楽曲で検索"
          name="songs"
          chunks={songChunks}
          selectedIds={songIds}
          getId={(item) => item.id}
          getLabel={(item) => item.song_name}
          onToggle={(id) => go({ songIds: toggleId(songIds, id) })}
          emblaRef={songEmblaRef}
          emblaApi={songEmblaApi}
        />

        {hasSelection && (
          <div className="mb-8 rounded-lg bg-white p-4 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-xl font-bold">選択中</h4>
              <Button
                onClick={() => go({ groupIds: [], songIds: [] })}
                className="rounded-2xl border bg-white font-bold text-black hover:bg-purple-50 hover:text-red-500 md:border-none"
                id="clear-button"
                name="clear"
              >
                <X />
                クリア
              </Button>
            </div>
            {selectedGroups.length > 0 && (
              <SelectedRow
                icon={<Users className="text-purple-400" />}
                label={selectedGroups.length > 1 ? "グループ（いずれか）" : "グループ"}
                items={selectedGroups}
                onRemove={(id) => go({ groupIds: groupIds.filter((item) => item !== id) })}
              />
            )}
            {selectedGroups.length > 0 && selectedSongs.length > 0 && (
              <p className="mb-3 text-sm font-bold text-purple-600">× 両方に合う動画</p>
            )}
            {selectedSongs.length > 0 && (
              <SelectedRow
                icon={<Music className="text-purple-400" />}
                label={selectedSongs.length > 1 ? "楽曲（いずれか）" : "楽曲"}
                items={selectedSongs}
                onRemove={(id) => go({ songIds: songIds.filter((item) => item !== id) })}
              />
            )}
          </div>
        )}

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xl font-bold md:text-2xl">
              {hasSelection ? "検索結果" : "すべての動画"}（{total}件）
            </h3>
          </div>

          {filteredData.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-y-10 lg:grid-cols-4 xl:grid-cols-5">
                {filteredData.map((video: Videos) => (
                  <div key={video.id}>
                    <VideoCard video={video} />
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-3">
                  {page > 1 && (
                    <Button id="prev-page" onClick={() => go({ page: page - 1 })}>
                      前へ
                    </Button>
                  )}
                  {page < totalPages && (
                    <Button id="next-page" onClick={() => go({ page: page + 1 })}>
                      次へ
                    </Button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="py-10">
              <p className="mb-4 text-center text-xl font-bold">条件に一致する動画が見つかりませんでした</p>
              <p className="text-md text-center font-bold">別の条件で検索してみてください</p>
            </div>
          )}
        </div>
      </Layout>
    </div>
  );
}

function TagCarousel<T>({
  title,
  name,
  chunks,
  selectedIds,
  getId,
  getLabel,
  onToggle,
  emblaRef,
  emblaApi,
}: {
  title: string;
  name: string;
  chunks: T[][];
  selectedIds: string[];
  getId: (item: T) => string;
  getLabel: (item: T) => string;
  onToggle: (id: string) => void;
  emblaRef: (node: HTMLElement | null) => void;
  emblaApi?: { scrollPrev: () => void; scrollNext: () => void };
}) {
  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xl font-bold md:text-2xl">{title}</h3>
        {chunks.length > 1 && <CarouselButton emblaApi={emblaApi} />}
      </div>
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {chunks.map((chunk, slideIndex) => (
            <div key={slideIndex} className="embla__slide">
              <div className="grid grid-cols-2 gap-2 p-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {chunk.map((item, index) => {
                  const id = getId(item);
                  const selected = selectedIds.includes(id);
                  return (
                    <div key={id}>
                      <Button
                        id={id}
                        name={name}
                        onClick={() => onToggle(id)}
                        className={`${selected ? `border-none text-white shadow-none hover:text-white active:text-white ${buttonStyles[index % buttonStyles.length]}` : ""}`}
                      >
                        #{getLabel(item)}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SelectedRow({
  icon,
  label,
  items,
  onRemove,
}: {
  icon: ReactNode;
  label: string;
  items: Record[];
  onRemove: (id: string) => void;
}) {
  return (
    <div className="mb-3">
      <div className="mb-2 flex items-center gap-2">
        {icon}
        <span className="font-bold">{label}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onRemove(item.id)}
            className="flex items-center gap-1 rounded-full bg-pink-100 px-3 py-1 text-sm text-pink-700 hover:bg-pink-200"
            aria-label={`${item.name}を外す`}
          >
            #{item.name}
            <X className="size-3" />
          </button>
        ))}
      </div>
    </div>
  );
}
