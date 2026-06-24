import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";
import SearchStrip from "@/components/SearchStrip";
import ToolsGrid from "./ToolsGrid";

// ── SEO Metadata ──────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "25 Công Cụ AI Hỗ Trợ SEO Hiệu Quả Nhất 2026 | Sơn Xin Chào",
  description:
    "Khám phá 25 công cụ AI SEO tốt nhất 2026 và quy trình 6 bước tạo bài viết lên top Google bằng AI. Từ nghiên cứu từ khóa đến xuất bản — đầy đủ, thực chiến.",
  keywords: [
    "công cụ AI SEO 2026", "AI SEO tools", "công cụ hỗ trợ SEO", "Surfer SEO", "ChatGPT SEO",
    "nghiên cứu từ khóa AI", "tối ưu nội dung AI", "SEO tự động", "quy trình SEO bằng AI",
    "SEO Đồng Nai", "digital marketing AI", "bài viết top Google",
  ],
  alternates: {
    canonical: "https://www.sonxinchao.com/cong-cu-ai-ho-tro-seo",
  },
  openGraph: {
    title: "25 Công Cụ AI Hỗ Trợ SEO Hiệu Quả Nhất 2026",
    description:
      "Tổng hợp 25 công cụ AI SEO tốt nhất 2026 kèm quy trình 6 bước tạo bài viết lên top Google. Cập nhật mới nhất tháng 6/2026.",
    url: "https://www.sonxinchao.com/cong-cu-ai-ho-tro-seo",
    type: "article",
    locale: "vi_VN",
    siteName: "Sơn Xin Chào",
  },
};

// ── Static data cho các sections ─────────────────────────────────────────────
const WORKFLOW_STEPS = [
  {
    num: "1",
    title: "Nghiên cứu từ khóa & phân tích thị trường",
    desc: "Bắt đầu bằng việc xác định từ khóa mục tiêu có lượng tìm kiếm thực tế và khả năng xếp hạng. Dùng AI để phân tích ý định tìm kiếm (search intent), xem đối thủ đang xếp hạng với nội dung gì và tìm khoảng trống chưa ai khai thác.",
    tools: ["Ahrefs Keywords Explorer", "SE Ranking", "SERP Gap Analyzer", "Content Harmony"],
    tip: "Chọn từ khóa có Search Intent là 'Informational' hoặc 'Commercial' — tránh từ khóa transactional nếu trang bạn là bài blog.",
  },
  {
    num: "2",
    title: "Phân tích đối thủ & xây dựng outline chuẩn",
    desc: "Lấy top 10 kết quả Google cho từ khóa mục tiêu, phân tích cấu trúc bài viết, độ dài nội dung, heading structure và các yếu tố NLP mà Google đang ưu tiên. Sau đó tạo outline tốt hơn tổng hợp của đối thủ.",
    tools: ["Surfer SEO (Content Editor)", "NeuronWriter", "MarketMuse", "ChatGPT"],
    tip: "Dùng Surfer SEO để lấy điểm NLP score của top đối thủ. Mục tiêu: outline bài mới cần bao phủ ít nhất 80% entities quan trọng.",
  },
  {
    num: "3",
    title: "Viết nội dung chất lượng cao bằng AI",
    desc: "Với outline đã chuẩn, sử dụng AI để tạo nội dung cho từng section. Quan trọng: không dùng AI viết hoàn toàn tự động — hãy bổ sung quan điểm cá nhân, ví dụ thực tế và số liệu mới nhất để đáp ứng tiêu chí E-E-A-T của Google.",
    tools: ["ChatGPT / Claude", "Jasper AI", "ContentShake AI", "Outranking"],
    tip: "Viết theo công thức EAT+P: Expertise + Authority + Trust + Personal Experience. Google 2026 ưu tiên nội dung có trải nghiệm thực tế.",
  },
  {
    num: "4",
    title: "Tối ưu on-page và chấm điểm SEO",
    desc: "Sau khi có bản nháp, đưa vào công cụ tối ưu on-page để kiểm tra: mật độ từ khóa, cấu trúc heading, độ dài đoạn văn, tối ưu hình ảnh, meta title/description và internal link. Điều chỉnh đến khi đạt điểm SEO mục tiêu.",
    tools: ["Surfer SEO Content Score", "NeuronWriter", "INK", "Alli AI"],
    tip: "Mục tiêu điểm Surfer SEO: 70–85/100 là lý tưởng. Điểm quá cao (90+) có thể gây keyword stuffing — Google sẽ nhận ra.",
  },
  {
    num: "5",
    title: "Tối ưu kỹ thuật & tốc độ trang",
    desc: "Đảm bảo trang có Core Web Vitals tốt (LCP, FID, CLS), schema markup đúng loại, internal link trỏ đúng trang liên quan và không có lỗi kỹ thuật ảnh hưởng đến crawl/index.",
    tools: ["NitroPack (tốc độ)", "Alli AI (schema)", "Link Whisper (internal link)", "SE Ranking (audit)"],
    tip: "Schema markup loại Article + FAQ + HowTo giúp Google hiểu nội dung tốt hơn và có cơ hội xuất hiện ở Rich Snippets — tăng CTR đáng kể.",
  },
  {
    num: "6",
    title: "Đo lường, cập nhật và nhân rộng",
    desc: "Theo dõi thứ hạng sau 2–4 tuần. Dùng AI phân tích dữ liệu performance để tìm cơ hội cải thiện. Cập nhật nội dung định kỳ 3–6 tháng/lần. Sau khi có bài hiệu quả, nhân rộng quy trình sang các từ khóa liên quan trong cùng topic cluster.",
    tools: ["SE Ranking (rank tracker)", "Ahrefs (performance)", "MarketMuse (content audit)", "OmniSEO (AI visibility)"],
    tip: "Năm 2026, hãy theo dõi thêm mục AI Overview Impressions trong Google Search Console — đây là chiến trường SEO mới quan trọng không kém kết quả organic.",
  },
];

