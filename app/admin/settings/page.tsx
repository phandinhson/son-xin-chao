"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { applyTheme } from "@/components/ThemeInjector";

type Settings = Record<string, string>;

// ─── Media Picker Modal ────────────────────────────────────────────────────────
type MediaFile = { name: string; url: string; sizeLabel: string; ext: string };

function MediaPickerModal({
  onSelect,
  onClose,
}: {
  onSelect: (url: string) => void;
  onClose: () => void;
}) {
  const [files, setFiles]         = useState<MediaFile[]>([]);
  const [loading, setLoading]     = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const loadFiles = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/media");
      const data = await r.json();
      setFiles(Array.isArray(data) ? data : []);
    } catch { setError("Không tải được thư viện ảnh"); }
    setLoading(false);
  }, []);

  useEffect(() => { loadFiles(); }, [loadFiles]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("files", file);
    const r = await fetch("/api/admin/media", { method: "POST", body: form });
    const data = await r.json();
    if (data.urls?.[0]) {
      onSelect(data.urls[0]);   // chọn luôn ảnh vừa upload
    } else {
      setError(data.errors?.[0] || "Upload thất bại");
      setUploading(false);
      await loadFiles();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-2xl max-h-[80vh] bg-gray-900 rounded-2xl border border-white/10 shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h3 className="text-white font-semibold text-base">🖼️ Thư viện ảnh — Chọn logo</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl leading-none transition-colors">✕</button>
        </div>

        {/* Upload strip */}
        <div className="px-5 pt-4 pb-3 border-b border-white/5">
          <div
            className="border-2 border-dashed border-white/20 rounded-xl p-4 text-center cursor-pointer hover:border-blue-500/60 hover:bg-blue-500/5 transition-all"
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? (
              <p className="text-blue-400 text-sm">⏳ Đang tải lên Supabase Storage...</p>
            ) : (
              <>
                <p className="text-gray-400 text-sm">📤 Nhấp để tải ảnh mới lên Thư viện</p>
                <p className="text-gray-600 text-xs mt-1">PNG, JPG, WebP — tối đa 5MB</p>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          {error && <p className="text-red-400 text-xs mt-2">⚠️ {error}</p>}
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="text-gray-500 text-center py-10">Đang tải...</div>
          ) : files.length === 0 ? (
            <div className="text-gray-600 text-center py-10 text-sm">Thư viện trống — hãy tải ảnh lên trước</div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {files.map(f => (
                <button
                  key={f.name}
                  onClick={() => onSelect(f.url)}
                  className="group relative aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-blue-500 focus:border-blue-500 focus:outline-none transition-all bg-white/5"
                  title={f.name}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.url} alt={f.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 font-semibold bg-blue-600 px-2 py-1 rounded-lg transition-all">
                      Chọn
                    </span>
                  </div>
                  <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-all">
                    {f.sizeLabel}
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

const sections = [
  {
    title: "Hero Section",
    icon: "🏠",
    fields: [
      { key: "hero_name", label: "Tên hiển thị", placeholder: "Sơn" },
      { key: "hero_tagline", label: "Tagline", placeholder: "Digital Marketing Specialist" },
      { key: "hero_description", label: "Mô tả ngắn", placeholder: "Tôi giúp doanh nghiệp...", multiline: true },
    ],
  },
  {
    title: "Thống kê (Stats)",
    icon: "📊",
    fields: [
      { key: "stat_years", label: "Năm kinh nghiệm", placeholder: "3+" },
      { key: "stat_projects", label: "Dự án", placeholder: "50+" },
      { key: "stat_satisfaction", label: "Hài lòng", placeholder: "98%" },
      { key: "stat_roas", label: "ROI trung bình", placeholder: "2x" },
    ],
  },
  {
    title: "Thông tin liên hệ",
    icon: "📞",
    fields: [
      { key: "contact_phone", label: "Số điện thoại", placeholder: "0968806360" },
      { key: "contact_zalo", label: "Số Zalo", placeholder: "0968806360" },
      { key: "contact_facebook", label: "Facebook URL / username", placeholder: "fb.com/sonxinchao" },
      { key: "contact_email", label: "Email", placeholder: "son@sonxinchao.com" },
    ],
  },
  {
    title: "Giới thiệu bản thân",
    icon: "👤",
    fields: [
      { key: "about_description", label: "Mô tả về bản thân", placeholder: "Với hơn 3 năm trong ngành...", multiline: true },
    ],
  },
];

export default function SettingsAdmin() {
  const [settings, setSettings]       = useState<Settings>({});
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [saved, setSaved]             = useState(false);
  const [logoTab, setLogoTab]         = useState<"url" | "library">("url");
  const [showPicker, setShowPicker]   = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => { setSettings(d); setLoading(false); });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    setSaving(false);
  };

  if (loading) return <div className="p-8 text-gray-500 text-center py-20">Đang tải...</div>;

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Cài đặt trang</h1>
          <p className="text-gray-400 mt-1">Chỉnh sửa nội dung hiển thị trên website</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-green-400 text-sm">✅ Đã lưu!</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
          >
            {saving ? "Đang lưu..." : "💾 Lưu tất cả"}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Logo & Thương hiệu */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-white font-semibold text-lg mb-5 flex items-center gap-2">
            <span>🖼️</span> Logo & Thương hiệu
          </h2>

          {/* Cảnh báo nếu đang lưu base64 */}
          {settings.logo_url?.startsWith("data:") && (
            <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
              <span className="text-base flex-shrink-0">⚠️</span>
              <span>
                Logo đang lưu dưới dạng <strong>base64</strong> (~67KB nhúng vào mỗi trang). Hãy chọn lại từ{" "}
                <button onClick={() => setLogoTab("library")} className="underline hover:text-amber-200">Thư viện ảnh</button>{" "}
                để lưu URL thực.
              </span>
            </div>
          )}

          {/* Preview */}
          <div className="mb-5 flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex-shrink-0">
              {settings.logo_url && !settings.logo_url.startsWith("data:") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={settings.logo_url}
                  alt="Logo"
                  className="w-12 h-12 rounded-xl object-cover shadow-lg"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {(settings.logo_text || "Sơn Xin Chào").charAt(0)}
                </div>
              )}
            </div>
            <div>
              <div className="text-white font-bold text-sm">
                {settings.logo_text || "Sơn Xin Chào"}
              </div>
              <div className="text-gray-500 text-xs mt-0.5">
                {settings.logo_url && !settings.logo_url.startsWith("data:")
                  ? "✅ Logo từ Supabase Storage"
                  : "Xem trước logo trên website"}
              </div>
            </div>
            {settings.logo_url && (
              <button
                onClick={() => setSettings({ ...settings, logo_url: "" })}
                className="ml-auto text-red-400 hover:text-red-300 text-xs border border-red-500/30 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-all"
              >
                🗑️ Xóa logo
              </button>
            )}
          </div>

          {/* Tabs: URL vs Thư viện */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setLogoTab("url")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                logoTab === "url"
                  ? "bg-blue-600 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              🔗 Nhập URL
            </button>
            <button
              onClick={() => setLogoTab("library")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                logoTab === "library"
                  ? "bg-blue-600 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              🖼️ Thư viện ảnh
            </button>
          </div>

          {logoTab === "url" ? (
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">URL ảnh logo</label>
              <input
                type="text"
                value={settings.logo_url?.startsWith("data:") ? "" : (settings.logo_url || "")}
                onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                placeholder="https://kpgtiqepktofdfyxgsbw.supabase.co/storage/v1/object/public/images/logo.png"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
              />
              <p className="text-gray-600 text-xs mt-1.5">
                💡 Dùng tab <strong className="text-gray-400">Thư viện ảnh</strong> để upload và lấy URL tự động
              </p>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setShowPicker(true)}
                className="w-full py-4 border-2 border-dashed border-blue-500/40 rounded-xl text-blue-400 hover:border-blue-500/70 hover:bg-blue-500/5 transition-all text-sm font-medium flex items-center justify-center gap-2"
              >
                <span className="text-xl">🖼️</span>
                Mở Thư viện ảnh — chọn hoặc tải ảnh mới lên
              </button>
              {settings.logo_url && !settings.logo_url.startsWith("data:") && (
                <p className="text-green-400 text-xs mt-2 flex items-center gap-1.5">
                  ✅ Đang dùng: <span className="text-gray-400 truncate max-w-xs">{settings.logo_url.split("/").pop()}</span>
                </p>
              )}
            </div>
          )}

          {/* Brand name */}
          <div className="mt-4">
            <label className="block text-gray-400 text-sm mb-1.5">Tên thương hiệu (hiển thị cạnh logo)</label>
            <input
              type="text"
              value={settings.logo_text || ""}
              onChange={(e) => setSettings({ ...settings, logo_text: e.target.value })}
              placeholder="Sơn Xin Chào"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
            />
          </div>
        </div>

        {/* Media Picker Modal */}
        {showPicker && (
          <MediaPickerModal
            onSelect={(url) => {
              setSettings({ ...settings, logo_url: url });
              setShowPicker(false);
              setLogoTab("library");
            }}
            onClose={() => setShowPicker(false)}
          />
        )}

        {/* SEO Metadata */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-white font-semibold text-lg mb-2 flex items-center gap-2">
            <span>🏷️</span> SEO Metadata
          </h2>
          <p className="text-gray-500 text-sm mb-5">
            Thông tin hiển thị trên Google Search và khi chia sẻ link lên mạng xã hội.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">
                Title — Tiêu đề trang <span className="text-gray-600">(hiển thị trên tab trình duyệt & Google)</span>
              </label>
              <input
                type="text"
                value={settings.meta_title || ""}
                onChange={(e) => setSettings({ ...settings, meta_title: e.target.value })}
                placeholder="Sơn Xin Chào | SEO · Ads · Website"
                maxLength={70}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
              />
              <p className="text-xs text-gray-600 mt-1">{(settings.meta_title || "").length}/60 ký tự lý tưởng</p>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1.5">
                Description — Mô tả <span className="text-gray-600">(đoạn text xuất hiện dưới tiêu đề trên Google)</span>
              </label>
              <textarea
                rows={3}
                value={settings.meta_description || ""}
                onChange={(e) => setSettings({ ...settings, meta_description: e.target.value })}
                placeholder="Dịch vụ SEO, quảng cáo Google/Facebook Ads và thiết kế Website WordPress chuyên nghiệp tại Long Thành, Đồng Nai."
                maxLength={170}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all resize-none text-sm"
              />
              <p className="text-xs text-gray-600 mt-1">{(settings.meta_description || "").length}/155 ký tự lý tưởng</p>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1.5">
                Keywords <span className="text-gray-600">(phân cách bằng dấu phẩy)</span>
              </label>
              <input
                type="text"
                value={settings.meta_keywords || ""}
                onChange={(e) => setSettings({ ...settings, meta_keywords: e.target.value })}
                placeholder="SEO, Google Ads, Facebook Ads, thiết kế website, WordPress, Long Thành, Đồng Nai"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
              />
            </div>

            <div className="pt-2 border-t border-white/5">
              <p className="text-gray-500 text-xs mb-3 font-semibold">Open Graph — hiển thị khi share lên Facebook, Zalo...</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-gray-400 text-sm mb-1.5">OG Title <span className="text-gray-600">(để trống = dùng Title ở trên)</span></label>
                  <input
                    type="text"
                    value={settings.og_title || ""}
                    onChange={(e) => setSettings({ ...settings, og_title: e.target.value })}
                    placeholder="Sơn Xin Chào | SEO · Ads · Website"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1.5">OG Description <span className="text-gray-600">(để trống = dùng Description ở trên)</span></label>
                  <textarea
                    rows={2}
                    value={settings.og_description || ""}
                    onChange={(e) => setSettings({ ...settings, og_description: e.target.value })}
                    placeholder="Dịch vụ SEO, quảng cáo và thiết kế Website chuyên nghiệp. Giải pháp digital marketing hiệu quả cho doanh nghiệp."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all resize-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1.5">OG Image URL <span className="text-gray-600">(ảnh thumbnail khi share — 1200×630px)</span></label>
                  <input
                    type="text"
                    value={settings.og_image || ""}
                    onChange={(e) => setSettings({ ...settings, og_image: e.target.value })}
                    placeholder="https://sonxinchao.com/og-image.jpg"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEO & Scripts */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-white font-semibold text-lg mb-2 flex items-center gap-2">
            <span>🔍</span> SEO & Scripts
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Các đoạn code được inject vào website — Schema, Analytics, GTM, Search Console...
            Paste nguyên đoạn code (bao gồm cả thẻ <code className="text-violet-400">&lt;script&gt;</code> hoặc <code className="text-violet-400">&lt;meta&gt;</code>).
          </p>

          <div className="space-y-5">
            {/* Schema Markup */}
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-1">
                Schema Markup
                <span className="ml-2 text-xs font-normal text-gray-500">JSON-LD structured data — inject vào &lt;head&gt;</span>
              </label>
              <textarea
                rows={6}
                value={settings.seo_schema || ""}
                onChange={(e) => setSettings({ ...settings, seo_schema: e.target.value })}
                placeholder={`<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "LocalBusiness",\n  "name": "Sơn Xin Chào"\n}\n</script>`}
                spellCheck={false}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-green-300 placeholder-gray-700 focus:outline-none focus:border-violet-500/50 transition-all resize-y font-mono text-xs leading-relaxed"
                onKeyDown={(e) => { if (e.key === "Tab") { e.preventDefault(); const el = e.currentTarget; const s = el.selectionStart; const val = el.value.substring(0, s) + "  " + el.value.substring(el.selectionEnd); setSettings({ ...settings, seo_schema: val }); setTimeout(() => { el.selectionStart = el.selectionEnd = s + 2; }, 0); } }}
              />
            </div>

            {/* Google Analytics */}
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-1">
                Google Analytics
                <span className="ml-2 text-xs font-normal text-gray-500">GA4 hoặc Google Ads Conversion — inject vào &lt;head&gt;</span>
              </label>
              <textarea
                rows={5}
                value={settings.seo_google_analytics || ""}
                onChange={(e) => setSettings({ ...settings, seo_google_analytics: e.target.value })}
                placeholder={`<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>\n<script>\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n  gtag('config', 'G-XXXXXXXXXX');\n</script>`}
                spellCheck={false}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-green-300 placeholder-gray-700 focus:outline-none focus:border-violet-500/50 transition-all resize-y font-mono text-xs leading-relaxed"
                onKeyDown={(e) => { if (e.key === "Tab") { e.preventDefault(); const el = e.currentTarget; const s = el.selectionStart; const val = el.value.substring(0, s) + "  " + el.value.substring(el.selectionEnd); setSettings({ ...settings, seo_google_analytics: val }); setTimeout(() => { el.selectionStart = el.selectionEnd = s + 2; }, 0); } }}
              />
            </div>

            {/* Google Webmaster Tool */}
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-1">
                Google Webmaster Tool
                <span className="ml-2 text-xs font-normal text-gray-500">Google Search Console verification — inject vào &lt;head&gt;</span>
              </label>
              <textarea
                rows={3}
                value={settings.seo_webmaster || ""}
                onChange={(e) => setSettings({ ...settings, seo_webmaster: e.target.value })}
                placeholder={`<meta name="google-site-verification" content="YOUR_CODE_HERE" />`}
                spellCheck={false}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-green-300 placeholder-gray-700 focus:outline-none focus:border-violet-500/50 transition-all resize-y font-mono text-xs leading-relaxed"
              />
            </div>

            {/* Head JS */}
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-1">
                Head JS
                <span className="ml-2 text-xs font-normal text-gray-500">Script tùy chỉnh — inject vào cuối &lt;head&gt;</span>
              </label>
              <textarea
                rows={5}
                value={settings.seo_head_js || ""}
                onChange={(e) => setSettings({ ...settings, seo_head_js: e.target.value })}
                placeholder={`<!-- Google Tag Manager -->\n<script>...</script>`}
                spellCheck={false}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-green-300 placeholder-gray-700 focus:outline-none focus:border-violet-500/50 transition-all resize-y font-mono text-xs leading-relaxed"
                onKeyDown={(e) => { if (e.key === "Tab") { e.preventDefault(); const el = e.currentTarget; const s = el.selectionStart; const val = el.value.substring(0, s) + "  " + el.value.substring(el.selectionEnd); setSettings({ ...settings, seo_head_js: val }); setTimeout(() => { el.selectionStart = el.selectionEnd = s + 2; }, 0); } }}
              />
            </div>

            {/* Body JS */}
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-1">
                Body JS
                <span className="ml-2 text-xs font-normal text-gray-500">Script inject vào đầu &lt;body&gt; — GTM noscript, chat widget...</span>
              </label>
              <textarea
                rows={5}
                value={settings.seo_body_js || ""}
                onChange={(e) => setSettings({ ...settings, seo_body_js: e.target.value })}
                placeholder={`<!-- GTM noscript -->\n<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXX"\nheight="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`}
                spellCheck={false}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-green-300 placeholder-gray-700 focus:outline-none focus:border-violet-500/50 transition-all resize-y font-mono text-xs leading-relaxed"
                onKeyDown={(e) => { if (e.key === "Tab") { e.preventDefault(); const el = e.currentTarget; const s = el.selectionStart; const val = el.value.substring(0, s) + "  " + el.value.substring(el.selectionEnd); setSettings({ ...settings, seo_body_js: val }); setTimeout(() => { el.selectionStart = el.selectionEnd = s + 2; }, 0); } }}
              />
            </div>
          </div>
        </div>

        {/* Custom CSS Blog */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-white font-semibold text-lg mb-2 flex items-center gap-2">
            <span>🎨</span> CSS Blog tùy chỉnh
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            CSS này được inject trực tiếp vào trang đọc bài viết. Dùng để chỉnh style
            nội dung blog mà không cần sửa code website.
          </p>

          {/* Quick reference */}
          <div className="mb-4 p-4 rounded-xl bg-black/30 border border-white/5 text-xs text-gray-500 font-mono leading-relaxed">
            <p className="text-gray-400 font-semibold mb-2 font-sans">📌 Class hay dùng:</p>
            <p><span className="text-violet-400">.prose-custom h2</span> — Tiêu đề lớn H2</p>
            <p><span className="text-violet-400">.prose-custom h3</span> — Tiêu đề nhỏ H3</p>
            <p><span className="text-violet-400">.prose-custom p</span> — Đoạn văn</p>
            <p><span className="text-violet-400">.prose-custom ul li</span> — Danh sách</p>
            <p><span className="text-violet-400">.prose-custom strong</span> — In đậm</p>
            <p><span className="text-violet-400">.prose-custom a</span> — Liên kết</p>
            <p><span className="text-violet-400">.prose-custom blockquote</span> — Trích dẫn</p>
            <p><span className="text-violet-400">.prose-custom code</span> — Code inline</p>
            <p><span className="text-violet-400">.prose-custom table</span> — Bảng</p>
          </div>

          <div className="relative">
            {/* Line number gutter feel */}
            <div className="absolute top-0 left-0 bottom-0 w-10 bg-black/20 rounded-l-xl border-r border-white/5 pointer-events-none z-10" />
            <textarea
              rows={16}
              value={settings.custom_blog_css || ""}
              onChange={(e) => setSettings({ ...settings, custom_blog_css: e.target.value })}
              placeholder={`/* Ví dụ: tăng cỡ chữ heading */\n.prose-custom h2 {\n  font-size: 1.6rem;\n  color: #a78bfa;\n}\n\n.prose-custom p {\n  line-height: 1.9;\n  font-size: 1rem;\n}\n\n.prose-custom ul li {\n  margin-bottom: 0.5rem;\n}`}
              spellCheck={false}
              className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-xl text-green-300 placeholder-gray-700 focus:outline-none focus:border-violet-500/50 transition-all resize-y font-mono text-sm leading-relaxed"
              style={{ minHeight: "320px", tabSize: 2 }}
              onKeyDown={(e) => {
                // Tab key → insert 2 spaces
                if (e.key === "Tab") {
                  e.preventDefault();
                  const el = e.currentTarget;
                  const start = el.selectionStart;
                  const end = el.selectionEnd;
                  const newVal = el.value.substring(0, start) + "  " + el.value.substring(end);
                  setSettings({ ...settings, custom_blog_css: newVal });
                  setTimeout(() => { el.selectionStart = el.selectionEnd = start + 2; }, 0);
                }
              }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
            <span>💡 Nhấn Tab để thụt lề • CSS thuần — không cần &lt;style&gt; tag</span>
            {settings.custom_blog_css && (
              <button
                onClick={() => setSettings({ ...settings, custom_blog_css: "" })}
                className="text-red-500/70 hover:text-red-400 transition-colors"
              >
                🗑️ Xoá CSS
              </button>
            )}
          </div>
        </div>

        {/* ── Giao diện & Màu sắc ── */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-white font-semibold text-lg mb-2 flex items-center gap-2">
            <span>🎨</span> Giao diện & Màu sắc
          </h2>
          <p className="text-gray-500 text-sm mb-5">
            Tuỳ chỉnh màu nền, chữ, font cho toàn bộ website. Xem trước ngay, lưu để đồng bộ vĩnh viễn.
          </p>

          {/* Preset themes */}
          <div className="mb-6">
            <p className="text-gray-400 text-sm mb-3 font-medium">Giao diện có sẵn</p>
            <div className="flex flex-wrap gap-2">
              {([
                { name: "🌙 Tối (mặc định)", bg: "#030712", bgAlt: "#111827", text: "#ffffff", font: "", accent: "#3b82f6", accent2: "#8b5cf6" },
                { name: "☀️ Sáng (gtvseo.com)", bg: "#ffffff", bgAlt: "#f8f9fa", text: "#1a1a2e", font: "Montserrat", accent: "#3b82f6", accent2: "#06b6d4" },
                { name: "🌊 Navy", bg: "#0f172a", bgAlt: "#1e293b", text: "#f1f5f9", font: "", accent: "#38bdf8", accent2: "#818cf8" },
                { name: "🌿 Xanh lá", bg: "#f0fdf4", bgAlt: "#dcfce7", text: "#14532d", font: "Montserrat", accent: "#16a34a", accent2: "#0d9488" },
              ] as const).map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    const updated = {
                      ...settings,
                      theme_bg: preset.bg, theme_bg_alt: preset.bgAlt,
                      theme_text: preset.text, theme_text_2: "", theme_text_3: "",
                      theme_font: preset.font, theme_accent: preset.accent, theme_accent_2: preset.accent2,
                    };
                    setSettings(updated);
                    applyTheme(updated);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-medium transition-all bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Color pickers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {([
              { key: "theme_bg",       label: "Màu nền chính",  hint: "Background toàn trang",       def: "#030712" },
              { key: "theme_bg_alt",   label: "Màu nền phụ",    hint: "Section xen kẽ, sidebar",     def: "#111827" },
              { key: "theme_text",     label: "Màu chữ chính",  hint: "Heading, nội dung chính",     def: "#ffffff" },
              { key: "theme_text_2",   label: "Màu chữ phụ",    hint: "Đoạn văn, mô tả",             def: "#d1d5db" },
              { key: "theme_text_3",   label: "Màu chữ mờ",     hint: "Label, placeholder, caption", def: "#9ca3af" },
              { key: "theme_accent",   label: "Màu nhấn chính", hint: "Button, link, badge",          def: "#3b82f6" },
              { key: "theme_accent_2", label: "Màu nhấn phụ",   hint: "Gradient, icon, highlight",   def: "#8b5cf6" },
            ] as const).map((field) => (
              <div key={field.key}>
                <label className="block text-gray-400 text-xs mb-1.5 font-medium">
                  {field.label}
                  <span className="ml-1.5 text-gray-600 font-normal">— {field.hint}</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings[field.key] || field.def}
                    onChange={(e) => {
                      const updated = { ...settings, [field.key]: e.target.value };
                      setSettings(updated);
                      applyTheme(updated);
                    }}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-white/10 p-0.5 bg-transparent"
                  />
                  <input
                    type="text"
                    value={settings[field.key] || ""}
                    onChange={(e) => {
                      const updated = { ...settings, [field.key]: e.target.value };
                      setSettings(updated);
                      if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) applyTheme(updated);
                    }}
                    placeholder={field.def}
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all text-xs font-mono"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Font selector */}
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">
              Font chữ
              <span className="ml-2 text-gray-600 font-normal text-xs">— Tên Google Font (ví dụ: Montserrat, Roboto)</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {["Be Vietnam Pro", "Montserrat", "Inter", "Roboto", "Open Sans", "Nunito"].map((f) => (
                <button key={f}
                  onClick={() => {
                    const updated = { ...settings, theme_font: f };
                    setSettings(updated);
                    applyTheme(updated);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    settings.theme_font === f
                      ? "bg-blue-600 text-white border-blue-500"
                      : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={settings.theme_font || ""}
              onChange={(e) => {
                const updated = { ...settings, theme_font: e.target.value };
                setSettings(updated);
                if (e.target.value.length > 2) applyTheme(updated);
              }}
              placeholder="Be Vietnam Pro"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
            />
            <p className="text-gray-600 text-xs mt-2">
              💡 Font phải có trên Google Fonts — font sẽ được tải tự động. Để trống = dùng Be Vietnam Pro.
            </p>
          </div>

          <div className="mt-5 p-4 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-300 text-xs">
            🖌️ <strong>Preview ngay:</strong> Màu/font được áp dụng trực tiếp khi bạn chọn. Nhấn <strong>"Lưu tất cả"</strong> để đồng bộ vĩnh viễn với website công khai.
          </div>
        </div>

        {sections.map((section) => (
          <div key={section.title} className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-white font-semibold text-lg mb-5 flex items-center gap-2">
              <span>{section.icon}</span>
              {section.title}
            </h2>
            <div className="space-y-4">
              {section.fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-gray-400 text-sm mb-1.5">{field.label}</label>
                  {field.multiline ? (
                    <textarea
                      rows={3}
                      value={settings[field.key] || ""}
                      onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all resize-none text-sm"
                    />
                  ) : (
                    <input
                      type="text"
                      value={settings[field.key] || ""}
                      onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Save button bottom */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
        >
          {saving ? "Đang lưu..." : "💾 Lưu tất cả thay đổi"}
        </button>
      </div>
    </div>
  );
}
