import Layout from "@/components/layout/Layout";
import { getInitialSearchState } from "@/lib/search/initialSearchState";
import { fetchGroups, fetchSongs, getAllVideos } from "@/lib/supabase/supabaseFunction";
import { Videos } from "@/types";
import SearchClient from "./SearchClient";

export const revalidate = 60;

type SearchPageProps = {
  searchParams: Promise<{ type?: string; id?: string }>;
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
  let groups: Awaited<ReturnType<typeof fetchGroups>>;
  let songs: Awaited<ReturnType<typeof fetchSongs>>;

  try {
    [videos, groups, songs] = await Promise.all([
      getAllVideos() as Promise<Videos[]>,
      fetchGroups(),
      fetchSongs(),
    ]);
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

  return <SearchClient videos={videos} groups={groups} songs={songs} {...initial} />;
}
