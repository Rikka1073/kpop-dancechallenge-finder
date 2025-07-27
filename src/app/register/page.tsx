"use client";
import Header from "@/components/feature/Header";
import Layout from "@/components/layout/Layout";
import { getAllVideos, registerVideo } from "@/libs/supabaseFunction";
import { RegisterInputs } from "@/types";
import { useForm, SubmitHandler } from "react-hook-form";
import { vi } from "vitest";
import { a } from "vitest/dist/chunks/suite.d.FvehnV49.js";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInputs>();

  const onSubmit: SubmitHandler<RegisterInputs> = async (data) => {
    console.log(data);
    const youtubeVideoId = data.youtubeVideoId.match(/shorts\/([a-zA-Z0-9_-]+)/);
    if (youtubeVideoId) {
      const videoId = youtubeVideoId[1];
      const existingVideos = await checkVideoExists(videoId);
      if (existingVideos) {
        console.log("動画はすでに登録されています");
        alert("動画はすでに登録されています");
        return;
      }
      await fetchYouTubeVideoData(videoId);
    } else {
      console.error("YouTube ShortsのURLを正しく入力してください");
    }
  };

  const checkVideoExists = async (youtubeVideoId: string) => {
    const registeredVideo = await getAllVideos();
    if (registeredVideo?.some((video) => video.youtube_id === youtubeVideoId)) {
      return true;
    }
  };
  // YouTube APIから動画情報を取得するためのサンプルコード
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
  };

  return (
    <div>
      <Header />
      <Layout>
        <div className="mb-6 text-center">
          <h2 className="mb-3 text-2xl font-bold text-purple-600 md:text-4xl">動画登録管理</h2>
          <p className="text-lg md:text-xl">YouTube URLを入力して動画を自動登録</p>
        </div>
        <div className="flex items-center justify-center px-60">
          <div className="flex w-full flex-col gap-2 rounded-2xl bg-white p-4">
            <p className="font-bold">YouTube URL</p>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="https://"
                {...register("youtubeVideoId", { required: true })}
                className="input input-lg w-full focus-within:border-none focus:outline-purple-600"
              />
              {errors.youtubeVideoId && <span className="font-bold text-red-500">入力必須です</span>}
              <p>YouTube ShortsのURLを入力してください</p>
              <input
                type="submit"
                value="動画情報を登録"
                className="btn-lg w-full rounded-2xl border-none bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-lg text-white md:text-xl"
              />
            </form>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Register;
