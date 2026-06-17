"use client";
import { useEffect, useState } from "react";
import type { Pricing } from "@/lib/supabase";

const ICONS = ["🌱", "🚀", "👑", "⭐", "💎", "🔥"];
const emptyForm = {
  name: "", icon: "🌱", price: "", unit: "đ/tháng",
  description: "", features: "", not_included: "",
  is_popular: false, cta_text: "Bắt đầu ngay", sort_order: 0,
};

export default function PricingAdmin() {
  const [items, setItems] = useState<Pricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Pricing | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const res = await fetch("/api/admin/pricing");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ ...emptyForm, sort_order: items.length + 1 });
    setShowForm(true);
  };

  const openEdit = (item: Pricing) => {
    setEditing(item);
    setForm({
      name: item.name, icon: item.icon, price: item.price, unit: item.unit,
      description: item.description, features: item.features.join("\n"),
      not_included: item.not_included.join("\n"),
      is_popular: item.is_popular, cta_text: item.cta_text, sort_order: item.sort_order,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...form,
      features: form.features.split("\n").map((f) => f.trim()).filter(Boolean),
      not_included: form.not_included.split("\n").map((f) => f.trim()).filter(Boolean),
    };
    const url = editing ? `/api/admin/pricing/${editing.id}` : "/api/admin/pricing";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (res.ok) { await load(); setShowForm(false); }
    setSaving(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Xóa gói "${name}"?`)) return;
    await fetch(`/api/admin/pricing/${id}`, { method: "DELETE" });
    await load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Bảng giá</h1>
          <p className="text-gray-400 mt-1">{items.length} gói dịch vụ</p>
        </div>
        <button onClick={openNew} className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all">
          + Thêm gói
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-white/10 rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-6">{editing ? "Sửa gói dịch vụ" : "Thêm gói mới"}</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Tên gói *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="VD: Starter, Growth, Pro"
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50" />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Icon</label>
                  <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none">
                    {ICONS.map((i) => <option key={i} className="bg-gray-900">{i}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Giá *</label>
                  <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="3.500.000 hoặc Liên hệ"
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50" />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Đơn vị</label>
                  <input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    placeholder="đ/tháng"
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Thứ tự</label>
                  <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: +e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Mô tả</label>
                <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none resize-none" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Tính năng bao gồm (mỗi dòng 1 tính năng)</label>
                <textarea rows={6} value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })}
                  placeholder={"SEO on-page cơ bản\nNghiên cứu 10 từ khóa\nBáo cáo hàng tháng"}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none resize-none font-mono" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Không bao gồm (mỗi dòng 1 mục)</label>
                <textarea rows={2} value={form.not_included} onChange={(e) => setForm({ ...form, not_included: e.target.value })}
                  placeholder={"Quảng cáo trả phí\nThiết kế website"}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none resize-none font-mono" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Nút CTA</label>
                  <input value={form.cta_text} onChange={(e) => setForm({ ...form, cta_text: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none" />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <span className="text-gray-400 text-sm">Gói nổi bật (Popular)</span>
                    <button onClick={() => setForm({ ...form, is_popular: !form.is_popular })}
                      className={`w-11 h-6 rounded-full transition-colors ${form.is_popular ? "bg-violet-600" : "bg-gray-700"}`}>
                      <div className={`w-4 h-4 bg-white rounded-full mx-1 transition-transform ${form.is_popular ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-3 border border-white/20 text-gray-300 rounded-xl hover:bg-white/5 transition-all">Hủy</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all">
                {saving ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? <div className="text-gray-500 text-center py-20">Đang tải...</div> : (
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 transition-all group">
              {item.is_popular && (
                <div className="absolute -top-3 right-4 px-3 py-1 bg-gradient-to-r from-violet-600 to-pink-600 text-white text-xs font-bold rounded-full">⭐ Phổ biến</div>
              )}
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="text-white font-bold text-xl mb-1">{item.name}</h3>
              <p className="text-blue-400 font-bold text-lg mb-3">
                {item.price} <span className="text-gray-500 text-sm font-normal">{item.unit}</span>
              </p>
              <ul className="text-gray-400 text-xs space-y-1 mb-4">
                {item.features.slice(0, 3).map((f, i) => <li key={i}>✓ {f}</li>)}
                {item.features.length > 3 && <li className="text-gray-600">+{item.features.length - 3} tính năng...</li>}
              </ul>
              <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(item)} className="flex-1 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-500/30 transition-all">Sửa</button>
                <button onClick={() => handleDelete(item.id, item.name)} className="flex-1 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/30 transition-all">Xóa</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
