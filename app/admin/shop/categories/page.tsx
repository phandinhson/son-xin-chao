"use client";
import { useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  bg: string;
  sort_order: number;
  active: boolean;
};

const PRESET_COLORS = [
  { color: "#0ea5e9", bg: "#e0f2fe", label: "Sky" },
  { color: "#f97316", bg: "#fff7ed", label: "Cam" },
  { color: "#10b981", bg: "#ecfdf5", label: "Xanh lá" },
  { color: "#8b5cf6", bg: "#f5f3ff", label: "Tím" },
  { color: "#f59e0b", bg: "#fffbeb", label: "Vàng" },
  { color: "#ef4444", bg: "#fef2f2", label: "Đỏ" },
  { color: "#6366f1", bg: "#eef2ff", label: "Indigo" },
  { color: "#ec4899", bg: "#fdf2f8", label: "Hồng" },
  { color: "#14b8a6", bg: "#f0fdfa", label: "Teal" },
  { color: "#64748b", bg: "#f8fafc", label: "Xám" },
];

const EMOJI_SUGGESTIONS = ["🔍","📣","💻","💬","📦","🛒","⚡","🎯","🚀","📈","💰","🎨","🔧","📱","🌐","✨","🏆","💡","📊","🎵"];

function CategoryModal({ cat, onSave, onClose }: {
  cat: Partial<Category>;
  onSave: (d: Partial<Category>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Partial<Category>>({
    name: "", icon: "📦", color: "#6366f1", bg: "#eef2ff",
    sort_order: 0, active: true,
    ...cat,
  });

  const set = (k: keyof Category, v: string | number | boolean) =>
    setForm(f => ({ ...f, [k]: v }));

  const pickColor = (c: { color: string; bg: string }) => {
    setForm(f => ({ ...f, color: c.color, bg: c.bg }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Preview */}
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: form.color }}>
              <span style={{ filter: "brightness(0) invert(1)" }}>{form.icon}</span>
            </div>
            <h3 className="font-bold text-gray-900">{cat.id ? "Sửa danh mục" : "Thêm danh mục"}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 text-xl">×</button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          {/* Name */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
              Tên danh mục <span className="text-red-500">*</span>
            </label>
            <input value={form.name || ""} onChange={e => set("name", e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="VD: Dịch vụ SEO, Chạy Ads..." />
          </div>

          {/* Icon */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Icon</label>
            <input value={form.icon || ""} onChange={e => set("icon", e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập emoji..." />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {EMOJI_SUGGESTIONS.map(e => (
                <button key={e} type="button" onClick={() => set("icon", e)}
                  className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center hover:bg-gray-100 transition-colors ${form.icon === e ? "bg-gray-200 ring-2 ring-blue-400" : ""}`}>
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Color presets */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Màu sắc</label>
            <div className="grid grid-cols-5 gap-2">
              {PRESET_COLORS.map(c => (
                <button key={c.color} type="button" onClick={() => pickColor(c)}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                  style={{ outline: form.color === c.color ? `2px solid ${c.color}` : "none" }}>
                  <div className="w-8 h-8 rounded-lg" style={{ background: c.color }} />
                  <span className="text-[9px] text-gray-500 font-medium">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sort order + active */}
          <div className="flex items-center gap-4 pt-1">
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Thứ tự</label>
              <input type="number" value={form.sort_order ?? 0} onChange={e => set("sort_order", parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={0} />
            </div>
            <div className="pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active ?? true} onChange={e => set("active", e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm font-medium text-gray-700">Hiển thị</span>
              </label>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button onClick={() => onSave(form)}
            className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors">
            {cat.id ? "Lưu thay đổi" : "Thêm danh mục"}
          </button>
          <button onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ShopCategoriesAdmin() {
  const [cats,    setCats]   = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]  = useState<Partial<Category> | null>(null);
  const [saving,  setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/shop-categories");
    if (res.ok) setCats(await res.json());
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleSave = async (data: Partial<Category>) => {
    if (!data.name?.trim()) return alert("Tên danh mục không được để trống");
    setSaving(true);
    const isEdit = !!data.id;
    const res = await fetch(
      isEdit ? `/api/admin/shop-categories/${data.id}` : "/api/admin/shop-categories",
      { method: isEdit ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }
    );
    if (res.ok) { setModal(null); await load(); }
    else { const e = await res.json(); alert("Lỗi: " + (e.error || "Không lưu được")); }
    setSaving(false);
  };

  const handleDelete = async (cat: Category) => {
    if (!confirm(`Xóa danh mục "${cat.name}"?\nCác sản phẩm thuộc danh mục này sẽ không bị xóa.`)) return;
    await fetch(`/api/admin/shop-categories/${cat.id}`, { method: "DELETE" });
    await load();
  };

  const handleToggle = async (cat: Category) => {
    await fetch(`/api/admin/shop-categories/${cat.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !cat.active }),
    });
    await load();
  };

  const handleMove = async (cat: Category, dir: -1 | 1) => {
    const sorted = [...cats].sort((a, b) => a.sort_order - b.sort_order);
    const idx  = sorted.findIndex(c => c.id === cat.id);
    const swap = sorted[idx + dir];
    if (!swap) return;
    await Promise.all([
      fetch(`/api/admin/shop-categories/${cat.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sort_order: swap.sort_order }) }),
      fetch(`/api/admin/shop-categories/${swap.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sort_order: cat.sort_order }) }),
    ]);
    await load();
  };

  const sorted = [...cats].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">🏷️ Danh mục sản phẩm</h1>
            <p className="text-sm text-gray-500 mt-0.5">Quản lý các danh mục hiển thị ở cửa hàng</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/shop" target="_blank"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              🛒 Xem cửa hàng
            </a>
            <button onClick={() => setModal({})}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              + Thêm danh mục
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6 space-y-4">

        {/* Preview mobile grid */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Preview — hiển thị trên mobile</p>
          <div className="grid grid-cols-4 gap-2 max-w-xs">
            {/* "Tất cả" luôn đứng đầu */}
            <div className="flex flex-col items-center gap-1.5 py-2">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm" style={{ background: "#6366f1" }}>
                <span style={{ filter: "brightness(0) invert(1)" }}>🏪</span>
              </div>
              <span className="text-[10px] font-semibold text-gray-700 text-center leading-tight">Tất cả</span>
            </div>

            {sorted.filter(c => c.active).slice(0, 7).map(cat => (
              <div key={cat.id} className="flex flex-col items-center gap-1.5 py-2">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm" style={{ background: cat.color }}>
                  <span style={{ filter: "brightness(0) invert(1)" }}>{cat.icon}</span>
                </div>
                <span className="text-[10px] font-semibold text-gray-700 text-center leading-tight line-clamp-2 px-0.5">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 shadow-sm text-center">
            <p className="text-2xl font-extrabold text-gray-900">{cats.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">Tổng danh mục</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 shadow-sm text-center">
            <p className="text-2xl font-extrabold text-green-600">{cats.filter(c => c.active).length}</p>
            <p className="text-xs text-gray-500 mt-0.5">Đang hiển thị</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 shadow-sm text-center">
            <p className="text-2xl font-extrabold text-gray-400">{cats.filter(c => !c.active).length}</p>
            <p className="text-xs text-gray-500 mt-0.5">Đã ẩn</p>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="bg-white rounded-xl border border-gray-200 py-16 flex items-center justify-center">
            <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Column headers */}
            <div className="grid grid-cols-[48px_1fr_80px_80px_100px] gap-3 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <span>Icon</span>
              <span>Tên danh mục</span>
              <span className="text-center">Màu</span>
              <span className="text-center">Hiển thị</span>
              <span className="text-right">Thao tác</span>
            </div>

            {sorted.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                <div className="text-4xl mb-3">🏷️</div>
                <p>Chưa có danh mục nào</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {sorted.map((cat, idx) => (
                  <div key={cat.id} className={`grid grid-cols-[48px_1fr_80px_80px_100px] gap-3 px-5 py-3 items-center hover:bg-gray-50 transition-colors ${!cat.active ? "opacity-50" : ""}`}>

                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm"
                      style={{ background: cat.color }}>
                      <span style={{ filter: "brightness(0) invert(1)" }}>{cat.icon}</span>
                    </div>

                    {/* Name */}
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{cat.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Thứ tự: {cat.sort_order}</p>
                    </div>

                    {/* Color swatch */}
                    <div className="flex justify-center">
                      <div className="w-6 h-6 rounded-full shadow-sm ring-2 ring-white ring-offset-1" style={{ background: cat.color }} />
                    </div>

                    {/* Toggle */}
                    <div className="flex justify-center">
                      <button onClick={() => handleToggle(cat)}
                        className="relative inline-flex rounded-full transition-colors focus:outline-none"
                        style={{ height: 22, width: 40, background: cat.active ? "#3b82f6" : "#d1d5db" }}>
                        <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
                          style={{ transform: cat.active ? "translateX(18px)" : "translateX(0)" }} />
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleMove(cat, -1)} disabled={idx === 0}
                        className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-20 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                      </button>
                      <button onClick={() => handleMove(cat, 1)} disabled={idx === sorted.length - 1}
                        className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-20 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                      </button>
                      <button onClick={() => setModal(cat)}
                        className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => handleDelete(cat)}
                        className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add at bottom */}
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
              <button onClick={() => setModal({})}
                className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Thêm danh mục mới
              </button>
            </div>
          </div>
        )}

        {/* Note */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3.5 flex items-start gap-3">
          <span className="text-xl mt-0.5">💡</span>
          <div className="text-sm text-amber-800 space-y-1">
            <p className="font-semibold">Đồng bộ với website</p>
            <p>Danh mục sẽ tự cập nhật trên trang cửa hàng sau khi reload. Khi tạo/sửa sản phẩm, dropdown danh mục cũng sẽ lấy từ danh sách này.</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal !== null && (
        <CategoryModal cat={modal} onSave={handleSave} onClose={() => setModal(null)} />
      )}

      {saving && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Đang lưu...
        </div>
      )}
    </div>
  );
}
