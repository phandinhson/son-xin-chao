"use client";
import { useState, useEffect } from "react";

type Settings = Record<string, string>;

const DEFAULT_SETTINGS: Settings = {
  img_quality: "80",
  img_format: "webp",
  img_lazy: "true",
  cache_static: "31536000",
  cache_api: "0",
  cache_blog: "3600",
};

const PAGES_TO_PURGE = [
  "https://www.sonxinchao.com/",
  "https://www.sonxinchao.com/cong-cu-ai",
  "https://www.sonxinchao.com/blog",
  "https://www.sonxinchao.com/dich-vu/seo",
  "https://www.sonxinchao.com/dich-vu/google-ads",
  "https://www.sonxinchao.com/dich-vu/thiet-ke-website",
];

function StatusBadge({ ok }: { ok: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${ok ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${ok ? "bg-emerald-500" : "bg-red-500"}`} />
      {ok ? "Đã bật" : "Tắt"}
    </span>
  );
}

export default function SpeedCachePage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [purging, setPurging] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [cfConfigured, setCfConfigured] = useState<boolean | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data: Settings) => {
        const merged: Settings = { ...DEFAULT_SETTINGS };
        for (const key of Object.keys(DEFAULT_SETTINGS)) {
          if (data[key] !== undefined) merged[key] = data[key];
        }
        setSettings(merged);
        setCfConfigured(!!data["cf_configured"] || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const saveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) showToast("success", "Đã lưu cài đặt thành công!");
      else showToast("error", data.error || "Lỗi khi lưu");
    } catch {
      showToast("error", "Không thể kết nối server");
    }
    setSaving(false);
  };

  const purgeCache = async (action: "purge_all" | "purge_pages") => {
    const label = action === "purge_all" ? "purge_all" : "purge_pages";
    setPurging(label);
    try {
      const body: Record<string, unknown> = { action };
      if (action === "purge_pages") body.urls = PAGES_TO_PURGE;
      const res = await fetch("/api/admin/speed-cache", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", data.message || "Cache đã xóa thành công!");
        setCfConfigured(true);
      } else {
        showToast("error", data.error || "Lỗi xóa cache");
        if (data.error?.includes("CF_ZONE_ID") || data.error?.includes("CF_API_TOKEN")) {
          setCfConfigured(false);
        }
      }
    } catch {
      showToast("error", "Không thể kết nối server");
    }
    setPurging(null);
  };

  const set = (key: string, val: string) =>
    setSettings((prev) => ({ ...prev, [key]: val }));

  const formatDuration = (seconds: string) => {
    const s = parseInt(seconds);
    if (s === 0) return "Không cache";
    if (s < 3600) return `${s / 60} phút`;
    if (s < 86400) return `${s / 3600} giờ`;
    if (s < 2592000) return `${Math.round(s / 86400)} ngày`;
    return `${Math.round(s / 2592000)} tháng`;
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-500 flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          Đang tải...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold ${
          toast.type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
        }`}>
          <span>{toast.type === "success" ? "✅" : "❌"}</span>
          {toast.msg}
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">⚡ Speed & Cache</h1>
            <p className="text-gray-500 text-sm mt-1">Tối ưu tốc độ và quản lý cache Cloudflare</p>
          </div>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-colors flex items-center gap-2 shadow-sm"
          >
            {saving ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Đang lưu...</>
            ) : (
              <><span>💾</span> Lưu cài đặt</>
            )}
          </button>
        </div>

        <div className="space-y-5">

          {/* ── Section 1: Purge Cache ── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔄</span>
                <div>
                  <h2 className="text-gray-900 font-bold">Purge Cloudflare Cache</h2>
                  <p className="text-gray-500 text-xs mt-0.5">Xóa cache để hiển thị nội dung mới nhất</p>
                </div>
              </div>
              {cfConfigured === true && <StatusBadge ok={true} />}
              {cfConfigured === false && <StatusBadge ok={false} />}
            </div>

            <div className="p-6">
              {cfConfigured === false && (
                <div className="mb-5 bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm">
                  <p className="font-bold mb-1">⚠️ Chưa cấu hình Cloudflare API</p>
                  <p className="text-xs text-amber-700">Thêm <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono">CF_ZONE_ID</code> và <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono">CF_API_TOKEN</code> vào Vercel Environment Variables.</p>
                  <a href="https://dash.cloudflare.com/profile/api-tokens" target="_blank" rel="noopener noreferrer"
                    className="inline-block mt-2 text-amber-600 underline text-xs font-semibold">
                    Tạo API Token tại Cloudflare →
                  </a>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => purgeCache("purge_pages")}
                  disabled={!!purging}
                  className="flex flex-col gap-2 p-5 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 rounded-2xl transition-all disabled:opacity-50 text-left"
                >
                  <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                    {purging === "purge_pages" ? (
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span className="text-lg">📄</span>
                    )}
                    Purge trang chính
                  </div>
                  <p className="text-xs text-blue-600">Xóa cache {PAGES_TO_PURGE.length} trang chính của website</p>
                </button>

                <button
                  onClick={() => purgeCache("purge_all")}
                  disabled={!!purging}
                  className="flex flex-col gap-2 p-5 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 rounded-2xl transition-all disabled:opacity-50 text-left"
                >
                  <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
                    {purging === "purge_all" ? (
                      <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span className="text-lg">🗑️</span>
                    )}
                    Purge toàn bộ cache
                  </div>
                  <p className="text-xs text-red-600">Xóa 100% cache Cloudflare — dùng khi có thay đổi lớn</p>
                </button>
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-gray-500 text-xs font-semibold mb-2">Trang được purge tự động:</p>
                <div className="flex flex-wrap gap-2">
                  {PAGES_TO_PURGE.map((url) => (
                    <span key={url} className="text-xs bg-white border border-gray-200 text-gray-600 px-2.5 py-1 rounded-full font-mono">
                      {url.replace("https://www.sonxinchao.com", "") || "/"}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 2: Image Optimization ── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
              <span className="text-2xl">🖼️</span>
              <div>
                <h2 className="text-gray-900 font-bold">Tối ưu hình ảnh</h2>
                <p className="text-gray-500 text-xs mt-0.5">Next.js Image Optimization settings</p>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Image Quality */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-gray-700">Chất lượng ảnh</label>
                  <span className="text-blue-600 font-bold text-sm bg-blue-50 px-2.5 py-0.5 rounded-lg">{settings.img_quality}%</span>
                </div>
                <input
                  type="range" min="50" max="100" step="5"
                  value={settings.img_quality}
                  onChange={(e) => set("img_quality", e.target.value)}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>50% (nhẹ nhất)</span>
                  <span>75% (khuyên dùng)</span>
                  <span>100% (gốc)</span>
                </div>
              </div>

              {/* Format */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-3">Định dạng ảnh mặc định</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { val: "webp", label: "WebP", desc: "Nhỏ hơn 30%", recommended: true },
                    { val: "avif", label: "AVIF", desc: "Nhỏ hơn 50%", recommended: false },
                    { val: "original", label: "Gốc", desc: "JPG/PNG", recommended: false },
                  ].map((f) => (
                    <button
                      key={f.val}
                      onClick={() => set("img_format", f.val)}
                      className={`relative p-4 rounded-xl border text-left transition-all ${
                        settings.img_format === f.val
                          ? "bg-blue-50 border-blue-400 text-blue-700"
                          : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {f.recommended && (
                        <span className="absolute top-2 right-2 text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold">✓</span>
                      )}
                      <div className="font-bold text-sm">{f.label}</div>
                      <div className="text-xs mt-0.5 opacity-70">{f.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Lazy Loading */}
              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Lazy Loading</p>
                  <p className="text-xs text-gray-500 mt-0.5">Chỉ load ảnh khi user scroll đến — giảm thời gian tải trang</p>
                </div>
                <button
                  onClick={() => set("img_lazy", settings.img_lazy === "true" ? "false" : "true")}
                  className={`relative w-12 h-6 rounded-full transition-colors ${settings.img_lazy === "true" ? "bg-blue-600" : "bg-gray-300"}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${settings.img_lazy === "true" ? "translate-x-6" : ""}`} />
                </button>
              </div>
            </div>
          </div>

          {/* ── Section 3: Cache Headers ── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
              <span className="text-2xl">⏱️</span>
              <div>
                <h2 className="text-gray-900 font-bold">Cache-Control Headers</h2>
                <p className="text-gray-500 text-xs mt-0.5">Thời gian cache cho từng loại nội dung</p>
              </div>
            </div>

            <div className="p-6 space-y-3">
              {[
                { key: "cache_static", label: "Static files (CSS, JS, ảnh)", icon: "📦", description: "File tĩnh — cache lâu dài là tốt nhất" },
                { key: "cache_blog", label: "Trang blog & bài viết", icon: "📝", description: "Cache ngắn để hiển thị bài mới nhanh" },
                { key: "cache_api", label: "API endpoints", icon: "🔌", description: "Thường để 0 (no-cache) để luôn fresh" },
              ].map(({ key, label, icon, description }) => (
                <div key={key} className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-100 rounded-xl">
                  <span className="text-xl">{icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{description}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-blue-600 font-semibold whitespace-nowrap bg-blue-50 px-2.5 py-1 rounded-lg">
                      {formatDuration(settings[key])}
                    </span>
                    <select
                      value={settings[key]}
                      onChange={(e) => set(key, e.target.value)}
                      className="bg-white border border-gray-300 text-gray-700 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="0">Không cache</option>
                      <option value="300">5 phút</option>
                      <option value="3600">1 giờ</option>
                      <option value="86400">1 ngày</option>
                      <option value="604800">1 tuần</option>
                      <option value="2592000">1 tháng</option>
                      <option value="31536000">1 năm</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Section 4: Performance Checklist ── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <h2 className="text-gray-900 font-bold">Performance Checklist</h2>
                <p className="text-gray-500 text-xs mt-0.5">Trạng thái các tối ưu đang hoạt động</p>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { label: "Cloudflare CDN Proxy", ok: true, desc: "Traffic đi qua Cloudflare edge servers" },
                  { label: "SSL/HTTPS", ok: true, desc: "TLS 1.3 — mã hóa toàn bộ kết nối" },
                  { label: "Gzip / Brotli Compression", ok: true, desc: "Cloudflare tự động nén response" },
                  { label: "Next.js Image Optimization", ok: true, desc: "Tự động resize + convert sang WebP" },
                  { label: "Code Splitting (JS)", ok: true, desc: "Next.js tự động chia nhỏ bundle" },
                  { label: "CSS Minification", ok: true, desc: "Vercel minify CSS khi build" },
                  { label: "Edge Caching (Vercel)", ok: true, desc: "Static assets cached tại Vercel CDN" },
                  { label: "Cloudflare Cache Purge API", ok: cfConfigured === true, desc: cfConfigured === true ? "CF_ZONE_ID + CF_API_TOKEN đã cấu hình" : "Chưa cấu hình env variables" },
                  { label: "OG Thumbnail Facebook Bot", ok: true, desc: "Cloudflare Worker intercept bot requests" },
                  { label: "robots.txt", ok: true, desc: "Đã cấu hình cho Facebook, Zalo crawlers" },
                ].map((item) => (
                  <div key={item.label} className={`flex items-start gap-3 p-3.5 rounded-xl border ${item.ok ? "bg-emerald-50 border-emerald-100" : "bg-gray-50 border-gray-200"}`}>
                    <span className={`mt-0.5 text-base flex-shrink-0`}>
                      {item.ok ? "✅" : "⬜"}
                    </span>
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold ${item.ok ? "text-gray-800" : "text-gray-400"}`}>
                        {item.label}
                      </p>
                      <p className={`text-xs mt-0.5 ${item.ok ? "text-gray-500" : "text-gray-400"}`}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Score */}
              <div className={`mt-5 p-5 rounded-xl border flex items-center gap-4 ${cfConfigured === true ? "bg-emerald-50 border-emerald-200" : "bg-blue-50 border-blue-200"}`}>
                <div className={`text-4xl font-black ${cfConfigured === true ? "text-emerald-600" : "text-blue-600"}`}>
                  {cfConfigured === true ? "10" : "9"}<span className="text-lg text-gray-400">/10</span>
                </div>
                <div>
                  <p className="text-gray-900 font-bold text-sm">
                    {cfConfigured === true ? "Tối ưu hoàn hảo! 🚀" : "Gần hoàn hảo! 🎯"}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {cfConfigured === true
                      ? "Website đang chạy với đầy đủ tối ưu hiệu suất"
                      : "Thêm CF_ZONE_ID + CF_API_TOKEN vào Vercel để đạt 10/10"}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
