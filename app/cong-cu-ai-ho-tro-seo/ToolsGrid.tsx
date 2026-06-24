"use client";
import { useState } from "react";

type ToolCat = "all" | "content" | "keyword" | "technical" | "local" | "other";

type Tool = {
  id: string;
  name: string;
  abbr: string;
  color: string;
  tag: string;
  tagStyle: string;
  cat: Exclude<ToolCat, "all">[];
  desc: string;
  features: string[];
  price: string;
  priceSub?: string;
  url: string;
};

const TOOLS: Tool[] = [
  {
    id: "surfer",
    name: "Surfer SEO", abbr: "S",
    color: "linear-gradient(135deg,#f59e0b,#ef4444)",
    tag: "✍️ Nội dung", tagStyle: "background:#fef3c7;color:#92400e",
    cat: ["content", "keyword"],
    desc: "Công cụ số 1 cho tối ưu nội dung on-page. So sánh bài viết với top 20 đối thủ, chấm điểm từng yếu tố và đề xuất cải tiến cụ thể.",
    features: ["SEO audit toàn diện theo từng URL", "Tạo outline bài viết chuẩn SEO", "Gợi ý liên kết nội bộ thông minh", "Nghiên cứu từ khóa dựa trên dữ liệu thực"],
    price: "Từ $79", priceSub: "/tháng", url: "https://surferseo.com",
  },
  {
    id: "ahrefs",
    name: "Ahrefs", abbr: "A",
    color: "linear-gradient(135deg,#0ea5e9,#2563eb)",
    tag: "🔍 Từ khóa", tagStyle: "background:#dbeafe;color:#1e40af",
    cat: ["keyword"],
    desc: "Bộ công cụ SEO toàn diện hàng đầu. Tính năng AI mới giúp viết meta, gợi ý nội dung và phân tích backlink đối thủ cực kỳ chính xác.",
    features: ["Keywords Explorer: 10 tỷ+ từ khóa", "Site Audit: phát hiện lỗi kỹ thuật", "AI viết tiêu đề & meta description", "Phân tích backlink chi tiết nhất"],
    price: "Tính năng AI", priceSub: "miễn phí", url: "https://ahrefs.com",
  },
  {
    id: "chatgpt",
    name: "ChatGPT", abbr: "C",
    color: "linear-gradient(135deg,#10b981,#059669)",
    tag: "🤖 AI Chat", tagStyle: "background:#dcfce7;color:#065f46",
    cat: ["content"],
    desc: "Trợ lý AI đa năng không thể thiếu trong quy trình SEO. Mạnh nhất ở giai đoạn research, xây dựng outline và tạo schema markup tự động.",
    features: ["Tạo outline bài viết chuyên sâu", "Viết và tối ưu schema markup", "Hỗ trợ research nội dung nhanh", "Phân tích ý định tìm kiếm (search intent)"],
    price: "Miễn phí", priceSub: "/ $20+ tháng", url: "https://chatgpt.com",
  },
  {
    id: "contentshake",
    name: "ContentShake AI", abbr: "CS",
    color: "linear-gradient(135deg,#f97316,#ef4444)",
    tag: "✍️ Nội dung", tagStyle: "background:#ffedd5;color:#9a3412",
    cat: ["content", "keyword"],
    desc: "Sản phẩm của Semrush, tích hợp AI vào toàn bộ quy trình viết nội dung. Từ ý tưởng, outline đến bài viết hoàn chỉnh kèm tối ưu SEO.",
    features: ["Tạo ý tưởng bài viết từ từ khóa", "Viết bài hoàn chỉnh bằng AI", "Tạo hình ảnh minh họa AI", "Đề xuất cải tiến on-page"],
    price: "$60", priceSub: "/tháng (thử 7 ngày)", url: "https://semrush.com",
  },
  {
    id: "jasper",
    name: "Jasper AI", abbr: "J",
    color: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
    tag: "✍️ Nội dung", tagStyle: "background:#ede9fe;color:#4c1d95",
    cat: ["content"],
    desc: "Chuyên gia về nội dung marketing. Đặc biệt mạnh ở tóm tắt văn bản dài, viết lại nội dung cũ và tạo nội dung đa dạng theo từng brand voice.",
    features: ["Tóm tắt tài liệu dài thành ngắn gọn", "Viết lại nội dung theo giọng thương hiệu", "Tạo tiêu đề & meta description hàng loạt", "Hơn 50 template marketing"],
    price: "Từ $39", priceSub: "/tháng (thử 7 ngày)", url: "https://jasper.ai",
  },
  {
    id: "perplexity",
    name: "Perplexity AI", abbr: "P",
    color: "linear-gradient(135deg,#06b6d4,#0284c7)",
    tag: "🔍 Research", tagStyle: "background:#cffafe;color:#155e75",
    cat: ["content"],
    desc: "Công cụ tìm kiếm AI thế hệ mới. Mạnh trong nghiên cứu chuyên sâu và tóm tắt tài liệu PDF phức tạp với nguồn trích dẫn rõ ràng.",
    features: ["Tìm kiếm AI với nguồn trích dẫn", "Tóm tắt file PDF tự động", "Tra cứu theo domain cụ thể", "Deep Research: phân tích đa chiều"],
    price: "Miễn phí", priceSub: "/ $20 Pro", url: "https://perplexity.ai",
  },
  {
    id: "marketmuse",
    name: "MarketMuse", abbr: "M",
    color: "linear-gradient(135deg,#10b981,#059669)",
    tag: "📋 Chiến lược", tagStyle: "background:#dcfce7;color:#065f46",
    cat: ["content", "keyword"],
    desc: "Nền tảng chiến lược nội dung tổng thể. Phân tích khoảng trống thông tin, lên kế hoạch nội dung dài hạn và đánh giá chất lượng bài viết.",
    features: ["Phân tích content gap chuyên sâu", "Lập kế hoạch theo topic cluster", "Chấm điểm chất lượng bài viết", "Gợi ý cấu trúc nội dung tối ưu"],
    price: "Miễn phí", priceSub: "/ Gói trả phí theo nhu cầu", url: "https://marketmuse.com",
  },
  {
    id: "seranking",
    name: "SE Ranking", abbr: "SR",
    color: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
    tag: "⚙️ Kỹ thuật", tagStyle: "background:#dbeafe;color:#1e40af",
    cat: ["keyword", "technical"],
    desc: "Bộ SEO toàn diện với AI tích hợp. Điểm nổi bật là theo dõi AI Overviews của Google — xu hướng quan trọng nhất trong SEO 2026.",
    features: ["Theo dõi AI Overview (AIO) từ Google", "Kiểm toán SEO toàn trang tự động", "Nghiên cứu từ khóa + phân tích đối thủ", "Viết nội dung bằng AI tích hợp"],
    price: "Từ $52", priceSub: "/tháng (thử 14 ngày)", url: "https://seranking.com",
  },
  {
    id: "neuronwriter",
    name: "NeuronWriter", abbr: "N",
    color: "linear-gradient(135deg,#f59e0b,#d97706)",
    tag: "✍️ Nội dung", tagStyle: "background:#fef3c7;color:#92400e",
    cat: ["content", "keyword"],
    desc: "All-in-one SEO content platform. Phân tích đối thủ, tối ưu NLP, gợi ý internal link và tạo nội dung chuẩn SEO trong một giao diện duy nhất.",
    features: ["Phân tích NLP của top đối thủ", "Kiểm toán nội dung hiện có", "Gợi ý liên kết nội bộ tự động", "Theo dõi thứ hạng từ khóa"],
    price: "Từ $19", priceSub: "/tháng (thử 7 ngày)", url: "https://neuronwriter.com",
  },
  {
    id: "neuraltext",
    name: "NeuralText", abbr: "NT",
    color: "linear-gradient(135deg,#ec4899,#db2777)",
    tag: "🔍 Từ khóa", tagStyle: "background:#fce7f3;color:#831843",
    cat: ["keyword", "content"],
    desc: "Công cụ đa năng cho cả keyword research và content creation. Nổi bật với tốc độ phân tích từ khóa nhanh và khả năng tạo mẫu nội dung tự động.",
    features: ["Nghiên cứu từ khóa chuyên sâu", "Tạo mẫu nội dung (template) tự động", "Lên dàn ý bài viết theo SERP", "Kiểm tra chất lượng nội dung"],
    price: "Từ $19", priceSub: "/tháng (thử 5 ngày)", url: "https://neuraltext.com",
  },
  {
    id: "copyai",
    name: "Copy.ai", abbr: "CA",
    color: "linear-gradient(135deg,#6366f1,#4f46e5)",
    tag: "✍️ Nội dung", tagStyle: "background:#ede9fe;color:#4c1d95",
    cat: ["content"],
    desc: "Nền tảng tự động hóa content marketing với 90+ template. Kiểm tra đạo văn tích hợp và khả năng tạo nội dung hàng loạt theo mục tiêu kinh doanh.",
    features: ["Hơn 90 template nội dung đa dạng", "Kiểm tra đạo văn tự động", "Tạo nội dung theo pipeline tự động", "Tích hợp với nhiều CMS phổ biến"],
    price: "Miễn phí", priceSub: "/ $49+ tháng", url: "https://copy.ai",
  },
  {
    id: "ink",
    name: "INK", abbr: "INK",
    color: "linear-gradient(135deg,#0f172a,#334155)",
    tag: "🔍 Từ khóa", tagStyle: "background:#f1f5f9;color:#334155",
    cat: ["keyword", "content"],
    desc: "Tập trung vào keyword clustering — nhóm các từ khóa liên quan theo chiến lược topic để tối ưu hóa toàn bộ cluster nội dung của website.",
    features: ["Phân cụm từ khóa thông minh", "Viết nội dung chuẩn SEO theo cluster", "Phân tích ý định tìm kiếm", "Tạo nội dung tự động theo nhóm từ khóa"],
    price: "Từ $39", priceSub: "/tháng (thử 5 ngày)", url: "https://inkforall.com",
  },
  {
    id: "contentharmony",
    name: "Content Harmony", abbr: "CH",
    color: "linear-gradient(135deg,#84cc16,#65a30d)",
    tag: "📋 Chiến lược", tagStyle: "background:#f7fee7;color:#3f6212",
    cat: ["keyword", "content"],
    desc: "Phân tích ngữ cảnh tìm kiếm sâu. Giúp bạn hiểu đúng ý định người dùng, theo dõi xu hướng và tìm ra khoảng trống nội dung chưa ai khai thác.",
    features: ["Phân tích search intent chuyên sâu", "Đánh giá khoảng trống nội dung", "Theo dõi xu hướng & đối thủ", "Báo cáo content brief chi tiết"],
    price: "Từ $50", priceSub: "/tháng", url: "https://www.contentharmony.com",
  },
  {
    id: "serpgap",
    name: "SERP Gap Analyzer", abbr: "SG",
    color: "linear-gradient(135deg,#f97316,#ea580c)",
    tag: "🔍 Từ khóa", tagStyle: "background:#ffedd5;color:#9a3412",
    cat: ["keyword"],
    desc: "Công cụ của Semrush chuyên tìm khoảng trống nội dung trên Google. Phát hiện chủ đề đối thủ đang xếp hạng mà bạn chưa có bài viết.",
    features: ["Tìm khoảng trống từ khóa so với đối thủ", "Đề xuất chủ đề cá nhân hóa", "Tạo dàn ý nội dung nhắm đúng từ khóa", "Gợi ý chiến lược nội dung dài hạn"],
    price: "$79", priceSub: "/tháng (Semrush)", url: "https://semrush.com",
  },
  {
    id: "nitropack",
    name: "NitroPack", abbr: "NP",
    color: "linear-gradient(135deg,#f59e0b,#d97706)",
    tag: "⚡ Tốc độ", tagStyle: "background:#fef3c7;color:#92400e",
    cat: ["technical"],
    desc: "Chuyên tối ưu Core Web Vitals và tốc độ tải trang — yếu tố xếp hạng trực tiếp của Google. Nén code, tối ưu ảnh và caching thông minh.",
    features: ["Nén HTML, CSS, JavaScript tự động", "Tối ưu và lazy-load hình ảnh", "Cải thiện LCP, FID, CLS", "CDN toàn cầu tích hợp"],
    price: "Từ $17.5", priceSub: "/tháng", url: "https://nitropack.io",
  },
  {
    id: "alliai",
    name: "Alli AI", abbr: "AI",
    color: "linear-gradient(135deg,#2563eb,#1d4ed8)",
    tag: "⚙️ On-page", tagStyle: "background:#dbeafe;color:#1e40af",
    cat: ["technical"],
    desc: "Tự động hóa SEO kỹ thuật on-page. Thực hiện A/B testing trực tiếp trên trang, tạo schema markup tự động và tối ưu tốc độ không cần dev.",
    features: ["A/B testing SEO trực tiếp trên site", "Tạo schema markup JSON-LD tự động", "Tối ưu tốc độ tải trang AI", "Bulk SEO changes cho toàn site"],
    price: "Từ $169", priceSub: "/tháng (thử 10 ngày)", url: "https://www.alliai.com",
  },
  {
    id: "linkwhisper",
    name: "Link Whisper", abbr: "LW",
    color: "linear-gradient(135deg,#0ea5e9,#0284c7)",
    tag: "🔗 Internal Link", tagStyle: "background:#cffafe;color:#155e75",
    cat: ["technical"],
    desc: "Plugin WordPress chuyên xây dựng internal link thông minh. AI đề xuất liên kết nội bộ phù hợp ngữ cảnh và thêm hàng loạt chỉ với một cú click.",
    features: ["Đề xuất internal link tự động theo ngữ cảnh", "Tích hợp liền mạch với WordPress", "Thêm nhiều liên kết chỉ với 1 click", "Báo cáo phân tích internal link toàn site"],
    price: "Từ $97", priceSub: "/năm", url: "https://linkwhisper.com",
  },
  {
    id: "outranking",
    name: "Outranking", abbr: "OR",
    color: "linear-gradient(135deg,#7c3aed,#6d28d9)",
    tag: "✍️ Nội dung", tagStyle: "background:#ede9fe;color:#4c1d95",
    cat: ["content", "technical"],
    desc: "Nền tảng tạo nội dung + workflow cho team content. Kết hợp viết AI, phân tích từ khóa và tự động hóa internal link trong một chỗ.",
    features: ["Viết nội dung AI theo quy trình chuẩn", "Phân tích và lập kế hoạch từ khóa", "Tự động tối ưu liên kết nội bộ", "Tạo workflow content cho team"],
    price: "Từ $19", priceSub: "/tháng", url: "https://outranking.io",
  },
  {
    id: "paraphrasing",
    name: "Paraphrasingtool.ai", abbr: "PT",
    color: "linear-gradient(135deg,#10b981,#047857)",
    tag: "✍️ Viết lại", tagStyle: "background:#dcfce7;color:#065f46",
    cat: ["content"],
    desc: "Chuyên diễn giải và viết lại nội dung để làm mới bài cũ, tránh trùng lặp và cải thiện độ rõ ràng. Hỗ trợ viết lại từ file ghi âm.",
    features: ["Viết lại văn bản theo nhiều phong cách", "Diễn giải từ file ghi âm/transcript", "Tạo nội dung mới từ nội dung cũ", "Kiểm tra và giảm đạo văn"],
    price: "$5", priceSub: "/tháng", url: "https://paraphrasingtool.ai",
  },
  {
    id: "pictory",
    name: "Pictory", abbr: "PI",
    color: "linear-gradient(135deg,#ec4899,#be185d)",
    tag: "🎬 Video", tagStyle: "background:#fce7f3;color:#831843",
    cat: ["other"],
    desc: "Biến bài viết blog thành video tự động. Tái sử dụng nội dung SEO đã có thành video cho YouTube/TikTok — tăng traffic đa kênh hiệu quả.",
    features: ["Chuyển văn bản → video tự động", "Tạo video từ URL bài viết", "Thêm phụ đề tự động", "Tái sử dụng nội dung đa kênh"],
    price: "Từ $19", priceSub: "/tháng (thử 14 ngày)", url: "https://pictory.ai",
  },
  {
    id: "localo",
    name: "Localo", abbr: "LO",
    color: "linear-gradient(135deg,#0ea5e9,#0369a1)",
    tag: "📍 Local SEO", tagStyle: "background:#cffafe;color:#155e75",
    cat: ["local"],
    desc: "Chuyên gia SEO địa phương. Tối ưu Google Business Profile, phân tích đối thủ cùng khu vực và đề xuất chiến lược để xuất hiện trên Google Maps.",
    features: ["Tối ưu Google Business Profile toàn diện", "Phân tích đối thủ cùng địa bàn", "Đề xuất chiến lược SEO địa phương", "Theo dõi thứ hạng Google Maps"],
    price: "Từ $99", priceSub: "/tháng", url: "https://localo.com",
  },
  {
    id: "yext",
    name: "Yext", abbr: "Y",
    color: "linear-gradient(135deg,#f97316,#c2410c)",
    tag: "📍 Local SEO", tagStyle: "background:#ffedd5;color:#9a3412",
    cat: ["local"],
    desc: "Nền tảng SEO địa phương cho doanh nghiệp đa chi nhánh. Quản lý thông tin đồng bộ trên 200+ nền tảng và tối ưu tìm kiếm bằng giọng nói.",
    features: ["Quản lý 200+ danh sách doanh nghiệp", "Tối ưu Voice Search SEO", "Tạo landing page cho từng chi nhánh", "Schema markup tự động cho multi-location"],
    price: "Từ $199", priceSub: "/năm", url: "https://yext.com",
  },
  {
    id: "omniseo",
    name: "OmniSEO™", abbr: "OS",
    color: "linear-gradient(135deg,#1e3a8a,#312e81)",
    tag: "🌐 Đa kênh", tagStyle: "background:#e0e7ff;color:#3730a3",
    cat: ["keyword", "technical"],
    desc: "Tiên phong trong SEO đa kênh, theo dõi khả năng hiển thị không chỉ trên Google mà cả ChatGPT, Perplexity và các AI search engine mới.",
    features: ["Đo lường độ phủ thương hiệu trên AI search", "So sánh hiện diện vs đối thủ đa kênh", "Theo dõi trích dẫn thương hiệu online", "Chiến lược GEO (Generative Engine Optimization)"],
    price: "Tùy chỉnh", priceSub: "theo doanh nghiệp", url: "#",
  },
  {
    id: "teamai",
    name: "TeamAI", abbr: "TA",
    color: "linear-gradient(135deg,#6366f1,#4338ca)",
    tag: "👥 Cộng tác", tagStyle: "background:#e0e7ff;color:#3730a3",
    cat: ["other"],
    desc: "Không gian làm việc AI cho cả team doanh nghiệp. Quản lý prompt library, phân tích tài liệu, tạo chatbot và tự động hóa quy trình nội bộ.",
    features: ["Thư viện prompt team chia sẻ", "Phân tích tài liệu nội bộ bằng AI", "Tạo chatbot không cần code", "Tích hợp nhiều mô hình AI (GPT, Claude...)"],
    price: "Từ $25", priceSub: "/tháng", url: "https://teamai.com",
  },
  {
    id: "shopify",
    name: "Shopify Magic", abbr: "SM",
    color: "linear-gradient(135deg,#059669,#047857)",
    tag: "🛒 Thương mại", tagStyle: "background:#dcfce7;color:#065f46",
    cat: ["content"],
    desc: "Bộ công cụ AI tích hợp sẵn trong Shopify. Tối ưu SEO cho trang sản phẩm, viết mô tả hàng loạt và tạo nội dung blog thu hút khách hàng.",
    features: ["Viết mô tả sản phẩm chuẩn SEO nhanh", "Tạo dàn ý blog cho e-commerce", "Viết nội dung email marketing AI", "Tối ưu title tag & meta hàng loạt"],
    price: "Trong gói", priceSub: "Shopify $29+/tháng", url: "https://shopify.com",
  },
];