const COMPARE_ROWS = [
  { name: "Surfer SEO",     keyword: true,  content: true,  technical: true,  local: false, price: "$79/tháng",     best: "Content creator, SEO agency" },
  { name: "Ahrefs",         keyword: true,  content: true,  technical: true,  local: false, price: "$129/tháng",    best: "SEO professional, agency" },
  { name: "ChatGPT",        keyword: true,  content: true,  technical: false, local: false, price: "Miễn phí",      best: "Tất cả — bắt đầu từ đây" },
  { name: "SE Ranking",     keyword: true,  content: true,  technical: true,  local: true,  price: "$52/tháng",     best: "SME, freelancer SEO" },
  { name: "NeuronWriter",   keyword: true,  content: true,  technical: false, local: false, price: "$19/tháng",     best: "Blogger, content writer" },
  { name: "NitroPack",      keyword: false, content: false, technical: true,  local: false, price: "$17.5/tháng",   best: "Website cần cải thiện tốc độ" },
  { name: "Localo",         keyword: false, content: false, technical: false, local: true,  price: "$99/tháng",     best: "Doanh nghiệp địa phương" },
  { name: "Perplexity AI",  keyword: true,  content: true,  technical: false, local: false, price: "Miễn phí",      best: "Research chuyên sâu" },
];

