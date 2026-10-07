import type { Metadata } from "next";
import "./globals.css";
import { GoogleTagManager } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "SeeKPOP | K-POPダンスチャレンジ検索",
  description:
    "推しのダンスチャレンジが一瞬で見つかる。グループ名や楽曲名をタップするだけで、アイドル公式コラボ動画を検索できます。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="scroll-smooth" data-theme="light">
      <body className="bg-white font-sans text-black antialiased">
        <main className="relative min-h-screen bg-gradient-to-br from-purple-50 to-pink-50" data-testid="main-content">
          {children}
          <GoogleTagManager gtmId="GTM-K55M4XSJ" />
        </main>
      </body>
    </html>
  );
}