const TABS: { id: ToolCat; label: string; count: number }[] = [
  { id: "all",       label: "🗂 Tất cả",          count: TOOLS.length },
  { id: "content",   label: "✍️ Tạo nội dung",    count: TOOLS.filter(t => t.cat.includes("content")).length },
  { id: "keyword",   label: "🔍 Từ khóa & Audit", count: TOOLS.filter(t => t.cat.includes("keyword")).length },
  { id: "technical", label: "⚙️ Kỹ thuật SEO",    count: TOOLS.filter(t => t.cat.includes("technical")).length },
  { id: "local",     label: "📍 Local SEO",        count: TOOLS.filter(t => t.cat.includes("local")).length },
  { id: "other",     label: "🎯 Khác",             count: TOOLS.filter(t => t.cat.includes("other")).length },
];

export default function ToolsGrid() {
  const [active, setActive] = useState<ToolCat>("all");

  const filtered = active === "all"
    ? TOOLS
    : TOOLS.filter(t => t.cat.includes(active));

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 flex-wrap mb-8">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
              active === tab.id
                ? "bg-blue-600 border-blue-600 text-white shadow-md"
                : "bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(tool => (
          <div
            key={tool.id}
            className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
          >
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div
                className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-sm font-black"
                style={{ background: tool.color }}
              >
                {tool.abbr}
              </div>
              <div>
                <div className="font-bold text-gray-900 text-base">{tool.name}</div>
                <span
                  className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1"
                  style={Object.fromEntries(tool.tagStyle.split(";").filter(Boolean).map(s => {
                    const [k, v] = s.split(":").map(x => x.trim());
                    return [k === "background" ? "backgroundColor" : k, v];
                  }))}
                >
                  {tool.tag}
                </span>
              </div>
            </div>

            {/* Desc */}
            <p className="text-sm text-gray-600 leading-relaxed mb-4">{tool.desc}</p>

            {/* Features */}
            <ul className="space-y-1 mb-5">
              {tool.features.map(f => (
                <li key={f} className="text-xs text-gray-600 flex items-start gap-2">
                  <span className="text-emerald-500 font-bold mt-0.5 flex-shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="text-sm">
                <span className="font-bold text-gray-900">{tool.price}</span>
                {tool.priceSub && <span className="text-gray-500 text-xs ml-1">{tool.priceSub}</span>}
              </div>
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
              >
                Dùng thử →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
