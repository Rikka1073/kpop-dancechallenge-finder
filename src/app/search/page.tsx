"use client";

import Header from "@/components/feature/Header";
import VideoCard from "@/components/feature/VideoCard";
import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";
import { fetchGroups, fetchSongs, getAllVideos, getMatchedGroupId } from "@/libs/supabaseFunction";
import { Record, Videos } from "@/types";
import useEmblaCarousel from "embla-carousel-react";
import { Music, Users, ChevronLeft, ChevronRight } from "lucide-react";
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

  const buttonStyles = ["bg-primary!", "bg-secondary!", "bg-accent!", "bg-info!", "bg-success!", "bg-warning!", "bg-error!"];

  if (isError) return <div>Error loading data</div>;

  return (
    <div className="text-black">
      <Header />
      <Layout>
        <h2 className="text-2xl md:text-4xl font-bold mb-3 text-center text-violet-500" data-testid="title">
          ダンスチャレンジ検索
        </h2>
        <div className="text-center mb-8">お気に入りの楽曲やグループを選んで検索しよう！</div>

        <div className="flex justify-center mb-8">
          <div className="flex flex-col md:flex-row gap-2 bg-white p-4 rounded-lg w-full md:w-auto">
            <Button
              id="songs-button"
              className={`btn-lg hover:bg-purple-50 hover:text-purple-400 border-none active:bg-purple-100 active:text-purple-400
                ${selectedButton === "songs" && "transition-all bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:text-white active:text-white"} `}
              onClick={() => onClickSelectButton("songs")}
            >
              <Music />
              楽曲で検索
            </Button>
            <Button
              className={`btn-lg hover:bg-purple-50  hover:text-purple-400 border-none active:bg-purple-100 active:text-purple-400
                ${selectedButton === "groups" && "transition-all bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:text-white active:text-white"}`}
              onClick={() => onClickSelectButton("groups")}
            >
              <Users />
              グループで検索
            </Button>
          </div>
        </div>

        {selectedButton === "songs" && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl md:text-2xl font-bold">楽曲で検索</h3>
              {limitedButton.length > 1 && (
                <div className="flex gap-2">
                  <button onClick={scrollPrev} className="bg-white hover:bg-gray-50 text-gray-600 hover:text-purple-600 rounded-full p-2 shadow-lg transition-all" aria-label="前へ">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={scrollNext} className="bg-white hover:bg-gray-50 text-gray-600 hover:text-purple-600 rounded-full p-2 shadow-lg transition-all" aria-label="次へ">
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
            <div className="embla" ref={emblaRef}>
              <div className="embla__container">
                {limitedButton.map((chunk, slideIndex) => (
                  <div key={slideIndex} className="embla__slide">
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-5 md:w-full p-2">
                      {chunk.map((item, index) => (
                        <div key={item.id}>
                          <Button
                            key={item.id}
                            id={item.id}
                            name="songs"
                            onClick={(event) => onclickButton(item.id, item.song_name, event)}
                            className={`hover:text-black active:text-black ${
                              selectedItems.some((selected) => selected.id === item.id) &&
                              `text-white shadow-none border-none hover:text-white active:text-white ${buttonStyles[index % buttonStyles.length]}`
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
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl md:text-2xl font-bold">グループで検索</h3>
              {limitedButton.length > 1 && (
                <div className="flex gap-2">
                  <button onClick={scrollPrev} className="bg-white hover:bg-gray-50 text-gray-600 hover:text-purple-600 rounded-full p-2 shadow-lg transition-all" aria-label="前へ">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={scrollNext} className="bg-white hover:bg-gray-50 text-gray-600 hover:text-purple-600 rounded-full p-2 shadow-lg transition-all" aria-label="次へ">
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
            <div className="embla" ref={emblaRef}>
              <div className="embla__container">
                {limitedButton.map((chunk, slideIndex) => (
                  <div key={slideIndex} className="embla__slide">
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-5 md:w-full p-2">
                      {chunk.map((item, index) => (
                        <div key={item.id}>
                          <Button
                            id={item.id}
                            name="groups"
                            onClick={(event) => onclickButton(item.id, item.group_name, event)}
                            className={`${selectedItems.some((selected) => selected.id === item.id) && `text-white shadow-none border-none ${buttonStyles[index % buttonStyles.length]}`}`}
                          >
                            {item.group_name}
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
          <div className="mb-8 bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                {selectedButton === "songs" ? <Music className="text-purple-400" /> : <Users className="text-purple-400" />}
                <h4 className="text-lg font-bold">選択中の{selectedButton === "songs" ? "楽曲" : "グループ"}</h4>
              </div>
              <Button onClick={onclickClear} className="hover:text-red-500 hover:bg-purple-50 font-bold bg-white text-black rounded-2xl border-none!" id="clear-button" name="clear">
                すべてクリア
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedItems &&
                selectedItems.map((selectedItem) => (
                  <div key={selectedItem.id} className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm">
                    #{selectedItem.name}
                  </div>
                ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex justify-between mb-3 items-center">
            <h3 className="text-xl md:text-2xl font-bold">
              {selectedItems.length > 0 ? "検索結果" : "すべての動画"}（{filteredData.length}件）
            </h3>
          </div>

          {filteredData && filteredData.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {filteredData.map((video: Videos) => (
                <div key={video.id} className="mb-4">
                  <VideoCard video={video} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10">
              <p className="font-bold text-xl text-center mb-4">条件に一致する動画が見つかりませんでした</p>
              <p className="font-bold text-md text-center">別の条件で検索してみてください</p>
            </div>
          )}
        </div>
        {isLoading && (
          <div className="flex justify-center items-center">
            <span className="loading loading-spinner text-primary loading-xl"></span>
          </div>
        )}
      </Layout>
    </div>
  );
};

export default Search;
