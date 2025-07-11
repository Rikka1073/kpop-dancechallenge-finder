"use client";

import VideoCard from "@/components/feature/VideoCard";
import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";
import { fetchGroups, fetchSongs, getAllVideos, getMatchedGroupId } from "@/libs/supabaseFunction";
import { Record, Videos } from "@/types";
import { useEffect, useState } from "react";
import useSWR from "swr";

const Search = () => {
  const [selectedItems, setSelectedItems] = useState<Record[]>([]);
  const [filteredData, setFilteredData] = useState<Videos[]>([]);
  const { data: videos, error: videosError, isLoading: videosLoading } = useSWR("videos", getAllVideos);
  const { data: songs, error: songsError, isLoading: songsLoading } = useSWR("songs", fetchSongs);
  const { data: groups, error: groupsError, isLoading: groupsLoading } = useSWR("groups", fetchGroups);
  const isLoading = songsLoading || videosLoading || groupsLoading;
  const isError = songsError || videosError || groupsError;

  // //初期表示の動画データ
  useEffect(() => {
    if (videos) {
      setFilteredData(videos);
    }
  }, [videos]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  const onclickButton = async (id: string, select: string, event: React.MouseEvent<HTMLButtonElement>) => {
    const buttonName = event.currentTarget.name;
    setSelectedItems((prev) => {
      const isSelected = prev.some((item) => item.id === id);
      if (isSelected) {
        // 既に選択されている場合は削除
        return prev.filter((item) => item.id !== id);
      } else {
        // 新たに選択する場合は追加
        return [...prev, { id, name: select }];
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

  const onclickClear = () => {
    setSelectedItems([]);
    setFilteredData(videos || []);
  };

  return (
    <div>
      <Layout>
        <h2 className="text-4xl font-bold mb-3 text-center text-violet-500" data-testid="title">
          ダンスチャレンジ検索
        </h2>
        <div className="text-center mb-6">お気に入りの楽曲やグループを選んで検索しよう！</div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-3">楽曲で検索</h3>
          <div className="flex flex-wrap gap-2">
            {songs && songs.map((item) => <Button key={item.id} id={item.id} name="songs" text={item.song_name} onClick={(event) => onclickButton(item.id, item.song_name, event)} />)}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-3">グループで検索</h3>
          <div className="flex flex-wrap gap-2">
            <div className="flex flex-wrap gap-2">
              {groups && groups.map((item) => <Button key={item.id} id={item.id} name="groups" text={item.group_name} onClick={(event) => onclickButton(item.id, item.group_name, event)} />)}
            </div>
          </div>
        </div>

        {selectedItems.length > 0 && (
          <div className="mb-8 bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xl font-bold">選択中の条件</h4>
              <Button onClick={onclickClear} className="hover:text-red-500 hover:bg-purple-50 font-bold bg-white text-black p-2" id="clear-button" name="clear" text="すべてクリア" />
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedItems &&
                selectedItems.map((selectedItem) => (
                  <div key={selectedItem.id} className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm">
                    {selectedItem.name}
                  </div>
                ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex justify-between mb-4 items-center">
            <h3 className="text-2xl font-bold mb-3">検索結果（{filteredData.length}件）</h3>
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
      </Layout>
    </div>
  );
};

export default Search;
