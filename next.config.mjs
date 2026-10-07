/** @type {import('next').NextConfig} */
const isCfStatic = process.env.CF_STATIC === "1";

const nextConfig = {
  ...(isCfStatic ? { output: "export" } : {}),
  images: {
    unoptimized: isCfStatic,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
  turbopack: {},
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        path: false,
        fs: false,
        os: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        url: false,
      };
    }
    return config;
  },
};

export default nextConfig;
