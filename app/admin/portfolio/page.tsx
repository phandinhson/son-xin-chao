"use client";
import { useEffect, useState } from "react";
import type { Portfolio } from "@/lib/supabase";

const COLORS = [
  "from-blue-600 to-cyan-500",
  "from-violet-600 to-pink-500",
  "from-emerald-600 to-teal-500",
  "from-pink-600 to-rose-500",
  "from-orange-600 to-amber-500",
  "from-blue-600 to-indigo-500",
];
const ICONS = ["🔍", "📱", "💻", "✨", "👗", "🏍️", "🏠", "📊", "🎯", "🚀"];
const CATEGORIES = ["SEO", "Ads", "Website"] as const;

type Category = typeof CATEGORIES[number];

const emptyForm = {
  title: "", industry: "", category: "SEO" as Category,
  result: "", detail: "", tags: "",
  metric_before: "", metric_after: "", metric_unit: "",
  icon: "🔍", color: COLORS[0], sort_order: 0, active: true,
};

export default function PortfolioAdmin() {
  const [items, setItems] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Portfolio | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const res = await fetch("/api/admin/portfolio");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ ...emptyForm, sort_order: items.length + 1 });
    setShowForm(true);
  };

  const openEdit = (item: Portfolio) => {
    setEditing(item);
    setForm({
      title: item.title, industry: item.industry, category: item.category,
      result: item.result, detail: item.detail, tags: item.tags.join(", "),
      metric_before: item.metric_before, metric_after: item.metric_after,
      metric_unit: item.metric_unit, icon: item.icon, color: item.color,
      sort_order: item.sort_order, active: item.active,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = { ...form, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean) };
    const url = editing ? `/api/admin/portfolio/${editing.id}` : "/api/admin/portfolio";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, {
      method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
    });
    if (res.ok) { await load(); setShowForm(false); }
    setSaving(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Xóa dự án "${title}"?`)) return;
    await fetch(`/api/admin/portfolio/${id}`, { method: "DELETE" });
    await load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Portfolio</h1>
          <p className="text-gray-400 mt-1">{items.length} dự án</p>
        </div>
        <button onClick={openNew} className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all">
          + Thêm dự án
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-white/10 rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-6">{editing ? "Sửa dự án" : "Thêm dự án mới"}</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Tên dự án *</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50" />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Ngành nghề</label>
                  <input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })}
                    placeholder="VD: Xe điện / Yadea"
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Danh mục</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as typeof form.category })}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none">
                    {CATEGORIES.map((c) => <option key={c} className="bg-gray-900">{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Icon</label>
                  <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none">
                    {ICONS.map((i) => <option key={i} className="bg-gray-900">{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Thứ tự</label>
                  <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: +e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Kết quả đạt được</label>
                <input value={form.result} onChange={(e) => setForm({ ...form, result: e.target.value })}
                  placeholder="VD: +340% traffic organic"
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Mô tả chi tiết</label>
                <input value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })}
                  placeholder="VD: Từ 200 → 880 lượt/tháng trong 5 tháng"
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Trước</label>
                  <input value={form.metric_before} onChange={(e) => setForm({ ...form, metric_before: e.target.value })}
                    placeholder="200"
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Sau</label>
                  <input value={form.metric_after} onChange={(e) => setForm({ ...form, metric_after: e.target.value })}
                    placeholder="880"
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Đơn vị</label>
                  <input value={form.metric_unit} onChange={(e) => setForm({ ...form, metric_unit: e.target.value })}
                    placeholder="lượt/tháng"
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Tags (cách nhau bởi dấu phẩy)</label>
                <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="SEO Local, Content, Google Map"
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Màu gradient</label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map((c) => (
                    <button key={c} onClick={() => setForm({ ...form, color: c })}
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c} transition-all ${form.color === c ? "ring-2 ring-white scale-110" : "opacity-60 hover:opacity-100"}`} />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-gray-400 text-sm">Hiển thị</label>
                <button onClick={() => setForm({ ...form, active: !form.active })}
                  className={`w-11 h-6 rounded-full transition-colors ${form.active ? "bg-blue-600" : "bg-gray-700"}`}>
                  <div className={`w-4 h-4 bg-white rounded-full mx-1 transition-transform ${form.active ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-3 border border-white/20 text-gray-300 rounded-xl hover:bg-white/5 transition-all">Hủy</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50">
                {saving ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? <div className="text-gray-500 text-center py-20">Đang tải...</div> : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 transition-all group">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl flex-shrink-0`}>{item.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-semibold truncate">{item.title}</h3>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-white/10 text-gray-400">{item.category}</span>
                  {!item.active && <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/15 text-red-400">Ẩn</span>}
                </div>
                <p className="text-blue-400 text-sm font-medium">{item.result}</p>
                <p className="text-gray-500 text-xs">{item.industry} · #{item.sort_order}</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(item)} className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-500/30 transition-all">Sửa</button>
                <button onClick={() => handleDelete(item.id, item.title)} className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/30 transition-all">Xóa</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
