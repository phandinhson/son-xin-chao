"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const FALLBACK_CATEGORIES = ["Dịch vụ SEO", "Chạy quảng cáo", "Thiết kế website", "Tư vấn", "Khác"];

type ProductFormData = {
  name: string;
  slug: string;
  short_description: string;
  description: string;
  price: string;
  sale_price: string;
  category: string;
  tags: string;
  images: string;   // comma-separated URLs
  status: "draft" | "published";
  featured: boolean;
  stock: string;
  sort_order: string;
};

type Props = {
  initial?: Partial<ProductFormData> & { id?: string };
  mode: "create" | "edit";
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d").replace(/Đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ProductForm({ initial, mode }: Props) {
  const router  = useRouter();
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState("");
  const [categories,  setCategories]  = useState<string[]>(FALLBACK_CATEGORIES);

  // Fetch danh mục từ DB (đồng bộ với admin/shop/categories)
  useEffect(() => {
    fetch("/api/admin/shop-categories")
      .then(r => r.ok ? r.json() : [])
      .then((data: { name: string }[]) => {
        if (data.length > 0) setCategories(data.map(c => c.name));
      })
      .catch(() => {});
  }, []);

  const [form, setForm] = useState<ProductFormData>({
    name:              initial?.name || "",
    slug:              initial?.slug || "",
    short_description: initial?.short_description || "",
    description:       initial?.description || "",
    price:             initial?.price?.toString() || "",
    sale_price:        initial?.sale_price?.toString() || "",
    category:          initial?.category || CATEGORIES[0],
    tags:              initial?.tags || "",
    images:            initial?.images || "",
    status:            initial?.status || "draft",
    featured:          initial?.featured || false,
    stock:             initial?.stock?.toString() || "-1",
    sort_order:        initial?.sort_order?.toString() || "0",
  });

  const set = (key: keyof ProductFormData, val: string | boolean) =>
    setForm(f => ({ ...f, [key]: val }));

  const handleNameChange = (name: string) => {
    setForm(f => ({ ...f, name, slug: mode === "create" ? slugify(name) : f.slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.price) { setError("Vui lòng nhập tên và giá sản phẩm"); return; }
    setSaving(true);

    const payload = {
      name:              form.name,
      slug:              form.slug || slugify(form.name),
      short_description: form.short_description,
      description:       form.description,
      price:             parseInt(form.price) || 0,
      sale_price:        form.sale_price ? parseInt(form.sale_price) : null,
      category:          form.category,
      tags:              form.tags.split(",").map(t => t.trim()).filter(Boolean),
      images:            form.images.split("\n").map(s => s.trim()).filter(Boolean),
      status:            form.status,
      featured:          form.featured,
      stock:             parseInt(form.stock) || -1,
      sort_order:        parseInt(form.sort_order) || 0,
    };

    try {
      const url    = mode === "create" ? "/api/admin/products" : `/api/admin/products/${initial?.id}`;
      const method = mode === "create" ? "POST" : "PUT";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "Lỗi lưu sản phẩm");
      } else {
        router.push("/admin/shop/products");
        router.refresh();
      }
    } catch {
      setError("Lỗi kết nối, vui lòng thử lại");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Main info */}
        <div className="lg:col-span-2 space-y-5">

          {/* Name */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-4">Thông tin cơ bản</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Tên sản phẩm <span className="text-red-500">*</span></label>
                <input required value={form.name} onChange={e => handleNameChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Gói SEO Starter 3 tháng" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  Slug URL
                  <span className="text-gray-400 font-normal ml-1">(tự động tạo từ tên)</span>
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                  <span className="px-3 py-2.5 text-gray-400 text-sm bg-gray-50 border-r border-gray-300">/shop/</span>
                  <input value={form.slug} onChange={e => set("slug", e.target.value)}
                    className="flex-1 px-3 py-2.5 text-sm focus:outline-none"
                    placeholder="goi-seo-starter" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Mô tả ngắn</label>
                <textarea rows={2} value={form.short_description} onChange={e => set("short_description", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Mô tả ngắn hiển thị trong danh sách sản phẩm..." />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Mô tả chi tiết</label>
                <textarea rows={8} value={form.description} onChange={e => set("description", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono"
                  placeholder="Hỗ trợ HTML. VD: <ul><li>Tính năng 1</li></ul>" />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-4">Hình ảnh sản phẩm</h3>
            <textarea rows={4} value={form.images} onChange={e => set("images", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono"
              placeholder={"Mỗi URL 1 dòng:\nhttps://example.com/anh1.jpg\nhttps://example.com/anh2.jpg"} />
            {/* Image previews */}
            {form.images && (
              <div className="mt-3 flex flex-wrap gap-2">
                {form.images.split("\n").filter(s => s.trim()).map((url, i) => (
                  <div key={i} className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                    <img src={url.trim()} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Settings */}
        <div className="space-y-5">

          {/* Status + Featured */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-4">Trạng thái</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" checked={form.status === "published"} onChange={() => set("status", "published")} className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700">
                  <span className="font-medium">Đang bán</span>
                  <span className="text-gray-400 block text-xs">Hiển thị trên cửa hàng</span>
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" checked={form.status === "draft"} onChange={() => set("status", "draft")} className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700">
                  <span className="font-medium">Bản nháp</span>
                  <span className="text-gray-400 block text-xs">Ẩn khỏi cửa hàng</span>
                </span>
              </label>
              <hr className="border-gray-100" />
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e => set("featured", e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm font-medium text-gray-700">⭐ Sản phẩm nổi bật</span>
              </label>
            </div>

            {/* Buttons */}
            <div className="mt-5 flex gap-2">
              <button type="submit" disabled={saving}
                className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors">
                {saving ? "Đang lưu..." : mode === "create" ? "Tạo sản phẩm" : "Lưu thay đổi"}
              </button>
              <button type="button" onClick={() => router.push("/admin/shop/products")}
                className="px-3 py-2.5 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                Hủy
              </button>
            </div>
          </div>

          {/* Price */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-4">Giá</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Giá gốc (VND) <span className="text-red-500">*</span></label>
                <input required type="number" min="0" value={form.price} onChange={e => set("price", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="3500000" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Giá khuyến mãi (để trống nếu không)</label>
                <input type="number" min="0" value={form.sale_price} onChange={e => set("sale_price", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="2900000" />
              </div>
            </div>
          </div>

          {/* Category + Tags */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-4">Phân loại</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Danh mục</label>
                <select value={form.category} onChange={e => set("category", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Tags (cách nhau bằng dấu phẩy)</label>
                <input value={form.tags} onChange={e => set("tags", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="SEO, Google, On-page" />
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-4">Kho & Thứ tự</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Số lượng kho (-1 = không giới hạn)</label>
                <input type="number" value={form.stock} onChange={e => set("stock", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="-1" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Thứ tự hiển thị</label>
                <input type="number" value={form.sort_order} onChange={e => set("sort_order", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
