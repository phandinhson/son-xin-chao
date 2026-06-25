import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Tất cả bots (Google, Bing, ...)
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      // Cốc Cốc crawler — search engine phổ biến tại Việt Nam (~25% market share VN)
      // User-agent chính xác: "coccocbot-web" (theo tài liệu help.coccoc.com/en/search-engine)
      // Explicit rule để Cốc Cốc ưu tiên index nhanh hơn
      {
        userAgent: "coccocbot-web",
        allow: "/",
        disallow: ["/admin/", "/api/"],
        // crawlDelay: 1,  // Uncomment nếu server bị overload
      },
      // Applebot — crawler của Apple cho Spotlight Search và Safari Suggestions
      // Giúp site xuất hiện trong iOS Safari address bar gợi ý
      {
        userAgent: "Applebot",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: "https://www.sonxinchao.com/sitemap.xml",
    // host: "https://www.sonxinchao.com",  // Yandex dùng field này (nếu cần)
  };
}
