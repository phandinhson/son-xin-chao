"use client";
import { useEffect, useState } from "react";

type Addon = {
  id: string;
  name: string;
  icon: string;
  price: string;
  unit: string;
  sort_order: number;
  active: boolean;
};

const ICON_OPTIONS = ["🌐", "📄", "🔎", "⚙️", "✍️", "📍", "⭐", "🚀", "💎", "🔥", "📊", "💡", "🎯", "🛠️", "📱", "🖥️"];

const emptyForm = {
  name: "",
  icon: "⭐",
  price: "",
  unit: "đ",
  sort_order: 0,
  active: true,
};

export default function AddonsAdmin() {
  const [items, setItems] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Addon | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch("/api/admin/addons");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ ...emptyForm, sort_order: items.length + 1 });
    setShowForm(true);
  };

  const openEdit = (item: Addon) => {
    setEditing(item);
    setForm({
      name: item.name,
      icon: item.icon,
      price: item.price,
      unit: item.unit,
      sort_order: item.sort_order,
      active: item.active,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/admin/addons/${editing.id}` : "/api/admin/addons";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setShowForm(false);
      await load();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/addons/${id}`, { method: "DELETE" });
    setDeleteId(null);
    await load();
  };

  const toggleActive = async (item: Addon) => {
    await fetch(`/api/admin/addons/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, active: !item.active }),
    });
    await load();
  };

  // Preview price string like "5.000.000đ" or "300.000đ/bài"
  const previewPrice = (price: string, unit: string) => {
    if (!unit || unit === "đ") return `${price}đ`;
    if (unit.startsWith("đ/")) return `${price}${unit}`;
    return `${price} ${unit}`;
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dịch vụ bổ sung</h1>
          <p className="text-gray-400 text-sm mt-1">Quản lý các Add-on hiển thị trong phần Bảng giá</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          <span className="text-lg">+</span> Thêm Add-on
        </button>
      </div>

      {/* Preview note */}
      <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm">
        💡 Các add-on đang <span className="font-semibold text-white">bật</span> sẽ hiển thị trên website. Tắt để ẩn tạm thời mà không xoá.
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <div className="text-5xl mb-4">📦</div>
          <p>Chưa có add-on nào. Nhấn <span className="text-white">+ Thêm Add-on</span> để bắt đầu.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${
                item.active
                  ? "bg-white/5 border-white/10 hover:border-white/20"
                  : "bg-white/2 border-white/5 opacity-50"
              }`}
            >
              {/* Icon */}
              <span className="text-2xl w-10 text-center flex-shrink-0">{item.icon}</span>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm ${item.active ? "text-white" : "text-gray-500"}`}>
                  {item.name}
                </p>
                <p className="text-blue-400 text-sm font-bold mt-0.5">
                  {previewPrice(item.price, item.unit)}
                </p>
              </div>

              {/* Sort order badge */}
              <span className="text-xs text-gray-600 w-8 text-center flex-shrink-0">#{item.sort_order}</span>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Toggle active */}
                <button
                  onClick={() => toggleActive(item)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    item.active ? "bg-blue-600" : "bg-gray-700"
                  }`}
                  title={item.active ? "Đang hiện — click để ẩn" : "Đang ẩn — click để hiện"}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      item.active ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>

                {/* Edit */}
                <button
                  onClick={() => openEdit(item)}
                  className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  Sửa
                </button>

                {/* Delete */}
                <button
                  onClick={() => setDeleteId(item.id)}
                  className="px-3 py-1.5 text-xs font-medium text-red-500 hover:text-red-400 bg-red-500/5 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  Xoá
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Form Modal ─── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 w-full max-w-lg shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">
              {editing ? "Chỉnh sửa Add-on" : "Thêm Add-on mới"}
            </h2>

            <div className="space-y-5">
              {/* Name */}
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Tên dịch vụ <span className="text-red-400">*</span></label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ví dụ: Thiết kế website WordPress cơ bản"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-colors"
                />
              </div>

              {/* Icon picker */}
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {ICON_OPTIONS.map((ic) => (
                    <button
                      key={ic}
                      onClick={() => setForm({ ...form, icon: ic })}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                        form.icon === ic
                          ? "bg-blue-600 ring-2 ring-blue-400 scale-110"
                          : "bg-white/5 hover:bg-white/10 border border-white/10"
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price + Unit */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">Giá <span className="text-red-400">*</span></label>
                  <input
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="5.000.000"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">Đơn vị</label>
                  <input
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    placeholder="đ / đ/bài / đ/tháng"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-colors"
                  />
                  <p className="text-xs text-gray-600 mt-1">Gõ: đ, đ/bài, đ/tháng</p>
                </div>
              </div>

              {/* Preview */}
              {form.price && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-2xl">{form.icon}</span>
                  <div>
                    <p className="text-white text-sm font-medium">{form.name || "Tên dịch vụ"}</p>
                    <p className="text-blue-400 text-sm font-bold">{previewPrice(form.price, form.unit)}</p>
                  </div>
                </div>
              )}

              {/* Sort order */}
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Thứ tự hiển thị</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>

              {/* Active toggle */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setForm({ ...form, active: !form.active })}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    form.active ? "bg-blue-600" : "bg-gray-700"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      form.active ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-300">
                  {form.active ? "Hiển thị trên website" : "Ẩn (không hiển thị)"}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors"
              >
                Huỷ
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name || !form.price}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
              >
                {saving ? "Đang lưu..." : editing ? "Lưu thay đổi" : "Thêm mới"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Delete Confirm Modal ─── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="text-5xl mb-4">🗑️</div>
            <h3 className="text-white font-bold text-lg mb-2">Xác nhận xoá?</h3>
            <p className="text-gray-400 text-sm mb-6">Add-on này sẽ bị xoá vĩnh viễn và không thể khôi phục.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors"
              >
                Huỷ
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors"
              >
                Xoá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
