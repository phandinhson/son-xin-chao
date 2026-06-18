"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

/* ─── Types ──────────────────────────────────────────── */
interface StatItem   { num: string; label: string; icon: string }
interface AdType     { icon: string; title: string; desc: string; tag: string }
interface StepItem   { step: string; title: string; desc: string; time: string; icon: string }
interface FaqItem    { q: string; a: string }

interface PageData {
  // Hero
  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  hero_desc: string;
  hero_cta_primary: string;
  hero_cta_primary_url: string;
  hero_trust_badges: string[]; // mảng các trust badge text
  // Stats
  stats: StatItem[];
  // Ad types
  adTypes: AdType[];
  // Steps
  steps: StepItem[];
  // Included
  included: string[];
  // FAQs
  faqs: FaqItem[];
  // CTA bottom
  cta_title: string;
  cta_subtitle: string;
  cta_desc: string;
}

const DEFAULTS: PageData = {
  hero_badge: "Quảng cáo Facebook & Instagram · Long Thành, Đồng Nai",
  hero_title: "Dịch Vụ Facebook Ads",
  hero_subtitle: "Đúng Người · Đúng Lúc · Đúng Chi Phí",
  hero_desc: "Target chính xác khách hàng tiềm năng tại Long Thành, Đồng Nai và toàn quốc.\nTối ưu ROAS, giảm CPA. Quản lý toàn diện Facebook & Instagram Ads.",
  hero_cta_primary: "Tư vấn miễn phí ngay",
  hero_cta_primary_url: "https://zalo.me/0968806360",
  hero_trust_badges: [
    "✅ Không cần hợp đồng dài hạn",
    "⚡ Chạy trong 48h",
    "📊 Báo cáo hàng tuần",
    "🛡️ Cam kết có lead",
  ],
  stats: [
    { num: "4–6x",  label: "ROAS trung bình",               icon: "📈" },
    { num: "3.5M+", label: "User Facebook tại Đồng Nai",    icon: "👥" },
    { num: "48h",   label: "Bắt đầu có lead",               icon: "⚡" },
    { num: "40%",   label: "Giảm CPA so với tự chạy",       icon: "💰" },
  ],
  adTypes: [
    { icon: "💬", title: "Tin nhắn & Lead",       desc: "Khách nhắn tin trực tiếp vào Fanpage hoặc điền form. Phù hợp dịch vụ, tư vấn, bán lẻ.",                   tag: "Phổ biến nhất" },
    { icon: "🛒", title: "Chuyển đổi website",    desc: "Dẫn traffic về website, tối ưu đơn hàng hoặc điền form. Cần pixel Facebook cài đặt đúng.",                 tag: "ROI cao" },
    { icon: "🎯", title: "Remarketing",           desc: "Nhắm lại người đã xem website, tương tác Fanpage nhưng chưa mua. Tỷ lệ chuyển đổi 3–5x.",                  tag: "Hiệu quả cao" },
    { icon: "📣", title: "Nhận diện thương hiệu", desc: "Tiếp cận đông người trong khu vực mục tiêu. Phù hợp shop mới khai trương, sản phẩm mới.",                   tag: "Brand" },
    { icon: "🎬", title: "Video Ads",             desc: "Quảng cáo video thu hút sự chú ý, kể câu chuyện thương hiệu. CPM thấp, tỷ lệ xem cao.",                    tag: "Engagement cao" },
    { icon: "📸", title: "Instagram Ads",         desc: "Quảng cáo trên Instagram — phù hợp ngành thời trang, làm đẹp, ẩm thực, lifestyle.",                          tag: "Visual" },
  ],
  steps: [
    { step: "01", title: "Phân tích & Lên chiến lược", desc: "Nghiên cứu đối thủ, xác định đối tượng mục tiêu, chọn mục tiêu chiến dịch phù hợp. Đề xuất ngân sách và timeline.", time: "Ngày 1–2",  icon: "🔍" },
    { step: "02", title: "Thiết lập kỹ thuật",         desc: "Cài Facebook Pixel, Conversion API, Business Manager, cấu hình tài khoản đúng chuẩn. Tạo custom & lookalike audience.", time: "Ngày 2–3",  icon: "⚙️" },
    { step: "03", title: "Tạo nội dung quảng cáo",     desc: "Viết ad copy thu hút (headline, primary text, CTA). Tư vấn hình ảnh/video hiệu quả hoặc thiết kế banner theo yêu cầu.", time: "Ngày 3–5",  icon: "✍️" },
    { step: "04", title: "Launch & Tối ưu liên tục",   desc: "Chạy A/B test đa dạng creative. Theo dõi hàng ngày, tắt quảng cáo kém, scale quảng cáo tốt. Báo cáo hàng tuần.", time: "Từ ngày 5+", icon: "🚀" },
  ],
  included: [
    "Thiết lập Business Manager & tài khoản Ads",
    "Cài đặt Facebook Pixel & Conversion API",
    "Phân tích đối tượng & tạo custom audience",
    "Viết ad copy A/B test (2–3 phiên bản)",
    "Tư vấn & thiết kế creative (hình ảnh/video)",
    "Tối ưu trang đích tăng tỷ lệ chuyển đổi",
    "Quản lý ngân sách & scale chiến dịch hiệu quả",
    "Remarketing & Lookalike audience",
    "Báo cáo hiệu quả hàng tuần (reach, CPM, CPA)",
    "Tư vấn nội dung Fanpage song song",
    "Hỗ trợ Zalo trong giờ làm việc",
    "Cập nhật theo thay đổi chính sách Meta",
  ],
  faqs: [
    { q: "Ngân sách tối thiểu để chạy Facebook Ads hiệu quả?",      a: "Tối thiểu 3–5 triệu/tháng ngân sách quảng cáo để có đủ data tối ưu. Với ngành cạnh tranh cao (bất động sản, xe hơi) nên từ 10 triệu/tháng. Phí quản lý tính riêng theo gói dịch vụ." },
    { q: "Facebook Ads có kết quả ngay không?",                       a: "Có traffic và tin nhắn ngay trong 24–48 giờ đầu. Tuy nhiên cần 1–2 tuần để thuật toán Facebook học đối tượng và tối ưu chi phí tốt nhất. Giai đoạn học máy quan trọng, không nên thay đổi quá nhiều." },
    { q: "Tôi có thể target khách hàng ở Long Thành, Đồng Nai không?", a: "Hoàn toàn được! Facebook cho phép target theo vị trí địa lý rất chi tiết — đến cấp xã/phường. Tôi sẽ target đúng khách hàng trong bán kính bạn muốn phục vụ." },
    { q: "Facebook Ads khác gì Google Ads?",                          a: "Google Ads tiếp cận người đang có nhu cầu tìm kiếm (demand capture). Facebook Ads tiếp cận người chưa tìm kiếm nhưng phù hợp đối tượng mục tiêu (demand generation) — thường phù hợp để tăng nhận diện và kích thích nhu cầu mua hàng." },
    { q: "Tôi cần chuẩn bị gì để bắt đầu chạy Facebook Ads?",       a: "Cần có: Fanpage Facebook hoạt động, tài khoản Business Manager, ngân sách quảng cáo (thẻ visa/mastercard hoặc tài khoản đã nạp tiền). Tôi sẽ hỗ trợ toàn bộ các bước thiết lập từ đầu." },
  ],
  cta_title: "Sẵn Sàng Bắt Đầu",
  cta_subtitle: "Chiến Dịch Facebook Ads?",
  cta_desc: "Tư vấn miễn phí — tôi phân tích đối thủ và đề xuất chiến lược phù hợp cho doanh nghiệp bạn trong 24 giờ.",
};

