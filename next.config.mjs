/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "we-care-base.sgp1.cdn.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname: "freefrontend.com",
      },
    ],
  },
};

export default nextConfig;
