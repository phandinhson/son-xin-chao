"use client";
import { useEffect, useState } from "react";

/* ── Types ── */
type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: string;
  description: string;
  type: "link" | "group" | "item";
  parent_id: string | null;
  sort_order: number;
  active: boolean;
  open_new_tab: boolean;
  badge: string;
  badge_color: string;
};

const BADGE_COLORS: Record<string, string> = {
  violet: "bg-violet-100 text-violet-700",
  red:    "bg-red-100 text-red-700",
  green:  "bg-green-100 text-green-700",
  blue:   "bg-blue-100 text-blue-700",
  amber:  "bg-amber-100 text-amber-700",
};

/* ── Empty item ── */
function emptyItem(overrides: Partial<NavItem> = {}): Omit<NavItem, "id"> {
  return {
    label: "", href: "#", icon: "", description: "",
    type: "link", parent_id: null,
    sort_order: 0, active: true, open_new_tab: false,
    badge: "", badge_color: "",
    ...overrides,
  };
}

/* ── Item Form Modal ── */
function ItemModal({
  item, groups, onSave, onClose,
}: {
  item: Partial<NavItem> & { parent_id?: string | null };
  groups: NavItem[];
  onSave: (data: Partial<NavItem>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Partial<NavItem>>({ ...emptyItem(), ...item });
  const set = (k: keyof NavItem, v: string | boolean | null) =>
    setForm(f => ({ ...f, [k]: v }));

  const isChild = form.parent_id != null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-base">
            {item.id ? "Chỉnh sửa mục menu" : "Thêm mục menu mới"}
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          {/* Type (only for new top-level items) */}
          {!item.id && !isChild && (
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Loại mục</label>
              <div className="flex gap-2">
                {(["link", "group"] as const).map(t => (
                  <button key={t} type="button" onClick={() => set("type", t)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${form.type === t ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                    {t === "link" ? "🔗 Link đơn" : "📂 Dropdown"}
                  </button>
                ))}
              </div>
              {form.type === "group" && (
                <p className="text-xs text-amber-600 mt-1.5 bg-amber-50 px-3 py-2 rounded-lg">
                  Dropdown sẽ hiện menu con khi hover. Thêm items vào dropdown sau khi tạo.
                </p>
              )}
            </div>
          )}

          {/* Label */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
              Tên hiển thị <span className="text-red-500">*</span>
            </label>
            <input value={form.label || ""} onChange={e => set("label", e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="VD: Dịch vụ, Blog, Liên hệ..." />
          </div>

          {/* Href */}
          {form.type !== "group" && (
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Đường dẫn (URL)</label>
              <input value={form.href || ""} onChange={e => set("href", e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="/trang, /#section, https://..." />
            </div>
          )}

          {/* Icon + Description (for dropdown items) */}
          {(isChild || form.type === "item") && (
            <>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Icon (emoji)</label>
                <input value={form.icon || ""} onChange={e => set("icon", e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="🔍 📣 💻 🎯 ..." />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Mô tả phụ</label>
                <input value={form.description || ""} onChange={e => set("description", e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mô tả ngắn hiển thị trong dropdown..." />
              </div>
            </>
          )}

          {/* Badge (for top-level links/groups) */}
          {!isChild && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Badge text</label>
                <input value={form.badge || ""} onChange={e => set("badge", e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder='VD: "NEW", "AI", "HOT"' />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Màu badge</label>
                <select value={form.badge_color || ""} onChange={e => set("badge_color", e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="">Không có</option>
                  <option value="violet">🟣 Violet</option>
                  <option value="red">🔴 Đỏ</option>
                  <option value="green">🟢 Xanh lá</option>
                  <option value="blue">🔵 Xanh dương</option>
                  <option value="amber">🟡 Vàng</option>
                </select>
              </div>
            </div>
          )}

          {/* Options */}
          <div className="flex flex-wrap gap-3 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.active ?? true} onChange={e => set("active", e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm text-gray-700 font-medium">Hiển thị</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.open_new_tab ?? false} onChange={e => set("open_new_tab", e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm text-gray-700 font-medium">Mở tab mới</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button onClick={() => onSave(form)}
            className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors">
            {item.id ? "Lưu thay đổi" : "Thêm mục"}
          </button>
          <button onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function NavigationAdmin() {
  const [items, setItems]       = useState<NavItem[]>([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState<{ item: Partial<NavItem>; parentId?: string | null } | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [saving, setSaving]     = useState(false);

  /* Load */
  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/nav-items");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  /* Toggle expand */
  const toggleExpand = (id: string) =>
    setExpanded(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  /* Save (create or update) */
  const handleSave = async (data: Partial<NavItem>) => {
    setSaving(true);
    const isEdit = !!data.id;
    const method = isEdit ? "PUT" : "POST";
    const url    = isEdit ? `/api/admin/nav-items/${data.id}` : "/api/admin/nav-items";

    // Nếu đang thêm item vào group, set parent_id và type
    if (modal?.parentId) {
      data.parent_id = modal.parentId;
      data.type      = "item";
    }

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) { setModal(null); await load(); }
    setSaving(false);
  };

  /* Delete */
  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`Xóa "${label}"? Các mục con cũng sẽ bị xóa.`)) return;
    await fetch(`/api/admin/nav-items/${id}`, { method: "DELETE" });
    await load();
  };

  /* Toggle active */
  const handleToggle = async (item: NavItem) => {
    await fetch(`/api/admin/nav-items/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !item.active }),
    });
    await load();
  };

  /* Reorder by picking position number directly */
  const handleReorder = async (item: NavItem, newPos: number) => {
    const siblings = items
      .filter(i => i.parent_id === item.parent_id && (item.parent_id !== null || i.type !== "item"))
      .sort((a, b) => a.sort_order - b.sort_order);
    const currentIdx = siblings.findIndex(i => i.id === item.id);
    const newIdx = newPos - 1;
    if (currentIdx === newIdx) return;
    const reordered = [...siblings];
    reordered.splice(currentIdx, 1);
    reordered.splice(newIdx, 0, item);
    setSaving(true);
    await Promise.all(
      reordered.map((it, i) =>
        fetch(`/api/admin/nav-items/${it.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sort_order: i + 1 }),
        })
      )
    );
    await load();
    setSaving(false);
  };

  /* Derived */
  const topLevel = items
    .filter(i => i.parent_id === null)
    .sort((a, b) => a.sort_order - b.sort_order);

  const childrenOf = (parentId: string) =>
    items.filter(i => i.parent_id === parentId).sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">🗂️ Quản lý Menu Navbar</h1>
            <p className="text-sm text-gray-500 mt-0.5">Thêm, sửa, xóa, sắp xếp các mục điều hướng</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              🌐 Xem Navbar
            </a>
            <button
              onClick={() => setModal({ item: emptyItem() })}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              + Thêm mục mới
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-4">

        {/* Guide */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-3.5 flex items-start gap-3">
          <span className="text-xl mt-0.5">💡</span>
          <div className="text-sm text-blue-800 space-y-0.5">
            <p className="font-semibold">Hướng dẫn nhanh</p>
            <p><span className="font-medium">🔗 Link đơn</span> — Hiện thẳng trên Navbar. <span className="font-medium">📂 Dropdown</span> — Nhóm có menu xổ xuống khi hover. Dùng ↑↓ để sắp xếp thứ tự.</p>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="bg-white rounded-xl border border-gray-200 py-16 flex items-center justify-center">
            <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (

          /* Nav tree */
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Column headers */}
            <div className="grid grid-cols-[32px_48px_1fr_100px_80px_80px] gap-3 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <span />
              <span className="text-center">Thứ tự</span>
              <span>Tên / URL</span>
              <span className="text-center">Loại</span>
              <span className="text-center">Hiển thị</span>
              <span className="text-right">Thao tác</span>
            </div>

            {topLevel.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                <div className="text-4xl mb-3">🗂️</div>
                <p>Chưa có mục menu nào. Nhấn &ldquo;Thêm mục mới&rdquo; để bắt đầu.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {topLevel.map((item, idx) => (
                  <div key={item.id}>
                    {/* Top-level row */}
                    <div className={`grid grid-cols-[32px_48px_1fr_100px_80px_80px] gap-3 px-5 py-3.5 items-center hover:bg-gray-50 transition-colors group ${!item.active ? "opacity-50" : ""}`}>

                      {/* Expand toggle (only groups) */}
                      <div className="flex justify-center">
                        {item.type === "group" ? (
                          <button onClick={() => toggleExpand(item.id)}
                            className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                            <svg className={`w-3.5 h-3.5 transition-transform ${expanded.has(item.id) ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        ) : (
                          <span className="w-6 h-6 flex items-center justify-center text-gray-300 text-xs">—</span>
                        )}
                      </div>

                      {/* Order number select */}
                      <div className="flex justify-center">
                        <select
                          value={idx + 1}
                          onChange={e => handleReorder(item, parseInt(e.target.value))}
                          className="w-10 h-8 text-center text-sm font-bold text-gray-700 bg-gray-100 border-0 rounded-lg cursor-pointer hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                          title="Chọn vị trí"
                        >
                          {topLevel.map((_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                          ))}
                        </select>
                      </div>

                      {/* Label + info */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-gray-900 text-sm">{item.label}</span>
                          {item.badge && (
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${BADGE_COLORS[item.badge_color] || "bg-gray-100 text-gray-600"}`}>
                              {item.badge}
                            </span>
                          )}
                          {item.open_new_tab && <span className="text-[10px] text-gray-400">↗ Tab mới</span>}
                        </div>
                        {item.type !== "group" && (
                          <p className="text-xs text-gray-400 mt-0.5 truncate">{item.href}</p>
                        )}
                        {item.type === "group" && (
                          <p className="text-xs text-gray-400 mt-0.5">{childrenOf(item.id).length} mục con</p>
                        )}
                      </div>

                      {/* Type badge */}
                      <div className="flex justify-center">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                          item.type === "group"
                            ? "bg-violet-50 text-violet-700 border-violet-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}>
                          {item.type === "group" ? "📂 Dropdown" : "🔗 Link"}
                        </span>
                      </div>

                      {/* Active toggle */}
                      <div className="flex justify-center">
                        <button onClick={() => handleToggle(item)}
                          className={`relative inline-flex w-10 h-5.5 rounded-full transition-colors focus:outline-none ${item.active ? "bg-blue-500" : "bg-gray-300"}`}
                          style={{ height: 22, width: 40 }}>
                          <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${item.active ? "translate-x-[18px]" : "translate-x-0"}`} />
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-1">
                        {/* Edit */}
                        <button onClick={() => setModal({ item })}
                          className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Sửa">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        {/* Delete */}
                        <button onClick={() => handleDelete(item.id, item.label)}
                          className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Xóa">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>

                    {/* Children (dropdown items) */}
                    {item.type === "group" && expanded.has(item.id) && (
                      <div className="border-t border-dashed border-gray-200 bg-gray-50/50">
                        {childrenOf(item.id).map((child, ci) => {
                          const siblings = childrenOf(item.id);
                          return (
                          <div key={child.id}
                            className={`grid grid-cols-[32px_48px_1fr_100px_80px_80px] gap-3 pl-10 pr-5 py-3 items-center border-b border-dashed border-gray-100 last:border-0 hover:bg-white transition-colors group ${!child.active ? "opacity-50" : ""}`}>

                            <div className="flex justify-center">
                              <span className="text-gray-300 text-sm">└</span>
                            </div>

                            {/* Order select for child */}
                            <div className="flex justify-center">
                              <select
                                value={ci + 1}
                                onChange={e => handleReorder(child, parseInt(e.target.value))}
                                className="w-10 h-8 text-center text-sm font-bold text-gray-700 bg-gray-100 border-0 rounded-lg cursor-pointer hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                                title="Chọn vị trí"
                              >
                                {siblings.map((_, i) => (
                                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                              </select>
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                {child.icon && <span className="text-base">{child.icon}</span>}
                                <span className="text-sm font-medium text-gray-800">{child.label}</span>
                              </div>
                              <p className="text-xs text-gray-400 truncate mt-0.5">{child.href}</p>
                              {child.description && <p className="text-xs text-gray-400 truncate">{child.description}</p>}
                            </div>

                            <div className="flex justify-center">
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[11px] font-medium rounded-full border border-gray-200">
                                Mục con
                              </span>
                            </div>

                            <div className="flex justify-center">
                              <button onClick={() => handleToggle(child)}
                                className={`relative inline-flex rounded-full transition-colors focus:outline-none ${child.active ? "bg-blue-500" : "bg-gray-300"}`}
                                style={{ height: 22, width: 40 }}>
                                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${child.active ? "translate-x-[18px]" : "translate-x-0"}`} />
                              </button>
                            </div>

                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => setModal({ item: child })}
                                className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Sửa">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                              </button>
                              <button onClick={() => handleDelete(child.id, child.label)}
                                className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Xóa">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </div>
                          </div>
                          );
                        })}

                        {/* Add child button */}
                        <div className="pl-10 pr-5 py-2.5">
                          <button
                            onClick={() => setModal({ item: emptyItem({ type: "item", parent_id: item.id }), parentId: item.id })}
                            className="flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                            Thêm mục vào "{item.label}"
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Quick expand hint for groups */}
                    {item.type === "group" && !expanded.has(item.id) && childrenOf(item.id).length > 0 && (
                      <div className="pl-14 pr-5 py-1.5 bg-gray-50/50 border-t border-dashed border-gray-100">
                        <button onClick={() => toggleExpand(item.id)}
                          className="text-xs text-gray-400 hover:text-blue-600 transition-colors">
                          Nhấn ▶ để xem {childrenOf(item.id).length} mục con...
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Add button at bottom */}
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
              <button onClick={() => setModal({ item: emptyItem() })}
                className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Thêm mục mới vào Navbar
              </button>
            </div>
          </div>
        )}

        {/* Preview hint */}
        <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3.5 flex items-center gap-3">
          <span className="text-xl">✅</span>
          <p className="text-sm text-green-800">
            <span className="font-semibold">Thay đổi được áp dụng ngay lập tức</span> — Navbar sẽ tự động cập nhật sau 60 giây hoặc khi reload trang.
          </p>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <ItemModal
          item={modal.item}
          groups={items.filter(i => i.type === "group")}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
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
