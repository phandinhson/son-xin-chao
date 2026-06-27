"use client";
import { useEffect, useCallback, useState } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
type StatItem    = { num: string; label: string };
type PainItem    = { icon: string; problem: string; fix: string };
type PricingPkg  = { name: string; price: string; tag: string; desc: string; features: string[]; highlight: boolean };
type ProcessStep = { icon: string; title: string; desc: string; tag: string };
type FaqItem     = { q: string; a: string };

type HeroContent = {
  badge: string;
  headline: string;
  subline: string;
  description: string;
  feature_badges: string[];
  cta_primary: string;
  cta_secondary: string;
};

type PageContent = {
  hero: HeroContent;
  stats: StatItem[];
  pain_points: PainItem[];
  pricing: PricingPkg[];
  process: ProcessStep[];
  faq: FaqItem[];
};

const SLUG = "audit-tu-van";

// ─── Default content (mirror của public page) ────────────────────────────────
const DEFAULT: PageContent = {
  hero: {
    badge: "📍 Long Thành · Nhơn Trạch · Đồng Nai · TP.HCM",
    headline: "Audit SEO & Tư Vấn",
    subline: "Chiến Lược Digital Marketing",
    description: "Biết chính xác website đang yếu ở đâu, đối thủ tại Long Thành–Đồng Nai đang làm gì và cần làm gì trong 90 ngày tới để tăng trưởng. Không đoán mò — chỉ quyết định dựa trên data.",
    feature_badges: ["✅ Audit 50+ điểm kiểm tra", "✅ Phân tích 3–5 đối thủ", "✅ Lộ trình hành động cụ thể", "✅ Buổi đầu miễn phí"],
    cta_primary: "Đặt lịch tư vấn miễn phí →",
    cta_secondary: "Xem checklist audit",
  },
  stats: [
    { num: "50+",   label: "Điểm kiểm tra mỗi audit" },
    { num: "3–5",   label: "Đối thủ được phân tích" },
    { num: "30–50", label: "Trang báo cáo chi tiết" },
    { num: "0đ",    label: "Chi phí buổi tư vấn đầu" },
  ],
  pain_points: [
    { icon: "😤", problem: "Website không lên nổi top 10 dù đã làm SEO mấy tháng",          fix: "Tìm đúng nguyên nhân kỹ thuật hoặc content đang kéo tụt ranking" },
    { icon: "💸", problem: "Đã chi nhiều tiền cho SEO/Ads nhưng traffic không tăng",         fix: "Audit toàn diện để biết tiền đang bị lãng phí ở đâu" },
    { icon: "😕", problem: "Không biết bắt đầu từ đâu với digital marketing tại Long Thành", fix: "Lộ trình 90 ngày cụ thể, ưu tiên theo ROI, phù hợp ngân sách địa phương" },
    { icon: "👀", problem: "Đối thủ cùng khu vực Đồng Nai rank cao hơn dù website đẹp hơn", fix: "Phân tích chi tiết đối thủ địa phương để tìm ra chiến lược họ đang dùng" },
    { icon: "📉", problem: "Traffic organic giảm đột ngột sau khi Google update",            fix: "Xác định trang nào bị ảnh hưởng và kế hoạch phục hồi nhanh" },
    { icon: "🤔", problem: "Không biết từ khóa nào nên nhắm tới, cạnh tranh quá cao",       fix: "Nghiên cứu keyword gaps — cơ hội từ khóa địa phương đối thủ bỏ qua" },
  ],
  pricing: [
    {
      name: "Tư vấn nhanh", price: "Miễn phí", tag: "Bắt đầu tại đây",
      desc: "Phù hợp khi bạn muốn có góc nhìn tổng quan trước khi đầu tư",
      features: ["30–45 phút qua Zoom/call", "Đánh giá nhanh website", "Xác định 3–5 vấn đề cấp bách", "Định hướng chiến lược sơ bộ", "Không cam kết tiếp tục"],
      highlight: false,
    },
    {
      name: "Audit Cơ bản", price: "1.500.000đ", tag: "Phổ biến nhất",
      desc: "Kiểm tra kỹ thuật và on-page, báo cáo chi tiết, danh sách việc cần làm",
      features: ["Audit kỹ thuật 30 điểm", "Phân tích on-page SEO", "Kiểm tra tốc độ & Core Web Vitals", "Báo cáo PDF 20–25 trang", "1 buổi giải thích kết quả", "Danh sách ưu tiên hành động"],
      highlight: true,
    },
    {
      name: "Audit Toàn diện", price: "3.500.000đ", tag: "Chuyên sâu nhất",
      desc: "Đầy đủ 50+ điểm, phân tích đối thủ, lộ trình chi tiết 3–6 tháng",
      features: ["Audit đầy đủ 50+ điểm", "Phân tích 3–5 đối thủ trực tiếp", "Nghiên cứu keyword gaps", "Báo cáo PDF 40–50 trang", "2 buổi tư vấn (1h mỗi buổi)", "Lộ trình hành động 3–6 tháng", "Hỗ trợ Q&A 30 ngày sau audit"],
      highlight: false,
    },
  ],
  process: [
    { icon: "📞", title: "Buổi tư vấn khám phá (miễn phí)", desc: "30–45 phút. Tôi hiểu mục tiêu, tình trạng hiện tại và những thách thức bạn đang gặp tại thị trường Long Thành, Đồng Nai. Không bán hàng — chỉ lắng nghe và đưa ra đánh giá trung thực.", tag: "Ngày 1" },
    { icon: "🔍", title: "Thu thập data & Phân tích", desc: "Crawl website, phân tích GSC/Analytics, kiểm tra backlink profile, nghiên cứu đối thủ địa phương. Xử lý bằng công cụ chuyên nghiệp: Ahrefs, Screaming Frog, Google tools.", tag: "Ngày 2–5" },
    { icon: "📊", title: "Lập báo cáo chi tiết", desc: "Tổng hợp 50+ điểm kiểm tra, phân tích vấn đề theo mức độ ảnh hưởng, so sánh với 3–5 đối thủ tại Long Thành/Đồng Nai, xác định cơ hội tăng trưởng.", tag: "Ngày 5–7" },
    { icon: "🗺️", title: "Lộ trình hành động", desc: "Danh sách việc cần làm ưu tiên theo ROI, timeline cụ thể theo tuần/tháng, ước tính kết quả kỳ vọng. Bạn biết chính xác bước 1, 2, 3 cần làm.", tag: "Ngày 7" },
    { icon: "💬", title: "Buổi giải thích báo cáo", desc: "Trình bày toàn bộ báo cáo, giải thích từng vấn đề, ưu tiên cùng nhau quyết định hướng triển khai. Q&A không giới hạn trong buổi này.", tag: "Ngày 7–10" },
  ],
  faq: [
    { q: "Audit SEO là gì và tại sao doanh nghiệp Long Thành, Đồng Nai cần thiết?", a: "Audit SEO là quá trình kiểm tra toàn diện website: kỹ thuật, nội dung, backlink, trải nghiệm người dùng. Với doanh nghiệp tại Long Thành, Đồng Nai đang cạnh tranh với các đối thủ TP.HCM, audit giúp xác định chính xác điểm yếu và cơ hội từ khóa địa phương chưa ai khai thác." },
    { q: "Buổi tư vấn miễn phí gồm những gì?", a: "30–45 phút qua Zoom/call: tôi sẽ nghe về tình trạng hiện tại, mục tiêu kinh doanh và xem nhanh website của bạn. Sau đó đưa ra đánh giá sơ bộ và đề xuất hướng xử lý. Hoàn toàn không có áp lực bán hàng." },
    { q: "Báo cáo audit chi tiết đến mức nào?", a: "Báo cáo 30–50 trang: kiểm tra 50+ điểm kỹ thuật, phân tích từ khóa và content gaps, so sánh với 3–5 đối thủ cạnh tranh trực tiếp, bản đồ nhiệt hành vi người dùng (nếu có data), lộ trình 3–6 tháng cụ thể từng tuần." },
    { q: "Khác gì so với dùng công cụ audit miễn phí?", a: "Công cụ tự động chỉ liệt kê lỗi kỹ thuật. Tôi phân tích context kinh doanh: lỗi nào thực sự ảnh hưởng đến ranking tại Long Thành/Đồng Nai, đối thủ địa phương đang làm gì, cơ hội từ khóa chưa ai khai thác, và ưu tiên xử lý theo ROI." },
    { q: "Tư vấn có cam kết triển khai không?", a: "Buổi tư vấn và báo cáo audit là dịch vụ độc lập — bạn nhận được tài liệu chi tiết và hoàn toàn có thể tự triển khai hoặc giao cho đội ngũ khác. Nếu muốn tôi triển khai, sẽ có báo giá riêng sau khi đã hiểu rõ tình trạng." },
    { q: "Doanh nghiệp nhỏ ở Nhơn Trạch, Long Thành có cần audit SEO không?", a: "Đặc biệt cần! Doanh nghiệp nhỏ ở các khu vực đang phát triển như Long Thành, Nhơn Trạch có lợi thế cạnh tranh từ khóa địa phương cao hơn nhiều so với TP.HCM. Audit giúp tìm đúng cơ hội từ khóa phù hợp với ngân sách và mục tiêu của bạn." },
  ],
};

