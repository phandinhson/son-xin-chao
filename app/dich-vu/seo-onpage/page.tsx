import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";
import SearchStrip from "@/components/SearchStrip";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic"; // Luôn fetch fresh từ DB (dùng revalidatePath sau khi admin lưu)

// ─── Fetch content từ DB ───────────────────────────────────────────────────────
async function getPageContent() {
  const { data } = await supabase
    .from("service_pages")
    .select("content")
    .eq("slug", "seo-onpage")
    .single();
  return data?.content ?? null;
}

export const metadata: Metadata = {
  title: "SEO Onpage Chuyên Sâu: Quy Trình Thực Chiến Với AI 2026 | Sơn Xin Chào",
  description: "Hướng dẫn SEO Onpage đầy đủ từ checklist 25+ yếu tố đến quy trình dùng Claude AI, ChatGPT tối ưu trang web lên top Google nhanh gấp 5 lần. Case study thực tế tại Long Thành, Đồng Nai.",
  keywords: "SEO Onpage, tối ưu SEO Onpage, kỹ thuật SEO Onpage, SEO Onpage là gì, dùng AI viết SEO, Claude AI SEO, checklist SEO Onpage 2026, SEO Onpage Long Thành",
  alternates: { canonical: "https://www.sonxinchao.com/dich-vu/seo-onpage" },
  openGraph: {
    title: "SEO Onpage Chuyên Sâu: Quy Trình Thực Chiến Với AI 2026",
    description: "Checklist 25+ yếu tố SEO Onpage + quy trình AI workflow thực tế giúp lên top Google nhanh hơn 5 lần.",
    url: "https://www.sonxinchao.com/dich-vu/seo-onpage",
    type: "article",
    images: [{ url: "https://www.sonxinchao.com/og-image.jpg", width: 1200, height: 630 }],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "SEO Onpage là gì?", acceptedAnswer: { "@type": "Answer", text: "SEO Onpage là tập hợp các kỹ thuật tối ưu hóa trực tiếp trên trang web — bao gồm nội dung, cấu trúc HTML (title, meta, heading), URL, hình ảnh, tốc độ tải trang và internal link — nhằm giúp Google hiểu và xếp hạng trang cao hơn trên kết quả tìm kiếm." } },
    { "@type": "Question", name: "AI giúp ích gì trong SEO Onpage?", acceptedAnswer: { "@type": "Answer", text: "AI (Claude, ChatGPT) giúp tăng tốc SEO Onpage ở 5 khâu chính: nghiên cứu từ khóa LSI, viết title/meta description hàng loạt, tạo outline bài chuẩn E-E-A-T, tối ưu nội dung theo semantic search và đề xuất internal link. Công việc thủ công mất 4–6 giờ có thể rút xuống còn 45–90 phút." } },
    { "@type": "Question", name: "SEO Onpage mất bao lâu để thấy kết quả?", acceptedAnswer: { "@type": "Answer", text: "Sau khi tối ưu SEO Onpage đúng chuẩn, thông thường trang mới bắt đầu cải thiện thứ hạng sau 4–8 tuần. Trang đã có thứ hạng từ 11–30 có thể lên top 10 sau 2–4 tuần nếu technical SEO sạch và content đủ E-E-A-T." } },
    { "@type": "Question", name: "SEO Onpage khác SEO Offpage như thế nào?", acceptedAnswer: { "@type": "Answer", text: "SEO Onpage tối ưu các yếu tố trong tầm kiểm soát của bạn — nội dung, kỹ thuật, cấu trúc trang. SEO Offpage tập trung vào các tín hiệu bên ngoài — backlink, brand mention, social signal. Cả hai đều cần thiết nhưng SEO Onpage là nền tảng bắt buộc phải làm trước." } },
    { "@type": "Question", name: "Chi phí dịch vụ SEO Onpage tại Sơn Xin Chào?", acceptedAnswer: { "@type": "Answer", text: "Dịch vụ SEO Onpage tại Sơn Xin Chào bắt đầu từ 2.500.000đ/tháng cho gói cơ bản (audit + tối ưu 10 trang). Liên hệ trực tiếp để được tư vấn gói phù hợp với quy mô website và ngân sách của bạn." } },
    { "@type": "Question", name: "Prompt nào dùng Claude AI để viết title tag chuẩn SEO?", acceptedAnswer: { "@type": "Answer", text: "Prompt hiệu quả: 'Viết 5 title tag cho trang [chủ đề], từ khóa chính [từ khóa], đối tượng [mô tả khách hàng], USP [điểm nổi bật]. Mỗi title dưới 60 ký tự, có từ khóa gần đầu, không clickbait.' Claude sẽ trả về 5 option từ đó bạn chọn tối ưu nhất." } },
  ],
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "SEO Onpage Chuyên Sâu: Quy Trình Thực Chiến Với AI 2026",
  description: "Hướng dẫn SEO Onpage đầy đủ từ checklist đến quy trình AI workflow thực tế.",
  url: "https://www.sonxinchao.com/dich-vu/seo-onpage",
  datePublished: "2026-06-24",
  dateModified: "2026-06-24",
  author: { "@type": "Person", name: "Phan Đình Sơn", url: "https://www.sonxinchao.com/gioi-thieu" },
  publisher: { "@type": "Organization", name: "Sơn Xin Chào", url: "https://www.sonxinchao.com" },
};

