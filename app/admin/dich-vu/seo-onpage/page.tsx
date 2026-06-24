"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────────────────────
type Stat       = { val: string; label: string };
type Hero       = { headline: string; subtitle: string; cta_primary: string; cta_secondary: string; hero_image: string | null; stats: Stat[] };
type CaseStat   = { val: string; label: string };
type CaseStudy  = { client: string; icon: string; tag: string; challenge: string; issue: string; actions: string[]; stats: CaseStat[]; image: string | null };
type PricingPlan= { name: string; price: string; note: string; highlight: boolean; cta: string; features: string[] };
type FaqItem    = { q: string; a: string };
type PageContent= { hero: Hero; case_studies: CaseStudy[]; pricing: PricingPlan[]; faq: FaqItem[] };

const SLUG = "seo-onpage";

// ─── Default data ─────────────────────────────────────────────────────────────
const DEFAULT: PageContent = {
  hero: { headline: "Tối Ưu SEO Onpage Nhanh Gấp 5 Lần Với AI", subtitle: "Quy trình 5 bước thực chiến dùng Claude AI + ChatGPT.", cta_primary: "Xem AI Workflow →", cta_secondary: "Tư vấn miễn phí", hero_image: null, stats: [{ val: "5×", label: "Nhanh hơn với AI" }, { val: "25+", label: "Tiêu chuẩn Onpage" }, { val: "3 tuần", label: "Thấy kết quả" }] },
  case_studies: [],
  pricing: [],
  faq: [],
};

// ─── Media Picker Modal ────────────────────────────────────────────────────────
type MediaFile = { name: string; url: string; sizeLabel: string };

function MediaModal({ onSelect, onClose }: { onSelect: (url: string) => void; onClose: () => void }) {
  const [files, setFiles]     = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/media").then(r => r.json()).then(d => { setFiles(d); setLoading(false); });
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("files", file);
    const res = await fetch("/api/admin/media", { method: "POST", body: fd });
    const data = await res.json();
    if (data.urls?.[0]) {
      onSelect(data.urls[0]);
    }
    setUploading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl border border-white/10">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h3 className="text-white font-bold">Thư viện ảnh</h3>
          <div className="flex items-center gap-3">
            <button onClick={() => fileRef.current?.click()}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2">
              {uploading ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "📤"}
              {uploading ? "Đang tải..." : "Upload ảnh mới"}
            </button>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white rounded-lg hover:bg-white/10">✕</button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex items-center justify-center h-40 text-gray-500">Đang tải...</div>
          ) : files.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-500">Chưa có ảnh nào. Upload ảnh đầu tiên!</div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {files.map(f => (
                <button key={f.url} onClick={() => onSelect(f.url)}
                  className="group relative aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all">
                  <Image src={f.url} alt={f.name} fill className="object-cover group-hover:scale-105 transition-transform" unoptimized />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-end">
                    <span className="w-full text-center text-white text-xs py-1 opacity-0 group-hover:opacity-100 transition-all truncate px-1">{f.sizeLabel}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Image Picker Button ───────────────────────────────────────────────────────
function ImagePicker({ value, onChange, label = "Ảnh" }: { value: string | null; onChange: (url: string | null) => void; label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <label className="block text-xs text-gray-400 font-medium mb-1.5">{label}</label>
      <div className="flex gap-3 items-start">
        {value ? (
          <div className="relative w-32 h-20 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 group">
            <Image src={value} alt="preview" fill className="object-cover" unoptimized />
            <button onClick={() => onChange(null)}
              className="absolute top-1 right-1 w-5 h-5 bg-red-600 rounded-full text-white text-xs opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">✕</button>
          </div>
        ) : (
          <div className="w-32 h-20 rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center text-gray-600 text-xs flex-shrink-0">Chưa có ảnh</div>
        )}
        <div className="flex flex-col gap-2">
          <button onClick={() => setOpen(true)}
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs font-medium rounded-lg transition-all">
            📷 Chọn ảnh
          </button>
          {value && (
            <span className="text-gray-500 text-xs truncate max-w-[150px]">{value.split("/").pop()}</span>
          )}
        </div>
      </div>
      {open && <MediaModal onSelect={(url) => { onChange(url); setOpen(false); }} onClose={() => setOpen(false)} />}
    </div>
  );
}

// ─── Reusable Inputs ──────────────────────────────────────────────────────────
const inputCls = "w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all";
const textareaCls = `${inputCls} resize-none`;
const labelCls = "block text-xs text-gray-400 font-medium mb-1.5";

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

