import Header from "@/components/feature/Header";
import { ArrowRight, Check, Heart, Play, Search, Star, TrendingUp, X } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const featureCards = [
    {
      id: 1,
      title: "簡単検索",
      description:
        "楽曲名やグループ名で瞬時に動画を検索。お気に入りのアーティストのダンスチャレンジがすぐに見つかります。",
      icon: <Search className="h-8 w-8 text-purple-600" />,
    },
    {
      id: 2,
      title: "ショート動画",
      description: "TikTok風の縦型ショート動画で、サクサク視聴。移動中でも気軽にK-POPダンスを楽しめます。",
      icon: <Play className="h-8 w-8 text-purple-600" />,
    },
    {
      id: 3,
      title: "視聴体験",
      description: "YouTubeでの視聴も可能。高画質でダンスパフォーマンスを楽しめます。",
      icon: <Heart className="h-8 w-8 text-purple-600" />,
    },
  ];

  const steps = [
    {
      id: 1,
      number: "01",
      title: "検索方法を選択",
      description: "楽曲検索またはグループ検索を選んでください",
      color: "from-purple-500 to-purple-600",
    },
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

  const painPoints = [
    {
      icon: <X className="text-red-500" />,
      text: '"IZ*ONE ダンスチャレンジ"で検索しても公式MVばかり',
    },
    {
      icon: <X className="text-red-500" />,
      text: "一般人の踊ってみた動画が混ざって見つからない",
    },
    {
      icon: <X className="text-red-500" />,
      text: "好きなグループの新しいダンス動画を毎回探すのが面倒",
    },
  ];

  const solutions = [
    {
      icon: <Check className="text-green-500" />,
      text: "アイドルのダンスチャレンジだけを厳選収録",
    },
    {
      icon: <Check className="text-green-500" />,
      text: "アイドルの公式ダンスチャレンジだけを厳選収録",
    },
    {
      icon: <Check className="text-green-500" />,
      text: "ワンタップで推しグループの動画一覧",
    },
  ];

  return (
    <div className="text-black">
      <Header />
      <section>
        <div className="sparkle-bg p-4 py-20 text-center">
          <div className="container mx-auto">
            <div className="mx-auto max-w-5xl">
              <h1 className="gradient-text mb-6 text-5xl font-bold" data-testid="home-title">
                K-POPダンス
                <br className="md:hidden" />
                チャレンジ
                <br />
                検索アプリ
              </h1>
              <p className="mb-6 text-lg md:text-xl">
                アイドル同士が踊るショート形式の
                <br className="md:hidden" />
                ダンスチャレンジ動画を
                <br />
                <span className="font-bold text-purple-600">簡単に検索・視聴</span>できるWebアプリ
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  href="/search"
                  className="btn btn-lg md:btn-xl btn-ghost flex gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-lg text-white transition-all hover:text-white active:bg-purple-100 active:text-purple-400"
                >
                  今すぐはじめる
                  <Play />
                </Link>
                <Link
                  href="/search"
                  className="btn btn-lg btn-outline md:btn-xl rounded-2xl text-lg text-purple-600 hover:bg-purple-600 hover:text-white"
                >
                  詳しく見る
                  <ArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="concept">
        <div className="bg-white px-4 py-20">
          <div className="container mx-auto">
            <div className="mx-auto max-w-5xl">
              <div className="mb-16 text-center">
                <div className="mb-4">
                  <span className="inline-block rounded-2xl bg-purple-200 px-3 py-2">PROBLEM & SOLUTION</span>
                </div>
                <h2 className="mb-6 text-4xl font-bold">こんな経験ありませんか？</h2>
              </div>
              <div className="mx-auto mb-12 grid max-w-6xl items-start gap-12 md:grid-cols-2">
                <div>
                  <h3 className="mb-8 flex items-center text-3xl font-bold text-red-600">
                    <X className="mr-3 flex-shrink-0" />
                    <span>よくある困りごと</span>
                  </h3>
                  <div className="space-y-6">
                    {painPoints.map((point, index) => (
                      <div
                        key={index}
                        className="flex h-22 items-center space-x-4 rounded-xl border border-red-100 bg-red-50 p-4"
                      >
                        <div className="mt-1 flex-shrink-0">{point.icon}</div>
                        <p className="text-lg leading-relaxed">{point.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-8 flex items-center text-3xl font-bold text-green-600">
                    <Check className="mr-3 flex-shrink-0" />
                    <span>このサイトなら解決！</span>
                  </h3>
                  <div className="space-y-6">
                    {solutions.map((solution, index) => (
                      <div
                        key={index}
                        className="flex h-22 items-center space-x-4 rounded-xl border border-green-100 bg-green-50 p-4"
                      >
                        <div className="mt-1 flex-shrink-0">{solution.icon}</div>
                        <p className="text-lg leading-relaxed">{solution.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-purple-600 md:text-xl">
                  あなたの「見たい」がきっと見つかる場所です
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="p-4 py-20">
          <div className="container mx-auto">
            <div className="mx-auto max-w-5xl">
              <div className="mb-10 text-center">
                <div className="mb-4">
                  <span className="inline-block rounded-2xl bg-purple-200 px-3 py-2">FEATURES</span>
                </div>
                <h2 className="mb-6 text-4xl font-bold">3つの特徴</h2>
                <p className="text-xl md:text-xl">K-POPダンスチャレンジを最高に楽しむための機能をご紹介</p>
              </div>
              <div className="grid flex-grow gap-8 md:grid-cols-3">
                {featureCards &&
                  featureCards.map((feature) => (
                    <div key={feature.id} className="flex">
                      <div className="h-full w-full rounded-3xl bg-white p-8 text-center shadow-xl">
                        <div className="m-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100">
                          {feature.icon}
                        </div>
                        <h3 className="mb-2 text-3xl font-bold">{feature.title}</h3>
                        <p className="text-lg">{feature.description}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="bg-white p-4 py-20">
          <div className="container mx-auto">
            <div className="mx-auto max-w-5xl">
              <div className="mb-10 text-center">
                <div className="mb-4">
                  <span className="inline-block rounded-2xl bg-purple-200 px-3 py-2">HOW TO USE</span>
                </div>
                <h2 className="mb-6 text-2xl font-bold md:text-4xl">使い方は簡単3ステップ</h2>
                <p className="text-xl md:text-xl">誰でも直感的に使える設計で、すぐにお気に入りの動画が見つかります</p>
              </div>
              {steps.map((step, index) => (
                <div key={step.id} className="mb-12 flex items-center last:mb-0">
                  <div className="mr-8 flex-shrink-0">
                    <div
                      className={`h-20 w-20 bg-gradient-to-r ${step.color} flex items-center justify-center rounded-2xl shadow-xl`}
                    >
                      <span className="text-xl font-bold text-white">{step.number}</span>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="mb-2 text-3xl font-bold">{step.title}</h3>
                    <p className="text-lg md:text-xl">{step.description}</p>
                  </div>
                  {index < steps.length - 1 ? (
                    <div className="ml-8 hidden md:block">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg">
                        <ArrowRight className="text-gray-300" />
                      </div>
                    </div>
                  ) : (
                    <div className="ml-8 hidden md:block">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
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

      <section className="px-4 py-20">
        <div className="container mx-auto">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600">
                <Star className="text-white" />
              </div>
            </div>
            <h2 className="mb-6 text-4xl font-bold md:text-5xl">今すぐK-POPダンスの世界へ</h2>
            <p className="mb-8 text-lg leading-relaxed md:text-xl">
              あなたが探していたあの動画、見たことのない新しいコラボレーション。
              <br />
              すべてがここで見つかります。
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/search"
                className="btn btn-lg md:btn-xl btn-ghost flex gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-lg text-white transition-all hover:text-white"
              >
                今すぐはじめる
                <Search />
              </Link>
              <Link
                href="/search"
                className="btn btn-lg btn-outline md:btn-xl rounded-2xl text-lg text-purple-600 hover:bg-purple-600 hover:text-white"
              >
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