const checklist = [
  { cat: "URL & Cấu trúc", icon: "🔗", color: "blue", items: ["URL ngắn, có từ khóa chính, không ký tự đặc biệt", "Dùng dấu gạch ngang (-) thay khoảng trắng", "Cấu trúc phân cấp rõ ràng: /danh-muc/bai-viet", "Loại bỏ tham số URL thừa, canonical URL đúng"] },
  { cat: "Title & Meta", icon: "🏷️", color: "violet", items: ["Title 50–60 ký tự, từ khóa chính gần đầu", "Meta description 140–160 ký tự, có CTA rõ ràng", "Title và H1 không trùng nhau hoàn toàn", "Mỗi trang có title và meta description riêng biệt"] },
  { cat: "Heading Structure", icon: "📋", color: "indigo", items: ["Chỉ 1 thẻ H1 duy nhất, chứa từ khóa chính", "H2 phân chia chủ đề lớn, có từ khóa phụ", "H3 chi tiết hóa từng phần H2", "Thứ bậc heading logic, không nhảy cấp (H1→H3)"] },
  { cat: "Nội dung & E-E-A-T", icon: "✍️", color: "emerald", items: ["Nội dung 1.200+ từ cho chủ đề competitive", "Từ khóa chính xuất hiện trong 100 từ đầu", "LSI keyword và semantic terms phân bổ tự nhiên", "Có dẫn chứng thực tế, số liệu, tác giả rõ ràng"] },
  { cat: "Hình ảnh", icon: "🖼️", color: "orange", items: ["Tên file ảnh tiếng Việt không dấu, có từ khóa", "Alt text mô tả chính xác, có từ khóa liên quan", "Nén ảnh WebP/AVIF, kích thước ≤ 100KB", "Thêm caption mô tả khi cần thiết"] },
  { cat: "Technical & Speed", icon: "⚡", color: "rose", items: ["Core Web Vitals: LCP < 2.5s, CLS < 0.1, FID < 100ms", "Schema markup phù hợp (Article, FAQ, Product...)", "Internal link 3–5 trang liên quan", "External link đến nguồn uy tín (nofollow khi cần)"] },
];