// ─── Main Component ────────────────────────────────────────────────────────────
export default function SeoOnpageEditor() {
  const [content, setContent] = useState<PageContent>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [tab, setTab]         = useState<"hero" | "case" | "pricing" | "faq">("hero");

  useEffect(() => {
    fetch(`/api/admin/service-pages/${SLUG}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) {
          // Bảng chưa tồn tại hoặc lỗi khác — dùng DEFAULT
          console.warn("[admin] service_pages fetch:", d.error);
        } else if (d.content && Object.keys(d.content).length > 0) {
          setContent(prev => ({ ...prev, ...d.content }));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch(`/api/admin/service-pages/${SLUG}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setSaveError(data.error || "Lưu thất bại. Kiểm tra bảng service_pages trong Supabase.");
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      setSaveError("Không thể kết nối server.");
    }
    setSaving(false);
  }, [content]);

  const setHero = (patch: Partial<Hero>) => setContent(c => ({ ...c, hero: { ...c.hero, ...patch } }));

  // Case Studies helpers
  const setCase = (i: number, patch: Partial<CaseStudy>) =>
    setContent(c => { const arr = [...c.case_studies]; arr[i] = { ...arr[i], ...patch }; return { ...c, case_studies: arr }; });
  const setCaseAction = (ci: number, ai: number, val: string) =>
    setContent(c => { const arr = [...c.case_studies]; const acts = [...arr[ci].actions]; acts[ai] = val; arr[ci] = { ...arr[ci], actions: acts }; return { ...c, case_studies: arr }; });
  const addCaseAction = (ci: number) =>
    setContent(c => { const arr = [...c.case_studies]; arr[ci] = { ...arr[ci], actions: [...arr[ci].actions, ""] }; return { ...c, case_studies: arr }; });
  const removeCaseAction = (ci: number, ai: number) =>
    setContent(c => { const arr = [...c.case_studies]; arr[ci] = { ...arr[ci], actions: arr[ci].actions.filter((_, j) => j !== ai) }; return { ...c, case_studies: arr }; });
  const setCaseStat = (ci: number, si: number, patch: Partial<CaseStat>) =>
    setContent(c => { const arr = [...c.case_studies]; const stats = [...arr[ci].stats]; stats[si] = { ...stats[si], ...patch }; arr[ci] = { ...arr[ci], stats }; return { ...c, case_studies: arr }; });

  // Pricing helpers
  const setPlan = (i: number, patch: Partial<PricingPlan>) =>
    setContent(c => { const arr = [...c.pricing]; arr[i] = { ...arr[i], ...patch }; return { ...c, pricing: arr }; });
  const setPlanFeature = (pi: number, fi: number, val: string) =>
    setContent(c => { const arr = [...c.pricing]; const feats = [...arr[pi].features]; feats[fi] = val; arr[pi] = { ...arr[pi], features: feats }; return { ...c, pricing: arr }; });
  const addPlanFeature = (pi: number) =>
    setContent(c => { const arr = [...c.pricing]; arr[pi] = { ...arr[pi], features: [...arr[pi].features, ""] }; return { ...c, pricing: arr }; });
  const removePlanFeature = (pi: number, fi: number) =>
    setContent(c => { const arr = [...c.pricing]; arr[pi] = { ...arr[pi], features: arr[pi].features.filter((_, j) => j !== fi) }; return { ...c, pricing: arr }; });

  // FAQ helpers
  const setFaq = (i: number, patch: Partial<FaqItem>) =>
    setContent(c => { const arr = [...c.faq]; arr[i] = { ...arr[i], ...patch }; return { ...c, faq: arr }; });
  const addFaq = () =>
    setContent(c => ({ ...c, faq: [...c.faq, { q: "", a: "" }] }));
  const removeFaq = (i: number) =>
    setContent(c => ({ ...c, faq: c.faq.filter((_, j) => j !== i) }));

  const TABS = [
    { id: "hero" as const,    label: "Hero",        icon: "🦸" },
    { id: "case" as const,    label: "Case Study",  icon: "📊" },
    { id: "pricing" as const, label: "Bảng giá",    icon: "💰" },
    { id: "faq" as const,     label: "FAQ",         icon: "❓" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ── Header ── */}
      {/* Error toast */}
      {saveError && (
        <div className="fixed top-4 right-4 z-50 max-w-sm bg-red-900 border border-red-500 text-red-100 text-sm px-4 py-3 rounded-xl shadow-xl flex items-start gap-3">
          <span className="text-red-400 text-base flex-shrink-0">⚠️</span>
          <div className="flex-1">
            <p className="font-bold mb-0.5">Lưu thất bại</p>
            <p className="text-red-300 text-xs">{saveError}</p>
            <p className="text-red-400 text-xs mt-1">→ Chạy SQL trong <strong>Supabase Dashboard → SQL Editor</strong></p>
          </div>
          <button onClick={() => setSaveError(null)} className="text-red-400 hover:text-white flex-shrink-0">✕</button>
        </div>
      )}

      <div className="sticky top-0 z-30 bg-gray-900/95 backdrop-blur border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-white">Chỉnh sửa trang SEO Onpage</h1>
            <p className="text-gray-500 text-xs mt-0.5">/dich-vu/seo-onpage</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dich-vu/seo-onpage" target="_blank"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-xl transition-all flex items-center gap-2">
              👁 Xem trang
            </Link>
            <button onClick={save} disabled={saving}
              className={`px-5 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${saved ? "bg-green-600" : "bg-blue-600 hover:bg-blue-500"} disabled:opacity-60`}>
              {saving ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : saved ? "✓" : "💾"}
              {saving ? "Đang lưu..." : saved ? "Đã lưu!" : "Lưu thay đổi"}
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="max-w-5xl mx-auto px-6 flex gap-1 pb-0">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all border-b-2 ${tab === t.id ? "text-blue-400 border-blue-500 bg-blue-500/10" : "text-gray-500 border-transparent hover:text-gray-300"}`}>
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* ── TAB: HERO ── */}
        {tab === "hero" && (
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-2xl p-6 border border-white/10 space-y-5">
              <h2 className="text-base font-bold text-white border-b border-white/10 pb-3">📝 Nội dung Hero</h2>
              <Field label="Tiêu đề chính (H1)" value={content.hero.headline} onChange={v => setHero({ headline: v })} placeholder="Tối Ưu SEO Onpage Nhanh Gấp 5 Lần Với AI" />
              <Field label="Mô tả ngắn dưới tiêu đề" textarea rows={3} value={content.hero.subtitle} onChange={v => setHero({ subtitle: v })} />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Nút CTA chính" value={content.hero.cta_primary} onChange={v => setHero({ cta_primary: v })} placeholder="Xem AI Workflow →" />
                <Field label="Nút CTA phụ" value={content.hero.cta_secondary} onChange={v => setHero({ cta_secondary: v })} placeholder="Tư vấn miễn phí" />
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-6 border border-white/10 space-y-5">
              <h2 className="text-base font-bold text-white border-b border-white/10 pb-3">🖼 Ảnh Hero (tùy chọn)</h2>
              <ImagePicker value={content.hero.hero_image} onChange={url => setHero({ hero_image: url })} label="Ảnh nền / minh họa Hero" />
              <p className="text-gray-600 text-xs">Kích thước đề xuất: 1200×600px. Nếu để trống, sẽ hiển thị panel AI workflow mặc định.</p>
            </div>

            <div className="bg-gray-900 rounded-2xl p-6 border border-white/10 space-y-4">
              <h2 className="text-base font-bold text-white border-b border-white/10 pb-3">📊 3 Số liệu thống kê</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {content.hero.stats.map((s, i) => (
                  <div key={i} className="bg-gray-800 rounded-xl p-4 space-y-3">
                    <p className="text-gray-400 text-xs font-medium">Số liệu {i + 1}</p>
                    <Field label="Giá trị (vd: 5×)" value={s.val} onChange={v => { const stats = [...content.hero.stats]; stats[i] = { ...stats[i], val: v }; setHero({ stats }); }} />
                    <Field label="Nhãn (vd: Nhanh hơn)" value={s.label} onChange={v => { const stats = [...content.hero.stats]; stats[i] = { ...stats[i], label: v }; setHero({ stats }); }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Preview mini */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-white/10">
              <h2 className="text-base font-bold text-white border-b border-white/10 pb-3 mb-4">👁 Preview Hero</h2>
              <div className="bg-white rounded-xl p-6 text-slate-900">
                <h3 className="text-2xl font-extrabold leading-tight mb-2">{content.hero.headline || "..."}</h3>
                <p className="text-slate-500 text-sm mb-4">{content.hero.subtitle || "..."}</p>
                <div className="flex gap-3 mb-4">
                  <span className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg">{content.hero.cta_primary || "CTA 1"}</span>
                  <span className="px-4 py-2 border-2 border-slate-200 text-slate-700 text-sm font-semibold rounded-lg">{content.hero.cta_secondary || "CTA 2"}</span>
                </div>
                <div className="flex gap-6 pt-4 border-t border-slate-100">
                  {content.hero.stats.map((s, i) => (
                    <div key={i} className="text-center">
                      <p className="text-lg font-extrabold text-blue-600">{s.val}</p>
                      <p className="text-xs text-slate-400">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: CASE STUDY ── */}
        {tab === "case" && (
          <div className="space-y-6">
            {content.case_studies.map((cs, ci) => (
              <div key={ci} className="bg-gray-900 rounded-2xl border border-white/10 overflow-hidden">
                {/* Card header */}
                <div className="flex items-center gap-3 px-6 py-4 bg-gray-800/50 border-b border-white/10">
                  <span className="text-2xl">{cs.icon}</span>
                  <div>
                    <p className="text-white font-bold">{cs.client || `Case Study ${ci + 1}`}</p>
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">{cs.tag}</span>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Field label="Tên khách hàng" value={cs.client} onChange={v => setCase(ci, { client: v })} />
                    <Field label="Icon (emoji)" value={cs.icon} onChange={v => setCase(ci, { icon: v })} placeholder="🪑" />
                    <Field label="Tag / Ngành nghề" value={cs.tag} onChange={v => setCase(ci, { tag: v })} placeholder="E-Commerce" />
                  </div>

                  <ImagePicker value={cs.image} onChange={url => setCase(ci, { image: url })} label="Ảnh minh họa case study" />

                  <Field label="Thách thức / Vấn đề ban đầu" textarea rows={2} value={cs.challenge} onChange={v => setCase(ci, { challenge: v })} />
                  <Field label="Nguyên nhân phát hiện" textarea rows={2} value={cs.issue} onChange={v => setCase(ci, { issue: v })} />

                  {/* Actions */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className={labelCls}>Hành động thực hiện</label>
                      <button onClick={() => addCaseAction(ci)} className="text-blue-400 text-xs hover:text-blue-300 font-medium">+ Thêm dòng</button>
                    </div>
                    <div className="space-y-2">
                      {cs.actions.map((a, ai) => (
                        <div key={ai} className="flex gap-2">
                          <input className={`${inputCls} flex-1`} value={a} onChange={e => setCaseAction(ci, ai, e.target.value)} placeholder={`Hành động ${ai + 1}`} />
                          <button onClick={() => removeCaseAction(ci, ai)} className="w-9 h-9 flex items-center justify-center text-red-400 hover:bg-red-500/20 rounded-lg transition-all flex-shrink-0">✕</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div>
                    <label className={labelCls}>3 Số liệu kết quả</label>
                    <div className="grid grid-cols-3 gap-3">
                      {cs.stats.map((s, si) => (
                        <div key={si} className="bg-gray-800 rounded-xl p-3 space-y-2">
                          <Field label="Giá trị" value={s.val} onChange={v => setCaseStat(ci, si, { val: v })} placeholder="Top 5" />
                          <Field label="Nhãn" value={s.label} onChange={v => setCaseStat(ci, si, { label: v })} placeholder="sau 5 tuần" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {content.case_studies.length === 0 && (
              <div className="bg-gray-900 rounded-2xl border border-dashed border-white/20 p-10 text-center text-gray-500">
                Chưa có case study. Nhấn nút bên dưới để thêm.
              </div>
            )}

            <button onClick={() => setContent(c => ({ ...c, case_studies: [...c.case_studies, { client: "", icon: "🏢", tag: "Business", challenge: "", issue: "", actions: [""], stats: [{ val: "", label: "" }, { val: "", label: "" }, { val: "", label: "" }], image: null }] }))}
              className="w-full py-3 border-2 border-dashed border-white/20 text-gray-400 hover:border-blue-500 hover:text-blue-400 rounded-2xl text-sm font-medium transition-all">
              + Thêm case study mới
            </button>
          </div>
        )}

        {/* ── TAB: PRICING ── */}
        {tab === "pricing" && (
          <div className="space-y-5">
            {content.pricing.map((plan, pi) => (
              <div key={pi} className={`bg-gray-900 rounded-2xl border overflow-hidden ${plan.highlight ? "border-blue-500/50" : "border-white/10"}`}>
                <div className="flex items-center gap-3 px-6 py-4 bg-gray-800/50 border-b border-white/10">
                  <div className={`w-3 h-3 rounded-full ${plan.highlight ? "bg-blue-500" : "bg-gray-600"}`} />
                  <p className="text-white font-bold">{plan.name || `Gói ${pi + 1}`}</p>
                  {plan.highlight && <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">Nổi bật</span>}
                </div>

                <div className="p-6 space-y-5">
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Field label="Tên gói" value={plan.name} onChange={v => setPlan(pi, { name: v })} placeholder="SEO Onpage Cơ Bản" />
                    <Field label="Giá (vd: 2.500.000đ)" value={plan.price} onChange={v => setPlan(pi, { price: v })} placeholder="2.500.000đ" />
                    <Field label="Ghi chú giá (vd: /tháng)" value={plan.note} onChange={v => setPlan(pi, { note: v })} placeholder="/tháng" />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Text nút CTA" value={plan.cta} onChange={v => setPlan(pi, { cta: v })} placeholder="Đăng ký gói này" />
                    <div>
                      <label className={labelCls}>Nổi bật (highlight)</label>
                      <button onClick={() => setPlan(pi, { highlight: !plan.highlight })}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${plan.highlight ? "bg-blue-500/20 border-blue-500 text-blue-400" : "bg-gray-800 border-white/10 text-gray-400"}`}>
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${plan.highlight ? "bg-blue-500 border-blue-500" : "border-gray-500"}`}>
                          {plan.highlight && <span className="text-white text-xs font-bold">✓</span>}
                        </div>
                        {plan.highlight ? "Đang hiển thị nổi bật" : "Đặt làm gói nổi bật"}
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className={labelCls}>Tính năng bao gồm</label>
                      <button onClick={() => addPlanFeature(pi)} className="text-blue-400 text-xs hover:text-blue-300 font-medium">+ Thêm tính năng</button>
                    </div>
                    <div className="space-y-2">
                      {plan.features.map((f, fi) => (
                        <div key={fi} className="flex gap-2">
                          <input className={`${inputCls} flex-1`} value={f} onChange={e => setPlanFeature(pi, fi, e.target.value)} placeholder={`Tính năng ${fi + 1}`} />
                          <button onClick={() => removePlanFeature(pi, fi)} className="w-9 h-9 flex items-center justify-center text-red-400 hover:bg-red-500/20 rounded-lg transition-all flex-shrink-0">✕</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {content.pricing.length === 0 && (
              <div className="bg-gray-900 rounded-2xl border border-dashed border-white/20 p-10 text-center text-gray-500">Chưa có gói giá nào.</div>
            )}

            <button onClick={() => setContent(c => ({ ...c, pricing: [...c.pricing, { name: "", price: "", note: "/tháng", highlight: false, cta: "Đăng ký", features: [""] }] }))}
              className="w-full py-3 border-2 border-dashed border-white/20 text-gray-400 hover:border-blue-500 hover:text-blue-400 rounded-2xl text-sm font-medium transition-all">
              + Thêm gói giá mới
            </button>
          </div>
        )}

        {/* ── TAB: FAQ ── */}
        {tab === "faq" && (
          <div className="space-y-4">
            {content.faq.map((item, i) => (
              <div key={i} className="bg-gray-900 rounded-2xl border border-white/10 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-medium">Câu hỏi {i + 1}</span>
                  <button onClick={() => removeFaq(i)} className="text-red-400 hover:text-red-300 text-xs hover:bg-red-500/20 px-2 py-1 rounded-lg transition-all">Xóa</button>
                </div>
                <Field label="Câu hỏi" value={item.q} onChange={v => setFaq(i, { q: v })} placeholder="Ví dụ: SEO Onpage là gì?" />
                <Field label="Câu trả lời" textarea rows={3} value={item.a} onChange={v => setFaq(i, { a: v })} />
              </div>
            ))}

            {content.faq.length === 0 && (
              <div className="bg-gray-900 rounded-2xl border border-dashed border-white/20 p-10 text-center text-gray-500">Chưa có câu hỏi nào.</div>
            )}

            <button onClick={addFaq}
              className="w-full py-3 border-2 border-dashed border-white/20 text-gray-400 hover:border-blue-500 hover:text-blue-400 rounded-2xl text-sm font-medium transition-all">
              + Thêm câu hỏi FAQ
            </button>
          </div>
        )}

      </div>

      {/* ── Bottom save bar ── */}
      <div className="sticky bottom-0 bg-gray-900/95 backdrop-blur border-t border-white/10 py-4 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <p className="text-gray-500 text-sm">
            {saved ? <span className="text-green-400 font-medium">✓ Đã lưu thành công</span> : "Nhớ lưu sau khi chỉnh sửa"}
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
