import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Compression ──────────────────────────────────────────
  compress: true,

  // ── Next/Image: Unsplash CDN + format optimization ───────
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400, // 24h browser cache для картинок
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },

  // ── HTTP headers: кэш статики + security ─────────────────
  async headers() {
    return [
      {
        // JS/CSS/fonts/images — кэш 1 год (immutable, Next добавляет hash)
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // API routes — no-store (данные real-time)
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store",
          },
        ],
      },
      {
        // HTML страницы — stale-while-revalidate
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
      },
    ];
  },

  // ── Experimental: turbo (уже был @tailwindcss/turbopack) ─
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
