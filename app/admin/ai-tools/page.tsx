"use client";
import { useState, useEffect, useRef } from "react";

type AiTool = {
  id: string;
  name: string;
  description: string;
  category: "Hình ảnh" | "Video" | "Âm thanh" | "Văn phòng";
  badge: "Miễn phí" | "Freemium" | "Trả phí";
  url: string;
  icon: string;
  is_hot: boolean;
  tags: string[];
  sort_order: number;
  active: boolean;
  created_at: string;
};

const EMPTY: Omit<AiTool, "id" | "created_at"> = {
  name: "",
  description: "",
  category: "Văn phòng",
  badge: "Freemium",
  url: "",
  icon: "🤖",
  is_hot: false,
  tags: [],
  sort_order: 0,
  active: true,
};

const CAT_COLOR: Record<AiTool["category"], string> = {
  "Hình ảnh": "bg-violet-100 text-violet-700",
  "Video":    "bg-rose-100 text-rose-700",
  "Âm thanh": "bg-emerald-100 text-emerald-700",
  "Văn phòng":"bg-blue-100 text-blue-700",
};

const BADGE_COLOR: Record<AiTool["badge"], string> = {
  "Miễn phí": "bg-emerald-100 text-emerald-700",
  "Freemium": "bg-amber-100 text-amber-700",
  "Trả phí":  "bg-slate-100 text-slate-600",
};

