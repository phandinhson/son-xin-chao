"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RichEditor from "@/components/RichEditor";

type DbCategory = { id: string; label: string; value: string; icon: string; color_key: string };

const CAT_LIGHT: Record<string, { bg: string; border: string; text: string }> = {
  blue:    { bg: "bg-blue-50",    border: "border-blue-300",    text: "text-blue-700"    },
  violet:  { bg: "bg-violet-50",  border: "border-violet-300",  text: "text-violet-700"  },
  emerald: { bg: "bg-emerald-50", border: "border-emerald-300", text: "text-emerald-700" },
  orange:  { bg: "bg-orange-50",  border: "border-orange-300",  text: "text-orange-700"  },
  red:     { bg: "bg-red-50",     border: "border-red-300",     text: "text-red-700"     },
  indigo:  { bg: "bg-indigo-50",  border: "border-indigo-300",  text: "text-indigo-700"  },
  pink:    { bg: "bg-pink-50",    border: "border-pink-300",    text: "text-pink-700"    },
  green:   { bg: "bg-green-50",   border: "border-green-300",   text: "text-green-700"   },
};

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

export default function NewPost() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", slug: "", excerpt: "", content: "",
    cover_image: "", status: "draft" as "draft" | "published", category: "", focus_keyword: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imgTab, setImgTab] = useState<"url" | "upload" | "library">("url");
  const [dbCategories, setDbCategories] = useState<DbCategory[]>([]);
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverUploadErr, setCoverUploadErr] = useState("");
  const [libImages, setLibImages] = useState<{name:string;url:string}[]>([]);
  const [libLoaded, setLibLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d) && d.length > 0) {
          setDbCategories(d);
          // Auto-chọn category đầu tiên từ DB nếu chưa chọn
          setForm(prev => ({ ...prev, category: prev.category || d[0].value }));
        }
      });
  }, []);

  const loadLibrary = () => {
    if (libLoaded) return;
    fetch("/api/admin/media").then(r => r.json()).then(d => {
      if (Array.isArray(d)) { setLibImages(d); setLibLoaded(true); }
    }).catch(() => {});
  };

  const uploadCoverImage = async (file: File) => {
    setCoverUploading(true);
    setCoverUploadErr("");
    const fd = new FormData();
    fd.append("files", file);
    try {
      const res  = await fetch("/api/admin/media", { method: "POST", body: fd });
      const data = await res.json();
      if (data.uploaded?.length && data.urls?.length) {
        update("cover_image", data.urls[0]);
        setLibLoaded(false);
      } else {
        setCoverUploadErr(data.errors?.[0] || data.error || "Upload thất bại");
      }
    } catch { setCoverUploadErr("Không thể kết nối server"); }
    finally { setCoverUploading(false); }
  };

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
    <div className="min-h-screen bg-gray-100">

      {/* ── Top bar ── */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 px-5 py-3">
          <Link href="/admin/posts" className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Bài viết
          </Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-sm font-semibold text-gray-800">Viết bài mới</h1>

          <div className="ml-auto flex items-center gap-2.5">
            {error && (
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-red-100 text-red-700">{error}</span>
            )}
            <button
              onClick={() => handleSave("draft")}
              disabled={saving}
              className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              {saving ? "Đang lưu..." : "Lưu nháp"}
            </button>
            <button
              onClick={() => handleSave("published")}
              disabled={saving}
              className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              {saving ? "Đang đăng..." : "Đăng bài"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Body: 2 columns ── */}
      <div className="max-w-6xl mx-auto px-5 py-6 flex gap-5 items-start">

        {/* ── Left: Title + Content ── */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Title card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tiêu đề bài viết *</label>
            </div>
            <div className="px-5 py-4">
              <input
                type="text"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Nhập tiêu đề bài viết..."
                className="w-full text-xl font-semibold text-gray-900 placeholder-gray-300 border-0 focus:outline-none focus:ring-0 bg-transparent"
                autoFocus
              />
            </div>
          </div>

          {/* Content editor card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nội dung</label>
              <span className="text-xs text-gray-400">Markdown được hỗ trợ</span>
            </div>
            <div className="p-4">
              <RichEditor value={form.content} onChange={(v) => update("content", v)} />
            </div>
          </div>

        </div>

        {/* ── Right: Sidebar ── */}
        <div className="w-72 flex-shrink-0 space-y-4 sticky top-[57px]">

          {/* Slug */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">🔗 Đường dẫn (URL)</h3>
            </div>
            <div className="p-4">
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                <span className="px-2.5 py-2 text-gray-400 text-xs bg-gray-50 border-r border-gray-300 select-none whitespace-nowrap">/blog/</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => update("slug", e.target.value)}
                  className="flex-1 px-2.5 py-2 text-sm text-gray-900 focus:outline-none bg-white min-w-0"
                />
              </div>
              <p className="mt-1.5 text-xs text-gray-400">Tự tạo từ tiêu đề, có thể chỉnh tay</p>
            </div>
          </div>

          {/* Focus Keyword */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-amber-50 border-b border-amber-200">
              <h3 className="text-xs font-semibold text-amber-800 uppercase tracking-wide">🎯 Từ khóa chính SEO</h3>
            </div>
            <div className="p-4">
              <input
                type="text"
                value={form.focus_keyword || ""}
                onChange={(e) => update("focus_keyword", e.target.value)}
                placeholder="VD: dịch vụ SEO Long Thành"
                className="w-full px-3 py-2 text-sm text-gray-900 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
              />
              <p className="mt-1.5 text-xs text-gray-400">Từ khóa Google muốn bài này rank lên top</p>
              {form.focus_keyword && form.title && !form.title.toLowerCase().includes(form.focus_keyword.toLowerCase()) && (
                <p className="mt-2 text-xs text-amber-600 bg-amber-50 px-2.5 py-1.5 rounded-md border border-amber-200">
                  ⚠️ Tiêu đề chưa chứa từ khóa chính
                </p>
              )}
              {form.focus_keyword && form.title && form.title.toLowerCase().includes(form.focus_keyword.toLowerCase()) && (
                <p className="mt-2 text-xs text-green-600 bg-green-50 px-2.5 py-1.5 rounded-md border border-green-200">
                  ✅ Tiêu đề có chứa từ khóa chính
                </p>
              )}
            </div>
          </div>

          {/* Excerpt */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">📝 Mô tả ngắn</h3>
            </div>
            <div className="p-4">
              <textarea
                rows={4}
                value={form.excerpt}
                onChange={(e) => update("excerpt", e.target.value)}
                placeholder="Tóm tắt bài viết (dùng cho SEO meta description, 150–160 ký tự)..."
                className="w-full text-sm text-gray-900 placeholder-gray-400 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
              />
              <div className="flex justify-between mt-1.5">
                <span className="text-xs text-gray-400">Meta description</span>
                <span className={`text-xs font-medium ${form.excerpt.length > 160 ? "text-red-500" : form.excerpt.length > 130 ? "text-green-600" : "text-gray-400"}`}>
                  {form.excerpt.length}/160
                </span>
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">🏷️ Danh mục</h3>
            </div>
            <div className="p-3 space-y-1">
              {dbCategories.length === 0 && (
                <p className="text-xs text-gray-400 py-2 px-1">
                  Chưa có danh mục —{" "}
                  <a href="/admin/categories" className="text-blue-600 hover:underline">Thêm danh mục</a>
                </p>
              )}
              {dbCategories.map((cat) => {
                const selected = form.category === cat.value;
                const c = CAT_LIGHT[cat.color_key] || CAT_LIGHT.blue;
                return (
                  <label key={cat.value}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-md cursor-pointer transition-all ${
                      selected ? `${c.bg} border ${c.border}` : "hover:bg-gray-50 border border-transparent"
                    }`}>
                    <input
                      type="radio" name="category" value={cat.value}
                      checked={selected}
                      onChange={() => update("category", cat.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-base leading-none">{cat.icon}</span>
                    <span className={`text-sm font-medium ${selected ? c.text : "text-gray-700"}`}>{cat.label}</span>
                    {selected && (
                      <svg className={`w-4 h-4 ml-auto flex-shrink-0 ${c.text}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Cover Image */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">🖼️ Ảnh bìa</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex rounded-md border border-gray-200 overflow-hidden text-xs">
                {(["url", "upload", "library"] as const).map((tab) => (
                  <button key={tab} onClick={() => { setImgTab(tab); if (tab === "library") loadLibrary(); }}
                    className={`flex-1 py-1.5 font-medium transition-colors ${
                      imgTab === tab ? "bg-blue-600 text-white" : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}>
                    {tab === "url" ? "🔗 URL" : tab === "upload" ? "📁 Tải lên" : "🖼️ Thư viện"}
                  </button>
                ))}
              </div>

              {imgTab === "url" && (
                <input type="url"
                  value={form.cover_image || ""}
                  onChange={(e) => update("cover_image", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 text-sm text-gray-900 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              )}

              {imgTab === "upload" && (
                <>
                  <div onClick={() => !coverUploading && fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all group ${
                      coverUploading ? "border-blue-300 bg-blue-50 opacity-70 cursor-wait" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                    }`}>
                    <div className="text-xl mb-1">{coverUploading ? "⏳" : "📁"}</div>
                    <p className="text-gray-600 text-xs font-medium">{coverUploading ? "Đang lưu vào thư viện..." : "Nhấp để chọn ảnh"}</p>
                    <p className="text-gray-400 text-xs mt-0.5">Tự động lưu vào /public/images/</p>
                  </div>
                  {coverUploadErr && <p className="text-red-500 text-xs">{coverUploadErr}</p>}
                  {((form.cover_image || "").startsWith("/images/") || (form.cover_image || "").includes("/storage/v1/object/public/")) && (
                    <p className="text-green-600 text-xs bg-green-50 border border-green-200 rounded px-2 py-1.5">
                      ✓ Đã lưu: <code>{form.cover_image}</code>
                    </p>
                  )}
                </>
              )}

              {imgTab === "library" && (
                <div className="max-h-48 overflow-y-auto">
                  {libImages.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">Thư viện trống — hãy upload ảnh trước.</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {libImages.map(img => (
                        <button key={img.name} type="button" onClick={() => update("cover_image", img.url)}
                          className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                            form.cover_image === img.url ? "border-blue-500 ring-1 ring-blue-300" : "border-transparent hover:border-blue-300"
                          }`}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img.url} alt={img.name} className="w-full aspect-square object-cover" loading="lazy" />
                          {form.cover_image === img.url && (
                            <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                              <span className="w-5 h-5 bg-blue-600 rounded-full text-white text-xs flex items-center justify-center">✓</span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadCoverImage(f); }}
              />

              {form.cover_image && (
                <div className="relative rounded-lg overflow-hidden border border-gray-200 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.cover_image} alt="Preview" className="w-full h-36 object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button onClick={() => { update("cover_image", ""); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-md shadow">
                      🗑️ Xoá ảnh
                    </button>
                  </div>
                  {((form.cover_image || "").startsWith("/images/") || (form.cover_image || "").includes("/storage/v1/object/public/")) && (
                    <div className="absolute bottom-2 left-2">
                      <span className="px-2 py-0.5 bg-blue-600/80 text-white text-xs rounded">📁 Thư viện</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bottom action buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => handleSave("draft")}
              disabled={saving}
              className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              💾 Lưu nháp
            </button>
            <button
              onClick={() => handleSave("published")}
              disabled={saving}
              className="flex-1 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              🚀 Đăng bài
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
