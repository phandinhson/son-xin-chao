"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RichEditor from "@/components/RichEditor";

function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

const CATEGORIES = [
  { value: "seo", label: "SEO", icon: "🔍", bg: "bg-green-500/15", border: "border-green-500/40", text: "text-green-400" },
  { value: "google-ads", label: "Google Ads", icon: "📈", bg: "bg-blue-500/15", border: "border-blue-500/40", text: "text-blue-400" },
  { value: "facebook-tiktok-ads", label: "Facebook & TikTok Ads", icon: "📣", bg: "bg-indigo-500/15", border: "border-indigo-500/40", text: "text-indigo-400" },
  { value: "website-wordpress", label: "Website / WordPress", icon: "💻", bg: "bg-violet-500/15", border: "border-violet-500/40", text: "text-violet-400" },
  { value: "website-reactjs", label: "Website / React.js", icon: "⚛️", bg: "bg-cyan-500/15", border: "border-cyan-500/40", text: "text-cyan-400" },
  { value: "tips", label: "Tips & Kiến thức", icon: "💡", bg: "bg-orange-500/15", border: "border-orange-500/40", text: "text-orange-400" },
];

export default function NewPost() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", slug: "", excerpt: "", content: "", cover_image: "", status: "draft" as "draft" | "published", category: "seo",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imgTab, setImgTab] = useState<"url" | "upload">("url");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = (field: string, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "title") next.slug = toSlug(value);
      return next;
    });
  };

  const handleSave = async (status: "draft" | "published") => {
    if (!form.title || !form.slug) { setError("Vui lòng nhập tiêu đề."); return; }
    setSaving(true); setError("");
    const res = await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, status }),
    });
    if (res.ok) {
      const data = await res.json();
      router.push(`/admin/posts/${data.id}`);
    } else {
      const d = await res.json();
      setError(d.error || "Lỗi khi lưu bài.");
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/posts" className="text-gray-500 hover:text-white transition-colors">← Bài viết</Link>
        <span className="text-gray-700">/</span>
        <h1 className="text-2xl font-bold text-white">Viết bài mới</h1>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-gray-400 text-sm mb-2">Tiêu đề *</label>
          <input value={form.title} onChange={(e) => update("title", e.target.value)}
            placeholder="Nhập tiêu đề bài viết..."
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all text-lg" />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-2">Slug (URL)</label>
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden focus-within:border-blue-500/50 transition-all">
            <span className="px-4 py-3 text-gray-600 text-sm border-r border-white/10">/blog/</span>
            <input value={form.slug} onChange={(e) => update("slug", e.target.value)}
              className="flex-1 px-4 py-3 bg-transparent text-white focus:outline-none text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-2">Mô tả ngắn</label>
          <textarea rows={2} value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)}
            placeholder="Tóm tắt bài viết..."
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all resize-none text-sm" />
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-400 text-sm mb-3">
            Danh mục <span className="text-gray-600 font-normal">— chọn 1 danh mục phù hợp</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {CATEGORIES.map((cat) => {
              const selected = form.category === cat.value;
              return (
                <button key={cat.value} type="button" onClick={() => update("category", cat.value)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium transition-all text-left
                    ${selected
                      ? `${cat.bg} ${cat.border} ${cat.text} ring-1 ring-inset ${cat.border}`
                      : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20"
                    }`}
                >
                  <span className="text-lg flex-shrink-0">{cat.icon}</span>
                  <span className="leading-tight">{cat.label}</span>
                  {selected && (
                    <svg className="w-4 h-4 ml-auto flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-2">Ảnh bìa</label>

          <div className="flex gap-2 mb-3">
            {(["url", "upload"] as const).map((tab) => (
              <button key={tab} onClick={() => setImgTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  imgTab === tab ? "bg-blue-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}>
                {tab === "url" ? "🔗 Nhập URL" : "📁 Tải từ máy"}
              </button>
            ))}
          </div>

          {imgTab === "url" ? (
            <input
              type="url"
              value={(form.cover_image || "").startsWith("data:") ? "" : form.cover_image}
              onChange={(e) => update("cover_image", e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
            />
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all"
            >
              <div className="text-3xl mb-2">🖼️</div>
              <p className="text-gray-400 text-sm">Nhấp để chọn ảnh từ máy tính</p>
              <p className="text-gray-600 text-xs mt-1">JPG, PNG, WebP — khuyến nghị 1200×630px</p>
            </div>
          )}

          <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (ev) => update("cover_image", ev.target?.result as string);
              reader.readAsDataURL(file);
            }}
          />

          {form.cover_image && (
            <div className="mt-3 relative rounded-xl overflow-hidden border border-white/10 group">
              <img src={form.cover_image} alt="Preview"
                className="w-full h-48 object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => { update("cover_image", ""); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  🗑️ Xoá ảnh
                </button>
              </div>
              {(form.cover_image || "").startsWith("data:") && (
                <div className="absolute bottom-2 left-2">
                  <span className="px-2 py-1 bg-green-600/80 text-white text-xs rounded-md">✓ Ảnh từ máy tính</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-2">Nội dung</label>
          <RichEditor value={form.content} onChange={(v) => update("content", v)} />
        </div>

        {error && <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}

        <div className="flex items-center gap-4 pt-4 border-t border-white/10">
          <button onClick={() => handleSave("draft")} disabled={saving}
            className="px-6 py-3 border border-white/20 text-gray-300 font-medium rounded-xl hover:bg-white/5 transition-all disabled:opacity-50">
            {saving ? "Đang lưu..." : "💾 Lưu nháp"}
          </button>
          <button onClick={() => handleSave("published")} disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50">
            {saving ? "Đang đăng..." : "🚀 Đăng bài"}
          </button>
        </div>
      </div>
    </div>
  );
}
