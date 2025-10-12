import Header from "@/components/feature/Header";
import { FileText, Home } from "lucide-react";
import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {/* ヘッダーセクション */}
          <div className="mb-12 text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600">
                <FileText className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">利用規約</h1>
            <p className="text-gray-600">最終更新日: 2025年10月12日</p>
          </div>

          {/* 規約本文 */}
          <div className="rounded-3xl bg-white p-8 shadow-lg md:p-12">
            <section className="mb-10">
              <h2 className="mb-6 text-2xl font-bold text-purple-600">第1条（サービス概要）</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  本サービス「SeeKPOP」（以下「本サービス」といいます）は、YouTubeに公開されているK-POPダンスチャレンジ動画を検索・閲覧するための情報提供サービスです。
                </p>
                <p>
                  本サービスは、動画コンテンツそのものを提供するものではなく、YouTube動画へのリンクおよび埋め込みのみを提供します。
                </p>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="mb-6 text-2xl font-bold text-purple-600">第2条（免責事項）</h2>
              <div className="space-y-4 text-gray-700">
                <p className="font-semibold">本サービスの利用にあたり、以下の事項についてご理解ください：</p>
                <ul className="list-inside list-disc space-y-3 pl-4">
                  <li>
                    <span className="font-semibold">著作権について：</span>
                    動画コンテンツの著作権は、各権利者に帰属します。本サービスは動画の著作権を保有しておらず、YouTube上に公開されている動画へのリンクを提供するのみです。
                  </li>
                  <li>
                    <span className="font-semibold">情報の正確性：</span>
                    リンク切れや動画の削除、情報の正確性について保証することはできません。
                  </li>
                  <li>
                    <span className="font-semibold">サービスの継続性：</span>
                    本サービスの継続的な提供を保証するものではありません。予告なくサービスを停止または終了する場合があります。
                  </li>
                  <li>
                    <span className="font-semibold">損害の補償：</span>
                    本サービスの利用により生じたいかなる損害についても、運営者は責任を負いません。
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="mb-6 text-2xl font-bold text-purple-600">第3条（YouTube利用規約の遵守）</h2>
              <div className="space-y-4 text-gray-700">
                <p>本サービスは、YouTube API Servicesを利用しており、以下の規約に準拠しています：</p>
                <ul className="list-inside list-disc space-y-3 pl-4">
                  <li>動画の埋め込みには、YouTubeが提供する正規の埋め込み機能を使用しています</li>
                  <li>動画のダウンロードや再配布は一切行っていません</li>
                  <li>
                    ユーザーの皆様には、
                    <a
                      href="https://www.youtube.com/t/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 underline hover:text-purple-800"
                    >
                      YouTube利用規約
                    </a>
                    の遵守をお願いいたします
                  </li>
                  <li>
                    本サービスは
                    <a
                      href="https://developers.google.com/youtube/terms/api-services-terms-of-service"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 underline hover:text-purple-800"
                    >
                      YouTube API Services利用規約
                    </a>
                    に基づいて運営されています
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="mb-6 text-2xl font-bold text-purple-600">第4条（禁止事項）</h2>
              <div className="space-y-4 text-gray-700">
                <p>ユーザーは、本サービスの利用にあたり、以下の行為を行ってはなりません：</p>
                <ul className="list-inside list-disc space-y-3 pl-4">
                  <li>本サービスを利用した著作権侵害行為</li>
                  <li>本サービスのシステムへの不正アクセスまたは妨害行為</li>
                  <li>本サービスの運営を妨害する行為</li>
                  <li>法令または公序良俗に違反する行為</li>
                  <li>その他、運営者が不適切と判断する行為</li>
                </ul>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="mb-6 text-2xl font-bold text-purple-600">第5条（プライバシー）</h2>
              <div className="space-y-4 text-gray-700">
                <p>本サービスにおける個人情報の取り扱いについて：</p>
                <ul className="list-inside list-disc space-y-3 pl-4">
                  <li>
                    本サービスは、アカウント登録機能を提供していないため、氏名・メールアドレス等の個人情報は基本的に収集していません
                  </li>
                  <li>サービス改善のため、アクセスログ等の技術的情報を収集する場合があります</li>
                  <li>本サービスは、利便性向上のためCookieを使用する場合があります</li>
                </ul>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="mb-6 text-2xl font-bold text-purple-600">第6条（規約の変更）</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  運営者は、必要に応じて本規約を変更することができます。規約を変更した場合は、本ページ上で告知いたします。
                </p>
                <p>変更後も本サービスを継続してご利用いただいた場合、変更後の規約に同意したものとみなします。</p>
              </div>
            </section>

            <section>
              <h2 className="mb-6 text-2xl font-bold text-purple-600">お問い合わせ</h2>
              <div className="space-y-4 text-gray-700">
                <p>本規約に関するご質問やお問い合わせは、GitHubのIssuesページよりお願いいたします。</p>
              </div>
            </section>
          </div>

          {/* フッター */}
          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:shadow-lg"
            >
              <Home className="h-5 w-5" />
              ホームへ戻る
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
