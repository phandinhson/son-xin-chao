"use client";
import { useEffect, useState } from "react";

type Category = {
  id: string;
  label: string;
  value: string;
  icon: string;
  color_key: string;
  subs: string[];
  sort_order: number;
};

const COLOR_OPTIONS = [
  { key: "blue",    label: "Xanh dương", preview: "bg-blue-500"    },
  { key: "violet",  label: "Tím",        preview: "bg-violet-500"  },
  { key: "emerald", label: "Xanh lá",    preview: "bg-emerald-500" },
  { key: "orange",  label: "Cam",        preview: "bg-orange-500"  },
  { key: "red",     label: "Đỏ",         preview: "bg-red-500"     },
  { key: "indigo",  label: "Chàm",       preview: "bg-indigo-500"  },
  { key: "pink",    label: "Hồng",       preview: "bg-pink-500"    },
  { key: "green",   label: "Xanh lục",   preview: "bg-green-500"   },
];

const COLOR_MAP: Record<string, { badge: string; tag: string }> = {
  blue:    { badge: "text-blue-400 border-blue-500/40 bg-blue-500/10",       tag: "bg-blue-100 text-blue-700"    },
  violet:  { badge: "text-violet-400 border-violet-500/40 bg-violet-500/10", tag: "bg-violet-100 text-violet-700" },
  emerald: { badge: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10", tag: "bg-emerald-100 text-emerald-700" },
  orange:  { badge: "text-orange-400 border-orange-500/40 bg-orange-500/10", tag: "bg-orange-100 text-orange-700" },
  red:     { badge: "text-red-400 border-red-500/40 bg-red-500/10",         tag: "bg-red-100 text-red-700"      },
  indigo:  { badge: "text-indigo-400 border-indigo-500/40 bg-indigo-500/10", tag: "bg-indigo-100 text-indigo-700" },
  pink:    { badge: "text-pink-400 border-pink-500/40 bg-pink-500/10",       tag: "bg-pink-100 text-pink-700"    },
  green:   { badge: "text-green-400 border-green-500/40 bg-green-500/10",    tag: "bg-green-100 text-green-700"  },
};

const empty = { label: "", value: "", icon: "📁", color_key: "blue", subs: [] as string[], sort_order: 0 };

function toValue(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

export default function CategoriesAdmin() {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState(empty);
  const [subsInput, setSubsInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/categories")
      .then(r => r.json())
      .then(d => { setCats(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setForm(empty);
    setSubsInput("");
    setEditing(null);
    setIsNew(true);
  };

  const openEdit = (cat: Category) => {
    setForm({ label: cat.label, value: cat.value, icon: cat.icon, color_key: cat.color_key, subs: cat.subs || [], sort_order: cat.sort_order });
    setSubsInput((cat.subs || []).join("\n"));
    setEditing(cat);
    setIsNew(false);
  };

  const closeForm = () => { setEditing(null); setIsNew(false); };

  const handleSave = async () => {
    if (!form.label) { setMsg("❌ Vui lòng nhập tên danh mục"); return; }
    setSaving(true);
    const payload = { ...form, subs: subsInput.split("\n").map(s => s.trim()).filter(Boolean) };
    if (!payload.value) payload.value = toValue(payload.label);

    const url = isNew ? "/api/admin/categories" : `/api/admin/categories/${editing!.id}`;
    const method = isNew ? "POST" : "PUT";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (res.ok) {
      setMsg("✅ Đã lưu!");
      load();
      closeForm();
      setTimeout(() => setMsg(""), 2500);
    } else {
      const d = await res.json();
      setMsg(`❌ ${d.error || "Lỗi khi lưu"}`);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (res.ok) { load(); setDeleteId(null); }
  };

  const showForm = isNew || editing !== null;

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Danh mục bài viết</h1>
          <p className="text-gray-500 text-sm mt-1">Quản lý danh mục hiển thị trên trang Blog</p>
        </div>
        <div className="flex items-center gap-3">
          {msg && <span className="text-sm">{msg}</span>}
          <button onClick={openNew}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all text-sm">
            + Thêm danh mục
          </button>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-gray-500 text-center py-20">Đang tải...</div>
      ) : (
        <div className="space-y-3">
          {cats.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <div className="text-4xl mb-3">📂</div>
              <p>Chưa có danh mục nào. Bấm "+ Thêm danh mục" để bắt đầu.</p>
            </div>
          )}
          {cats.map((cat) => {
            const c = COLOR_MAP[cat.color_key] || COLOR_MAP.blue;
            return (
              <div key={cat.id} className="flex items-start gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl hover:border-white/20 transition-all group">
                {/* Icon + label */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-2xl">{cat.icon}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-3 py-0.5 rounded-full text-xs font-bold border ${c.badge}`}>{cat.label}</span>
                      <code className="text-gray-600 text-xs">{cat.value}</code>
                    </div>
                    {(cat.subs || []).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {(cat.subs || []).slice(0, 4).map(s => (
                          <span key={s} className="px-2 py-0.5 bg-white/5 text-gray-500 text-[11px] rounded-md">› {s}</span>
                        ))}
                        {(cat.subs || []).length > 4 && (
                          <span className="text-gray-600 text-[11px]">+{(cat.subs || []).length - 4} nữa</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {/* Sort order */}
                <div className="text-gray-600 text-xs flex items-center gap-1 flex-shrink-0">
                  <span>Thứ tự:</span>
                  <span className="text-gray-400 font-medium">{cat.sort_order}</span>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(cat)}
                    className="px-3 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-medium rounded-lg hover:bg-blue-600/30 transition-all">
                    ✏️ Sửa
                  </button>
                  <button onClick={() => setDeleteId(cat.id)}
                    className="px-3 py-1.5 bg-red-600/10 text-red-400 border border-red-500/20 text-xs font-medium rounded-lg hover:bg-red-600/20 transition-all">
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Form Modal ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={closeForm}>
          <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-white font-bold">{isNew ? "Thêm danh mục mới" : "Chỉnh sửa danh mục"}</h2>
              <button onClick={closeForm} className="text-gray-500 hover:text-white transition-colors">✕</button>
            </div>
            <div className="p-6 space-y-5">
              {/* Label */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Tên danh mục *</label>
                <input value={form.label}
                  onChange={e => setForm(prev => ({ ...prev, label: e.target.value, value: isNew ? toValue(e.target.value) : prev.value }))}
                  placeholder="VD: SEO, Ads, Website..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 text-sm"
                />
              </div>

              {/* Value (slug) */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Slug (ID dùng nội bộ)</label>
                <input value={form.value}
                  onChange={e => setForm(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="seo, google-ads, website..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 text-sm font-mono"
                />
                <p className="text-gray-600 text-xs mt-1">Dùng chữ thường, không dấu, dấu gạch ngang</p>
              </div>

              {/* Icon + Sort order */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Icon (emoji)</label>
                  <input value={form.icon}
                    onChange={e => setForm(prev => ({ ...prev, icon: e.target.value }))}
                    placeholder="🔍"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 text-lg text-center"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Thứ tự hiển thị</label>
                  <input type="number" value={form.sort_order}
                    onChange={e => setForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 text-sm"
                  />
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Màu sắc</label>
                <div className="grid grid-cols-4 gap-2">
                  {COLOR_OPTIONS.map(c => (
                    <button key={c.key} onClick={() => setForm(prev => ({ ...prev, color_key: c.key }))}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all
                        ${form.color_key === c.key ? "border-white/40 bg-white/10 text-white" : "border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-300"}`}>
                      <span className={`w-3 h-3 rounded-full flex-shrink-0 ${c.preview}`} />
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sub-topics */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Sub-topics <span className="text-gray-600">(mỗi dòng 1 mục)</span></label>
                <textarea rows={4} value={subsInput}
                  onChange={e => setSubsInput(e.target.value)}
                  placeholder={"SEO Organic\nSEO Technical\nSEO Local\nTừ khóa & Nội dung"}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 resize-none text-sm"
                />
              </div>

              {/* Preview */}
              {form.label && (
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-gray-500 text-xs mb-2">Preview trên blog:</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{form.icon}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold border ${(COLOR_MAP[form.color_key] || COLOR_MAP.blue).badge}`}>
                      {form.label}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 pb-5 flex gap-3">
              <button onClick={closeForm}
                className="px-5 py-2.5 border border-white/20 text-gray-400 rounded-xl hover:bg-white/5 transition-all text-sm">
                Hủy
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 text-sm">
                {saving ? "Đang lưu..." : isNew ? "➕ Thêm danh mục" : "💾 Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-4xl mb-3 text-center">⚠️</div>
            <h3 className="text-white font-bold text-center mb-2">Xóa danh mục?</h3>
            <p className="text-gray-400 text-sm text-center mb-5">
              Bài viết đã gán danh mục này sẽ không bị xóa, nhưng danh mục sẽ không còn hiển thị trên blog.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 border border-white/20 text-gray-400 rounded-xl hover:bg-white/5 transition-all text-sm">
                Hủy
              </button>
              <button onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all text-sm">
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