const TIPS = [
  {
    icon: "🧠",
    title: "AI là trợ lý, không phải thay thế",
    body: "AI tạo nội dung nhanh nhưng thiếu trải nghiệm thực tế — yếu tố Google đang ưu tiên nhất với tiêu chí E-E-A-T 2026. Luôn thêm góc nhìn riêng của bạn vào mọi bài viết.",
    border: "border-blue-500", bg: "bg-blue-50", titleColor: "text-blue-800", bodyColor: "text-blue-700",
  },
  {
    icon: "✅",
    title: "Kiểm tra thông tin trước khi đăng",
    body: "AI có thể tạo ra thông tin sai có vẻ đúng (hallucination). Luôn fact-check số liệu, tên người và các khẳng định quan trọng trước khi xuất bản.",
    border: "border-emerald-500", bg: "bg-emerald-50", titleColor: "text-emerald-800", bodyColor: "text-emerald-700",
  },
  {
    icon: "⚡",
    title: "Đừng chọn quá nhiều công cụ",
    body: "Bắt đầu với 2–3 công cụ thật sự thành thạo còn hơn dùng 10 công cụ lơ mơ. Bộ ba nền tảng gợi ý: ChatGPT (miễn phí) + Surfer SEO + Ahrefs/SE Ranking.",
    border: "border-amber-500", bg: "bg-amber-50", titleColor: "text-amber-800", bodyColor: "text-amber-700",
  },
  {
    icon: "🎯",
    title: "Tập trung vào search intent",
    body: "Mỗi từ khóa chỉ có một search intent chủ đạo. Công cụ AI tốt nhất cũng vô nghĩa nếu bài viết không đáp ứng đúng ý định tìm kiếm của người dùng.",
    border: "border-pink-500", bg: "bg-pink-50", titleColor: "text-pink-800", bodyColor: "text-pink-700",
  },
  {
    icon: "🌐",
    title: "SEO 2026 = AI Visibility",
    body: "Google AI Overviews và ChatGPT Search đang thay đổi cách người dùng tìm kiếm. Tối ưu cho cả traditional SERP lẫn AI-generated answers là xu hướng không thể bỏ qua.",
    border: "border-sky-500", bg: "bg-sky-50", titleColor: "text-sky-800", bodyColor: "text-sky-700",
  },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function CongCuAIHoTroSEOPage() {
  return (
    <>
      <Navbar />
      <SearchStrip />

      <main className="bg-white">

        {/* ── HERO ── */}
        <section className="relative overflow-hidden bg-white border-b border-gray-100 pt-16 pb-20 px-6 text-center">
          {/* subtle grid pattern */}
          <div className="pointer-events-none absolute inset-0 opacity-[.03]"
            style={{ backgroundImage: "radial-gradient(circle, #2563eb 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

          <div className="relative max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Cập nhật tháng 6/2026
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5 text-gray-900">
              25 Công Cụ{" "}
              <span className="text-blue-600">AI Hỗ Trợ SEO</span>
              <br />Hiệu Quả Nhất Năm 2026
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-12">
              Từ nghiên cứu từ khóa đến tạo nội dung, từ kỹ thuật SEO đến đo lường —
              AI đang thay đổi hoàn toàn cách làm SEO. Khám phá công cụ phù hợp và học
              cách tạo bài SEO top Google chỉ trong 6 bước.
            </p>
            {/* Stats */}
            <div className="inline-flex flex-wrap justify-center gap-px bg-gray-200 rounded-2xl overflow-hidden shadow-sm">
              {[
                { num: "25",   label: "Công cụ được review" },
                { num: "5",    label: "Nhóm chức năng" },
                { num: "6",    label: "Bước tạo bài SEO" },
                { num: "2026", label: "Cập nhật mới nhất" },
              ].map(s => (
                <div key={s.num} className="bg-white px-8 py-5 text-center min-w-[100px]">
                  <div className="text-2xl font-black text-blue-600">{s.num}</div>
                  <div className="text-xs text-gray-500 mt-1 whitespace-nowrap">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── GIỚI THIỆU ── */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-blue-100 text-blue-700 mb-3">
            Tổng quan
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">AI SEO Tools là gì?</h2>
          <p className="text-gray-600 text-lg max-w-2xl mb-10">
            Công cụ AI SEO là phần mềm sử dụng trí tuệ nhân tạo và mô hình ngôn ngữ lớn (LLM)
            để tự động hóa toàn bộ quy trình tối ưu hóa công cụ tìm kiếm — từ phân tích từ khóa,
            viết nội dung, kiểm tra kỹ thuật đến theo dõi thứ hạng.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: "🔍", bg: "bg-blue-50",    title: "Nghiên cứu từ khóa",  body: "AI phân tích hàng triệu truy vấn, dự đoán xu hướng và đánh giá độ cạnh tranh từ khóa chỉ trong vài giây." },
              { icon: "✍️", bg: "bg-emerald-50", title: "Tối ưu nội dung",     body: "So sánh với top đối thủ, đề xuất cách cải thiện on-page và chấm điểm bài viết theo tiêu chuẩn Google." },
              { icon: "⚡", bg: "bg-amber-50",   title: "Kỹ thuật SEO",        body: "Tự động kiểm tra tốc độ, schema markup, internal link và các lỗi kỹ thuật ảnh hưởng đến xếp hạng." },
              { icon: "📊", bg: "bg-pink-50",    title: "Theo dõi hiệu suất",   body: "Phân tích dữ liệu, báo cáo thứ hạng và đưa ra khuyến nghị chiến lược dựa trên dữ liệu thực tế." },
            ].map(card => (
              <div key={card.title} className="border border-gray-200 rounded-2xl p-6">
                <div className={`w-11 h-11 rounded-xl ${card.bg} flex items-center justify-center text-2xl mb-4`}>
                  {card.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── TOOLS GRID (interactive client component) ── */}
        <section className="bg-gray-50 py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-blue-100 text-blue-700 mb-3">
              Danh sách công cụ
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Top 25 Công Cụ AI SEO 2026</h2>
            <p className="text-gray-600 text-lg mb-8">
              Được phân loại theo chức năng chính để bạn dễ tìm đúng công cụ cho nhu cầu.
            </p>
            <ToolsGrid />
          </div>
        </section>

        {/* ── QUY TRÌNH 6 BƯỚC ── */}
        <section className="bg-white py-20 px-6 border-t border-gray-100">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-blue-100 text-blue-700 mb-3">
              Quy trình thực chiến
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              6 Bước Tạo Bài SEO Top Google Bằng AI
            </h2>
            <p className="text-gray-500 text-lg mb-12">
              Quy trình chuẩn từ ý tưởng đến bài viết được Google đánh giá cao —
              kết hợp sức mạnh của nhiều công cụ AI ở từng giai đoạn.
            </p>

            <div className="divide-y divide-gray-100">
              {WORKFLOW_STEPS.map((step, idx) => (
                <div key={step.num} className="grid grid-cols-[56px_1fr] gap-6 py-10">
                  {/* số bước */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg flex-shrink-0 shadow-sm">
                      {step.num}
                    </div>
                    {idx < WORKFLOW_STEPS.length - 1 && (
                      <div className="flex-1 w-px bg-gray-200 min-h-[24px]" />
                    )}
                  </div>
                  <div className="pb-2">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{step.desc}</p>
                    {/* tool badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {step.tools.map(t => (
                        <span key={t} className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700">
                          {t}
                        </span>
                      ))}
                    </div>
                    {/* tip */}
                    <div className="bg-amber-50 border-l-3 border-amber-400 pl-4 py-3 rounded-r-xl text-sm text-amber-800" style={{borderLeftWidth: "3px", borderLeftColor: "#f59e0b"}}>
                      <span className="font-semibold">💡 Mẹo: </span>{step.tip}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BẢNG SO SÁNH ── */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-blue-100 text-blue-700 mb-3">
            So sánh nhanh
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Công Cụ Nào Phù Hợp Với Bạn?</h2>
          <p className="text-gray-600 text-lg mb-8">Chọn theo nhu cầu ưu tiên và ngân sách.</p>

          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="text-left px-5 py-4 font-semibold rounded-tl-2xl">Công cụ</th>
                  <th className="px-4 py-4 font-semibold">Từ khóa</th>
                  <th className="px-4 py-4 font-semibold">Nội dung</th>
                  <th className="px-4 py-4 font-semibold">Kỹ thuật</th>
                  <th className="px-4 py-4 font-semibold">Local</th>
                  <th className="px-4 py-4 font-semibold">Giá</th>
                  <th className="text-left px-5 py-4 font-semibold rounded-tr-2xl">Phù hợp nhất</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, i) => (
                  <tr key={row.name} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-5 py-3.5 font-semibold text-gray-900">{row.name}</td>
                    <td className="px-4 py-3.5 text-center">{row.keyword   ? <span className="text-emerald-500 font-bold">✓</span> : <span className="text-gray-200">—</span>}</td>
                    <td className="px-4 py-3.5 text-center">{row.content   ? <span className="text-emerald-500 font-bold">✓</span> : <span className="text-gray-200">—</span>}</td>
                    <td className="px-4 py-3.5 text-center">{row.technical ? <span className="text-emerald-500 font-bold">✓</span> : <span className="text-gray-200">—</span>}</td>
                    <td className="px-4 py-3.5 text-center">{row.local     ? <span className="text-emerald-500 font-bold">✓</span> : <span className="text-gray-200">—</span>}</td>
                    <td className="px-4 py-3.5 text-gray-700 whitespace-nowrap">{row.price}</td>
                    <td className="px-5 py-3.5 text-gray-600">{row.best}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── TIPS ── */}
        <section className="bg-gray-50 py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-blue-100 text-blue-700 mb-3">
              Lưu ý quan trọng
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8">5 Điều Cần Nhớ Khi Dùng AI Làm SEO</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {TIPS.map(tip => (
                <div key={tip.title} className={`${tip.bg} border-l-4 ${tip.border} rounded-r-2xl p-6`}>
                  <h3 className={`font-bold ${tip.titleColor} mb-2`}>{tip.icon} {tip.title}</h3>
                  <p className={`text-sm leading-relaxed ${tip.bodyColor}`}>{tip.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-gradient-to-r from-blue-600 to-violet-600 py-20 px-6 text-white text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl font-extrabold mb-4">Sẵn Sàng Đưa Website Lên Top Google?</h2>
            <p className="text-white/80 text-lg mb-8">
              Tôi giúp doanh nghiệp tại Long Thành và toàn quốc xây dựng chiến lược SEO
              kết hợp AI — từ nghiên cứu từ khóa đến nội dung chuẩn top.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/lien-he"
                className="inline-block bg-white text-blue-700 font-bold px-8 py-3.5 rounded-full hover:-translate-y-0.5 hover:shadow-lg transition-all"
              >
                Tư vấn miễn phí →
              </Link>
              <Link
                href="/dich-vu/seo-onpage"
                className="inline-block border-2 border-white/40 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 transition-all"
              >
                Xem dịch vụ SEO
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
      <MobileBar />
    </>
  );
}
