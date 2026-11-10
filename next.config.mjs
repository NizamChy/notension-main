/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "we-care-base.sgp1.cdn.digitaloceanspaces.com",
      },
    ],
  },
  // Old URLs -> new URLs (routes were renamed; keep bookmarks/SEO working).
  // Specific rules must come before the catch-all fashion rule.
  async rewrites() {
    return [{ source: "/demo-images/:folder/:path*", destination: "/demo/:path*" }];
  },
  async redirects() {
    return [
      {
        source: "/fashion_lifestyle/cat/:slug",
        destination: "/fashion-lifestyle/type/:slug",
        permanent: true,
      },
      {
        source: "/fashion_lifestyle/subcat/:slug",
        destination: "/fashion-lifestyle/category/:slug",
        permanent: true,
      },
      {
        source: "/fashion_lifestyle/category/:slug",
        destination: "/fashion-lifestyle/subcategory/:slug",
        permanent: true,
      },
      {
        source: "/fashion_lifestyle/:path*",
        destination: "/fashion-lifestyle/:path*",
        permanent: true,
      },
      {
        source: "/medical-services/medical-service",
        destination: "/medical-services",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
