"use client";

import Header from "@/components/feature/Header";
import VideoCard from "@/components/feature/VideoCard";
import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";
import { fetchGroups, fetchSongs, getAllVideos, getMatchedGroupId } from "@/libs/supabaseFunction";
import { Record, Videos } from "@/types";
import useEmblaCarousel from "embla-carousel-react";
import { Music, Users, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";

const Search = () => {
  const [selectedItems, setSelectedItems] = useState<Record[]>([]);
  const [selectedButton, setSelectedButton] = useState<string>("songs");
  const [filteredData, setFilteredData] = useState<Videos[]>([]);
  const { data: videos, error: videosError, isLoading: videosLoading } = useSWR("videos", getAllVideos);
  const { data: songs, error: songsError, isLoading: songsLoading } = useSWR("songs", fetchSongs);
  const { data: groups, error: groupsError, isLoading: groupsLoading } = useSWR("groups", fetchGroups);
  const isLoading = songsLoading || videosLoading || groupsLoading;
  const isError = songsError || videosError || groupsError;
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

  // //初期表示の動画データ
  useEffect(() => {
    if (videos) {
      setFilteredData(videos);
    }
  }, [videos]);

  const chankArray = <T,>(array: T[], chunkSize: number): T[][] => {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  };

  const limitedButton = useMemo(() => {
    if (selectedButton === "songs" && songs) {
      return chankArray(songs, 10);
    } else if (selectedButton === "groups" && groups) {
      return chankArray(groups, 10);
    }
    return [];
  }, [groups, songs, selectedButton]);

  useEffect(() => {
    if (emblaApi) {
      console.log(emblaApi.slideNodes()); // Access API
    }
  }, [emblaApi, limitedButton]);

  // Embla Carousel navigation functions
  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  const onclickButton = async (id: string, select: string, event: React.MouseEvent<HTMLButtonElement>) => {
    const buttonName = event.currentTarget.name;
    setSelectedItems((prev) => {
      const isSelected = prev.some((item) => item.id === id);
      if (isSelected) {
        // 既に選択されている場合は削除
        return prev.filter((item) => item.id !== id);
      } else {
        // 新たに選択する場合は追加
        return [{ id, name: select }];
      }
    });

    try {
      const filteredData = await getMatchedGroupId(id, buttonName);
      setFilteredData(filteredData ?? []);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
      setFilteredData([]);
    }
  };

  const onClickSelectButton = (type: string) => {
    if (type === "songs") {
      setSelectedButton("songs");
      setSelectedItems([]);
      setFilteredData(videos || []);
    } else if (type === "groups") {
      setSelectedButton("groups");
      setSelectedItems([]);
      setFilteredData(videos || []);
    }
  };

  const onclickClear = () => {
    setSelectedItems([]);
    setFilteredData(videos || []);
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

  if (isError) return <div>Error loading data</div>;

  return (
    <div className="text-black">
      <Header />
      <Layout>
        <h2 className="mb-3 text-center text-2xl font-bold text-violet-500 md:text-4xl" data-testid="title">
          ダンスチャレンジ検索
        </h2>
        <div className="mb-8 text-center text-xl md:text-xl">
          お気に入りの楽曲やグループを選んで
          <br className="md:hidden" />
          検索しよう！
        </div>

        <div className="mb-8 flex justify-center">
          <div className="flex w-full flex-col gap-2 rounded-lg bg-white p-4 md:w-auto md:flex-row">
            <Button
              id="songs-button"
              className={`btn-lg border-none hover:bg-purple-50 hover:text-purple-400 active:bg-white active:text-black ${selectedButton === "songs" && "bg-gradient-to-r from-purple-600 to-pink-600 text-white transition-all hover:text-white active:text-white"} `}
              onClick={() => onClickSelectButton("songs")}
            >
              <Music />
              楽曲で検索
            </Button>
            <Button
              className={`btn-lg border-none hover:bg-purple-50 hover:text-purple-400 active:bg-white active:text-black ${selectedButton === "groups" && "bg-gradient-to-r from-purple-600 to-pink-600 text-white transition-all hover:text-white active:text-white"}`}
              onClick={() => onClickSelectButton("groups")}
            >
              <Users />
              グループで検索
            </Button>
          </div>
        </div>

        {selectedButton === "songs" && (
          <div className="mb-8">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xl font-bold md:text-2xl">楽曲で検索</h3>
              {limitedButton.length > 1 && (
                <div className="flex gap-2">
                  <button
                    onClick={scrollPrev}
                    className="rounded-full bg-white p-2 text-gray-600 shadow-lg transition-all hover:bg-gray-50 hover:text-purple-600"
                    aria-label="前へ"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={scrollNext}
                    className="rounded-full bg-white p-2 text-gray-600 shadow-lg transition-all hover:bg-gray-50 hover:text-purple-600"
                    aria-label="次へ"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
            <div className="embla" ref={emblaRef}>
              <div className="embla__container">
                {limitedButton.map((chunk, slideIndex) => (
                  <div key={slideIndex} className="embla__slide">
                    <div className="grid grid-cols-2 gap-2 p-2 md:w-full md:grid-cols-5">
                      {chunk.map((item, index) => (
                        <div key={item.id}>
                          <Button
                            key={item.id}
                            id={item.id}
                            name="songs"
                            onClick={(event) => onclickButton(item.id, item.song_name, event)}
                            className={`hover:text-black active:text-black ${
                              selectedItems.some((selected) => selected.id === item.id) &&
                              `border-none text-white shadow-none hover:text-white active:text-white ${buttonStyles[index % buttonStyles.length]}`
                            }`}
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

        {selectedButton === "groups" && (
          <div className="mb-8">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xl font-bold md:text-2xl">グループで検索</h3>
              {limitedButton.length > 1 && (
                <div className="flex gap-2">
                  <button
                    onClick={scrollPrev}
                    className="rounded-full bg-white p-2 text-gray-600 shadow-lg transition-all hover:bg-gray-50 hover:text-purple-600"
                    aria-label="前へ"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={scrollNext}
                    className="rounded-full bg-white p-2 text-gray-600 shadow-lg transition-all hover:bg-gray-50 hover:text-purple-600"
                    aria-label="次へ"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
            <div className="embla" ref={emblaRef}>
              <div className="embla__container">
                {limitedButton.map((chunk, slideIndex) => (
                  <div key={slideIndex} className="embla__slide">
                    <div className="grid grid-cols-2 gap-2 p-2 md:w-full md:grid-cols-5">
                      {chunk.map((item, index) => (
                        <div key={item.id}>
                          <Button
                            id={item.id}
                            name="groups"
                            onClick={(event) => onclickButton(item.id, item.group_name, event)}
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

        {selectedItems.length > 0 && (
          <div className="mb-8 rounded-lg bg-white p-4 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedButton === "songs" ? (
                  <Music className="text-purple-400" />
                ) : (
                  <Users className="text-purple-400" />
                )}
                <h4 className="text-lg font-bold">選択中の{selectedButton === "songs" ? "楽曲" : "グループ"}</h4>
              </div>
              <Button
                onClick={onclickClear}
                className="rounded-2xl border-none! bg-white font-bold text-black hover:bg-purple-50 hover:text-red-500"
                id="clear-button"
                name="clear"
              >
                <X />
                すべてクリア
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedItems &&
                selectedItems.map((selectedItem) => (
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
              {selectedItems.length > 0 ? "検索結果" : "すべての動画"}（{filteredData.length}件）
            </h3>
          </div>

          {filteredData && filteredData.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {filteredData.map((video: Videos) => (
                <div key={video.id} className="mb-4">
                  <VideoCard video={video} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10">
              <p className="mb-4 text-center text-xl font-bold">条件に一致する動画が見つかりませんでした</p>
              <p className="text-md text-center font-bold">別の条件で検索してみてください</p>
            </div>
          )}
        </div>
        {isLoading && (
          <div className="flex items-center justify-center">
            <span className="loading loading-spinner text-primary loading-xl"></span>
          </div>
        )}
      </Layout>
    </div>
  );
};

export default Search;
