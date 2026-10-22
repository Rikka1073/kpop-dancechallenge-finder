"use client";

import VideoCard from "@/components/feature/VideoCard";
import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";
import CarouselButton from "@/components/ui/CarouselButton";
import { InitialSearchState, SearchButton, searchPath } from "@/lib/search/initialSearchState";
import { GroupRecord, SongRecord, Videos } from "@/types";
import useEmblaCarousel from "embla-carousel-react";
import { Music, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

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
  selectedButton,
  selectedItems,
  filteredData,
  total,
  page,
  pageSize,
}: SearchClientProps) {
  const router = useRouter();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

  const groupChunks = useMemo(() => chunkArray(groups, 10), [groups]);
  const songChunks = useMemo(() => chunkArray(songs, 10), [songs]);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const selectedId = selectedItems[0]?.id ?? null;

  const go = (type?: SearchButton | null, id?: string | null, nextPage?: number | null) => {
    router.replace(searchPath(type, id, nextPage), { scroll: false });
  };

  const onclickItem = (type: SearchButton, id: string) => {
    const isSelected = selectedItems.some((item) => item.id === id);
    go(type, isSelected ? null : id);
  };

  const buttonStyles = [
    "bg-primary!",
    "bg-secondary!",
    "bg-accent!",
    "bg-info!",
    "bg-success!",
    "bg-warning!",
    "bg-error!",
  ];

  return (
    <div className="text-black">
      <Layout>
        <div className="mb-8 text-center">
          <h2 className="mb-3 text-2xl font-bold text-purple-600 md:text-4xl" data-testid="title">
            ダンスチャレンジ検索
          </h2>
          <div className="text-lg md:text-xl">
            お気に入りの楽曲やグループを選んで
            <br className="md:hidden" />
            検索しよう！
          </div>
        </div>

        <div className="mb-8 flex justify-center">
          <div className="flex w-full flex-col gap-2 rounded-lg bg-white p-4 md:w-auto md:flex-row">
            <Button
              id="groups-button"
              className={`btn-lg border-none hover:bg-purple-50 hover:text-purple-400 ${selectedButton === "groups" && "bg-gradient-to-r from-purple-600 to-pink-600 text-white transition-all hover:text-white"}`}
              onClick={() => go("groups")}
            >
              <Users />
              グループで検索
            </Button>
            <Button
              id="songs-button"
              className={`btn-lg border-none hover:bg-purple-50 hover:text-purple-400 ${selectedButton === "songs" && "bg-gradient-to-r from-purple-600 to-pink-600 text-white transition-all hover:text-white"} `}
              onClick={() => go("songs")}
            >
              <Music />
              楽曲で検索
            </Button>
          </div>
        </div>

        {selectedButton === "groups" && (
          <div className="mb-8">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xl font-bold md:text-2xl">グループで検索</h3>
              {groupChunks.length > 1 && <CarouselButton emblaApi={emblaApi} />}
            </div>
            <div className="embla" ref={emblaRef}>
              <div className="embla__container">
                {groupChunks.map((chunk, slideIndex) => (
                  <div key={slideIndex} className="embla__slide">
                    <div className="grid grid-cols-2 gap-2 p-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                      {chunk.map((item, index) => (
                        <div key={item.id}>
                          <Button
                            id={item.id}
                            name="groups"
                            onClick={() => onclickItem("groups", item.id)}
                            className={`${selectedItems.some((selected) => selected.id === item.id) && `border-none text-white shadow-none ${buttonStyles[index % buttonStyles.length]}`}`}
                          >
                            #{item.group_name}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedButton === "songs" && (
          <div className="mb-8">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xl font-bold md:text-2xl">楽曲で検索</h3>
              {songChunks.length > 1 && <CarouselButton emblaApi={emblaApi} />}
            </div>
            <div className="embla" ref={emblaRef}>
              <div className="embla__container">
                {songChunks.map((chunk, slideIndex) => (
                  <div key={slideIndex} className="embla__slide">
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                      {chunk.map((item, index) => (
                        <div key={item.id}>
                          <Button
                            key={item.id}
                            id={item.id}
                            name="songs"
                            onClick={() => onclickItem("songs", item.id)}
                            className={`${selectedItems.some((selected) => selected.id === item.id) && `border-none text-white shadow-none hover:text-white active:text-white ${buttonStyles[index % buttonStyles.length]}`}`}
                          >
                            #{item.song_name}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedItems.length > 0 && (
          <div className="mb-8 rounded-lg bg-white p-4 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedButton === "songs" ? (
                  <Music className="text-purple-400" />
                ) : (
                  <Users className="text-purple-400" />
                )}
                <h4 className="text-xl font-bold">選択中の{selectedButton === "songs" ? "楽曲" : "グループ"}</h4>
              </div>
              <Button
                onClick={() => go()}
                className="rounded-2xl border bg-white font-bold text-black hover:bg-purple-50 hover:text-red-500 md:border-none"
                id="clear-button"
                name="clear"
              >
                <X />
                クリア
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedItems.map((selectedItem) => (
                <div key={selectedItem.id} className="rounded-full bg-pink-100 px-3 py-1 text-sm text-pink-700">
                  #{selectedItem.name}
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xl font-bold md:text-2xl">
              {selectedItems.length > 0 ? "検索結果" : "すべての動画"}（{total}件）
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
                    <Button id="prev-page" onClick={() => go(selectedButton, selectedId, page - 1)}>
                      前へ
                    </Button>
                  )}
                  {page < totalPages && (
                    <Button id="next-page" onClick={() => go(selectedButton, selectedId, page + 1)}>
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
