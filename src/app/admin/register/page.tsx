"use client";
import Header from "@/components/feature/Header";
import Layout from "@/components/layout/Layout";
import {
  fetchGroups,
  fetchSongs,
  getAllRegisteredVideos,
  registerVideoGroup,
  registerVideoSong,
} from "@/libs/supabaseFunction";
import { RegisterInputs } from "@/types";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import useSWR from "swr";

const AdminPage = () => {
  const { data: videos } = useSWR("videos", getAllRegisteredVideos);
  const { data: songs } = useSWR("songs", fetchSongs);
  const { data: groups } = useSWR("groups", fetchGroups);
  const { register, handleSubmit } = useForm<RegisterInputs>();

  const onSubmit: SubmitHandler<RegisterInputs> = async (data) => {
    console.log("Submitted data:", data);
    await registerVideoGroup(data);
    await registerVideoSong(data);
  };

  return (
    <div>
      <Header />
      <Layout>
        <div className="flex items-center justify-center">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="flex justify-center lg:col-span-2">
              <div className="flex w-full flex-col gap-2 rounded-2xl bg-white p-4">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">未登録動画</legend>
                    <select
                      defaultValue="未登録動画"
                      className="select select-lg w-full focus-within:border-none focus:outline-purple-600"
                      {...register("videoId")}
                    >
                      <option disabled={true}>未登録動画</option>
                      {videos &&
                        videos.map((video: { id: string; group_name: string }) => (
                          <option key={video.id}>{video.id}</option>
                        ))}
                    </select>
                  </fieldset>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">グループ1</legend>
                    <select
                      defaultValue="グループ1"
                      className="select select-lg w-full focus-within:border-none focus:outline-purple-600"
                      {...register("firstGroupId")}
                    >
                      <option disabled={true}>グループ1</option>
                      {groups &&
                        groups.map((group: { id: string; group_name: string }) => (
                          <option key={group.id}>{group.group_name}</option>
                        ))}
                    </select>
                  </fieldset>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">グループ2</legend>
                    <select
                      defaultValue="グループ2"
                      className="select select-lg w-full focus-within:border-none focus:outline-purple-600"
                      {...register("secondGroupId")}
                    >
                      <option disabled={true}>グループ2</option>
                      {groups &&
                        groups.map((group: { id: string; group_name: string }) => (
                          <option key={group.id}>{group.group_name}</option>
                        ))}
                    </select>
                  </fieldset>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">曲</legend>
                    <select
                      defaultValue="曲"
                      className="select select-lg w-full focus-within:border-none focus:outline-purple-600"
                      {...register("songId")}
                    >
                      <option disabled={true}>曲</option>
                      {songs &&
                        songs.map((song: { id: string; song_name: string }) => (
                          <option key={song.id}>{song.song_name}</option>
                        ))}
                    </select>
                  </fieldset>
                  <input
                    type="submit"
                    value="動画情報を登録"
                    className="btn-lg w-full rounded-2xl border-none bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-lg text-white md:text-xl"
                  />
                </form>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="w-full rounded-2xl bg-white p-4 shadow-lg">
                <h2 className="mb-4 text-lg font-bold">未登録動画一覧</h2>
                {videos && (
                  <div>
                    {videos.map((video) => (
                      <div key={video.id}>
                        <Link
                          href={`https://www.youtube.com/shorts/${video.youtube_id}`}
                          className="link no-underline hover:text-purple-400"
                          target="_blank"
                        >
                          <div className="mb-2">{video.id}</div>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default AdminPage;