const colorMap: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  blue:    { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",    badge: "bg-blue-100 text-blue-700" },
  violet:  { bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-200",  badge: "bg-violet-100 text-violet-700" },
  indigo:  { bg: "bg-indigo-50",  text: "text-indigo-700",  border: "border-indigo-200",  badge: "bg-indigo-100 text-indigo-700" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-700" },
  orange:  { bg: "bg-orange-50",  text: "text-orange-700",  border: "border-orange-200",  badge: "bg-orange-100 text-orange-700" },
  rose:    { bg: "bg-rose-50",    text: "text-rose-700",    border: "border-rose-200",    badge: "bg-rose-100 text-rose-700" },
};

const aiWorkflow = [
  { step: "01", title: "Nghiên cứu từ khóa LSI với Claude", time: "10 phút", icon: "🔍", desc: "Thay vì dùng tool trả phí, Claude có thể gợi ý 30–50 từ khóa liên quan ngữ nghĩa (LSI) từ 1 seed keyword.", prompt: `Tôi muốn viết bài về "[từ khóa chính]". Hãy gợi ý:\n1. 10 từ khóa LSI cùng chủ đề\n2. 10 câu hỏi người dùng hay tìm kiếm\n3. 5 long-tail keyword mua hàng cao\nSắp xếp theo mức độ liên quan giảm dần.`, result: "30–50 từ khóa có thể dùng ngay, không cần tool trả phí" },
  { step: "02", title: "Viết Title + Meta hàng loạt", time: "5 phút", icon: "🏷️", desc: "Tạo 5–10 phiên bản title và meta description để A/B test, tối ưu CTR trên SERP.", prompt: `Viết 5 title tag (≤60 ký tự) và 5 meta description (140–160 ký tự) cho trang:\n- Chủ đề: [chủ đề]\n- Từ khóa chính: [từ khóa]\n- Đối tượng: [khách hàng mục tiêu]\n- USP: [điểm nổi bật]\nYêu cầu: title có từ khóa gần đầu, meta có CTA mạnh.`, result: "5 options để chọn + test CTR, tiết kiệm 30 phút brainstorm" },
  { step: "03", title: "Tạo Outline chuẩn E-E-A-T", time: "8 phút", icon: "📐", desc: "Outline đúng chuẩn Google E-E-A-T là nền tảng cho bài lên top bền vững qua các core update.", prompt: `Tạo outline bài viết chuẩn E-E-A-T về "[chủ đề]" (1.500–2.000 từ):\n- Từ khóa chính: [từ khóa]\n- Đối tượng đọc: [người mới / trung cấp / chuyên gia]\n- Mục tiêu: [thông tin / chuyển đổi / so sánh]\nYêu cầu: H1, H2 với câu hỏi thực tế, H3, FAQ 5 câu, CTA cuối.`, result: "Outline hoàn chỉnh trong 8 phút, thay vì 1–2 giờ research thủ công" },
  { step: "04", title: "Tối ưu nội dung hiện có", time: "15 phút", icon: "🔧", desc: "Đưa bài viết cũ vào Claude để phân tích và đề xuất tối ưu — hiệu quả hơn viết lại từ đầu.", prompt: `Phân tích đoạn nội dung sau và đề xuất cải thiện SEO:\n[paste nội dung]\n\nTừ khóa mục tiêu: [từ khóa]\n1. Mật độ từ khóa hiện tại\n2. LSI keyword còn thiếu\n3. Đề xuất chỉnh sửa 3–5 câu\n4. Gợi ý internal link`, result: "Tối ưu bài cũ trong 15 phút thay vì viết lại — tiết kiệm 80% thời gian" },
  { step: "05", title: "Tạo Schema FAQ tự động", time: "3 phút", icon: "💡", desc: "Schema FAQ giúp trang xuất hiện dạng rich snippet trên Google — tăng CTR 20–30%.", prompt: `Từ nội dung bài về "[chủ đề]", tạo Schema FAQPage JSON-LD gồm 6 câu hỏi thực tế. Mỗi câu trả lời 50–100 từ. Format JSON-LD chuẩn schema.org, sẵn sàng paste vào website.`, result: "Schema FAQ hoàn chỉnh trong 3 phút, tăng khả năng xuất hiện rich snippet" },
];

const defaultCaseStudies = [
  { client: "Cửa hàng nội thất Long Thành", icon: "🪑", tag: "E-Commerce", challenge: "Trang sản phẩm tủ bếp đứng vị trí 18–25 suốt 8 tháng dù content khá tốt.", issue: "Title không có từ khóa địa phương, thiếu Schema, 0 internal link, tốc độ tải 6.2s.", actions: ["Rewrite title + meta với từ khóa 'tủ bếp Long Thành'", "Thêm Schema Product + Review với Claude AI", "Tối ưu ảnh: 12 ảnh → WebP, giảm từ 4.8MB → 380KB", "Thêm 5 internal link từ blog liên quan"], stats: [{ val: "Top 5", label: "sau 5 tuần" }, { val: "+340%", label: "organic traffic" }, { val: "12", label: "leads/tháng" }] },
  { client: "Phòng khám nha khoa Nhơn Trạch", icon: "🦷", tag: "Healthcare", challenge: "Trang dịch vụ niềng răng bị đẩy khỏi top 20 sau Core Update tháng 3/2026.", issue: "Google coi trang thiếu E-E-A-T: không có tên bác sĩ, thiếu chứng chỉ, thông tin địa chỉ mơ hồ.", actions: ["Thêm author bio bác sĩ + chứng chỉ hành nghề", "Rewrite content theo Claude — thêm số liệu thực tế", "Thêm Schema MedicalBusiness + FAQPage", "Cập nhật NAP (Name, Address, Phone) nhất quán"], stats: [{ val: "Top 8", label: "sau 6 tuần" }, { val: "Ổn định", label: "qua các update" }, { val: "5 ngày", label: "triển khai" }] },
];

const defaultPricingPlans = [
  { name: "SEO Audit Onpage", price: "1.500.000đ", note: "1 lần", highlight: false, features: ["Audit toàn bộ website (≤ 50 trang)", "Checklist 25 yếu tố Onpage", "Báo cáo chi tiết từng trang", "Danh sách lỗi ưu tiên cần sửa", "Hướng dẫn sửa từng mục cụ thể", "Không bao gồm triển khai"], cta: "Đặt Audit ngay" },
  { name: "SEO Onpage Cơ Bản", price: "2.500.000đ", note: "/tháng", highlight: true, features: ["Tối ưu 10 trang/tháng (content + technical)", "Rewrite title, meta, heading chuẩn AI", "Tối ưu hình ảnh + alt text", "Thêm Schema markup phù hợp", "5 internal link/trang", "Báo cáo thứ hạng hàng tuần"], cta: "Đăng ký gói này" },
  { name: "SEO Onpage Toàn Diện", price: "4.500.000đ", note: "/tháng", highlight: false, features: ["Tối ưu không giới hạn số trang", "Core Web Vitals optimization", "Viết thêm 4 bài blog/tháng (AI-assisted)", "Toàn bộ Schema markup website", "Internal link strategy toàn site", "Báo cáo GA4 + Search Console hàng tuần"], cta: "Tư vấn gói này" },
];

export default async function SeoOnpagePage() {
  const db = await getPageContent();

  // Merge DB data với defaults (DB ưu tiên)
  const hero         = db?.hero         ?? null;
  const caseStudies  = (db?.case_studies && db.case_studies.length > 0) ? db.case_studies : defaultCaseStudies;
  const pricingPlans = (db?.pricing && db.pricing.length > 0) ? db.pricing : defaultPricingPlans;
  const faqItems     = (db?.faq && db.faq.length > 0) ? db.faq : faqSchema.mainEntity.map(f => ({ q: f.name, a: f.acceptedAnswer.text }));
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <Navbar />
      <SearchStrip />

      <div className="bg-white text-slate-900">

        {/* ── HERO ── */}
        <section className="relative overflow-hidden bg-white pt-20 pb-20 px-6 sm:px-8">
          {/* Subtle background decoration */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50/60 to-transparent" />
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl" />
            <div className="absolute top-40 right-1/4 w-48 h-48 bg-violet-100/30 rounded-full blur-2xl" />
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-slate-900 mb-5">
                  {hero?.headline ? (
                    <span>{hero.headline}</span>
                  ) : (
                    <>Tối Ưu{" "}
                      <span className="relative">
                        <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">SEO Onpage</span>
                        <svg className="absolute -bottom-1 left-0 w-full" height="4" viewBox="0 0 200 4" preserveAspectRatio="none">
                          <path d="M0 2 Q50 0 100 2 Q150 4 200 2" stroke="url(#u1)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                          <defs><linearGradient id="u1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#2563eb"/><stop offset="100%" stopColor="#7c3aed"/></linearGradient></defs>
                        </svg>
                      </span>
                      {" "}Nhanh Gấp 5 Lần Với AI
                    </>
                  )}
                </h1>
                <p className="text-lg text-slate-500 leading-relaxed mb-7">
                  {hero?.subtitle ?? "Quy trình 5 bước thực chiến dùng Claude AI + ChatGPT — kèm checklist 25 yếu tố và 2 case study thực tế tại Đồng Nai."}
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="#ai-workflow"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold rounded-xl hover:opacity-90 hover:shadow-lg hover:shadow-blue-200 transition-all text-sm">
                    {hero?.cta_primary ?? "Xem AI Workflow →"}
                  </Link>
                  <Link href="/contact"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all text-sm">
                    {hero?.cta_secondary ?? "Tư vấn miễn phí"}
                  </Link>
                </div>

                {/* Trust bar */}
                <div className="flex items-center gap-6 mt-8 pt-6 border-t border-slate-100">
                  {(hero?.stats ?? [{ val: "5×", label: "Nhanh hơn với AI" }, { val: "25+", label: "Tiêu chuẩn Onpage" }, { val: "3 tuần", label: "Thấy kết quả" }]).map((s: {val:string;label:string}) => (
                    <div key={s.label} className="text-center">
                      <div className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">{s.val}</div>
                      <div className="text-slate-400 text-xs mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: hero image (DB) hoặc workflow card (default) */}
              <div className="hidden lg:block">
                {hero?.hero_image ? (
                  <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-slate-200 border border-slate-100 aspect-[4/3]">
                    <Image src={hero.hero_image} alt="SEO Onpage" fill className="object-cover" unoptimized />
                  </div>
                ) : (
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200 border border-slate-100 p-6">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">AI Workflow — 41 phút/bài</p>
                  <div className="space-y-3">
                    {[
                      { step: "01", label: "Nghiên cứu từ khóa LSI", time: "10 phút", done: true },
                      { step: "02", label: "Viết Title + Meta hàng loạt", time: "5 phút", done: true },
                      { step: "03", label: "Tạo Outline chuẩn E-E-A-T", time: "8 phút", done: true },
                      { step: "04", label: "Tối ưu nội dung hiện có", time: "15 phút", done: false },
                      { step: "05", label: "Tạo Schema FAQ tự động", time: "3 phút", done: false },
                    ].map((row, i) => (
                      <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${row.done ? "bg-blue-50" : "bg-slate-50"}`}>
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${row.done ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"}`}>{row.step}</span>
                        <span className={`flex-1 text-sm font-medium ${row.done ? "text-blue-800" : "text-slate-600"}`}>{row.label}</span>
                        <span className="text-xs text-slate-400 flex-shrink-0">{row.time}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl text-white text-center">
                    <p className="text-xs font-medium opacity-80">So với thủ công: 4–6 giờ</p>
                    <p className="font-bold text-sm">Tiết kiệm 85% thời gian</p>
                  </div>
                </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── WHAT IS SEO ONPAGE ── */}
        <section className="py-16 px-6 sm:px-8 bg-slate-50">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-10 items-start">
              <div>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wide mb-3">Hiểu đúng trước khi làm</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4 leading-tight">
                  SEO Onpage là gì và tại sao quan trọng hơn backlink?
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4 text-sm">
                  SEO Onpage là tập hợp các kỹ thuật tối ưu hóa <strong className="text-slate-800">trực tiếp trên trang web</strong> — nội dung, cấu trúc HTML, URL, hình ảnh, tốc độ tải và internal link — giúp Google hiểu rõ trang của bạn đang nói về gì và phục vụ ai.
                </p>
                <p className="text-slate-600 leading-relaxed mb-6 text-sm">
                  Nhiều website đầu tư hàng chục triệu mua backlink mà bỏ quên SEO Onpage. Kết quả là Google không thể hiểu trang nói về gì — dù có backlink tốt vẫn không lên top. <strong className="text-slate-800">Onpage là nền tảng. Không có nền tảng, mọi effort khác đều lãng phí.</strong>
                </p>
                <div className="space-y-2.5">
                  {["Kiểm soát hoàn toàn — không phụ thuộc bên ngoài", "Kết quả bền vững, không mất khi dừng", "Chi phí thấp hơn backlink 3–5 lần", "Cải thiện UX → tăng chuyển đổi cùng lúc"].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                      </div>
                      <span className="text-slate-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-5 text-base flex items-center gap-2">
                  <span className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-xs">⚖️</span>
                  SEO Onpage vs Offpage
                </h3>
                <div className="space-y-1">
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <span />
                    <span className="text-center text-xs font-bold text-blue-600 bg-blue-50 py-1.5 rounded-lg">Onpage</span>
                    <span className="text-center text-xs font-bold text-slate-500 bg-slate-50 py-1.5 rounded-lg">Offpage</span>
                  </div>
                  {[
                    { label: "Kiểm soát", on: "100% chủ động", off: "Phụ thuộc ngoài" },
                    { label: "Chi phí", on: "Thấp – trung", off: "Trung – cao" },
                    { label: "Kết quả", on: "3–6 tuần", off: "2–6 tháng" },
                    { label: "Khi dừng", on: "Giữ nguyên", off: "Giảm dần" },
                    { label: "Rủi ro penalty", on: "Rất thấp", off: "Cao (link spam)" },
                  ].map((row) => (
                    <div key={row.label} className="grid grid-cols-3 gap-2 py-2 border-b border-slate-50">
                      <span className="text-slate-500 text-xs font-medium self-center">{row.label}</span>
                      <span className="px-2 py-1 bg-green-50 text-green-700 rounded-lg text-xs text-center font-medium">{row.on}</span>
                      <span className="px-2 py-1 bg-orange-50 text-orange-600 rounded-lg text-xs text-center">{row.off}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── AI WORKFLOW ── */}
        <section id="ai-workflow" className="py-16 px-6 sm:px-8 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 bg-violet-100 text-violet-700 text-xs font-bold rounded-full uppercase tracking-wide mb-3">Quy trình thực tế</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
                5 Bước Dùng AI Tối Ưu SEO Onpage
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto text-sm">
                Mỗi bước kèm prompt thực tế — copy và chạy ngay với Claude AI hoặc ChatGPT.
              </p>
            </div>

            <div className="space-y-5">
              {aiWorkflow.map((item, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-blue-200 transition-all">
                  <div className="flex items-start gap-4 p-5 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0">
                      {item.step}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-base">{item.icon}</span>
                        <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full border border-blue-100">⏱ {item.time}</span>
                      </div>
                      <p className="text-slate-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                  <div className="p-5 grid sm:grid-cols-2 gap-4 bg-slate-50/50">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">📋 Prompt mẫu</p>
                      <pre className="bg-slate-900 text-emerald-300 text-xs p-4 rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed font-mono border border-slate-700">
                        {item.prompt}
                      </pre>
                    </div>
                    <div className="flex flex-col justify-center gap-3">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">✅ Kết quả đạt được</p>
                        <div className="p-4 bg-white border border-emerald-200 rounded-xl text-slate-700 text-sm leading-relaxed shadow-sm">
                          <span className="text-emerald-600 font-semibold">→ </span>{item.result}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-bold text-slate-800 text-base">⏱ Tổng thời gian với AI: <span className="text-blue-600">~41 phút/bài</span></p>
                <p className="text-slate-500 text-sm mt-0.5">So với làm thủ công: 4–6 giờ. Tiết kiệm <strong>85% thời gian</strong>.</p>
              </div>
              <Link href="/contact" className="flex-shrink-0 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-700 transition-all">
                Thuê Sơn làm thay →
              </Link>
            </div>
          </div>
        </section>

        {/* ── CHECKLIST ── */}
        <section className="py-16 px-6 sm:px-8 bg-slate-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wide mb-3">Checklist 2026</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">25+ Yếu Tố SEO Onpage Cần Kiểm Tra</h2>
              <p className="text-slate-500 max-w-lg mx-auto text-sm">Cập nhật theo Google Search Central 2026. Print ra và tick từng mục trước khi publish bất kỳ trang nào.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {checklist.map((cat) => {
                const c = colorMap[cat.color];
                return (
                  <div key={cat.cat} className={`bg-white rounded-2xl p-5 border ${c.border} shadow-sm hover:shadow-md transition-all`}>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 ${c.badge} rounded-full text-xs font-bold mb-3`}>
                      <span>{cat.icon}</span>
                      {cat.cat}
                    </div>
                    <ul className="space-y-2.5">
                      {cat.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-xs text-slate-600">
                          <div className={`w-4 h-4 border-2 ${c.border} rounded flex-shrink-0 mt-0.5`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 text-center">
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-900 text-slate-900 font-bold rounded-xl hover:bg-slate-900 hover:text-white transition-all text-sm shadow-sm">
                📥 Nhận checklist PDF đầy đủ qua Zalo
              </Link>
            </div>
          </div>
        </section>

        {/* ── CASE STUDIES ── */}
        <section className="py-16 px-6 sm:px-8 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full uppercase tracking-wide mb-3">Kết quả thực tế</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">Case Study: Khách Hàng Tại Đồng Nai</h2>
              <p className="text-slate-500 text-sm">Số liệu thực tế từ Google Search Console, không phóng đại.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {caseStudies.map((cs: {icon:string;client:string;tag:string;challenge:string;issue:string;actions:string[];stats:{val:string;label:string}[];image?:string|null}, i: number) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
                  {/* Ảnh case study (nếu có) */}
                  {cs.image && (
                    <div className="relative h-40 w-full overflow-hidden">
                      <Image src={cs.image} alt={cs.client} fill className="object-cover" unoptimized />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                  )}
                  {/* Header */}
                  <div className="p-5 border-b border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{cs.icon}</span>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">{cs.client}</h3>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full">{cs.tag}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">{cs.challenge}</p>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* Problem */}
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                      <p className="text-xs font-bold text-red-600 mb-1">🔎 Vấn đề phát hiện</p>
                      <p className="text-slate-600 text-xs leading-relaxed">{cs.issue}</p>
                    </div>

                    {/* Actions */}
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">🛠 Hành động thực hiện</p>
                      <ul className="space-y-1.5">
                        {cs.actions.map((a) => (
                          <li key={a} className="flex items-start gap-2 text-xs text-slate-600">
                            <span className="text-blue-500 font-bold flex-shrink-0 mt-0.5">→</span>
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                      {cs.stats.map((s) => (
                        <div key={s.label} className="text-center p-2 bg-slate-50 rounded-xl">
                          <p className="font-extrabold text-blue-600 text-sm">{s.val}</p>
                          <p className="text-slate-400 text-xs mt-0.5">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section className="py-16 px-6 sm:px-8 bg-slate-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wide mb-3">Dịch vụ</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">Bảng Giá Dịch Vụ SEO Onpage</h2>
              <p className="text-slate-500 text-sm max-w-lg mx-auto">Triển khai bằng AI-workflow — chi phí tối ưu, kết quả nhanh hơn làm thủ công truyền thống.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {pricingPlans.map((plan: {name:string;price:string;note:string;highlight:boolean;cta:string;features:string[]}) => (
                <div key={plan.name}
                  className={`bg-white rounded-2xl overflow-hidden transition-all ${plan.highlight ? "border-2 border-blue-500 shadow-xl shadow-blue-100 scale-105" : "border border-slate-200 shadow-sm"}`}>
                  {plan.highlight && (
                    <div className="bg-gradient-to-r from-blue-600 to-violet-600 text-white text-center py-2 text-xs font-bold">
                      ⭐ Phổ biến nhất
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="font-bold text-slate-900 text-base mb-1">{plan.name}</h3>
                    <div className="flex items-end gap-1 mb-5">
                      <span className={`text-2xl font-extrabold ${plan.highlight ? "text-blue-600" : "text-slate-900"}`}>{plan.price}</span>
                      <span className="text-slate-400 text-sm mb-0.5">{plan.note}</span>
                    </div>
                    <ul className="space-y-2.5 mb-6">
                      {plan.features.map((f: string) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                          <svg className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.highlight ? "text-blue-500" : "text-emerald-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link href="/contact"
                      className={`block text-center py-3 px-4 rounded-xl font-bold text-sm transition-all ${plan.highlight ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>
                      {plan.cta}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-slate-400 text-xs mt-5">Giá chưa bao gồm VAT. Liên hệ để nhận báo giá tùy chỉnh theo quy mô website.</p>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-16 px-6 sm:px-8 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">Câu Hỏi Thường Gặp</h2>
              <p className="text-slate-500 text-sm">Những thắc mắc phổ biến nhất về SEO Onpage.</p>
            </div>
            <div className="space-y-3">
              {faqItems.map((faq: {q: string; a: string}, i: number) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-blue-200 transition-all shadow-sm">
                  <div className="p-5 border-b border-slate-50 bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 text-sm flex items-start gap-2">
                      <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">Q</span>
                      {faq.q}
                    </h3>
                  </div>
                  <div className="p-5">
                    <p className="text-slate-600 text-sm leading-relaxed pl-7">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="py-16 px-6 sm:px-8 bg-white border-t-4 border-blue-600">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-green-700 text-xs font-semibold mb-5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              Đang nhận dự án mới — tháng 6/2026
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">Sẵn Sàng Tối Ưu SEO Onpage?</h2>
            <p className="text-slate-500 text-base mb-8 leading-relaxed max-w-xl mx-auto">
              Audit miễn phí 30 phút — phát hiện ngay những lỗi Onpage đang kéo thứ hạng của bạn xuống.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-extrabold rounded-xl hover:opacity-90 hover:shadow-lg hover:shadow-blue-200 transition-all text-sm">
                Đặt lịch Audit miễn phí →
              </Link>
              <a href="tel:0968806360"
                className="px-8 py-4 border-2 border-slate-200 text-slate-800 font-semibold rounded-xl hover:border-blue-400 hover:text-blue-600 transition-all text-sm">
                📞 0968 806 360
              </a>
            </div>
            <p className="text-slate-400 text-xs mt-6">Phản hồi trong 2 giờ · Tư vấn không ràng buộc · Phục vụ toàn quốc</p>
          </div>
        </section>

        {/* ── INTERNAL LINKS ── */}
        <section className="py-8 px-6 sm:px-8 bg-white border-t border-slate-100">
          <div className="max-w-5xl mx-auto">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-3">Tìm hiểu thêm</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Dịch vụ SEO Organic toàn diện", href: "/#services" },
                { label: "Thiết kế Website WordPress chuẩn SEO", href: "/dich-vu/thiet-ke-website" },
                { label: "Dịch vụ Google Ads", href: "/#services" },
                { label: "Bảng giá dịch vụ", href: "/pricing" },
                { label: "Blog SEO & Marketing", href: "/blog" },
                { label: "Liên hệ tư vấn", href: "/contact" },
              ].map((link) => (
                <Link key={link.label} href={link.href}
                  className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium rounded-full hover:border-blue-300 hover:text-blue-600 transition-all">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

      </div>

      <Footer />
      <MobileBar />
    </>
  );
}