export default function AdminAiToolsPage() {
  const [tools, setTools] = useState<AiTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<AiTool["category"] | "Tất cả">("Tất cả");
  const [search, setSearch] = useState("");

  // Panel state
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState<AiTool | null>(null);
  const [form, setForm] = useState<Omit<AiTool, "id" | "created_at">>(EMPTY);
  const [tagInput, setTagInput] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  /* ── fetch ── */
  const fetchTools = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/ai-tools");
    const data = await res.json();
    setTools(Array.isArray(data) ? data : []);
    setLoading(false);
  };
  useEffect(() => { fetchTools(); }, []);

  /* ── toast ── */
  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── open panel ── */
  const openNew = () => {
    setEditing(null);
    setForm({ ...EMPTY, sort_order: tools.length + 1 });
    setTagInput("");
    setPanelOpen(true);
  };

  const openEdit = (t: AiTool) => {
    setEditing(t);
    // null-safety: DB có thể trả null thay vì "" → React input bị uncontrolled
    setForm({
      name:        t.name        ?? "",
      description: t.description ?? "",
      category:    (t.category   ?? "Văn phòng") as AiTool["category"],
      badge:       (t.badge      ?? "Freemium")  as AiTool["badge"],
      url:         t.url         ?? "",
      icon:        t.icon        ?? "🤖",
      is_hot:      t.is_hot      ?? false,
      tags:        Array.isArray(t.tags) ? [...t.tags] : [],
      sort_order:  t.sort_order  ?? 0,
      active:      t.active      ?? true,
    });
    setTagInput("");
    setPanelOpen(true);
  };

  /* ── save ── */
  const handleSave = async () => {
    if (!form.name.trim() || !form.url.trim()) {
      showToast("Vui lòng điền tên và URL", "error");
      return;
    }
    setSaving(true);
    try {
      const url = editing ? `/api/admin/ai-tools/${editing.id}` : "/api/admin/ai-tools";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      showToast(editing ? "Đã cập nhật công cụ!" : "Đã thêm công cụ mới!");
      setPanelOpen(false);
      fetchTools();
    } catch {
      showToast("Có lỗi xảy ra", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ── toggle active / hot inline ── */
  const toggleField = async (t: AiTool, field: "active" | "is_hot") => {
    const updated = { ...t, [field]: !t[field] };
    setTools((prev) => prev.map((x) => (x.id === t.id ? updated : x)));
    await fetch(`/api/admin/ai-tools/${t.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: !t[field] }),
    });
  };

  /* ── delete ── */
  const handleDelete = async (t: AiTool) => {
    if (!confirm(`Xóa "${t.name}"? Hành động này không thể hoàn tác.`)) return;
    await fetch(`/api/admin/ai-tools/${t.id}`, { method: "DELETE" });
    showToast(`Đã xóa "${t.name}"`);
    fetchTools();
  };

  /* ── tag helpers ── */
  const addTag = () => {
    const v = tagInput.trim();
    if (v && !form.tags.includes(v)) {
      setForm((f) => ({ ...f, tags: [...f.tags, v] }));
    }
    setTagInput("");
  };
  const removeTag = (tag: string) => setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));

  /* ── filtered list ── */
  const displayed = tools.filter((t) => {
    const matchCat = filter === "Tất cả" || t.category === filter;
    const q = search.toLowerCase();
    const matchQ = !q || t.name.toLowerCase().includes(q) || t.url.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  const cats: (AiTool["category"] | "Tất cả")[] = ["Tất cả", "Hình ảnh", "Video", "Âm thanh", "Văn phòng"];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold transition-all ${
          toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
        }`}>
          {toast.type === "success"
            ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          }
          {toast.msg}
        </div>
      )}

      {/* ── Top bar ── */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <a href="/admin" className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </a>
            <div>
              <h1 className="font-extrabold text-gray-900 text-base">Công cụ AI</h1>
              <p className="text-xs text-gray-400">{tools.length} công cụ · {tools.filter(t => t.active).length} đang hiển thị</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/cong-cu-ai" target="_blank"
              className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Xem trang
            </a>
            <button onClick={openNew}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Thêm công cụ
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">

        {/* ── Filter + Search ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex gap-2 flex-wrap">
            {cats.map((c) => (
              <button key={c} onClick={() => setFilter(c)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  filter === c ? "bg-gray-900 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
                }`}>
                {c}
                <span className="ml-1.5 text-xs opacity-60">
                  ({c === "Tất cả" ? tools.length : tools.filter(t => t.category === c).length})
                </span>
              </button>
            ))}
          </div>
          <div className="relative sm:ml-auto sm:w-60">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Tìm công cụ..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" />
          </div>
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-gray-400 gap-3">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Đang tải...
            </div>
          ) : displayed.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-3">🤖</div>
              <p className="font-medium">Chưa có công cụ nào</p>
              <button onClick={openNew} className="mt-3 text-sm text-blue-600 hover:underline">+ Thêm công cụ đầu tiên</button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                  <th className="text-left px-4 py-3 font-semibold">Công cụ</th>
                  <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Danh mục</th>
                  <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">Giá</th>
                  <th className="text-center px-4 py-3 font-semibold hidden lg:table-cell">Hot</th>
                  <th className="text-center px-4 py-3 font-semibold">Hiển thị</th>
                  <th className="text-right px-4 py-3 font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {displayed.map((t) => (
                  <tr key={t.id} className="group hover:bg-gray-50 transition-colors">
                    {/* Tên + icon + URL */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                          {t.icon}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{t.name}</div>
                          <a href={t.url} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline truncate max-w-[200px] block">
                            {t.url.replace("https://", "").replace("http://", "").split("/")[0]}
                          </a>
                        </div>
                      </div>
                    </td>
                    {/* Category */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CAT_COLOR[t.category]}`}>
                        {t.category}
                      </span>
                    </td>
                    {/* Badge */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${BADGE_COLOR[t.badge]}`}>
                        {t.badge}
                      </span>
                    </td>
                    {/* Hot toggle */}
                    <td className="px-4 py-3 text-center hidden lg:table-cell">
                      <button onClick={() => toggleField(t, "is_hot")}
                        className={`text-xl transition-all hover:scale-110 ${t.is_hot ? "opacity-100" : "opacity-20 hover:opacity-60"}`}
                        title={t.is_hot ? "Đang HOT — click để tắt" : "Click để đánh dấu HOT"}>
                        🔥
                      </button>
                    </td>
                    {/* Active toggle */}
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleField(t, "active")}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          t.active ? "bg-emerald-500" : "bg-gray-300"
                        }`}>
                        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
                          t.active ? "translate-x-4" : "translate-x-0.5"
                        }`} />
                      </button>
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(t)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Chỉnh sửa">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <a href={t.url} target="_blank" rel="noopener noreferrer"
                          className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Mở link">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                        <button onClick={() => handleDelete(t)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Slide-over Panel ── */}
      {panelOpen && (
        <div className="fixed inset-0 z-40 flex justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setPanelOpen(false)} />

          {/* Panel */}
          <div ref={panelRef} className="relative w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl flex flex-col">

            {/* Panel header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="font-extrabold text-gray-900 text-base">
                  {editing ? "Chỉnh sửa công cụ" : "Thêm công cụ mới"}
                </h2>
                {editing && <p className="text-xs text-gray-400 mt-0.5">{editing.name}</p>}
              </div>
              <button onClick={() => setPanelOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form body */}
            <div className="flex-1 px-6 py-5 flex flex-col gap-5">

              {/* Icon + Tên */}
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Icon</label>
                  <input type="text" value={form.icon}
                    onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                    className="w-16 text-center text-2xl text-gray-900 border border-gray-200 rounded-lg py-2 focus:outline-none focus:border-blue-400" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Tên công cụ <span className="text-red-400">*</span></label>
                  <input type="text" placeholder="VD: Midjourney" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400" />
                </div>
              </div>

              {/* URL */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Link website <span className="text-red-400">*</span>
                </label>
                <input type="url" placeholder="https://..." value={form.url}
                  onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 font-mono" />
              </div>

              {/* Mô tả */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Mô tả</label>
                <textarea rows={3} placeholder="Mô tả ngắn về công cụ..." value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none" />
              </div>

              {/* Category + Badge */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Danh mục</label>
                  <select value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value as AiTool["category"] }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-400 bg-white">
                    <option value="Hình ảnh">🖼️ Hình ảnh</option>
                    <option value="Video">🎬 Video</option>
                    <option value="Âm thanh">🎵 Âm thanh</option>
                    <option value="Văn phòng">💼 Văn phòng</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Giá</label>
                  <select value={form.badge}
                    onChange={e => setForm(f => ({ ...f, badge: e.target.value as AiTool["badge"] }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-400 bg-white">
                    <option value="Miễn phí">Miễn phí</option>
                    <option value="Freemium">Freemium</option>
                    <option value="Trả phí">Trả phí</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Tags</label>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {form.tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="text-gray-400 hover:text-red-500 leading-none ml-0.5">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" placeholder="Thêm tag..." value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400" />
                  <button onClick={addTag}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-sm font-medium transition-colors">
                    Thêm
                  </button>
                </div>
              </div>

              {/* Sort order */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Thứ tự hiển thị</label>
                <input type="number" min={0} value={form.sort_order}
                  onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))}
                  className="w-28 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-400" />
                <span className="text-xs text-gray-400 ml-2">Số nhỏ hơn hiển thị trước</span>
              </div>

              {/* Toggles */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <button type="button" onClick={() => setForm(f => ({ ...f, is_hot: !f.is_hot }))}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${form.is_hot ? "bg-orange-500" : "bg-gray-300"}`}>
                    <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${form.is_hot ? "translate-x-4" : "translate-x-0.5"}`} />
                  </button>
                  <span className="text-sm text-gray-700 font-medium">🔥 Đánh dấu HOT</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <button type="button" onClick={() => setForm(f => ({ ...f, active: !f.active }))}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${form.active ? "bg-emerald-500" : "bg-gray-300"}`}>
                    <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${form.active ? "translate-x-4" : "translate-x-0.5"}`} />
                  </button>
                  <span className="text-sm text-gray-700 font-medium">Hiển thị công khai</span>
                </label>
              </div>
            </div>

            {/* Panel footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3">
              <button onClick={() => setPanelOpen(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                Hủy
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2">
                {saving && (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                )}
                {editing ? "Lưu thay đổi" : "Thêm công cụ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
