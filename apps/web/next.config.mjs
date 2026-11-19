// Where /api-proxy/<service>/* goes: the API (apps/api). Proxying keeps the
// login cookie on this site's own domain.
const API_PROXY_TARGET = (
  process.env.API_PROXY_TARGET ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : "https://notension-api.vercel.app")
).replace(/\/+$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Workspace package shipped as TypeScript source.
  transpilePackages: ["@notension/shared"],
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
    return [
      { source: "/demo-images/:folder/:path*", destination: "/demo/:path*" },
      { source: "/api-proxy/:service/:path*", destination: `${API_PROXY_TARGET}/:path*` },
    ];
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
