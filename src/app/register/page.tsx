"use client";
import Header from "@/components/feature/Header";
import Layout from "@/components/layout/Layout";
import { getAllRegisteredVideos, registerVideo } from "@/libs/supabase/registerSupabaseFunction";
import { RegisterInputs } from "@/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

const Register = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterInputs>();
  const [completed, setCompleted] = useState(false);
  const [existingVideos, setExistingVideos] = useState(false);

  const onSubmit: SubmitHandler<RegisterInputs> = async (data) => {
    console.log(data);
    const youtubeVideoId = data.videoId.match(/shorts\/([a-zA-Z0-9_-]+)/);
    if (youtubeVideoId) {
      const videoId = youtubeVideoId[1];
      const existingVideos = await checkVideoExists(videoId);
      if (existingVideos) {
        console.log("動画はすでに登録されています");
        setCompleted(false);
        setExistingVideos(true);
        reset();
        return;
      } else {
        setCompleted(true);
        setExistingVideos(false);
        reset();
      }
      await fetchYouTubeVideoData(videoId);
    } else {
      console.error("YouTube ShortsのURLを正しく入力してください");
    }
  };

  const checkVideoExists = async (youtubeVideoId: string) => {
    const registeredVideo = await getAllRegisteredVideos();
    console.log("registeredVideo", youtubeVideoId);
    if (registeredVideo?.some((video) => video.youtube_id === youtubeVideoId)) {
      return true;
    }
    return false;
  };

  // YouTube APIから動画情報を取得
  const fetchYouTubeVideoData = async (id: string) => {
    const videoId = id;
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apiKey}`
    );

    const videosData = await response.json();
    console.log("videosData", videosData.items[0].id);
    registerVideo({
      id: videosData.items[0].id,
      title: videosData.items[0].snippet.title,
      thumbnailUrl: videosData.items[0].snippet.thumbnails.maxres.url,
      viewCount: videosData.items[0].statistics.viewCount,
    });

    return;
  };

  return (
    <div>
      <Header />
      <Layout>
        <Link href="/" className="link mb-4 flex gap-2 font-bold no-underline hover:text-purple-400">
          <ArrowLeft />
          TOPへ戻る
        </Link>
        <div className="mb-6 text-center">
          <h2 className="mb-3 text-2xl font-bold text-purple-600 md:text-4xl">動画登録管理</h2>
          <p className="text-lg md:text-xl">YouTube URLを入力して動画を自動登録</p>
        </div>
        <div className="m-auto flex w-full items-center justify-center md:w-3xl">
          <div className="flex w-full flex-col gap-2 rounded-2xl bg-white p-4">
            <p className="font-bold">YouTube URL</p>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="https://"
                {...register("videoId", { required: true })}
                className="input input-lg w-full focus-within:border-none focus:outline-purple-600"
              />
              {errors.videoId && <span className="font-bold text-red-500">入力必須です</span>}
              <p>YouTube ShortsのURLを入力してください</p>
              <input
                type="submit"
                value="動画情報を登録"
                className="btn-lg w-full rounded-2xl border-none bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-lg text-white md:text-xl"
              />
            </form>
          </div>
        </div>
        {completed && (
          <div className="mt-4 text-center">
            <p className="text-lg text-green-600">
              動画の登録が完了しました！
              <br />
              反映までしばらくお待ちください。
            </p>
          </div>
        )}
        {existingVideos && (
          <div className="mt-4 text-center">
            <p className="text-lg text-red-600">動画はすでに登録されています</p>
          </div>
        )}
      </Layout>
    </div>
  );
};

export default Register;
