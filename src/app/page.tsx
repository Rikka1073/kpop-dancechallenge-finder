import Footer from "@/components/feature/Footer";
import Header from "@/components/feature/Header";
import { ArrowRight, Check, Heart, Play, Search, Shield, Star, TrendingUp, X, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const featureCards = [
    {
      id: 1,
      title: "ワンタップ検索",
      description: "複雑な検索キーワードは不要。グループ名をタップするだけで、関連するダンス動画が瞬時に表示されます。",
      icon: <Zap className="h-8 w-8 text-purple-600" />,
    },
    {
      id: 2,
      title: "厳選公式コラボ動画",
      description:
        "アイドル同士のダンスチャレンジのみを厳選収録。一般人の動画や宣伝動画は完全除外で、質の高いコンテンツだけをお届け。",
      icon: <Shield className="h-8 w-8 text-red-600" />,
    },
    {
      id: 3,
      title: "推し活サポート",
      description:
        "好きなグループの動画を一覧で管理。1タップで推しの全ダンス動画にアクセスでき、新着動画も見逃しません。",
      icon: <Heart className="h-8 w-8 text-rose-700" />,
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
        <div className="sparkle-bg py-10 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-7xl">
              <div className="grid items-center gap-12 md:grid-cols-2">
                {/* 左側: テキスト */}
                <div className="order-2 text-center md:order-1 md:text-left">
                  <h1 className="gradient-text mb-6 text-5xl font-bold md:text-6xl">SeeKPOP</h1>
                  <p className="mb-4 text-2xl font-bold md:text-3xl">
                    推しのダンスチャレンジが
                    <br />
                    一瞬で見つかる
                  </p>
                  <p className="mb-8 text-lg text-gray-700">
                    グループ名をタップするだけ。
                    <br />
                    アイドル公式コラボ動画を簡単検索
                  </p>
                  <Link
                    href="/search"
                    className="link mb-8 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-lg text-white no-underline transition-all hover:text-white md:w-xs"
                  >
                    今すぐはじめる
                    <Play />
                  </Link>
                  <Link
                    href="#concept"
                    className="link flex items-center justify-center rounded-2xl border border-purple-600 p-4 text-lg text-purple-600 no-underline hover:bg-purple-600 hover:text-white md:w-xs"
                  >
                    詳しく見る
                    <ArrowRight />
                  </Link>
                </div>

                {/* 右側: GIF */}
                <div className="order-1 md:order-2">
                  <div className="relative mx-auto max-w-sm">
                    <video
                      src="/howto-seekpop.mp4"
                      width={400}
                      height={800}
                      className="h-auto w-full rounded-2xl shadow-2xl"
                      autoPlay
                      loop
                      muted
                    />
                  </div>
                </div>
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
                <h2 className="mb-6 text-4xl font-bold" data-testid="first-subTitle">
                  こんな経験ありませんか？
                </h2>
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
                        <p className="text-lg leading-relaxed text-gray-600">{point.text}</p>
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
                        <p className="text-lg leading-relaxed text-gray-600">{solution.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-purple-600 md:text-xl">あなたの「見たい」が見つかる場所です</p>
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
                <h2 className="mb-6 text-4xl font-bold" data-testid="second-subTitle">
                  3つの特徴
                </h2>
                <p className="text-xl md:text-xl">K-POPダンスチャレンジを最高に楽しむための機能をご紹介</p>
              </div>
              <div className="grid flex-grow gap-8 md:grid-cols-3">
                {featureCards &&
                  featureCards.map((feature) => (
                    <div key={feature.id} className="flex">
                      <div className="h-full w-full transform rounded-3xl bg-white p-8 text-center shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl">
                        <div className="m-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100">
                          {feature.icon}
                        </div>
                        <h3 className="mb-2 text-2xl font-bold">{feature.title}</h3>
                        <p className="text-lg text-gray-600">{feature.description}</p>
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
                <h2 className="mb-6 text-2xl font-bold md:text-4xl" data-testid="third-subTitle">
                  使い方は簡単3ステップ
                </h2>
                <p className="text-xl text-gray-600 md:text-xl">
                  誰でも直感的に使える設計で、すぐにお気に入りの動画が見つかります
                </p>
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
                    <p className="text-lg text-gray-600 md:text-xl">{step.description}</p>
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
            <h2 className="mb-6 text-4xl font-bold md:text-4xl" data-testid="fourth-subTitle">
              今すぐK-POPダンスの世界へ
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-gray-600 md:text-xl">
              あなたが探していたあの動画、見たことのない新しいコラボレーション。
              <br />
              すべてがここで見つかります。
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/search"
                className="link flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-lg text-white no-underline transition-all hover:text-white"
              >
                今すぐはじめる
                <Search />
              </Link>
              <Link
                href="/search"
                className="link flex items-center justify-center gap-2 rounded-2xl border border-purple-600 p-4 text-lg text-purple-600 no-underline hover:bg-purple-600 hover:text-white active:bg-transparent"
              >
                人気動画を見る
                <TrendingUp />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
