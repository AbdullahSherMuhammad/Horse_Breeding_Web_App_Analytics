/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "alendis-website-ten.vercel.app",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
