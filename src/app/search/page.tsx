"use client";

import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";
import { fetchGroups, fetchSongs, getAllVideos } from "@/libs/supabaseFunction";
import useSWR from "swr";

const Search = () => {
  const { data: videos, error: videosError, isLoading: videosLoading } = useSWR("videos", getAllVideos);
  const { data: songs, error: songsError, isLoading: songsLoading } = useSWR("songs", fetchSongs);
  const { data: groups, error: groupsError, isLoading: groupsLoading } = useSWR("groups", fetchGroups);
  const isLoading = songsLoading || videosLoading || groupsLoading;
  const isError = songsError || videosError || groupsError;

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  return (
    <div>
      <Layout>
        <h2 className="text-4xl font-bold mb-3 text-center text-violet-500" data-testid="title">
          ダンスチャレンジ検索
        </h2>
        <div className="text-center mb-6">お気に入りの楽曲やグループを選んで検索しよう！</div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-3">楽曲で検索</h3>
          <div className="flex flex-wrap gap-2">{songs && songs.map((item) => <Button key={item.id} id={item.id} name="songs" text={item.song_name} />)}</div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-3">グループで検索</h3>
          <div className="flex flex-wrap gap-2">
            <div className="flex flex-wrap gap-2">{groups && groups.map((item) => <Button key={item.id} id={item.id} name="songs" text={item.group_name} />)}</div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Search;
