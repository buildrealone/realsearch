/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "avatars.dicebear.com"],
  }
  // async rewrites() {
  //   return [
  //     {
  //       source: "/",
  //       destination: `https://londonsearch.vercel.app/`,
  //     },
  //   ];
  // },
}

module.exports = nextConfig
