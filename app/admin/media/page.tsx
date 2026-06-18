"use client";
import { useEffect, useRef, useState, useCallback } from "react";

type ImageFile = {
  name: string;
  url: string;
  size: number;
  sizeLabel: string;
  ext: string;
  uploadedAt: string;
};

type ImageMeta = {
  title?: string;
  alt?: string;
  description?: string;
  tags?: string[];
  focalX?: number;
  focalY?: number;
  updatedAt?: string;
};

type AllMeta = Record<string, ImageMeta>;

const EXT_COLORS: Record<string, string> = {
  jpg:  "bg-orange-500/20 text-orange-400 border-orange-500/30",
  jpeg: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  png:  "bg-blue-500/20 text-blue-400 border-blue-500/30",
  webp: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  gif:  "bg-pink-500/20 text-pink-400 border-pink-500/30",
  svg:  "bg-violet-500/20 text-violet-400 border-violet-500/30",
};

function fmt(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function relTime(iso: string) {
  const d = (Date.now() - new Date(iso).getTime()) / 1000;
  if (d < 60) return "Vừa xong";
  if (d < 3600) return `${Math.floor(d / 60)} phút trước`;
  if (d < 86400) return `${Math.floor(d / 3600)} giờ trước`;
  return `${Math.floor(d / 86400)} ngày trước`;
}

// ── Canvas compression helper ────────────────────────────────────────────────
async function compressViaCanvas(
  imgUrl: string,
  quality: number,        // 0.0–1.0
  format: "image/jpeg" | "image/webp" | "image/png"
): Promise<Blob | null> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(null); return; }
      // White background for JPEG (transparent → black otherwise)
      if (format === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => resolve(blob),
        format,
        quality
      );
    };
    img.onerror = () => resolve(null);
    img.src = imgUrl + "?t=" + Date.now(); // bust cache
  });
}