// ─── Shared Input Styles ──────────────────────────────────────────────────────
const inputCls    = "w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all";
const textareaCls = `${inputCls} resize-none`;
const labelCls    = "block text-xs text-gray-400 font-medium mb-1.5";

function Field({ label, value, onChange, textarea = false, rows = 3, placeholder = "" }: {
  label: string; value: string; onChange: (v: string) => void;
  textarea?: boolean; rows?: number; placeholder?: string;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {textarea
        ? <textarea className={textareaCls} rows={rows} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
        : <input className={inputCls} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      }
    </div>
  );
}

// ─── Inline tag list editor ───────────────────────────────────────────────────
function TagListEditor({ label, items, onChange }: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  const update = (i: number, val: string) => { const a = [...items]; a[i] = val; onChange(a); };
  const add    = () => onChange([...items, ""]);
  const remove = (i: number) => onChange(items.filter((_, j) => j !== i));
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className={labelCls}>{label}</label>
        <button onClick={add} className="text-blue-400 text-xs hover:text-blue-300 font-medium">+ Thêm</button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input className={`${inputCls} flex-1`} value={item} onChange={e => update(i, e.target.value)} placeholder={`Mục ${i + 1}`} />
            <button onClick={() => remove(i)} className="w-9 h-9 flex items-center justify-center text-red-400 hover:bg-red-500/20 rounded-lg transition-all flex-shrink-0 text-sm">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Mini preview badge ───────────────────────────────────────────────────────
function PreviewBadge({ label, color = "blue" }: { label: string; color?: string }) {
  const cls = color === "green" ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-blue-500/20 text-blue-400 border-blue-500/30";
  return <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${cls}`}>{label}</span>;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AuditTuVanEditor() {
  const [content, setContent]     = useState<PageContent>(DEFAULT);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [tab, setTab]             = useState<"hero" | "stats" | "pain" | "pricing" | "process" | "faq">("hero");

  // ─── Load từ DB ─────────────────────────────────────────────────────────────
  useEffect(() => {
    fetch(`/api/admin/service-pages/${SLUG}`)
      .then(r => r.json())
      .then(d => {
        if (d?.content && Object.keys(d.content).length > 0) {
          // Deep merge: DB data overrides DEFAULT
          setContent(prev => ({
            hero:        { ...prev.hero,        ...(d.content.hero        ?? {}) },
            stats:       d.content.stats        ?? prev.stats,
            pain_points: d.content.pain_points  ?? prev.pain_points,
            pricing:     d.content.pricing      ?? prev.pricing,
            process:     d.content.process      ?? prev.process,
            faq:         d.content.faq          ?? prev.faq,
          }));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // ─── Save ────────────────────────────────────────────────────────────────────
  const save = useCallback(async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const res  = await fetch(`/api/admin/service-pages/${SLUG}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setSaveError(data.error || "Lưu thất bại — kiểm tra bảng service_pages trong Supabase.");
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      setSaveError("Không thể kết nối server.");
    }
    setSaving(false);
  }, [content]);

  // ─── Helpers ──────────────────────────────────────────────────────────────────
  const setHero = (patch: Partial<HeroContent>) =>
    setContent(c => ({ ...c, hero: { ...c.hero, ...patch } }));

  const setStat = (i: number, patch: Partial<StatItem>) =>
    setContent(c => { const a = [...c.stats]; a[i] = { ...a[i], ...patch }; return { ...c, stats: a }; });

  const setPain = (i: number, patch: Partial<PainItem>) =>
    setContent(c => { const a = [...c.pain_points]; a[i] = { ...a[i], ...patch }; return { ...c, pain_points: a }; });
  const addPain    = () => setContent(c => ({ ...c, pain_points: [...c.pain_points, { icon: "❓", problem: "", fix: "" }] }));
  const removePain = (i: number) => setContent(c => ({ ...c, pain_points: c.pain_points.filter((_, j) => j !== i) }));

  const setPkg = (i: number, patch: Partial<PricingPkg>) =>
    setContent(c => { const a = [...c.pricing]; a[i] = { ...a[i], ...patch }; return { ...c, pricing: a }; });
  const setPkgFeature = (pi: number, fi: number, val: string) =>
    setContent(c => { const a = [...c.pricing]; const feats = [...a[pi].features]; feats[fi] = val; a[pi] = { ...a[pi], features: feats }; return { ...c, pricing: a }; });
  const addPkgFeature = (pi: number) =>
    setContent(c => { const a = [...c.pricing]; a[pi] = { ...a[pi], features: [...a[pi].features, ""] }; return { ...c, pricing: a }; });
  const removePkgFeature = (pi: number, fi: number) =>
    setContent(c => { const a = [...c.pricing]; a[pi] = { ...a[pi], features: a[pi].features.filter((_, j) => j !== fi) }; return { ...c, pricing: a }; });
  const addPkg    = () => setContent(c => ({ ...c, pricing: [...c.pricing, { name: "", price: "", tag: "", desc: "", features: [""], highlight: false }] }));
  const removePkg = (i: number) => setContent(c => ({ ...c, pricing: c.pricing.filter((_, j) => j !== i) }));

  const setStep = (i: number, patch: Partial<ProcessStep>) =>
    setContent(c => { const a = [...c.process]; a[i] = { ...a[i], ...patch }; return { ...c, process: a }; });
  const addStep    = () => setContent(c => ({ ...c, process: [...c.process, { icon: "📋", title: "", desc: "", tag: "" }] }));
  const removeStep = (i: number) => setContent(c => ({ ...c, process: c.process.filter((_, j) => j !== i) }));

  const setFaq = (i: number, patch: Partial<FaqItem>) =>
    setContent(c => { const a = [...c.faq]; a[i] = { ...a[i], ...patch }; return { ...c, faq: a }; });
  const addFaq    = () => setContent(c => ({ ...c, faq: [...c.faq, { q: "", a: "" }] }));
  const removeFaq = (i: number) => setContent(c => ({ ...c, faq: c.faq.filter((_, j) => j !== i) }));

  const TABS = [
    { id: "hero"    as const, label: "Hero",      icon: "🦸" },
    { id: "stats"   as const, label: "Số liệu",   icon: "📊" },
    { id: "pain"    as const, label: "Vấn đề",    icon: "😤" },
    { id: "pricing" as const, label: "Bảng giá",  icon: "💰" },
    { id: "process" as const, label: "Quy trình", icon: "🗂️" },
    { id: "faq"     as const, label: "FAQ",        icon: "❓" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Đang tải dữ liệu trang Audit SEO...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ── Error toast ── */}
      {saveError && (
        <div className="fixed top-4 right-4 z-50 max-w-sm bg-red-900 border border-red-500 text-red-100 text-sm px-4 py-3 rounded-xl shadow-xl flex items-start gap-3">
          <span className="flex-shrink-0 mt-0.5">⚠️</span>
          <div className="flex-1">
            <p className="font-bold mb-0.5">Lưu thất bại</p>
            <p className="text-red-300 text-xs">{saveError}</p>
          </div>
          <button onClick={() => setSaveError(null)} className="text-red-400 hover:text-white flex-shrink-0">✕</button>
        </div>
      )}

      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-30 bg-gray-900/95 backdrop-blur border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-white">Chỉnh sửa trang Audit SEO</h1>
            <p className="text-gray-500 text-xs mt-0.5">/dich-vu/audit-tu-van</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dich-vu/audit-tu-van" target="_blank"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-xl transition-all flex items-center gap-2">
              👁 Xem trang
            </Link>
            <button onClick={save} disabled={saving}
              className={`px-5 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${saved ? "bg-green-600" : "bg-blue-600 hover:bg-blue-500"} disabled:opacity-60`}>
              {saving ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
              {saving ? "Đang lưu..." : saved ? "✓ Đã lưu!" : "💾 Lưu thay đổi"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto px-6 flex gap-1 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
                tab === t.id
                  ? "text-blue-400 border-blue-500 bg-blue-500/10"
                  : "text-gray-500 border-transparent hover:text-gray-300"
              }`}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* ══════════════ TAB: HERO ══════════════ */}
        {tab === "hero" && (
          <>
            <div className="bg-gray-900 rounded-2xl p-6 border border-white/10 space-y-5">
              <h2 className="text-base font-bold border-b border-white/10 pb-3">📍 Badge & Tiêu đề</h2>
              <Field label="Badge địa điểm (trên H1)" value={content.hero.badge} onChange={v => setHero({ badge: v })}
                placeholder="📍 Long Thành · Nhơn Trạch · Đồng Nai · TP.HCM" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Tiêu đề chính (H1 — phần xanh)" value={content.hero.headline} onChange={v => setHero({ headline: v })}
                  placeholder="Audit SEO & Tư Vấn" />
                <Field label="Dòng phụ dưới H1" value={content.hero.subline} onChange={v => setHero({ subline: v })}
                  placeholder="Chiến Lược Digital Marketing" />
              </div>
              <Field label="Đoạn mô tả ngắn" textarea rows={3} value={content.hero.description} onChange={v => setHero({ description: v })} />
            </div>

            <div className="bg-gray-900 rounded-2xl p-6 border border-white/10 space-y-5">
              <h2 className="text-base font-bold border-b border-white/10 pb-3">🏷️ Feature Badges & CTA</h2>
              <TagListEditor
                label="Các badge tính năng (✅ ...)"
                items={content.hero.feature_badges}
                onChange={v => setHero({ feature_badges: v })}
              />
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <Field label="Nút CTA chính" value={content.hero.cta_primary} onChange={v => setHero({ cta_primary: v })} placeholder="Đặt lịch tư vấn miễn phí →" />
                <Field label="Nút CTA phụ" value={content.hero.cta_secondary} onChange={v => setHero({ cta_secondary: v })} placeholder="Xem checklist audit" />
              </div>
            </div>

            {/* Mini preview */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-white/10">
              <h2 className="text-base font-bold border-b border-white/10 pb-3 mb-5">👁 Preview Hero</h2>
              <div className="bg-gradient-to-br from-slate-700 to-blue-900 rounded-xl p-6 text-white">
                <div className="text-xs bg-white/15 border border-white/20 rounded-full px-3 py-1 inline-block mb-3 opacity-80">
                  {content.hero.badge}
                </div>
                <h3 className="text-2xl font-extrabold mb-1">
                  <span className="text-blue-300">{content.hero.headline || "Audit SEO"}</span>
                </h3>
                <p className="text-slate-300 text-sm font-semibold mb-2">{content.hero.subline}</p>
                <p className="text-slate-200 text-xs leading-relaxed mb-4 max-w-md">{content.hero.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {content.hero.feature_badges.map((b, i) => (
                    <span key={i} className="text-xs bg-white/15 border border-white/20 px-2.5 py-1 rounded-full">{b}</span>
                  ))}
                </div>
                <div className="flex gap-3">
                  <span className="px-4 py-2 bg-blue-400 text-slate-900 text-xs font-bold rounded-full">{content.hero.cta_primary}</span>
                  <span className="px-4 py-2 bg-white/15 border border-white/30 text-white text-xs font-semibold rounded-full">{content.hero.cta_secondary}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ══════════════ TAB: STATS ══════════════ */}
        {tab === "stats" && (
          <div className="bg-gray-900 rounded-2xl p-6 border border-white/10 space-y-5">
            <h2 className="text-base font-bold border-b border-white/10 pb-3">📊 4 Số liệu thống kê nổi bật</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {content.stats.map((s, i) => (
                <div key={i} className="bg-gray-800 rounded-xl p-4 space-y-3">
                  <p className="text-gray-400 text-xs font-medium">Số liệu {i + 1}</p>
                  <Field label="Số / giá trị (vd: 50+)" value={s.num} onChange={v => setStat(i, { num: v })} placeholder="50+" />
                  <Field label="Nhãn mô tả" value={s.label} onChange={v => setStat(i, { label: v })} placeholder="Điểm kiểm tra mỗi audit" />
                </div>
              ))}
            </div>

            {/* Preview */}
            <div className="bg-white rounded-xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center mt-4">
              {content.stats.map((s, i) => (
                <div key={i}>
                  <div className="text-xl font-extrabold text-blue-600">{s.num || "—"}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{s.label || "..."}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════ TAB: PAIN POINTS ══════════════ */}
        {tab === "pain" && (
          <>
            {content.pain_points.map((p, i) => (
              <div key={i} className="bg-gray-900 rounded-2xl border border-white/10 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 bg-gray-800/60 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{p.icon || "❓"}</span>
                    <span className="text-sm font-semibold text-gray-300 truncate max-w-xs">{p.problem || `Vấn đề ${i + 1}`}</span>
                  </div>
                  <button onClick={() => removePain(i)} className="text-red-400 hover:bg-red-500/20 text-xs px-2.5 py-1 rounded-lg transition-all">Xóa</button>
                </div>
                <div className="p-5 space-y-4">
                  <div className="grid sm:grid-cols-[80px,1fr] gap-3">
                    <Field label="Icon" value={p.icon} onChange={v => setPain(i, { icon: v })} placeholder="😤" />
                    <Field label="Câu hỏi / vấn đề khách hàng gặp" value={p.problem} onChange={v => setPain(i, { problem: v })} placeholder="Website không lên top..." />
                  </div>
                  <Field label="✅ Giải pháp audit mang lại" value={p.fix} onChange={v => setPain(i, { fix: v })} placeholder="Tìm đúng nguyên nhân kỹ thuật..." />
                </div>
              </div>
            ))}

            <button onClick={addPain}
              className="w-full py-3 border-2 border-dashed border-white/20 text-gray-400 hover:border-blue-500 hover:text-blue-400 rounded-2xl text-sm font-medium transition-all">
              + Thêm vấn đề mới
            </button>
          </>
        )}

        {/* ══════════════ TAB: PRICING ══════════════ */}
        {tab === "pricing" && (
          <>
            {content.pricing.map((pkg, pi) => (
              <div key={pi} className={`bg-gray-900 rounded-2xl border overflow-hidden ${pkg.highlight ? "border-blue-500/50" : "border-white/10"}`}>
                {/* Card header */}
                <div className="flex items-center justify-between px-6 py-4 bg-gray-800/50 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${pkg.highlight ? "bg-blue-500" : "bg-gray-600"}`} />
                    <p className="font-bold text-white">{pkg.name || `Gói ${pi + 1}`}</p>
                    {pkg.highlight && <PreviewBadge label="Nổi bật" />}
                  </div>
                  <button onClick={() => removePkg(pi)} className="text-red-400 hover:bg-red-500/20 text-xs px-2.5 py-1 rounded-lg transition-all">Xóa gói</button>
                </div>

                <div className="p-6 space-y-5">
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Field label="Tên gói" value={pkg.name} onChange={v => setPkg(pi, { name: v })} placeholder="Audit Cơ bản" />
                    <Field label="Giá (vd: 1.500.000đ)" value={pkg.price} onChange={v => setPkg(pi, { price: v })} placeholder="1.500.000đ" />
                    <Field label="Tag hiển thị" value={pkg.tag} onChange={v => setPkg(pi, { tag: v })} placeholder="Phổ biến nhất" />
                  </div>

                  <Field label="Mô tả ngắn" textarea rows={2} value={pkg.desc} onChange={v => setPkg(pi, { desc: v })} />

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className={labelCls}>Tính năng bao gồm</label>
                      <button onClick={() => addPkgFeature(pi)} className="text-blue-400 text-xs hover:text-blue-300 font-medium">+ Thêm tính năng</button>
                    </div>
                    <div className="space-y-2">
                      {pkg.features.map((f, fi) => (
                        <div key={fi} className="flex gap-2">
                          <input className={`${inputCls} flex-1`} value={f} onChange={e => setPkgFeature(pi, fi, e.target.value)} placeholder={`Tính năng ${fi + 1}`} />
                          <button onClick={() => removePkgFeature(pi, fi)} className="w-9 h-9 flex items-center justify-center text-red-400 hover:bg-red-500/20 rounded-lg flex-shrink-0 text-sm">✕</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Nổi bật (highlight gói này)</label>
                    <button onClick={() => setPkg(pi, { highlight: !pkg.highlight })}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                        pkg.highlight ? "bg-blue-500/20 border-blue-500 text-blue-400" : "bg-gray-800 border-white/10 text-gray-400"
                      }`}>
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${pkg.highlight ? "bg-blue-500 border-blue-500" : "border-gray-500"}`}>
                        {pkg.highlight && <span className="text-white text-xs font-bold">✓</span>}
                      </div>
                      {pkg.highlight ? "Đang hiển thị nổi bật" : "Đặt làm gói nổi bật"}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button onClick={addPkg}
              className="w-full py-3 border-2 border-dashed border-white/20 text-gray-400 hover:border-blue-500 hover:text-blue-400 rounded-2xl text-sm font-medium transition-all">
              + Thêm gói mới
            </button>

            {/* Pricing preview */}
            <div className="bg-gray-900 rounded-2xl p-5 border border-white/10">
              <p className="text-xs text-gray-500 font-medium mb-4 uppercase tracking-wider">Preview bảng giá</p>
              <div className="grid md:grid-cols-3 gap-4">
                {content.pricing.map((pkg, i) => (
                  <div key={i} className={`rounded-xl p-4 border-2 ${pkg.highlight ? "border-blue-400 bg-blue-600/20" : "border-white/10 bg-gray-800"}`}>
                    <p className="text-xs text-gray-400 mb-1">{pkg.tag}</p>
                    <p className="font-bold text-white text-sm">{pkg.name || "—"}</p>
                    <p className={`text-xl font-extrabold mt-1 ${pkg.highlight ? "text-yellow-300" : "text-blue-400"}`}>{pkg.price || "—"}</p>
                    <ul className="mt-3 space-y-1">
                      {pkg.features.slice(0, 3).map((f, fi) => (
                        <li key={fi} className="text-xs text-gray-400 flex items-start gap-1.5">
                          <span className="text-emerald-400 flex-shrink-0">✓</span> {f || "..."}
                        </li>
                      ))}
                      {pkg.features.length > 3 && <li className="text-xs text-gray-600">+{pkg.features.length - 3} tính năng khác</li>}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ══════════════ TAB: PROCESS ══════════════ */}
        {tab === "process" && (
          <>
            {content.process.map((step, i) => (
              <div key={i} className="bg-gray-900 rounded-2xl border border-white/10 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 bg-gray-800/60 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{step.icon || "📋"}</span>
                    <div>
                      <span className="text-xs text-blue-400 font-medium mr-2">Bước {i + 1}</span>
                      <span className="text-sm font-semibold text-gray-300">{step.title || "..."}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {i > 0 && (
                      <button
                        onClick={() => setContent(c => { const a = [...c.process]; [a[i-1], a[i]] = [a[i], a[i-1]]; return { ...c, process: a }; })}
                        className="text-gray-500 hover:text-white text-xs px-2 py-1 rounded hover:bg-white/10 transition-all">▲</button>
                    )}
                    {i < content.process.length - 1 && (
                      <button
                        onClick={() => setContent(c => { const a = [...c.process]; [a[i], a[i+1]] = [a[i+1], a[i]]; return { ...c, process: a }; })}
                        className="text-gray-500 hover:text-white text-xs px-2 py-1 rounded hover:bg-white/10 transition-all">▼</button>
                    )}
                    <button onClick={() => removeStep(i)} className="text-red-400 hover:bg-red-500/20 text-xs px-2.5 py-1 rounded-lg transition-all ml-1">Xóa</button>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div className="grid sm:grid-cols-[80px,1fr,120px] gap-3">
                    <Field label="Icon" value={step.icon} onChange={v => setStep(i, { icon: v })} placeholder="📞" />
                    <Field label="Tiêu đề bước" value={step.title} onChange={v => setStep(i, { title: v })} placeholder="Buổi tư vấn khám phá" />
                    <Field label="Thời gian / Tag" value={step.tag} onChange={v => setStep(i, { tag: v })} placeholder="Ngày 1" />
                  </div>
                  <Field label="Mô tả chi tiết" textarea rows={3} value={step.desc} onChange={v => setStep(i, { desc: v })} />
                </div>
              </div>
            ))}

            <button onClick={addStep}
              className="w-full py-3 border-2 border-dashed border-white/20 text-gray-400 hover:border-blue-500 hover:text-blue-400 rounded-2xl text-sm font-medium transition-all">
              + Thêm bước mới
            </button>
          </>
        )}

        {/* ══════════════ TAB: FAQ ══════════════ */}
        {tab === "faq" && (
          <>
            {content.faq.map((item, i) => (
              <div key={i} className="bg-gray-900 rounded-2xl border border-white/10 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-medium bg-gray-800 px-2.5 py-1 rounded-full">Câu hỏi {i + 1}</span>
                  <button onClick={() => removeFaq(i)} className="text-red-400 hover:text-red-300 text-xs hover:bg-red-500/20 px-2.5 py-1 rounded-lg transition-all">Xóa</button>
                </div>
                <Field label="❓ Câu hỏi" value={item.q} onChange={v => setFaq(i, { q: v })} placeholder="Audit SEO là gì?" />
                <Field label="💬 Câu trả lời" textarea rows={4} value={item.a} onChange={v => setFaq(i, { a: v })} />
              </div>
            ))}

            {content.faq.length === 0 && (
              <div className="bg-gray-900 rounded-2xl border border-dashed border-white/20 p-10 text-center text-gray-500">
                Chưa có câu hỏi nào.
              </div>
            )}

            <button onClick={addFaq}
              className="w-full py-3 border-2 border-dashed border-white/20 text-gray-400 hover:border-blue-500 hover:text-blue-400 rounded-2xl text-sm font-medium transition-all">
              + Thêm câu hỏi FAQ
            </button>
          </>
        )}

      </div>

      {/* ── Bottom save bar ── */}
      <div className="sticky bottom-0 bg-gray-900/95 backdrop-blur border-t border-white/10 py-4 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <p className="text-gray-500 text-sm">
            {saved
              ? <span className="text-green-400 font-medium">✓ Đã lưu — trang public sẽ cập nhật ngay</span>
              : "Nhớ bấm Lưu sau khi chỉnh sửa xong"}
          </p>
          <button onClick={save} disabled={saving}
            className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${saved ? "bg-green-600" : "bg-blue-600 hover:bg-blue-500"} disabled:opacity-60`}>
            {saving ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
            {saving ? "Đang lưu..." : saved ? "✓ Đã lưu!" : "💾 Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
}
