/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@full-stack-demo/ui", "@full-stack-demo/utils"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
