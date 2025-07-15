import Header from "@/components/feature/Header";
import { ArrowRight, Check, Heart, Play, Search, Star, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const featureCards = [
    {
      id: 1,
      title: "簡単検索",
      description: "楽曲名やグループ名で瞬時に動画を検索。お気に入りのアーティストのダンスチャレンジがすぐに見つかります。",
      icon: <Search className="w-8 h-8 text-purple-600" />,
    },
    {
      id: 2,
      title: "ショート動画",
      description: "TikTok風の縦型ショート動画で、サクサク視聴。移動中でも気軽にK-POPダンスを楽しめます。",
      icon: <Play className="w-8 h-8 text-purple-600" />,
    },
    {
      id: 3,
      title: "視聴体験",
      description: "YouTubeでの視聴も可能。高画質でダンスパフォーマンスを楽しめます。",
      icon: <Heart className="w-8 h-8 text-purple-600" />,
    },
  ];

  const steps = [
    { id: 1, number: "01", title: "検索方法を選択", description: "楽曲検索またはグループ検索を選んでください", color: "from-purple-500 to-purple-600" },
    {
      id: 2,
      number: "02",
      title: "お気に入りを選択",
      description: "好きな楽曲やグループをクリックして選択",
      color: "from-pink-500 to-pink-600",
    },
    {
      id: 3,
      number: "03",
      title: "動画を楽しむ",
      description: "検索結果から動画を選んで視聴開始！",
      color: "from-blue-500 to-blue-600",
    },
  ];

  return (
    <div className="text-black">
      <Header />
      <section>
        <div className="text-center py-20 p-4 sparkle-bg">
          <div className="container mx-auto">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-5xl font-bold mb-6 gradient-text" data-testid="home-title">
                K-POPダンス
                <br className="md:hidden" />
                チャレンジ
                <br />
                検索アプリ
              </h1>
              <p className="mb-6 md:text-2xl">
                アイドル同士が踊るショート形式の
                <br className="md:hidden" />
                ダンスチャレンジ動画を
                <br />
                <span className="text-purple-600 font-bold">簡単に検索・視聴</span>できるWebアプリ
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/search" className="btn btn-lg md:btn-xl btn-ghost rounded-2xl gap-2 flex transition-all bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:text-white text-lg">
                  今すぐはじめる
                  <Play />
                </Link>
                <Link href="/search" className="btn btn-lg btn-outline md:btn-xl hover:bg-purple-600 text-purple-600 rounded-2xl hover:text-white text-lg">
                  詳しく見る
                  <ArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="py-20 p-4 bg-white">
          <div className="container mx-auto">
            <div className="max-w-5xl mx-auto">
              <div className="mb-10 text-center">
                <div className="mb-4">
                  <span className="px-3 py-2 bg-purple-200 rounded-2xl">CONCEPT</span>
                </div>
                <h2 className="text-4xl mb-6 font-bold">K-POPダンスの新しい楽しみ方</h2>
                <p className="md:text-xl">
                  異なるグループのアーティスト同士がコラボレーションするダンスチャレンジ動画。 <br />
                  従来では見ることのできない貴重な組み合わせを、いつでもどこでも楽しめます。
                </p>
              </div>
              <div className="grid gap-8 md:grid-cols-2">
                <div className="md:text-left text-center">
                  <h3 className="text-3xl mb-6 font-bold">なぜこのサイトが生まれたのか？</h3>
                  <div className="space-y-4 md:text-left text-center md:text-lg">
                    <p>K-POPファンなら誰もが夢見る「もしあのグループとあのグループがコラボしたら...」 そんな願いを叶えるダンスチャレンジ動画が、SNSに散らばって見つけにくい現状がありました。</p>
                    <p>このサイトは、そんな貴重なコラボレーション動画を一箇所に集め、 楽曲やグループから簡単に検索できるプラットフォームとして誕生しました。</p>
                    <p className="text-purple-600 font-bold">あなたの「見たい」がきっと見つかる場所です。</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 shadow-xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl p-4 shadow-lg">
                      <div className="w-full aspect-[9/16] bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
                        <Play className="text-white" />
                      </div>
                      <p className="text-sm font-semibold mt-2">NewJeans × LE SSERAFIM</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-lg">
                      <div className="w-full aspect-[9/16] bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl flex items-center justify-center">
                        <Play className="text-white" />
                      </div>
                      <p className="text-sm font-semibold mt-2">IVE × aespa</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="py-20 p-4">
          <div className="container mx-auto">
            <div className="max-w-5xl mx-auto">
              <div className="mb-10 text-center">
                <div className="mb-4">
                  <span className="px-3 py-2 bg-purple-200 rounded-2xl">FEATURES</span>
                </div>
                <h2 className="text-4xl mb-6 font-bold">3つの特徴</h2>
                <p className="md:text-xl">K-POPダンスチャレンジを最高に楽しむための機能をご紹介</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8 flex-grow">
                {featureCards &&
                  featureCards.map((feature) => (
                    <div key={feature.id} className="flex">
                      <div className="bg-white rounded-3xl p-8 shadow-xl text-center h-full w-full">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center m-auto mb-4">{feature.icon}</div>
                        <h3 className="text-3xl font-bold mb-2">{feature.title}</h3>
                        <p className="text-gray-600 md:text-lg">{feature.description}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="py-20 p-4 bg-white">
          <div className="container mx-auto">
            <div className="max-w-5xl mx-auto">
              <div className="mb-10 text-center">
                <div className="mb-4">
                  <span className="px-3 py-2 bg-purple-200 rounded-2xl">HOW TO USE</span>
                </div>
                <h2 className="text-4xl mb-6 font-bold">使い方は簡単3ステップ</h2>
                <p>誰でも直感的に使える設計で、すぐにお気に入りの動画が見つかります</p>
              </div>
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center mb-12 last:mb-0">
                  <div className="flex-shrink-0 mr-8">
                    <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center shadow-xl`}>
                      <span className="text-white font-bold text-xl">{step.number}</span>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-lg">{step.description}</p>
                  </div>
                  {index < steps.length - 1 ? (
                    <div className="hidden md:block ml-8">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <ArrowRight className="text-gray-300" />
                      </div>
                    </div>
                  ) : (
                    <div className="hidden md:block ml-8">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                        <Check className="text-gray-300" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
                <Star className="text-white" size={32} />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">今すぐK-POPダンスの世界へ</h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              あなたが探していたあの動画、見たことのない新しいコラボレーション。
              <br />
              すべてがここで見つかります。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/search" className="btn btn-lg md:btn-xl btn-ghost rounded-2xl gap-2 flex transition-all bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:text-white text-lg">
                今すぐはじめる
                <Search />
              </Link>
              <Link href="/search" className="btn btn-lg btn-outline md:btn-xl hover:bg-purple-600 text-purple-600 rounded-2xl hover:text-white text-lg">
                人気動画を見る
                <TrendingUp />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
