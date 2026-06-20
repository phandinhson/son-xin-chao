"use client";
import { useState, useEffect, useRef } from "react";

/* ════════════════════════════════════════════════════════
   TYPES
════════════════════════════════════════════════════════ */
type Video = {
  id: string;
  title: string;
  youtube_id: string;
  channel: string;
  duration: string;
  views: string;
  sort_order: number;
  active: boolean;
  created_at: string;
};

type Tool = {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  badge: ToolBadge;
  url: string;
  icon: string;
  color: string;
  is_hot: boolean;
  is_new: boolean;
  tags: string[];
  sort_order: number;
  active: boolean;
  created_at: string;
};

type ToolCategory = "Học tập" | "Thiết kế & Ảnh" | "Video & Film" | "Âm thanh" | "Văn phòng" | "Lập trình" | "Marketing";
type ToolBadge    = "Miễn phí" | "Freemium" | "Trả phí";

/* ════════════════════════════════════════════════════════
   CONSTANTS
════════════════════════════════════════════════════════ */
const TOOL_CATS: ToolCategory[] = ["Học tập","Thiết kế & Ảnh","Video & Film","Âm thanh","Văn phòng","Lập trình","Marketing"];
const CAT_ICON: Record<ToolCategory, string> = {
  "Học tập": "🎓", "Thiết kế & Ảnh": "🎨", "Video & Film": "🎬",
  "Âm thanh": "🎵", "Văn phòng": "📊", "Lập trình": "💻", "Marketing": "📣",
};
const CAT_COLOR: Record<ToolCategory, string> = {
  "Học tập":        "bg-sky-100 text-sky-700",
  "Thiết kế & Ảnh": "bg-rose-100 text-rose-700",
  "Video & Film":   "bg-red-100 text-red-700",
  "Âm thanh":       "bg-pink-100 text-pink-700",
  "Văn phòng":      "bg-blue-100 text-blue-700",
  "Lập trình":      "bg-gray-100 text-gray-700",
  "Marketing":      "bg-orange-100 text-orange-700",
};
const BADGE_COLOR: Record<ToolBadge, string> = {
  "Miễn phí": "bg-emerald-100 text-emerald-700",
  "Freemium":  "bg-amber-100 text-amber-700",
  "Trả phí":   "bg-slate-100 text-slate-600",
};

const EMPTY_VIDEO: Omit<Video, "id" | "created_at"> = {
  title: "", youtube_id: "", channel: "Sơn Xin Chào", duration: "", views: "", sort_order: 0, active: true,
};
const EMPTY_TOOL: Omit<Tool, "id" | "created_at"> = {
  name: "", description: "", category: "Học tập", badge: "Freemium",
  url: "", icon: "🤖", color: "#6366f1", is_hot: false, is_new: false, tags: [], sort_order: 0, active: true,
};

