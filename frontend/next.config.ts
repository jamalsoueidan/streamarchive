import { loadEnvConfig } from "@next/env";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

loadEnvConfig(process.cwd());

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_ID: Date.now().toString(),
  },
  serverExternalPackages: ["esbuild-wasm"],
  reactCompiler: true,
  output: "standalone",
  images: {
    unoptimized: true,
    localPatterns: [
      {
        pathname: "/**",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
    ],
  },
  async redirects() {
    return [
      // non-www to www
      {
        source: "/:path*",
        has: [{ type: "host", value: "livestreamrecorder.com" }],
        destination: "https://www.livestreamrecorder.com/:path*",
        permanent: true,
      },
      //webmaster tools
      {
        source: "/:platform(pandalive|tiktok|youtube|twitch|kick)",
        destination: "/recordings/:platform",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
        ],
      },
      {
        source: "/favicon.ico",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/icons/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/simple/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/:file(.*\\.(?:png|jpg|jpeg|svg|webp|gif|ico))",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/robots.txt",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400" }],
      },
      {
        source: "/manifest.json",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400" }],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: process.env.STRAPI_URL + "/uploads/:path*",
      },
      {
        source: "/assets/placeholder/:path*",
        destination: "https://placehold.co/:path*",
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