// ── Main component ────────────────────────────────────────────────────────────
export default function MediaPage() {
  const [images, setImages]   = useState<ImageFile[]>([]);
  const [allMeta, setAllMeta] = useState<AllMeta>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading]   = useState(false);
  const [uploadMsg, setUploadMsg]   = useState<{ type: "ok"|"err"; text: string }|null>(null);
  const [dragOver, setDragOver]     = useState(false);
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("all");
  const [view, setView]       = useState<"grid"|"list">("grid");
  const [copied, setCopied]   = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string|null>(null);
  const [deleting, setDeleting] = useState(false);

  // Modal
  const [selected, setSelected]       = useState<ImageFile|null>(null);
  const [modalTab, setModalTab]       = useState<"preview"|"optimize"|"info">("preview");

  // Optimize tab
  const [optQuality, setOptQuality]   = useState(82);
  const [optFormat, setOptFormat]     = useState<"auto"|"jpeg"|"webp">("auto");
  const [optPreviewing, setOptPreviewing] = useState(false);
  const [optPreviewSize, setOptPreviewSize] = useState<number|null>(null);
  const [optPreviewBlob, setOptPreviewBlob] = useState<Blob|null>(null);
  const [optApplying, setOptApplying] = useState(false);
  const [optResult, setOptResult]     = useState<{saved: number; percent: number}|null>(null);

  // Info / metadata tab
  const [metaForm, setMetaForm] = useState<ImageMeta>({});
  const [metaSaving, setMetaSaving] = useState(false);
  const [metaSaved, setMetaSaved]   = useState(false);
  const [tagsInput, setTagsInput]   = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const focalRef     = useRef<HTMLDivElement>(null);

  // ── Data loading ────────────────────────────────────────────────────────────
  const loadImages = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/media")
      .then(r => r.json())
      .then(d => { setImages(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const loadMeta = useCallback(() => {
    fetch("/api/admin/media/meta")
      .then(r => r.json())
      .then(d => setAllMeta(typeof d === "object" ? d : {}))
      .catch(() => {});
  }, []);

  useEffect(() => { loadImages(); loadMeta(); }, [loadImages, loadMeta]);

  // ── Upload ──────────────────────────────────────────────────────────────────
  const uploadFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files);
    if (!arr.length) return;
    setUploading(true);
    setUploadMsg(null);
    const fd = new FormData();
    arr.forEach(f => fd.append("files", f));
    try {
      const res = await fetch("/api/admin/media", { method: "POST", body: fd });
      const data = await res.json();
      if (data.uploaded?.length) {
        setUploadMsg({ type: "ok", text: `✓ Đã upload ${data.uploaded.length} ảnh!${data.errors?.length ? ` (${data.errors.length} lỗi)` : ""}` });
        loadImages();
      } else {
        setUploadMsg({ type: "err", text: data.error || data.errors?.join(", ") || "Upload thất bại" });
      }
    } catch {
      setUploadMsg({ type: "err", text: "Không thể kết nối server" });
    } finally {
      setUploading(false);
      setTimeout(() => setUploadMsg(null), 4000);
    }
  };

  // ── Delete ──────────────────────────────────────────────────────────────────
  const deleteImage = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: deleteTarget }),
      });
      // also delete meta
      await fetch("/api/admin/media/meta", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: deleteTarget }),
      }).catch(() => {});
      setImages(prev => prev.filter(i => i.name !== deleteTarget));
      setAllMeta(prev => { const n = {...prev}; delete n[deleteTarget]; return n; });
      if (selected?.name === deleteTarget) setSelected(null);
      setDeleteTarget(null);
    } finally { setDeleting(false); }
  };

  // ── Copy URL ─────────────────────────────────────────────────────────────────
  const copyUrl = (url: string) => {
    const full = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(full).then(() => {
      setCopied(url);
      setTimeout(() => setCopied(""), 2000);
    });
  };

  // ── Open modal ───────────────────────────────────────────────────────────────
  const openModal = (img: ImageFile) => {
    setSelected(img);
    setModalTab("preview");
    resetOptimize();
    const m = allMeta[img.name] ?? {};
    setMetaForm(m);
    setTagsInput((m.tags ?? []).join(", "));
    setMetaSaved(false);
  };

  // ── Optimize tab helpers ────────────────────────────────────────────────────
  const resetOptimize = () => {
    setOptPreviewing(false);
    setOptPreviewSize(null);
    setOptPreviewBlob(null);
    setOptApplying(false);
    setOptResult(null);
  };

  const resolveFormat = (img: ImageFile): "image/jpeg"|"image/webp"|"image/png" => {
    if (optFormat === "webp") return "image/webp";
    if (optFormat === "jpeg") return "image/jpeg";
    // auto: keep original or use webp for png
    if (img.ext === "webp") return "image/webp";
    return "image/jpeg";
  };

  const previewOptimize = async () => {
    if (!selected) return;
    setOptPreviewing(true);
    setOptPreviewBlob(null);
    setOptPreviewSize(null);
    const fmt = resolveFormat(selected);
    const blob = await compressViaCanvas(selected.url, optQuality / 100, fmt);
    if (blob) {
      setOptPreviewSize(blob.size);
      setOptPreviewBlob(blob);
    }
    setOptPreviewing(false);
  };

  const applyOptimize = async () => {
    if (!selected || !optPreviewBlob) return;
    setOptApplying(true);
    try {
      const fmt = resolveFormat(selected);
      const ext = fmt === "image/webp" ? ".webp" : ".jpg";
      const fd = new FormData();
      fd.append("file", optPreviewBlob, selected.name);
      fd.append("originalName", selected.name);
      const res = await fetch("/api/admin/media/optimize", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setOptResult({ saved: data.saved, percent: data.savedPercent });
        loadImages();
      } else if (data.skipped) {
        setOptResult({ saved: 0, percent: 0 });
      }
      void ext;
    } finally {
      setOptApplying(false);
    }
  };

  // ── Metadata save ────────────────────────────────────────────────────────────
  const saveMeta = async () => {
    if (!selected) return;
    setMetaSaving(true);
    const tags = tagsInput.split(",").map(t => t.trim()).filter(Boolean);
    const payload = { filename: selected.name, ...metaForm, tags };
    try {
      const res = await fetch("/api/admin/media/meta", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const saved = await res.json();
      setAllMeta(prev => ({ ...prev, [selected.name]: saved }));
      setMetaSaved(true);
      setTimeout(() => setMetaSaved(false), 2500);
    } finally { setMetaSaving(false); }
  };

  // ── Focal point pick ─────────────────────────────────────────────────────────
  const handleFocalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setMetaForm(prev => ({ ...prev, focalX: x, focalY: y }));
  };

  // ── Filtered list ─────────────────────────────────────────────────────────────
  const exts = ["all", ...Array.from(new Set(images.map(i => i.ext))).sort()];
  const filtered = images.filter(img => {
    const matchSearch = img.name.toLowerCase().includes(search.toLowerCase()) ||
      (allMeta[img.name]?.title ?? "").toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || img.ext === filter;
    return matchSearch && matchFilter;
  });
  const totalSize = images.reduce((s, i) => s + i.size, 0);

  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="p-8 min-h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">🖼️ Thư viện ảnh</h1>
          <p className="text-gray-500 text-sm mt-1">
            {images.length} ảnh · {fmt(totalSize)} · <code className="text-gray-400 bg-gray-800 px-1.5 py-0.5 rounded text-xs">/public/images/</code>
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all"
        >
          {uploading ? <><span className="animate-spin">⏳</span> Đang upload...</> : <><span>⬆️</span> Upload ảnh</>}
        </button>
        <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden"
          onChange={e => e.target.files && uploadFiles(e.target.files)} />
      </div>

      {uploadMsg && (
        <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium ${uploadMsg.type === "ok" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-red-500/15 text-red-400 border border-red-500/30"}`}>
          {uploadMsg.text}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); uploadFiles(e.dataTransfer.files); }}
        onClick={() => fileInputRef.current?.click()}
        className={`mb-6 border-2 border-dashed rounded-2xl py-7 px-6 text-center cursor-pointer transition-all ${dragOver ? "border-blue-500 bg-blue-500/10 scale-[1.01]" : "border-white/10 hover:border-white/20 hover:bg-white/5"}`}
      >
        <div className="text-3xl mb-1">{dragOver ? "📂" : "🖼️"}</div>
        <p className="text-gray-400 text-sm">{dragOver ? "Thả ảnh vào đây..." : "Kéo & thả ảnh vào đây, hoặc click để chọn file"}</p>
        <p className="text-gray-600 text-xs mt-1">JPG · PNG · WebP · GIF · SVG · Tối đa 5MB/file</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <input type="text" placeholder="🔍 Tìm theo tên file hoặc tiêu đề..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] bg-gray-800 border border-white/10 text-white placeholder-gray-500 text-sm px-4 py-2 rounded-xl focus:outline-none focus:border-blue-500" />
        <div className="flex gap-1 flex-wrap">
          {exts.map(ext => (
            <button key={ext} onClick={() => setFilter(ext)}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-all ${filter === ext ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"}`}>
              {ext === "all" ? "Tất cả" : ext.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
          <button onClick={() => setView("grid")} className={`px-3 py-1.5 text-sm rounded-md transition-all ${view === "grid" ? "bg-gray-600 text-white" : "text-gray-400 hover:text-white"}`}>⊞</button>
          <button onClick={() => setView("list")} className={`px-3 py-1.5 text-sm rounded-md transition-all ${view === "list" ? "bg-gray-600 text-white" : "text-gray-400 hover:text-white"}`}>☰</button>
        </div>
      </div>

      {/* Grid / List */}
      {loading ? (
        <div className="text-center py-20 text-gray-500">Đang tải...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-600">
          {images.length === 0 ? <><div className="text-5xl mb-3">📭</div><p className="text-gray-500">Chưa có ảnh nào. Upload ảnh đầu tiên!</p></> : <><div className="text-4xl mb-3">🔍</div><p className="text-gray-500">Không tìm thấy ảnh phù hợp.</p></>}
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map(img => {
            const m = allMeta[img.name];
            return (
              <div key={img.name} onClick={() => openModal(img)}
                className="group relative bg-gray-800 rounded-2xl overflow-hidden border border-white/5 hover:border-blue-500/50 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-black/40">
                <div className="w-full aspect-square bg-gray-700/30 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={m?.alt || img.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                </div>
                <div className="p-2">
                  <p className="text-white text-xs font-medium truncate">{m?.title || img.name}</p>
                  <p className="text-gray-500 text-xs">{img.sizeLabel}</p>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                  <button onClick={e => { e.stopPropagation(); copyUrl(img.url); }}
                    className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors">
                    {copied === img.url ? "✓ Đã copy!" : "📋 Copy URL"}
                  </button>
                  <button onClick={e => { e.stopPropagation(); openModal(img); setModalTab("optimize"); }}
                    className="w-full py-1.5 bg-emerald-600/80 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors">
                    ⚡ Tối ưu
                  </button>
                  <button onClick={e => { e.stopPropagation(); setDeleteTarget(img.name); }}
                    className="w-full py-1.5 bg-red-600/80 hover:bg-red-500 text-white text-xs font-semibold rounded-lg transition-colors">
                    🗑️ Xóa
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-gray-900 rounded-2xl border border-white/5 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-gray-500 text-xs uppercase">
                <th className="text-left px-5 py-3 font-medium">Ảnh</th>
                <th className="text-left px-5 py-3 font-medium">Tên / Tiêu đề</th>
                <th className="text-left px-5 py-3 font-medium">Loại</th>
                <th className="text-left px-5 py-3 font-medium">Dung lượng</th>
                <th className="text-left px-5 py-3 font-medium">Upload</th>
                <th className="text-right px-5 py-3 font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((img, i) => {
                const m = allMeta[img.name];
                return (
                  <tr key={img.name} className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i % 2 === 0 ? "" : "bg-white/[0.02]"}`}>
                    <td className="px-5 py-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.url} alt={m?.alt || img.name} className="w-12 h-12 object-cover rounded-lg bg-gray-700" />
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-white font-medium">{m?.title || img.name}</span>
                      {m?.title && <p className="text-gray-500 text-xs">{img.name}</p>}
                      {m?.tags?.length ? <p className="text-blue-400 text-xs mt-0.5">{m.tags.map(t => `#${t}`).join(" ")}</p> : null}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full border uppercase ${EXT_COLORS[img.ext] || "bg-gray-700 text-gray-300 border-gray-600"}`}>{img.ext}</span>
                    </td>
                    <td className="px-5 py-3 text-gray-400">{img.sizeLabel}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{relTime(img.uploadedAt)}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => copyUrl(img.url)} className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white text-xs rounded-lg transition-colors">
                          {copied === img.url ? "✓ Copied!" : "📋 URL"}
                        </button>
                        <button onClick={() => { openModal(img); setModalTab("optimize"); }}
                          className="px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-xs rounded-lg transition-colors">⚡</button>
                        <button onClick={() => openModal(img)} className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-lg transition-colors">✏️</button>
                        <button onClick={() => setDeleteTarget(img.name)} className="px-3 py-1.5 bg-red-500/15 hover:bg-red-500/30 text-red-400 text-xs rounded-lg transition-colors">🗑️</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Detail Modal ─────────────────────────────────────────────────────── */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-gray-900 rounded-2xl border border-white/10 shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>

            {/* Modal header + tabs */}
            <div className="flex items-center justify-between px-5 pt-5 pb-0">
              <h3 className="text-white font-bold text-base truncate max-w-[60%]">{allMeta[selected.name]?.title || selected.name}</h3>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white text-xl leading-none p-1 flex-shrink-0">✕</button>
            </div>
            {/* Tabs */}
            <div className="flex gap-1 px-5 pt-3 pb-0 border-b border-white/5">
              {(["preview", "optimize", "info"] as const).map(t => (
                <button key={t} onClick={() => { setModalTab(t); if (t === "optimize") resetOptimize(); }}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors -mb-px ${modalTab === t ? "border-blue-500 text-blue-400" : "border-transparent text-gray-500 hover:text-white"}`}>
                  {t === "preview" ? "👁 Xem" : t === "optimize" ? "⚡ Tối ưu" : "✏️ Thông tin"}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto">

              {/* TAB: PREVIEW */}
              {modalTab === "preview" && (
                <div className="p-5">
                  <div className="bg-gray-800/50 rounded-xl flex items-center justify-center min-h-[260px] mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={selected.url} alt={allMeta[selected.name]?.alt || selected.name}
                      className="max-h-[360px] max-w-full object-contain rounded-lg" />
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{selected.sizeLabel} · .{selected.ext.toUpperCase()} · {relTime(selected.uploadedAt)}</p>
                  {/* URL copy */}
                  <div className="bg-gray-800 rounded-xl px-4 py-3 flex items-center gap-3 mb-3">
                    <code className="text-blue-400 text-xs flex-1 truncate">{`${typeof window !== "undefined" ? window.location.origin : ""}${selected.url}`}</code>
                    <button onClick={() => copyUrl(selected.url)}
                      className="flex-shrink-0 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors">
                      {copied === selected.url ? "✓ Đã copy!" : "📋 Copy"}
                    </button>
                  </div>
                  {/* Snippet hints */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-800/60 rounded-xl p-3">
                      <p className="text-gray-500 text-xs mb-1 font-medium">Markdown</p>
                      <code className="text-green-400 text-xs break-all">{`![${allMeta[selected.name]?.alt || selected.name}](${selected.url})`}</code>
                    </div>
                    <div className="bg-gray-800/60 rounded-xl p-3">
                      <p className="text-gray-500 text-xs mb-1 font-medium">HTML img</p>
                      <code className="text-yellow-400 text-xs break-all">{`<img src="${selected.url}" alt="${allMeta[selected.name]?.alt || ""}" />`}</code>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <a href={selected.url} target="_blank" rel="noopener noreferrer"
                      className="flex-1 text-center py-2.5 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-xl transition-colors">🔗 Mở tab mới</a>
                    <button onClick={() => setDeleteTarget(selected.name)}
                      className="px-5 py-2.5 bg-red-500/15 hover:bg-red-500/25 text-red-400 text-sm font-medium rounded-xl transition-colors">🗑️ Xóa</button>
                  </div>
                </div>
              )}

              {/* TAB: OPTIMIZE */}
              {modalTab === "optimize" && (
                <div className="p-5 space-y-5">
                  {selected.ext === "svg" ? (
                    <div className="text-center py-10 text-gray-500">
                      <div className="text-4xl mb-2">🎨</div>
                      <p>SVG là vector — không cần nén dung lượng.</p>
                    </div>
                  ) : (
                    <>
                      {/* Preview */}
                      <div className="bg-gray-800/40 rounded-xl p-3 flex items-center justify-center min-h-[180px]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={selected.url} alt={selected.name} className="max-h-[180px] max-w-full object-contain rounded-lg" />
                      </div>

                      {/* Size info */}
                      <div className="grid grid-cols-3 gap-3 text-center text-sm">
                        <div className="bg-gray-800 rounded-xl p-3">
                          <div className="text-gray-400 text-xs mb-1">Dung lượng hiện tại</div>
                          <div className="text-white font-bold">{selected.sizeLabel}</div>
                        </div>
                        <div className={`rounded-xl p-3 ${optPreviewSize !== null ? "bg-emerald-500/15 border border-emerald-500/30" : "bg-gray-800"}`}>
                          <div className="text-gray-400 text-xs mb-1">Sau khi nén</div>
                          <div className={`font-bold ${optPreviewSize !== null ? "text-emerald-400" : "text-gray-600"}`}>
                            {optPreviewSize !== null ? fmt(optPreviewSize) : "—"}
                          </div>
                        </div>
                        <div className={`rounded-xl p-3 ${optPreviewSize !== null ? "bg-yellow-500/15 border border-yellow-500/30" : "bg-gray-800"}`}>
                          <div className="text-gray-400 text-xs mb-1">Tiết kiệm</div>
                          <div className={`font-bold ${optPreviewSize !== null ? "text-yellow-400" : "text-gray-600"}`}>
                            {optPreviewSize !== null ? `${Math.round((1 - optPreviewSize / selected.size) * 100)}%` : "—"}
                          </div>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-gray-300 text-sm font-medium">Chất lượng ảnh</label>
                            <span className="text-blue-400 font-bold text-sm">{optQuality}%</span>
                          </div>
                          <input type="range" min={50} max={95} value={optQuality}
                            onChange={e => { setOptQuality(+e.target.value); setOptPreviewSize(null); setOptPreviewBlob(null); setOptResult(null); }}
                            className="w-full accent-blue-500" />
                          <div className="flex justify-between text-xs text-gray-600 mt-1">
                            <span>50% (nhỏ nhất)</span>
                            <span className="text-gray-500">Khuyến nghị: 75–85%</span>
                            <span>95% (nét nhất)</span>
                          </div>
                        </div>

                        <div>
                          <label className="text-gray-300 text-sm font-medium block mb-2">Định dạng xuất</label>
                          <div className="flex gap-2">
                            {(["auto", "jpeg", "webp"] as const).map(f => (
                              <button key={f} onClick={() => { setOptFormat(f); setOptPreviewSize(null); setOptPreviewBlob(null); setOptResult(null); }}
                                className={`flex-1 py-2 text-sm font-medium rounded-xl border transition-all ${optFormat === f ? "bg-blue-600 border-blue-500 text-white" : "bg-gray-800 border-white/10 text-gray-400 hover:text-white"}`}>
                                {f === "auto" ? "Auto" : f === "jpeg" ? "JPEG" : "WebP"}
                              </button>
                            ))}
                          </div>
                          <p className="text-gray-600 text-xs mt-1">WebP nhỏ hơn ~30% so với JPEG cùng chất lượng</p>
                        </div>
                      </div>

                      {/* Result banner */}
                      {optResult && (
                        <div className={`rounded-xl px-4 py-3 text-sm font-medium ${optResult.percent > 0 ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-gray-700 text-gray-400"}`}>
                          {optResult.percent > 0
                            ? `✓ Đã tiết kiệm ${fmt(optResult.saved)} (${optResult.percent}%) — ảnh đã được cập nhật!`
                            : "ℹ️ File nén không nhỏ hơn bản gốc, giữ nguyên."}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex gap-3">
                        <button onClick={previewOptimize} disabled={optPreviewing}
                          className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors">
                          {optPreviewing ? "⏳ Đang tính..." : "🔍 Xem trước kết quả"}
                        </button>
                        <button onClick={applyOptimize} disabled={!optPreviewBlob || optApplying || !!optResult}
                          className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-colors">
                          {optApplying ? "⏳ Đang lưu..." : "⚡ Áp dụng nén"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* TAB: INFO / METADATA */}
              {modalTab === "info" && (
                <div className="p-5 space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1.5">Tiêu đề ảnh <span className="text-gray-500 font-normal">(title)</span></label>
                    <input type="text" value={metaForm.title ?? ""} onChange={e => setMetaForm(p => ({ ...p, title: e.target.value }))}
                      placeholder="Ví dụ: Dịch vụ SEO TP.HCM — Lên top Google"
                      className="w-full bg-gray-800 border border-white/10 text-white text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500" />
                  </div>

                  {/* Alt text */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1.5">
                      Alt text <span className="text-gray-500 font-normal">(mô tả cho Google & người khiếm thị)</span>
                    </label>
                    <input type="text" value={metaForm.alt ?? ""} onChange={e => setMetaForm(p => ({ ...p, alt: e.target.value }))}
                      placeholder="Ví dụ: Infographic SEO từ khóa cho website"
                      className="w-full bg-gray-800 border border-white/10 text-white text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500" />
                    <p className="text-gray-600 text-xs mt-1">Quan trọng cho SEO hình ảnh — nên chứa từ khóa tự nhiên.</p>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1.5">Mô tả chi tiết</label>
                    <textarea rows={3} value={metaForm.description ?? ""} onChange={e => setMetaForm(p => ({ ...p, description: e.target.value }))}
                      placeholder="Mô tả nội dung hoặc ngữ cảnh sử dụng ảnh..."
                      className="w-full bg-gray-800 border border-white/10 text-white text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 resize-none" />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1.5">Thẻ / Tags</label>
                    <input type="text" value={tagsInput} onChange={e => setTagsInput(e.target.value)}
                      placeholder="seo, hcm, marketing (phân cách bằng dấu phẩy)"
                      className="w-full bg-gray-800 border border-white/10 text-white text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500" />
                    {tagsInput.trim() && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {tagsInput.split(",").map(t => t.trim()).filter(Boolean).map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs">#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Focal point */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1.5">
                      Điểm lấy nét (Focal Point)
                      <span className="text-gray-500 font-normal ml-2">
                        {metaForm.focalX !== undefined ? `X: ${metaForm.focalX}% · Y: ${metaForm.focalY}%` : "chưa đặt"}
                      </span>
                    </label>
                    <p className="text-gray-600 text-xs mb-2">Click vào ảnh để chọn điểm trung tâm quan trọng — dùng cho crop responsive.</p>
                    <div ref={focalRef} onClick={handleFocalClick}
                      className="relative rounded-xl overflow-hidden cursor-crosshair bg-gray-800 border border-white/10 select-none"
                      style={{ maxHeight: 220 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={selected.url} alt={selected.name} className="w-full object-contain max-h-[220px]" draggable={false} />
                      {/* Focal crosshair */}
                      {metaForm.focalX !== undefined && metaForm.focalY !== undefined && (
                        <div className="absolute pointer-events-none" style={{ left: `${metaForm.focalX}%`, top: `${metaForm.focalY}%`, transform: "translate(-50%,-50%)" }}>
                          <div className="w-5 h-5 rounded-full border-2 border-yellow-400 bg-yellow-400/30 shadow-lg">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-1 h-1 rounded-full bg-yellow-400" />
                            </div>
                          </div>
                          {/* crosshair lines */}
                          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-3 bg-yellow-400 -translate-y-full opacity-70" />
                          <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-px h-3 bg-yellow-400 translate-y-full opacity-70" />
                          <div className="absolute top-1/2 left-0 -translate-y-1/2 h-px w-3 bg-yellow-400 -translate-x-full opacity-70" />
                          <div className="absolute top-1/2 right-0 -translate-y-1/2 h-px w-3 bg-yellow-400 translate-x-full opacity-70" />
                        </div>
                      )}
                    </div>
                    {metaForm.focalX !== undefined && (
                      <div className="mt-2 flex gap-3">
                        <div className="flex-1 bg-gray-800 rounded-lg px-3 py-2 text-xs">
                          <span className="text-gray-500">CSS: </span>
                          <code className="text-blue-400">{`object-position: ${metaForm.focalX}% ${metaForm.focalY}%`}</code>
                        </div>
                        <button onClick={() => setMetaForm(p => ({ ...p, focalX: undefined, focalY: undefined }))}
                          className="px-3 py-1.5 text-xs text-gray-500 hover:text-red-400 transition-colors">Xóa điểm</button>
                      </div>
                    )}
                  </div>

                  {/* Save button */}
                  <button onClick={saveMeta} disabled={metaSaving}
                    className={`w-full py-3 text-sm font-bold rounded-xl transition-all ${metaSaved ? "bg-emerald-600 text-white" : "bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white"}`}>
                    {metaSaving ? "⏳ Đang lưu..." : metaSaved ? "✓ Đã lưu thành công!" : "💾 Lưu thông tin"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl border border-white/10 shadow-2xl max-w-sm w-full p-6 text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="text-white font-bold text-lg mb-1">Xóa ảnh này?</h3>
            <p className="text-gray-400 text-sm mb-5 break-all">
              <span className="text-gray-300 font-medium">{deleteTarget}</span>
              <br /><span className="text-xs text-red-400 mt-1 block">Hành động không thể hoàn tác!</span>
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} disabled={deleting}
                className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-xl">Hủy</button>
              <button onClick={deleteImage} disabled={deleting}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl">
                {deleting ? "Đang xóa..." : "Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