/* ════════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════════ */
export default function AdminHocAiPage() {
  const [activeTab, setActiveTab] = useState<"video" | "tools">("video");

  /* ── Toast ── */
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[60] flex items-center gap-2.5 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold transition-all ${
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
              <h1 className="font-extrabold text-gray-900 text-base">🎓 Quản lý trang Học AI</h1>
              <p className="text-xs text-gray-400">Chỉnh sửa video & công cụ AI hiển thị tại /hoc-ai</p>
            </div>
          </div>
          <a href="/hoc-ai" target="_blank"
            className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Xem trang
          </a>
        </div>

        {/* ── Tab navigation ── */}
        <div className="max-w-7xl mx-auto px-6 flex gap-0 border-t border-gray-100">
          {([
            { key: "video",  label: "📹 Video",       desc: "Playlist YouTube" },
            { key: "tools",  label: "🤖 Công cụ AI",  desc: "Khám phá công cụ" },
          ] as const).map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "text-violet-600 border-violet-600"
                  : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
              }`}>
              {tab.label}
              <span className="ml-1.5 text-xs font-normal opacity-60 hidden sm:inline">{tab.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === "video"
          ? <VideoTab showToast={showToast} />
          : <ToolsTab showToast={showToast} />
        }
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   VIDEO TAB
════════════════════════════════════════════════════════ */
function VideoTab({ showToast }: { showToast: (m: string, t?: "success" | "error") => void }) {
  const [videos, setVideos]       = useState<Video[]>([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing]     = useState<Video | null>(null);
  const [form, setForm]           = useState<Omit<Video, "id" | "created_at">>(EMPTY_VIDEO);
  const panelRef                  = useRef<HTMLDivElement>(null);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/hoc-ai-videos");
      const data = res.ok ? await res.json() : [];
      setVideos(Array.isArray(data) ? data : []);
    } catch {
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchVideos(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ ...EMPTY_VIDEO, sort_order: videos.length + 1 });
    setPanelOpen(true);
  };
  const openEdit = (v: Video) => {
    setEditing(v);
    setForm({
      title: v.title ?? "", youtube_id: v.youtube_id ?? "",
      channel: v.channel ?? "Sơn Xin Chào", duration: v.duration ?? "",
      views: v.views ?? "", sort_order: v.sort_order ?? 0, active: v.active ?? true,
    });
    setPanelOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.youtube_id.trim()) {
      showToast("Vui lòng điền tiêu đề và YouTube ID", "error"); return;
    }
    setSaving(true);
    try {
      const url    = editing ? `/api/admin/hoc-ai-videos/${editing.id}` : "/api/admin/hoc-ai-videos";
      const method = editing ? "PUT" : "POST";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      showToast(editing ? "Đã cập nhật video!" : "Đã thêm video mới!");
      setPanelOpen(false);
      fetchVideos();
    } catch { showToast("Có lỗi xảy ra", "error"); }
    finally { setSaving(false); }
  };

  const toggleActive = async (v: Video) => {
    const updated = { ...v, active: !v.active };
    setVideos(prev => prev.map(x => x.id === v.id ? updated : x));
    await fetch(`/api/admin/hoc-ai-videos/${v.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !v.active }),
    });
  };

  const handleDelete = async (v: Video) => {
    if (!confirm(`Xóa video "${v.title}"?`)) return;
    await fetch(`/api/admin/hoc-ai-videos/${v.id}`, { method: "DELETE" });
    showToast(`Đã xóa "${v.title}"`);
    fetchVideos();
  };

  return (
    <>
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">{videos.length} video · {videos.filter(v => v.active).length} đang hiển thị</p>
        <button onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Thêm video
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400 gap-3">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Đang tải...
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-3">📹</div>
            <p className="font-medium">Chưa có video nào</p>
            <button onClick={openNew} className="mt-3 text-sm text-violet-600 hover:underline">+ Thêm video đầu tiên</button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                <th className="text-left px-4 py-3 font-semibold w-16">Thứ tự</th>
                <th className="text-left px-4 py-3 font-semibold">Thumbnail & Tiêu đề</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Kênh</th>
                <th className="text-center px-4 py-3 font-semibold hidden lg:table-cell">Thời lượng</th>
                <th className="text-center px-4 py-3 font-semibold hidden lg:table-cell">Lượt xem</th>
                <th className="text-center px-4 py-3 font-semibold">Hiển thị</th>
                <th className="text-right px-4 py-3 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {videos.map(v => (
                <tr key={v.id} className="group hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-center text-xs text-gray-400 font-mono">{v.sort_order}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* Thumbnail mini */}
                      <div className="w-20 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
                        <img
                          src={`https://img.youtube.com/vi/${v.youtube_id}/mqdefault.jpg`}
                          alt="" className="w-full h-full object-cover"
                          onError={e => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 48'%3E%3Crect fill='%23e5e7eb' width='80' height='48'/%3E%3Ctext x='40' y='28' text-anchor='middle' font-size='18' fill='%23d1d5db'%3E▶%3C/text%3E%3C/svg%3E"; }}
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <div className="w-5 h-5 rounded-full bg-white/90 flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 ml-0.5 text-gray-900" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                          </div>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">{v.title}</div>
                        <a href={`https://youtube.com/watch?v=${v.youtube_id}`} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-violet-500 hover:underline font-mono mt-0.5 block">
                          youtu.be/{v.youtube_id}
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-sm text-gray-600">{v.channel}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-center">
                    <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600">{v.duration || "—"}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-center text-xs text-gray-500">{v.views || "—"}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggleActive(v)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${v.active ? "bg-emerald-500" : "bg-gray-300"}`}>
                      <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${v.active ? "translate-x-4" : "translate-x-0.5"}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(v)}
                        className="p-1.5 text-gray-500 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors" title="Chỉnh sửa">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <a href={`https://youtube.com/watch?v=${v.youtube_id}`} target="_blank" rel="noopener noreferrer"
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Mở YouTube">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                      <button onClick={() => handleDelete(v)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Xóa">
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

      {/* ── Video Slide-over Panel ── */}
      {panelOpen && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setPanelOpen(false)} />
          <div ref={panelRef} className="relative w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="font-extrabold text-gray-900 text-base">
                  {editing ? "Chỉnh sửa video" : "Thêm video mới"}
                </h2>
                {editing && <p className="text-xs text-gray-400 mt-0.5 truncate">{editing.title}</p>}
              </div>
              <button onClick={() => setPanelOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 px-6 py-5 flex flex-col gap-5">

              {/* YouTube ID */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  YouTube Video ID <span className="text-red-400">*</span>
                  <span className="ml-1 text-gray-400 font-normal">(phần sau v= trong URL)</span>
                </label>
                <input type="text" placeholder="VD: JTxsNm9IdYU" value={form.youtube_id}
                  onChange={e => setForm(f => ({ ...f, youtube_id: e.target.value.trim() }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-violet-400 font-mono" />
                {form.youtube_id && (
                  <div className="mt-2 rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
                    <img
                      src={`https://img.youtube.com/vi/${form.youtube_id}/mqdefault.jpg`}
                      alt="Preview" className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                )}
              </div>

              {/* Tiêu đề */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Tiêu đề video <span className="text-red-400">*</span></label>
                <input type="text" placeholder="VD: ChatGPT Full Tutorial từ A đến Z" value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-violet-400" />
              </div>

              {/* Kênh + Thời lượng */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Tên kênh</label>
                  <input type="text" placeholder="Sơn Xin Chào" value={form.channel}
                    onChange={e => setForm(f => ({ ...f, channel: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-violet-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Thời lượng</label>
                  <input type="text" placeholder="VD: 18:42" value={form.duration}
                    onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-violet-400 font-mono" />
                </div>
              </div>

              {/* Lượt xem + Sort */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Lượt xem</label>
                  <input type="text" placeholder="VD: 12K" value={form.views}
                    onChange={e => setForm(f => ({ ...f, views: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-violet-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Thứ tự</label>
                  <input type="number" min={0} value={form.sort_order}
                    onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-violet-400" />
                </div>
              </div>

              {/* Active toggle */}
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <button type="button" onClick={() => setForm(f => ({ ...f, active: !f.active }))}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${form.active ? "bg-emerald-500" : "bg-gray-300"}`}>
                  <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${form.active ? "translate-x-4" : "translate-x-0.5"}`} />
                </button>
                <span className="text-sm text-gray-700 font-medium">Hiển thị công khai</span>
              </label>

              {/* Tip */}
              <div className="p-3 bg-violet-50 rounded-lg border border-violet-100 text-xs text-violet-700">
                <strong>Cách lấy YouTube ID:</strong> Mở video → copy phần sau <code className="bg-violet-100 px-1 rounded">v=</code> trong URL.<br />
                VD: youtube.com/watch?v=<strong>JTxsNm9IdYU</strong> → ID là <strong>JTxsNm9IdYU</strong>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3">
              <button onClick={() => setPanelOpen(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                Hủy
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2">
                {saving && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>}
                {editing ? "Lưu thay đổi" : "Thêm video"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ════════════════════════════════════════════════════════
   TOOLS TAB
════════════════════════════════════════════════════════ */
function ToolsTab({ showToast }: { showToast: (m: string, t?: "success" | "error") => void }) {
  const [tools, setTools]         = useState<Tool[]>([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [filter, setFilter]       = useState<ToolCategory | "Tất cả">("Tất cả");
  const [search, setSearch]       = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing]     = useState<Tool | null>(null);
  const [form, setForm]           = useState<Omit<Tool, "id" | "created_at">>(EMPTY_TOOL);
  const [tagInput, setTagInput]   = useState("");
  const panelRef                  = useRef<HTMLDivElement>(null);

  const fetchTools = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/hoc-ai-tools");
      const data = res.ok ? await res.json() : [];
      setTools(Array.isArray(data) ? data : []);
    } catch {
      setTools([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchTools(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ ...EMPTY_TOOL, sort_order: tools.length + 1 });
    setTagInput("");
    setPanelOpen(true);
  };
  const openEdit = (t: Tool) => {
    setEditing(t);
    setForm({
      name: t.name ?? "", description: t.description ?? "",
      category: (t.category ?? "Học tập") as ToolCategory,
      badge: (t.badge ?? "Freemium") as ToolBadge,
      url: t.url ?? "", icon: t.icon ?? "🤖", color: t.color ?? "#6366f1",
      is_hot: t.is_hot ?? false, is_new: t.is_new ?? false,
      tags: Array.isArray(t.tags) ? [...t.tags] : [],
      sort_order: t.sort_order ?? 0, active: t.active ?? true,
    });
    setTagInput("");
    setPanelOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.url.trim()) {
      showToast("Vui lòng điền tên và URL", "error"); return;
    }
    setSaving(true);
    try {
      const url    = editing ? `/api/admin/hoc-ai-tools/${editing.id}` : "/api/admin/hoc-ai-tools";
      const method = editing ? "PUT" : "POST";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      showToast(editing ? "Đã cập nhật công cụ!" : "Đã thêm công cụ mới!");
      setPanelOpen(false);
      fetchTools();
    } catch { showToast("Có lỗi xảy ra", "error"); }
    finally { setSaving(false); }
  };

  const toggleField = async (t: Tool, field: "active" | "is_hot" | "is_new") => {
    const updated = { ...t, [field]: !t[field] };
    setTools(prev => prev.map(x => x.id === t.id ? updated : x));
    await fetch(`/api/admin/hoc-ai-tools/${t.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: !t[field] }),
    });
  };

  const handleDelete = async (t: Tool) => {
    if (!confirm(`Xóa "${t.name}"? Hành động này không thể hoàn tác.`)) return;
    await fetch(`/api/admin/hoc-ai-tools/${t.id}`, { method: "DELETE" });
    showToast(`Đã xóa "${t.name}"`);
    fetchTools();
  };

  const addTag = () => {
    const v = tagInput.trim();
    if (v && !form.tags.includes(v)) setForm(f => ({ ...f, tags: [...f.tags, v] }));
    setTagInput("");
  };
  const removeTag = (tag: string) => setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));

  const cats: (ToolCategory | "Tất cả")[] = ["Tất cả", ...TOOL_CATS];
  const displayed = tools.filter(t => {
    const matchCat = filter === "Tất cả" || t.category === filter;
    const q = search.toLowerCase();
    const matchQ = !q || t.name.toLowerCase().includes(q) || (t.description ?? "").toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  return (
    <>
      {/* Filter + Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex gap-2 flex-wrap">
          {cats.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                filter === c ? "bg-gray-900 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
              }`}>
              {c !== "Tất cả" && <span className="mr-1">{CAT_ICON[c as ToolCategory]}</span>}
              {c}
              <span className="ml-1.5 text-xs opacity-60">
                ({c === "Tất cả" ? tools.length : tools.filter(t => t.category === c).length})
              </span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 sm:ml-auto">
          <div className="relative sm:w-60">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Tìm công cụ..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-violet-400 text-gray-900" />
          </div>
          <button onClick={openNew}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Thêm công cụ
          </button>
        </div>
      </div>

      {/* Table */}
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
            <button onClick={openNew} className="mt-3 text-sm text-violet-600 hover:underline">+ Thêm công cụ đầu tiên</button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                <th className="text-left px-4 py-3 font-semibold">Công cụ</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Danh mục</th>
                <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">Giá</th>
                <th className="text-center px-4 py-3 font-semibold hidden lg:table-cell">HOT / NEW</th>
                <th className="text-center px-4 py-3 font-semibold">Hiển thị</th>
                <th className="text-right px-4 py-3 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {displayed.map(t => (
                <tr key={t.id} className="group hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                        style={{ background: t.color + "22" }}>
                        {t.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{t.name}</div>
                        <a href={t.url} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-violet-500 hover:underline truncate max-w-[200px] block">
                          {t.url.replace(/https?:\/\//, "").split("/")[0]}
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CAT_COLOR[t.category]}`}>
                      {CAT_ICON[t.category]} {t.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${BADGE_COLOR[t.badge]}`}>
                      {t.badge}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center hidden lg:table-cell">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => toggleField(t, "is_hot")}
                        className={`text-lg transition-all hover:scale-110 ${t.is_hot ? "opacity-100" : "opacity-20 hover:opacity-60"}`}
                        title={t.is_hot ? "HOT — click tắt" : "Click đánh dấu HOT"}>🔥</button>
                      <button onClick={() => toggleField(t, "is_new")}
                        className={`text-xs font-bold px-1.5 py-0.5 rounded border transition-all ${t.is_new ? "bg-emerald-500 text-white border-emerald-500" : "border-gray-300 text-gray-400 hover:border-gray-400"}`}
                        title={t.is_new ? "NEW — click tắt" : "Click đánh dấu NEW"}>NEW</button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggleField(t, "active")}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${t.active ? "bg-emerald-500" : "bg-gray-300"}`}>
                      <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${t.active ? "translate-x-4" : "translate-x-0.5"}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(t)}
                        className="p-1.5 text-gray-500 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors" title="Chỉnh sửa">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <a href={t.url} target="_blank" rel="noopener noreferrer"
                        className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Mở link">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                      <button onClick={() => handleDelete(t)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Xóa">
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

      {/* ── Tools Slide-over Panel ── */}
      {panelOpen && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setPanelOpen(false)} />
          <div ref={panelRef} className="relative w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl flex flex-col">

            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="font-extrabold text-gray-900 text-base">
                  {editing ? "Chỉnh sửa công cụ" : "Thêm công cụ mới"}
                </h2>
                {editing && <p className="text-xs text-gray-400 mt-0.5">{editing.name}</p>}
              </div>
              <button onClick={() => setPanelOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 px-6 py-5 flex flex-col gap-5">

              {/* Icon + Color + Tên */}
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Icon</label>
                  <input type="text" value={form.icon}
                    onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                    className="w-16 text-center text-2xl text-gray-900 border border-gray-200 rounded-lg py-2 focus:outline-none focus:border-violet-400" />
                </div>
                <div className="flex-shrink-0">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Màu</label>
                  <input type="color" value={form.color}
                    onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                    className="w-16 h-10 border border-gray-200 rounded-lg cursor-pointer p-1" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Tên công cụ <span className="text-red-400">*</span></label>
                  <input type="text" placeholder="VD: Midjourney" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-violet-400" />
                </div>
              </div>

              {/* URL */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Link website <span className="text-red-400">*</span>
                </label>
                <input type="url" placeholder="https://..." value={form.url}
                  onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-violet-400 font-mono" />
              </div>

              {/* Mô tả */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Mô tả</label>
                <textarea rows={3} placeholder="Mô tả ngắn về công cụ..." value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-violet-400 resize-none" />
              </div>

              {/* Category + Badge */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Danh mục</label>
                  <select value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value as ToolCategory }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-violet-400 bg-white">
                    {TOOL_CATS.map(c => (
                      <option key={c} value={c}>{CAT_ICON[c]} {c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Giá</label>
                  <select value={form.badge}
                    onChange={e => setForm(f => ({ ...f, badge: e.target.value as ToolBadge }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-violet-400 bg-white">
                    <option value="Miễn phí">✅ Miễn phí</option>
                    <option value="Freemium">⚡ Freemium</option>
                    <option value="Trả phí">💳 Trả phí</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Tags</label>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {form.tags.map(tag => (
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
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-violet-400" />
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
                  className="w-28 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-violet-400" />
                <span className="text-xs text-gray-400 ml-2">Số nhỏ hơn hiển thị trước</span>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-5">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <button type="button" onClick={() => setForm(f => ({ ...f, is_hot: !f.is_hot }))}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${form.is_hot ? "bg-orange-500" : "bg-gray-300"}`}>
                    <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${form.is_hot ? "translate-x-4" : "translate-x-0.5"}`} />
                  </button>
                  <span className="text-sm text-gray-700 font-medium">🔥 Đánh dấu HOT</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <button type="button" onClick={() => setForm(f => ({ ...f, is_new: !f.is_new }))}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${form.is_new ? "bg-emerald-500" : "bg-gray-300"}`}>
                    <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${form.is_new ? "translate-x-4" : "translate-x-0.5"}`} />
                  </button>
                  <span className="text-sm text-gray-700 font-medium">✨ Đánh dấu NEW</span>
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

            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3">
              <button onClick={() => setPanelOpen(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                Hủy
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2">
                {saving && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>}
                {editing ? "Lưu thay đổi" : "Thêm công cụ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
