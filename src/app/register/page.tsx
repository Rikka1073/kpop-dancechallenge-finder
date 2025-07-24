import Header from "@/components/feature/Header";
import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";

const page = () => {
  return (
    <div>
      <Header />
      <Layout>
        <div className="text-center">
          <h2>動画登録管理</h2>
          <p>YouTube URLを入力して動画を自動登録</p>
        </div>
        <div className="flex items-center justify-center px-60">
          <div className="flex w-full flex-col gap-2 rounded-2xl bg-white p-4">
            <p className="font-bold">YouTube URL</p>
            <input
              type="text"
              placeholder="Type here"
              className="input input-lg w-full focus-within:border-none focus:outline-purple-600"
            />
            <p>YouTube動画またはShortsのURLを入力してください</p>
            <Button
              id="songs-button"
              className="btn-lg border-none bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              // onClick={() => onClickSelectButton("songs")}
            >
              楽曲で検索
            </Button>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default page;
