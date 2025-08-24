import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["i.ytimg.com"],
  },
  webpack: (config, { nextRuntime }) => {
    // Edge Runtime での Node.js モジュールの fallback 設定
    if (nextRuntime === "edge") {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        util: false,
        os: false,
        child_process: false,
      };

      // Clerk関連のモジュールを外部化
      config.externals = [
        ...(config.externals || []),
        {
          "@clerk/nextjs/server": "commonjs @clerk/nextjs/server",
        },
      ];
    }

    return config;
  },
};

if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}

export default nextConfig;
