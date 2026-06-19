/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
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
