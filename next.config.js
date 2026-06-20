/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
    // Chạy webpack trong worker riêng — tăng tốc compile ~30%
    webpackBuildWorker: true,
    // Build server traces song song — giảm thời gian "Collecting build traces"
    parallelServerBuildTraces: true,
    // Compile server components song song
    parallelServerCompiles: true,
    // Tree-shake các thư viện lớn — giảm bundle size
    optimizePackageImports: ["@supabase/supabase-js", "lucide-react"],
  },
  images: {
    // Cho phép next/image optimize ảnh từ Supabase Storage
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kpgtiqepktofdfyxgsbw.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
    // Cho phép SVG từ placehold.co (placeholder ảnh bài viết)
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Thêm WebP + AVIF để giảm kích thước ảnh trên mobile
    formats: ["image/avif", "image/webp"],
    // Cache ảnh đã optimize 30 ngày
    minimumCacheTTL: 2592000,
  },
};

module.exports = nextConfig;
