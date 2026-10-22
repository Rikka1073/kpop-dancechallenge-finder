import Layout from "@/components/layout/Layout";
import { getInitialSearchState, parseSearchPage } from "@/lib/search/initialSearchState";
import { fetchGroups, fetchSongs, searchPublicVideos } from "@/lib/supabase/supabaseFunction";
import { Videos } from "@/types";
import type { Metadata } from "next";
import SearchClient from "./SearchClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "ダンスチャレンジ検索",
  description: "グループ名や楽曲名を選んで、K-POPアイドル公式のダンスチャレンジ動画を検索できます。",
  alternates: { canonical: "/search" },
};

type SearchPageProps = {
  searchParams: Promise<{ type?: string; id?: string; page?: string }>;
};

function SearchError() {
  return (
    <div className="text-black">
      <Layout>
        <div className="rounded-3xl bg-white p-8 text-center shadow-lg">
          <h2 className="mb-3 text-2xl font-bold text-purple-600">データを読み込めませんでした</h2>
          <p className="text-gray-600">時間をおいてから、もう一度お試しください。</p>
        </div>
      </Layout>
    </div>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;

  let videos: Videos[];
  let total: number;
  let page: number;
  let pageSize: number;
  let groups: Awaited<ReturnType<typeof fetchGroups>>;
  let songs: Awaited<ReturnType<typeof fetchSongs>>;

  try {
    const [result, fetchedGroups, fetchedSongs] = await Promise.all([
      searchPublicVideos({
        queryType: params.type,
        queryId: params.id,
        page: parseSearchPage(params.page),
      }),
      fetchGroups(),
      fetchSongs(),
    ]);
    videos = result.videos as Videos[];
    total = result.total;
    page = result.page;
    pageSize = result.pageSize;
    groups = fetchedGroups;
    songs = fetchedSongs;
  } catch {
    return <SearchError />;
  }

  const initial = getInitialSearchState({
    videos,
    groups,
    songs,
    queryType: params.type,
    queryId: params.id,
  });

  return (
    <SearchClient groups={groups} songs={songs} total={total} page={page} pageSize={pageSize} {...initial} />
  );
}
