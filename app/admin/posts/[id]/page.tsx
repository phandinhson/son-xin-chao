"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import RichEditor from "@/components/RichEditor";

type FormData = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  status: "draft" | "published";
  category: string;
};

type DbCategory = { id: string; label: string; value: string; icon: string; color_key: string };

const CAT_COLOR: Record<string, { bg: string; border: string; text: string }> = {
  blue:    { bg: "bg-blue-500/15",    border: "border-blue-500/40",    text: "text-blue-400"    },
  violet:  { bg: "bg-violet-500/15",  border: "border-violet-500/40",  text: "text-violet-400"  },
  emerald: { bg: "bg-emerald-500/15", border: "border-emerald-500/40", text: "text-emerald-400" },
  orange:  { bg: "bg-orange-500/15",  border: "border-orange-500/40",  text: "text-orange-400"  },
  red:     { bg: "bg-red-500/15",     border: "border-red-500/40",     text: "text-red-400"     },
  indigo:  { bg: "bg-indigo-500/15",  border: "border-indigo-500/40",  text: "text-indigo-400"  },
  pink:    { bg: "bg-pink-500/15",    border: "border-pink-500/40",    text: "text-pink-400"    },
  green:   { bg: "bg-green-500/15",   border: "border-green-500/40",   text: "text-green-400"   },
};

const empty: FormData = { title: "", slug: "", excerpt: "", content: "", cover_image: "", status: "draft", category: "seo" };

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

export default function PostEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const router = useRouter();

  const [form, setForm] = useState<FormData>(empty);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(!isNew);
  const [imgTab, setImgTab] = useState<"url" | "upload">("url");
  const [dbCategories, setDbCategories] = useState<DbCategory[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch categories từ DB
    fetch("/api/categories").then(r => r.json()).then(d => { if (Array.isArray(d)) setDbCategories(d); });
    if (!isNew) {
      fetch(`/api/admin/posts/${id}`)
        .then((r) => r.json())
        .then((d) => { setForm(d); setLoading(false); });
    }
  }, [id, isNew]);

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "title" && isNew) next.slug = toSlug(value);
      return next;
    });
  };

  const handleSave = async (status?: "draft" | "published") => {
    setSaving(true);
    setMessage("");
    const payload = { ...form, status: status || form.status };
    const res = await fetch(isNew ? "/api/admin/posts" : `/api/admin/posts/${id}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setMessage("✅ Đã lưu thành công!");
      if (isNew) {
        const data = await res.json();
        router.replace(`/admin/posts/${data.id}`);
      }
    } else {
      setMessage("❌ Lỗi khi lưu. Vui lòng thử lại.");
    }
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  };

  if (loading) return <div className="p-8 text-gray-500 text-center py-20">Đang tải...</div>;

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 flex-wrap">
        <Link href="/admin/posts" className="text-gray-500 hover:text-white transition-colors text-sm">← Bài viết</Link>
        <span className="text-gray-700">/</span>
        <h1 className="text-2xl font-bold text-white">{isNew ? "Viết bài mới" : "Chỉnh sửa bài viết"}</h1>
        <div className="ml-auto flex items-center gap-3 flex-wrap">
          {message && <span className="text-sm">{message}</span>}
          {/* Link xem bài trên website */}
          {!isNew && form.slug && (
            <a
              href={`/blog/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all text-xs font-medium"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Xem trên website
            </a>
          )}
          {/* Badge trạng thái */}
          {!isNew && (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              form.status === "published"
                ? "bg-green-500/15 text-green-400 border border-green-500/20"
                : "bg-gray-500/15 text-gray-400 border border-gray-500/20"
            }`}>
              {form.status === "published" ? "🟢 Đang đăng" : "⚪ Bản nháp"}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-gray-400 text-sm mb-2">Tiêu đề *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="Nhập tiêu đề bài viết..."
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all text-lg"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-gray-400 text-sm mb-2">
            Slug (URL) — <span className="text-gray-500">tự tạo từ tiêu đề</span>
          </label>
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden focus-within:border-blue-500/50 transition-all">
            <span className="px-4 py-3 text-gray-600 text-sm border-r border-white/10">/blog/</span>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => update("slug", e.target.value)}
              className="flex-1 px-4 py-3 bg-transparent text-white focus:outline-none text-sm"
            />
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-gray-400 text-sm mb-2">Mô tả ngắn (excerpt)</label>
          <textarea
            rows={2}
            value={form.excerpt}
            onChange={(e) => update("excerpt", e.target.value)}
            placeholder="Tóm tắt ngắn về bài viết, hiển thị trên danh sách blog..."
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all resize-none text-sm"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-400 text-sm mb-3">
            Danh mục <span className="text-gray-600 font-normal">— chọn 1 danh mục phù hợp</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {dbCategories.map((cat) => {
              const selected = form.category === cat.value;
              const c = CAT_COLOR[cat.color_key] || CAT_COLOR.blue;
              return (
                <button key={cat.value} type="button" onClick={() => update("category", cat.value)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium transition-all text-left
                    ${selected ? `${c.bg} ${c.border} ${c.text} ring-1 ring-inset ${c.border}` : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20"}`}
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
            {dbCategories.length === 0 && (
              <p className="col-span-3 text-gray-600 text-xs py-2">Chưa có danh mục — vào <a href="/admin/categories" className="text-blue-500 hover:underline">Admin → Danh mục</a> để thêm.</p>
            )}
          </div>
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-gray-400 text-sm mb-2">Ảnh bìa</label>

          {/* Tab chọn kiểu */}
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

          {/* Input file ẩn */}
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (ev) => {
                update("cover_image", ev.target?.result as string);
              };
              reader.readAsDataURL(file);
            }}
          />

          {/* Preview ảnh */}
          {form.cover_image && (
            <div className="mt-3 relative rounded-xl overflow-hidden border border-white/10 group">
              <img src={form.cover_image} alt="Preview ảnh bìa"
                className="w-full h-48 object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
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

        {/* Content */}
        <div>
          <label className="block text-gray-400 text-sm mb-2">Nội dung</label>
          <RichEditor value={form.content} onChange={(v) => update("content", v)} />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-white/10 flex-wrap">
          <button
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="px-5 py-2.5 border border-white/20 text-gray-300 font-medium rounded-xl hover:bg-white/5 transition-all disabled:opacity-50 text-sm"
          >
            {saving ? "Đang lưu..." : "💾 Lưu nháp"}
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={saving}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 text-sm"
          >
            {saving ? "Đang đăng..." : "🚀 Đăng bài"}
          </button>

          {/* Xem trên website (bản đang đăng) */}
          {!isNew && form.slug && form.status === "published" && (
            <a
              href={`/blog/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Xem bài đăng
            </a>
          )}

          {/* Xem preview (bản nháp) */}
          {!isNew && form.slug && form.status === "draft" && (
            <a
              href={`/blog/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 transition-all text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Xem trước
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
