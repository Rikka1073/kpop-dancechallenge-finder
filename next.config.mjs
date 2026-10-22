/** @type {import('next').NextConfig} */
const isCfStatic = process.env.CF_STATIC === "1";

const nextConfig = {
  agentRules: false,
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
};

export default nextConfig;
