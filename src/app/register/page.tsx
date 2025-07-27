"use client";
import Header from "@/components/feature/Header";
import Layout from "@/components/layout/Layout";
import { RegisterInputs } from "@/types";
import { useForm, SubmitHandler } from "react-hook-form";

const Register = () => {
  const onClickRegisterButton = () => {
    // console.log(url);
  };

  // const videoUrl = "https://www.youtube.com/shorts/7rEWKNzngtE";
  // const newUrl = videoUrl.match(/shorts\/([a-zA-Z0-9_-]+)/);
  // console.log(newUrl);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInputs>();
  const onSubmit: SubmitHandler<RegisterInputs> = (data) => console.log(data);

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
                onClick={onClickRegisterButton}
              />
            </form>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Register;