/* ─── Tabs ───────────────────────────────────────────── */
type Tab = "hero" | "stats" | "adtypes" | "steps" | "included" | "faq";
const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "hero",     label: "Hero",          icon: "🏠" },
  { id: "stats",    label: "Thống kê",      icon: "📊" },
  { id: "adtypes",  label: "Loại hình QC",  icon: "📋" },
  { id: "steps",    label: "Quy trình",     icon: "⚙️" },
  { id: "included", label: "Dịch vụ bao gồm", icon: "✅" },
  { id: "faq",      label: "FAQ",           icon: "❓" },
];

/* ─── Shared style ───────────────────────────────────── */
const inp  = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all text-sm";
const lbl  = "block text-gray-400 text-sm mb-1.5";
const card = "p-6 rounded-2xl bg-white/5 border border-white/10";

function Field({ label, value, onChange, multiline = false, placeholder = "", hint = "" }: {
  label: string; value: string; onChange: (v: string) => void;
  multiline?: boolean; placeholder?: string; hint?: string;
}) {
  return (
    <div>
      <label className={lbl}>
        {label}
        {hint && <span className="ml-1.5 text-gray-600 text-xs font-normal">— {hint}</span>}
      </label>
      {multiline
        ? <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={inp + " resize-none"} />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={inp} />
      }
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────── */
export default function AdminFacebookAds() {
  const [data, setData]   = useState<PageData>(DEFAULTS);
  const [tab, setTab]     = useState<Tab>("hero");
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [saveErr, setSaveErr]   = useState("");

  useEffect(() => {
    fetch("/api/admin/facebook-ads")
      .then(r => r.json())
      .then(d => { if (d && Object.keys(d).length > 0) setData({ ...DEFAULTS, ...d }); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true); setSaveErr("");
    const res = await fetch("/api/admin/facebook-ads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    else { const j = await res.json(); setSaveErr(j.error || "Lỗi lưu dữ liệu"); }
    setSaving(false);
  };

  /* helpers */
  const set = (k: keyof PageData, v: unknown) => setData(d => ({ ...d, [k]: v }));

  const setStat   = (i: number, f: keyof StatItem,  v: string) =>
    setData(d => { const a = [...d.stats];    a[i] = { ...a[i], [f]: v }; return { ...d, stats: a }; });
  const setAdType = (i: number, f: keyof AdType,    v: string) =>
    setData(d => { const a = [...d.adTypes];  a[i] = { ...a[i], [f]: v }; return { ...d, adTypes: a }; });
  const setStep   = (i: number, f: keyof StepItem,  v: string) =>
    setData(d => { const a = [...d.steps];    a[i] = { ...a[i], [f]: v }; return { ...d, steps: a }; });
  const setFaq    = (i: number, f: keyof FaqItem,   v: string) =>
    setData(d => { const a = [...d.faqs];     a[i] = { ...a[i], [f]: v }; return { ...d, faqs: a }; });
  const setIncluded = (i: number, v: string) =>
    setData(d => { const a = [...d.included]; a[i] = v; return { ...d, included: a }; });
  const addIncluded = () => setData(d => ({ ...d, included: [...d.included, ""] }));
  const delIncluded = (i: number) => setData(d => ({ ...d, included: d.included.filter((_, j) => j !== i) }));
  const setTrust = (i: number, v: string) =>
    setData(d => { const a = [...d.hero_trust_badges]; a[i] = v; return { ...d, hero_trust_badges: a }; });
  const addFaq = () => setData(d => ({ ...d, faqs: [...d.faqs, { q: "", a: "" }] }));
  const delFaq = (i: number) => setData(d => ({ ...d, faqs: d.faqs.filter((_, j) => j !== i) }));

  if (loading) return (
    <div className="flex items-center justify-center h-96 text-gray-500">
      <div className="text-center"><div className="text-4xl mb-3 animate-spin">⚙️</div><p>Đang tải...</p></div>
    </div>
  );

  return (
    <div className="p-8 max-w-4xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-white">Facebook Ads</h1>
            <Link href="/dich-vu/facebook-ads" target="_blank"
              className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/10">
              🔗 Xem trang
            </Link>
          </div>
          <p className="text-gray-400 text-sm">Chỉnh sửa nội dung <code className="text-violet-400">/dich-vu/facebook-ads</code></p>
        </div>
        <div className="flex items-center gap-3">
          {saved   && <span className="text-green-400 text-sm animate-pulse">✅ Đã lưu!</span>}
          {saveErr && <span className="text-red-400 text-sm">{saveErr}</span>}
          <button onClick={handleSave} disabled={saving}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 text-sm transition-all">
            {saving ? "Đang lưu..." : "💾 Lưu thay đổi"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tab === t.id
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
            }`}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* ══════ HERO ══════ */}
      {tab === "hero" && (
        <div className="space-y-6">
          <div className={card + " space-y-4"}>
            <h2 className="text-white font-semibold flex items-center gap-2">🏠 Hero Section</h2>
            <Field label="Badge (dòng nhỏ trên tiêu đề)" value={data.hero_badge} onChange={v => set("hero_badge", v)} placeholder="Quảng cáo Facebook & Instagram · Long Thành, Đồng Nai" />
            <Field label="Tiêu đề chính" value={data.hero_title} onChange={v => set("hero_title", v)} placeholder="Dịch Vụ Facebook Ads" />
            <Field label="Tiêu đề phụ (dòng 2)" value={data.hero_subtitle} onChange={v => set("hero_subtitle", v)} placeholder="Đúng Người · Đúng Lúc · Đúng Chi Phí" />
            <Field label="Mô tả" value={data.hero_desc} onChange={v => set("hero_desc", v)} multiline placeholder="Target chính xác khách hàng tiềm năng..." />
          </div>

          <div className={card + " space-y-4"}>
            <h2 className="text-white font-semibold flex items-center gap-2">🔗 CTA chính</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Text nút CTA" value={data.hero_cta_primary} onChange={v => set("hero_cta_primary", v)} placeholder="Tư vấn miễn phí ngay" />
              <Field label="Link URL" value={data.hero_cta_primary_url} onChange={v => set("hero_cta_primary_url", v)} placeholder="https://zalo.me/0968806360" />
            </div>
          </div>

          <div className={card + " space-y-3"}>
            <h2 className="text-white font-semibold flex items-center gap-2 mb-2">🏷️ Trust Badges</h2>
            <p className="text-gray-500 text-xs">4 badge nhỏ hiển thị dưới nút CTA trong hero</p>
            {data.hero_trust_badges.map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-gray-600 text-xs w-5 text-right">{i + 1}.</span>
                <input type="text" value={b} onChange={e => setTrust(i, e.target.value)}
                  className={inp + " flex-1"} placeholder="✅ Không cần hợp đồng dài hạn" />
              </div>
            ))}
          </div>

          <div className={card + " space-y-4"}>
            <h2 className="text-white font-semibold flex items-center gap-2">📣 CTA cuối trang</h2>
            <Field label="Tiêu đề dòng 1" value={data.cta_title} onChange={v => set("cta_title", v)} placeholder="Sẵn Sàng Bắt Đầu" />
            <Field label="Tiêu đề dòng 2 (màu vàng)" value={data.cta_subtitle} onChange={v => set("cta_subtitle", v)} placeholder="Chiến Dịch Facebook Ads?" />
            <Field label="Mô tả" value={data.cta_desc} onChange={v => set("cta_desc", v)} multiline placeholder="Tư vấn miễn phí — tôi phân tích đối thủ..." />
          </div>
        </div>
      )}

      {/* ══════ STATS ══════ */}
      {tab === "stats" && (
        <div className="space-y-4">
          <p className="text-gray-500 text-sm">4 con số nổi bật hiển thị dưới hero section</p>
          <div className="grid md:grid-cols-2 gap-4">
            {data.stats.map((s, i) => (
              <div key={i} className={card + " space-y-3"}>
                <h3 className="text-white font-semibold text-sm">Stat #{i + 1}</h3>
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Icon" value={s.icon}  onChange={v => setStat(i, "icon",  v)} placeholder="📈" />
                  <div className="col-span-2">
                    <Field label="Con số" value={s.num}  onChange={v => setStat(i, "num",   v)} placeholder="4–6x" />
                  </div>
                </div>
                <Field label="Mô tả" value={s.label} onChange={v => setStat(i, "label", v)} placeholder="ROAS trung bình" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════ AD TYPES ══════ */}
      {tab === "adtypes" && (
        <div className="space-y-4">
          <p className="text-gray-500 text-sm">6 loại hình quảng cáo hiển thị dạng card grid</p>
          {data.adTypes.map((t, i) => (
            <div key={i} className={card + " space-y-3"}>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{t.icon}</span>
                <h3 className="text-white font-semibold text-sm">Loại hình #{i + 1}</h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Icon" value={t.icon}  onChange={v => setAdType(i, "icon",  v)} placeholder="💬" />
                <div className="col-span-2">
                  <Field label="Tên loại hình" value={t.title} onChange={v => setAdType(i, "title", v)} placeholder="Tin nhắn & Lead" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Tag nhãn" value={t.tag} onChange={v => setAdType(i, "tag", v)} placeholder="Phổ biến nhất" />
                <div className="col-span-2">
                  <Field label="Mô tả" value={t.desc} onChange={v => setAdType(i, "desc", v)} placeholder="Mô tả ngắn về loại hình này..." />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══════ STEPS ══════ */}
      {tab === "steps" && (
        <div className="space-y-4">
          <p className="text-gray-500 text-sm">4 bước quy trình triển khai (section nền xanh đậm)</p>
          {data.steps.map((s, i) => (
            <div key={i} className={card + " space-y-3"}>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{s.icon}</span>
                <span className="text-blue-400 font-bold text-sm">BƯỚC {s.step}</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Icon" value={s.icon} onChange={v => setStep(i, "icon", v)} placeholder="🔍" />
                <div className="col-span-2">
                  <Field label="Tên bước" value={s.title} onChange={v => setStep(i, "title", v)} placeholder="Phân tích & Lên chiến lược" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Thời gian" value={s.time} onChange={v => setStep(i, "time", v)} placeholder="Ngày 1–2" />
                <div className="col-span-2">
                  <Field label="Mô tả" value={s.desc} onChange={v => setStep(i, "desc", v)} multiline placeholder="Mô tả chi tiết bước này..." />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══════ INCLUDED ══════ */}
      {tab === "included" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-sm">Danh sách dịch vụ bao gồm trong gói ({data.included.length} mục)</p>
            <button onClick={addIncluded}
              className="px-4 py-2 text-sm font-semibold rounded-xl bg-green-600/20 text-green-400 border border-green-500/30 hover:bg-green-600/30 transition-all">
              + Thêm mục
            </button>
          </div>
          <div className={card + " space-y-2"}>
            {data.included.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs flex-shrink-0 font-bold">
                  ✓
                </div>
                <input type="text" value={item} onChange={e => setIncluded(i, e.target.value)}
                  className={inp + " flex-1"} placeholder="Mô tả dịch vụ..." />
                <button onClick={() => delIncluded(i)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500/60 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0 text-sm">
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════ FAQ ══════ */}
      {tab === "faq" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-sm">Câu hỏi thường gặp ({data.faqs.length} câu)</p>
            <button onClick={addFaq}
              className="px-4 py-2 text-sm font-semibold rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30 hover:bg-violet-600/30 transition-all">
              + Thêm câu hỏi
            </button>
          </div>
          {data.faqs.map((faq, i) => (
            <div key={i} className={card + " space-y-3"}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center text-xs font-bold">Q</span>
                  <span className="text-gray-400 text-sm font-medium">Câu hỏi #{i + 1}</span>
                </div>
                <button onClick={() => delFaq(i)}
                  className="text-red-500/60 hover:text-red-400 text-xs hover:bg-red-500/10 px-2 py-1 rounded-lg transition-all">
                  Xóa
                </button>
              </div>
              <Field label="Câu hỏi" value={faq.q} onChange={v => setFaq(i, "q", v)} placeholder="Ngân sách tối thiểu để chạy Facebook Ads hiệu quả?" />
              <div>
                <label className={lbl}>
                  <span className="w-6 h-6 rounded-lg bg-green-600/30 text-green-400 inline-flex items-center justify-center text-xs font-bold mr-2">A</span>
                  Câu trả lời
                </label>
                <textarea rows={3} value={faq.a} onChange={e => setFaq(i, "a", e.target.value)}
                  placeholder="Câu trả lời chi tiết..."
                  className={inp + " resize-none"} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom save */}
      <div className="mt-8 flex items-center justify-between py-4 border-t border-white/5">
        <p className="text-gray-600 text-sm">
          💡 Sau khi lưu, trang{" "}
          <Link href="/dich-vu/facebook-ads" target="_blank" className="text-violet-400 hover:underline">
            /dich-vu/facebook-ads
          </Link>{" "}
          cập nhật ngay.
        </p>
        <button onClick={handleSave} disabled={saving}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all">
          {saving ? "Đang lưu..." : "💾 Lưu tất cả thay đổi"}
        </button>
      </div>
    </div>
  );
}
