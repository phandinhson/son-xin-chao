"use client";
import { useRef, useState, useEffect, useCallback } from "react";

type LibImg = { name: string; url: string; sizeLabel: string };

/**
 * Xóa tiền tố origin bị ghép lỗi khi browser resolve URL trong contenteditable.
 * VD: "https://www.sonxinchao.comhttps://kpgtiqepktofdfyxgsbw.supabase.co/..."
 *   → "https://kpgtiqepktofdfyxgsbw.supabase.co/..."
 */
function sanitizeImgSrc(raw: string): string {
  if (!raw) return raw;
  // Nếu chuỗi chứa 2 URL liên tiếp (http xuất hiện lần 2 sau vị trí 4),
  // giữ lại URL thứ hai (URL thực sự được paste vào).
  const second = raw.indexOf("http", 4);
  if (second > 0) return raw.slice(second);
  return raw;
}

// ── Image Modal — upload lưu vào /public/images/, chọn từ thư viện ──────────
function ImageModal({ onInsert, onClose }: {
  onInsert: (src: string, alt: string) => void;
  onClose: () => void;
}) {
  const [tab, setTab]         = useState<"upload" | "library" | "url">("upload");
  const [url, setUrl]         = useState("");
  const [alt, setAlt]         = useState("");
  const [preview, setPreview] = useState("");
  const [uploading, setUploading]   = useState(false);
  const [uploadErr, setUploadErr]   = useState("");
  const [libImages, setLibImages]   = useState<LibImg[]>([]);
  const [libLoading, setLibLoading] = useState(false);
  const [libSearch, setLibSearch]   = useState("");
  const [picked, setPicked]         = useState<LibImg | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Load thư viện khi chuyển tab
  useEffect(() => {
    if (tab !== "library") return;
    setLibLoading(true);
    fetch("/api/admin/media")
      .then(r => r.json())
      .then(d => { setLibImages(Array.isArray(d) ? d : []); setLibLoading(false); })
      .catch(() => setLibLoading(false));
  }, [tab]);

  // Upload lên /public/images/ qua media API
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadErr("");
    setUrl(""); setPreview("");
    const fd = new FormData();
    fd.append("files", file);
    try {
      const res  = await fetch("/api/admin/media", { method: "POST", body: fd });
      const data = await res.json();
      if (data.uploaded?.length && data.urls?.length) {
        const imgUrl = data.urls[0];
        setUrl(imgUrl);
        setPreview(imgUrl);
        // Auto-fill alt từ tên file nếu chưa nhập
        setAlt(prev => prev || data.uploaded[0].replace(/[-_]/g, " ").replace(/\.[^.]+$/, ""));
      } else {
        setUploadErr(data.errors?.[0] || data.error || "Upload thất bại");
      }
    } catch { setUploadErr("Không thể kết nối server"); }
    finally { setUploading(false); }
  };

  const handleInsert = () => {
    const finalUrl = tab === "library" ? (picked?.url ?? "") : url;
    const finalAlt = alt || (tab === "library" ? (picked?.name ?? "") : "");
    if (!finalUrl) return;
    onInsert(finalUrl, finalAlt);
    onClose();
  };

  const canInsert = tab === "library" ? !!picked : !!url;
  const filteredLib = libImages.filter(i =>
    i.name.toLowerCase().includes(libSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
      <div className="bg-white border border-gray-200 rounded-xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-gray-900 font-semibold">🖼️ Chèn ảnh vào bài viết</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none transition-colors">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 flex-shrink-0">
          {(["upload", "library", "url"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-sm font-medium transition-all ${
                tab === t
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}>
              {t === "upload" ? "📁 Tải lên" : t === "library" ? "🖼️ Thư viện" : "🔗 Nhập URL"}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* ── Tab: Upload ── */}
          {tab === "upload" && (
            <>
              <div
                onClick={() => !uploading && fileRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all group ${
                  uploading
                    ? "border-blue-300 bg-blue-50 opacity-70 cursor-wait"
                    : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                }`}>
                <div className="text-4xl mb-2">{uploading ? "⏳" : "📁"}</div>
                <p className="text-gray-600 text-sm font-medium">
                  {uploading ? "Đang lưu vào thư viện ảnh..." : "Nhấp hoặc kéo & thả ảnh vào đây"}
                </p>
                <p className="text-gray-400 text-xs mt-1">JPG · PNG · WebP · GIF · Tự động lưu vào /public/images/</p>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
              </div>
              {uploadErr && <p className="text-red-500 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">{uploadErr}</p>}
              {url && !uploadErr && tab === "upload" && preview && (
                <div className="flex items-center gap-2.5 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
                  <span className="text-green-600 text-lg">✓</span>
                  <div>
                    <p className="text-green-700 text-sm font-medium">Đã lưu vào thư viện ảnh!</p>
                    <code className="text-green-600 text-xs">{url}</code>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── Tab: Thư viện ── */}
          {tab === "library" && (
            <>
              <input
                type="text"
                placeholder="🔍 Tìm ảnh theo tên..."
                value={libSearch}
                onChange={e => setLibSearch(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
              />
              {libLoading ? (
                <div className="text-center py-8 text-gray-400 text-sm">Đang tải thư viện...</div>
              ) : filteredLib.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-3xl mb-2">📭</div>
                  <p className="text-sm">{libImages.length === 0 ? "Thư viện trống — upload ảnh trước." : "Không tìm thấy ảnh phù hợp."}</p>
                  {libImages.length === 0 && (
                    <button onClick={() => setTab("upload")} className="mt-2 text-blue-600 text-sm hover:underline">Upload ngay →</button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2.5">
                  {filteredLib.map(img => (
                    <button key={img.name} type="button"
                      onClick={() => { setPicked(img); setAlt(prev => prev || img.name.replace(/[-_]/g, " ").replace(/\.[^.]+$/, "")); }}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all text-left ${
                        picked?.name === img.name
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "border-transparent hover:border-blue-300"
                      }`}>
                      <div className="aspect-square bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.url} alt={img.name} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <p className="text-xs text-gray-500 truncate px-1.5 py-1 bg-white">{img.name}</p>
                      {picked?.name === img.name && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shadow">
                          <span className="text-white text-xs leading-none">✓</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── Tab: URL ── */}
          {tab === "url" && (
            <div>
              <label className="text-gray-600 text-sm mb-1.5 block font-medium">URL ảnh</label>
              <input type="url" value={url}
                onChange={e => { const v = sanitizeImgSrc(e.target.value); setUrl(v); setPreview(v); }}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          )}

          {/* Alt text — luôn hiện */}
          <div>
            <label className="text-gray-600 text-sm mb-1.5 block font-medium">
              Alt text <span className="text-gray-400 font-normal">(mô tả ảnh — quan trọng cho SEO)</span>
            </label>
            <input type="text" value={alt} onChange={e => setAlt(e.target.value)}
              placeholder="Mô tả nội dung ảnh..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Preview */}
          {(preview || picked) && (
            <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              <p className="text-xs text-gray-500 px-3 py-1.5 border-b border-gray-200 font-medium">Xem trước</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={picked ? picked.url : preview} alt={alt || "preview"}
                className="w-full max-h-52 object-contain" onError={() => setPreview("")} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 py-4 border-t border-gray-200 flex-shrink-0">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-all">
            Huỷ
          </button>
          <button onClick={handleInsert} disabled={!canInsert}
            className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-sm font-semibold transition-all">
            ✓ Chèn ảnh
          </button>
        </div>
      </div>
    </div>
  );
}

type Props = {
  value: string;
  onChange: (val: string) => void;
};

// ── SVG icon helpers ─────────────────────────────────────────────────────
const Ico = ({ d, vb = "0 0 24 24" }: { d: string; vb?: string }) => (
  <svg width="15" height="15" viewBox={vb} fill="currentColor" aria-hidden="true"><path d={d} /></svg>
);

// ── Grouped toolbar config ───────────────────────────────────────────────
type ToolItem = { tag: string; title: string; icon: React.ReactNode };
const TOOL_GROUPS: ToolItem[][] = [
  // ── Định dạng chữ
  [
    {
      tag: "strong", title: "In đậm (Ctrl+B)",
      icon: <Ico d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3V6.5zm3.5 9H10V13h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" />,
    },
    {
      tag: "em", title: "In nghiêng (Ctrl+I)",
      icon: <Ico d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4h-8z" />,
    },
    {
      tag: "ins", title: "Gạch chân",
      icon: <Ico d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z" />,
    },
    {
      tag: "del", title: "Gạch ngang",
      icon: <Ico d="M6.85 7.08C6.85 4.37 9.45 3 12.24 3c1.64 0 3 .49 3.9 1.28.77.65 1.46 1.73 1.46 3.24h-2.44c0-.43-.15-.99-.49-1.39-.41-.51-1.09-.76-1.9-.76-1.66 0-2.44.79-2.44 1.86 0 .48.25.88.74 1.21.38.25.77.48 1.41.7H7.39c-.21-.36-.54-.89-.54-1.06zM21 12v-2H3v2h9.62c1.15.45 1.96.75 1.96 1.97 0 1-.81 1.67-2.28 1.67-1.54 0-2.93-.68-2.93-2.51H7.01c0 1.24.56 2.15 1.38 2.74.82.6 1.96.99 3.4.99 1.48 0 2.79-.38 3.66-1.1.87-.72 1.17-1.55 1.17-2.55 0-.6-.14-1.12-.38-1.57H21v-.64z" />,
    },
  ],
  // ── Tiêu đề
  [
    {
      tag: "h2", title: "Tiêu đề H2",
      icon: <span className="font-extrabold text-[11px] leading-none tracking-tight">H<sub className="text-[8px]">2</sub></span>,
    },
    {
      tag: "h3", title: "Tiêu đề H3",
      icon: <span className="font-extrabold text-[11px] leading-none tracking-tight">H<sub className="text-[8px]">3</sub></span>,
    },
  ],
  // ── Chèn
  [
    {
      tag: "a", title: "Chèn liên kết (Ctrl+K)",
      icon: <Ico d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />,
    },
    {
      tag: "img", title: "Chèn ảnh",
      icon: <Ico d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />,
    },
  ],
  // ── Khối
  [
    {
      tag: "blockquote", title: "Trích dẫn (Blockquote)",
      icon: <Ico d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />,
    },
    {
      tag: "code", title: "Code inline",
      icon: <Ico d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />,
    },
  ],
  // ── Danh sách
  [
    {
      tag: "ul", title: "Danh sách không số",
      icon: <Ico d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z" />,
    },
    {
      tag: "ol", title: "Danh sách có số",
      icon: <Ico d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z" />,
    },
    {
      tag: "li", title: "Thêm mục (li)",
      icon: <span className="font-mono text-[10px] font-bold leading-none">li</span>,
    },
  ],
  // ── Nâng cao
  [
    {
      tag: "more", title: "Ngắt 'Đọc thêm'",
      icon: <Ico d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />,
    },
    {
      tag: "close", title: "Đóng thẻ HTML cuối cùng",
      icon: <span className="font-mono text-[9px] font-bold leading-none">&lt;/▌&gt;</span>,
    },
  ],
];

// ── Link Popover ────────────────────────────────────────────────────────────
function LinkPopover({
  href, top, left,
  onSave, onOpen, onUnlink, onClose,
}: {
  href: string; top: number; left: number;
  onSave: (url: string) => void;
  onOpen: (url: string) => void;
  onUnlink: () => void;
  onClose: () => void;
}) {
  const [val, setVal] = useState(href);
  const popRef = useRef<HTMLDivElement>(null);

  // Đóng khi click ra ngoài
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node)) onClose();
    };
    // Delay nhỏ để tránh đóng ngay lập tức do click mở
    const t = setTimeout(() => document.addEventListener("mousedown", handler), 50);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", handler); };
  }, [onClose]);

  // Đóng khi nhấn Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Tính toán vị trí: tránh tràn ra ngoài màn hình phải
  const style: React.CSSProperties = {
    position: "fixed",
    top: top + 6,
    zIndex: 9999,
    left: Math.min(left, window.innerWidth - 360),
  };

  return (
    <div ref={popRef} style={style}
      className="bg-white border border-gray-200 rounded-xl shadow-2xl p-3 w-[340px] flex flex-col gap-2.5">
      {/* Triangle arrow */}
      <div className="absolute -top-2 left-4 w-3 h-2 overflow-hidden">
        <div className="w-3 h-3 bg-white border-t border-l border-gray-200 rotate-45 translate-y-1" />
      </div>

      {/* URL input */}
      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-sm flex-shrink-0">🔗</span>
        <input
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") { e.preventDefault(); onSave(val); }
            if (e.key === "Escape") onClose();
          }}
          placeholder="https://..."
          className="flex-1 text-sm text-blue-600 border border-gray-200 rounded-lg px-2.5 py-1.5
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
            placeholder-gray-300 truncate"
        />
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onMouseDown={e => { e.preventDefault(); onOpen(val); }}
          className="flex-1 px-2 py-1.5 text-xs text-blue-600 border border-blue-200 bg-blue-50
            rounded-lg hover:bg-blue-100 transition-all font-medium whitespace-nowrap">
          ↗ Mở link
        </button>
        <button
          onMouseDown={e => { e.preventDefault(); onSave(val); }}
          className="flex-1 px-2 py-1.5 text-xs text-white bg-blue-600
            rounded-lg hover:bg-blue-700 transition-all font-semibold whitespace-nowrap">
          ✓ Cập nhật
        </button>
        <button
          onMouseDown={e => { e.preventDefault(); onUnlink(); }}
          className="flex-1 px-2 py-1.5 text-xs text-red-600 border border-red-200 bg-red-50
            rounded-lg hover:bg-red-100 transition-all font-medium whitespace-nowrap">
          ✕ Xoá link
        </button>
      </div>
    </div>
  );
}

// ── Image Popover ────────────────────────────────────────────────────────────
function ImagePopover({
  src, alt, top, left,
  onSave, onDelete, onClose,
}: {
  src: string; alt: string; top: number; left: number;
  onSave: (src: string, alt: string) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const [valSrc, setValSrc] = useState(() => sanitizeImgSrc(src));
  const [valAlt, setValAlt] = useState(alt);
  const popRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node)) onClose();
    };
    const t = setTimeout(() => document.addEventListener("mousedown", handler), 50);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", handler); };
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const style: React.CSSProperties = {
    position: "fixed",
    top: top + 8,
    zIndex: 9999,
    left: Math.min(Math.max(left - 80, 8), window.innerWidth - 380),
  };

  return (
    <div ref={popRef} style={style}
      className="bg-white border border-gray-200 rounded-xl shadow-2xl p-3.5 w-[360px] flex flex-col gap-3">

      {/* Preview nhỏ + tiêu đề */}
      <div className="flex items-center gap-2.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={valSrc} alt={valAlt}
          className="w-14 h-14 object-cover rounded-lg border border-gray-200 flex-shrink-0 bg-gray-100"
          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-700 mb-0.5">🖼️ Chỉnh sửa ảnh</p>
          <p className="text-[10px] text-gray-400 truncate">{valSrc || "Chưa có URL"}</p>
        </div>
      </div>

      {/* Src input */}
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">URL ảnh</label>
        <input
          value={valSrc}
          onChange={e => setValSrc(sanitizeImgSrc(e.target.value))}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); onSave(valSrc, valAlt); } if (e.key === "Escape") onClose(); }}
          placeholder="https://..."
          className="text-sm text-gray-800 border border-gray-200 rounded-lg px-2.5 py-2
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
            placeholder-gray-300"
        />
      </div>

      {/* Alt input */}
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
          Alt text <span className="normal-case text-gray-400 font-normal">(mô tả ảnh — SEO)</span>
        </label>
        <input
          value={valAlt}
          onChange={e => setValAlt(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); onSave(valSrc, valAlt); } if (e.key === "Escape") onClose(); }}
          placeholder="Mô tả nội dung ảnh..."
          className="text-sm text-gray-800 border border-gray-200 rounded-lg px-2.5 py-2
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
            placeholder-gray-300"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-0.5">
        <button
          onMouseDown={e => { e.preventDefault(); onSave(valSrc, valAlt); }}
          className="flex-1 px-3 py-2 text-xs text-white bg-blue-600
            rounded-lg hover:bg-blue-700 transition-all font-semibold">
          ✓ Cập nhật
        </button>
        <button
          onMouseDown={e => { e.preventDefault(); onDelete(); }}
          className="px-3 py-2 text-xs text-red-600 border border-red-200 bg-red-50
            rounded-lg hover:bg-red-100 transition-all font-medium whitespace-nowrap">
          🗑 Xoá ảnh
        </button>
      </div>
    </div>
  );
}

export default function RichEditor({ value, onChange }: Props) {
  const [mode, setMode] = useState<"visual" | "code">("visual");
  const [fullscreen, setFullscreen] = useState(false);
  const [showImgModal, setShowImgModal] = useState(false);
  const [pasteMsg, setPasteMsg] = useState<{ type: "loading" | "ok" | "err"; text: string } | null>(null);
  const [linkPopover, setLinkPopover] = useState<{
    href: string; top: number; left: number; el: HTMLAnchorElement;
  } | null>(null);
  const [imagePopover, setImagePopover] = useState<{
    src: string; alt: string; top: number; left: number; el: HTMLImageElement;
  } | null>(null);
  const editorRef   = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const prevMode    = useRef<"visual" | "code">("visual");
  const savedRange  = useRef<Range | null>(null);
  const hasInitialized = useRef(false);

  // Sync value → editor khi chuyển sang Visual
  useEffect(() => {
    if (mode === "visual" && prevMode.current !== "visual" && editorRef.current) {
      editorRef.current.innerHTML = value;
    }
    prevMode.current = mode;
  }, [mode]);

  // Load giá trị ban đầu khi data async tải về
  useEffect(() => {
    if (editorRef.current && !hasInitialized.current) {
      if (value) {
        editorRef.current.innerHTML = value;
        hasInitialized.current = true;
      }
    }
  }, [value]);

  // ── Textarea helpers ──────────────────────────────────────────────────────
  const wrapTA = (open: string, close: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const s = ta.selectionStart, e = ta.selectionEnd;
    const sel = ta.value.substring(s, e);
    const next = ta.value.substring(0, s) + open + sel + close + ta.value.substring(e);
    onChange(next);
    setTimeout(() => {
      ta.focus();
      ta.selectionStart = s + open.length;
      ta.selectionEnd   = s + open.length + sel.length;
    }, 0);
  };

  // ── Visual helpers ────────────────────────────────────────────────────────
  const exec = (cmd: string, val?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val ?? undefined);
    onChange(editorRef.current?.innerHTML || "");
  };

  const insertHTML = (html: string) => {
    editorRef.current?.focus();
    document.execCommand("insertHTML", false, html);
    onChange(editorRef.current?.innerHTML || "");
  };

  // ── Paste handler: intercept images → upload to Supabase ─────────────────
  const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = Array.from(e.clipboardData.items);
    const imageItems = items.filter(item => item.type.startsWith("image/"));

    // Case 1: Image file pasted from clipboard (screenshot, copy file, etc.)
    if (imageItems.length > 0) {
      e.preventDefault();
      setPasteMsg({ type: "loading", text: `Đang upload ${imageItems.length} ảnh...` });

      for (const item of imageItems) {
        const file = item.getAsFile();
        if (!file) continue;
        const fd = new FormData();
        fd.append("files", file, `paste-${Date.now()}.png`);
        try {
          const res  = await fetch("/api/admin/media", { method: "POST", body: fd });
          const data = await res.json();
          if (data.urls?.length) {
            insertHTML(`<img src="${data.urls[0]}" alt="" style="max-width:100%;border-radius:6px;margin:8px 0">`);
            setPasteMsg({ type: "ok", text: "✓ Ảnh đã lưu vào thư viện" });
          } else {
            setPasteMsg({ type: "err", text: data.errors?.[0] || "Upload thất bại" });
          }
        } catch {
          setPasteMsg({ type: "err", text: "Không kết nối được server" });
        }
      }
      setTimeout(() => setPasteMsg(null), 3000);
      return;
    }

    // Case 2: HTML paste containing base64 images (copy from Word, browser, etc.)
    const html = e.clipboardData.getData("text/html");
    if (html && html.includes("data:image/")) {
      e.preventDefault();
      // Remove base64 imgs, keep text content
      const cleaned = html
        .replace(/<img[^>]*src="data:image\/[^"]*"[^>]*\/?>/gi, "")
        .replace(/<img[^>]*src='data:image\/[^']*'[^>]*\/?>/gi, "");
      document.execCommand("insertHTML", false, cleaned);
      onChange(editorRef.current?.innerHTML || "");
      setPasteMsg({ type: "err", text: "⚠ Ảnh base64 bị xoá — hãy dùng nút img để chèn ảnh từ thư viện" });
      setTimeout(() => setPasteMsg(null), 5000);
      return;
    }

    // Default: allow normal paste
  };

  // ── Toolbar action ────────────────────────────────────────────────────────
  const handleTool = (tag: string) => {
    if (mode === "code") {
      switch (tag) {
        case "strong":     return wrapTA("<strong>", "</strong>");
        case "em":         return wrapTA("<em>", "</em>");
        case "del":        return wrapTA("<del>", "</del>");
        case "ins":        return wrapTA("<ins>", "</ins>");
        case "code":       return wrapTA("<code>", "</code>");
        case "li":         return wrapTA("<li>", "</li>");
        case "ul":         return wrapTA("<ul>\n  <li>", "</li>\n</ul>");
        case "ol":         return wrapTA("<ol>\n  <li>", "</li>\n</ol>");
        case "blockquote": return wrapTA("<blockquote>", "</blockquote>");
        case "h2":         return wrapTA("<h2>", "</h2>");
        case "h3":         return wrapTA("<h3>", "</h3>");
        case "more":       return wrapTA("<!--more-->", "");
        case "a": {
          const url = prompt("Nhập URL liên kết:");
          if (url) wrapTA(`<a href="${url}" target="_blank" rel="noopener">`, "</a>");
          return;
        }
        case "img": {
          setShowImgModal(true);
          return;
        }
        case "close": {
          const ta = textareaRef.current;
          if (!ta) return;
          const text  = ta.value.substring(0, ta.selectionStart);
          const match = text.match(/<([a-z][a-z0-9]*)[^/]*>(?![\s\S]*<\/\1>)/i);
          if (match) wrapTA(`</${match[1]}>`, "");
          return;
        }
      }
    } else {
      switch (tag) {
        case "strong": return exec("bold");
        case "em":     return exec("italic");
        case "del":    return exec("strikeThrough");
        case "ins":    return exec("underline");
        case "ul":     return exec("insertUnorderedList");
        case "ol":     return exec("insertOrderedList");
        case "blockquote": return exec("formatBlock", "blockquote");
        case "h2":     return exec("formatBlock", "h2");
        case "h3":     return exec("formatBlock", "h3");
        case "code": {
          const sel = window.getSelection();
          if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
            const range = sel.getRangeAt(0);
            const code  = document.createElement("code");
            try { range.surroundContents(code); onChange(editorRef.current?.innerHTML || ""); }
            catch { insertHTML(`<code>${sel.toString()}</code>`); }
          } else {
            insertHTML("<code>code</code>");
          }
          return;
        }
        case "li": return insertHTML("<li>Mục danh sách</li>");
        case "more": return insertHTML('<hr style="border:none;border-top:1px dashed #ccc;margin:16px 0;" /><span style="color:#999;font-size:11px">––– đọc thêm –––</span>');
        case "a": {
          const url  = prompt("Nhập URL liên kết:");
          if (url) exec("createLink", url);
          return;
        }
        case "img": {
          const sel = window.getSelection();
          if (sel && sel.rangeCount > 0) savedRange.current = sel.getRangeAt(0).cloneRange();
          setShowImgModal(true);
          return;
        }
        case "close": return;
      }
    }
  };

  // ── Insert image từ modal ─────────────────────────────────────────────────
  const handleInsertImage = (src: string, alt: string) => {
    const imgHtml = `<img src="${src}" alt="${alt}" style="max-width:100%;height:auto;border-radius:8px;margin:16px 0;display:block;border:1px solid #e5e7eb;" />`;
    if (mode === "code") {
      const ta = textareaRef.current;
      if (ta) {
        const s = ta.selectionStart;
        const next = ta.value.substring(0, s) + imgHtml + ta.value.substring(ta.selectionEnd);
        onChange(next);
        setTimeout(() => { ta.focus(); ta.selectionStart = ta.selectionEnd = s + imgHtml.length; }, 0);
      }
    } else {
      editorRef.current?.focus();
      const sel = window.getSelection();
      if (sel && savedRange.current) {
        sel.removeAllRanges();
        sel.addRange(savedRange.current);
      }
      document.execCommand("insertHTML", false, imgHtml);
      onChange(editorRef.current?.innerHTML || "");
    }
  };

  // ── Click vào <a> hoặc <img> trong visual mode ──────────────────────────
  const handleEditorClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;

    // Ảnh — ưu tiên trước (ảnh có thể nằm trong link)
    if (target.tagName === "IMG") {
      const img = target as HTMLImageElement;
      const rect = img.getBoundingClientRect();
      setLinkPopover(null);
      setImagePopover({
        src:  sanitizeImgSrc(img.getAttribute("src") || ""),
        alt:  img.getAttribute("alt") || "",
        top:  rect.bottom,
        left: rect.left + rect.width / 2,
        el:   img,
      });
      return;
    }

    // Link
    const anchor = target.closest("a") as HTMLAnchorElement | null;
    if (anchor) {
      const rect = anchor.getBoundingClientRect();
      setImagePopover(null);
      setLinkPopover({
        href: anchor.getAttribute("href") || "",
        top:  rect.bottom,
        left: rect.left,
        el:   anchor,
      });
      return;
    }

    // Click vào chỗ khác → đóng cả hai
    setLinkPopover(null);
    setImagePopover(null);
  }, []);

  // ── Image popover handlers ────────────────────────────────────────────────
  const handleImageSave = useCallback((src: string, alt: string) => {
    if (!imagePopover) return;
    imagePopover.el.setAttribute("src", src);
    imagePopover.el.setAttribute("alt", alt);
    onChange(editorRef.current?.innerHTML || "");
    setImagePopover(null);
  }, [imagePopover, onChange]);

  const handleImageDelete = useCallback(() => {
    if (!imagePopover) return;
    // Xoá ảnh và figure cha nếu có
    const parent = imagePopover.el.parentElement;
    if (parent?.tagName === "FIGURE") {
      parent.remove();
    } else {
      imagePopover.el.remove();
    }
    onChange(editorRef.current?.innerHTML || "");
    setImagePopover(null);
  }, [imagePopover, onChange]);

  const handleLinkSave = useCallback((url: string) => {
    if (!linkPopover) return;
    linkPopover.el.setAttribute("href", url);
    if (!linkPopover.el.getAttribute("target")) {
      linkPopover.el.setAttribute("target", "_blank");
      linkPopover.el.setAttribute("rel", "noopener");
    }
    onChange(editorRef.current?.innerHTML || "");
    setLinkPopover(null);
  }, [linkPopover, onChange]);

  const handleLinkOpen = useCallback((url: string) => {
    if (url) window.open(url.startsWith("http") ? url : "https://" + url, "_blank", "noopener");
  }, []);

  const handleLinkUnlink = useCallback(() => {
    if (!linkPopover) return;
    const el = linkPopover.el;
    const parent = el.parentNode;
    if (!parent) return;
    // Giữ lại text/children, chỉ xoá thẻ <a>
    const frag = document.createDocumentFragment();
    while (el.firstChild) frag.appendChild(el.firstChild);
    parent.replaceChild(frag, el);
    onChange(editorRef.current?.innerHTML || "");
    setLinkPopover(null);
  }, [linkPopover, onChange]);

  // ── Mode switch ───────────────────────────────────────────────────────────
  const goCode = () => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
    setLinkPopover(null);
    setImagePopover(null);
    setMode("code");
  };
  const goVisual = () => setMode("visual");

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === "b") { e.preventDefault(); exec("bold"); }
      if (e.key === "i") { e.preventDefault(); exec("italic"); }
      if (e.key === "k") { e.preventDefault(); handleTool("a"); }
    }
  };

  const minH = fullscreen ? "calc(100vh - 108px)" : "500px";

  return (
    <>
    <div className={`border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm ${
      fullscreen ? "fixed inset-0 z-50 rounded-none flex flex-col shadow-2xl" : ""
    }`}>

      {/* ── Header: tabs + fullscreen ── */}
      <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200 px-3 py-2 flex-shrink-0">
        <div className="flex rounded-md overflow-hidden border border-gray-200">
          <button onClick={goVisual}
            className={`px-4 py-1.5 text-xs font-semibold transition-all ${
              mode === "visual"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}>
            Trực quan
          </button>
          <button onClick={goCode}
            className={`px-4 py-1.5 text-xs font-semibold border-l border-gray-200 transition-all ${
              mode === "code"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}>
            Mã HTML
          </button>
        </div>
        <button onClick={() => setFullscreen(!fullscreen)}
          title={fullscreen ? "Thu nhỏ" : "Toàn màn hình"}
          className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 text-xs font-medium px-3 py-1.5 rounded-md hover:bg-gray-100 border border-gray-200 transition-colors">
          {fullscreen
            ? <><span>✕</span><span>Thu nhỏ</span></>
            : <><span>⛶</span><span>Toàn màn hình</span></>
          }
        </button>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-0.5 px-2.5 py-2 bg-gray-50 border-b border-gray-200 flex-shrink-0">
        {TOOL_GROUPS.map((group, gi) => (
          <span key={gi} className="contents">
            {/* Separator giữa nhóm */}
            {gi > 0 && (
              <span className="inline-block w-px h-6 bg-gray-300 mx-1 flex-shrink-0 self-center" />
            )}
            {group.map((t) => (
              <button
                key={t.tag}
                onMouseDown={e => { e.preventDefault(); handleTool(t.tag); }}
                title={t.title}
                className="flex items-center justify-center w-8 h-8 rounded text-gray-500
                  hover:bg-white hover:text-gray-900 hover:shadow-sm
                  hover:border-gray-300 border border-transparent
                  active:scale-95 transition-all duration-75 flex-shrink-0"
              >
                {t.icon}
              </button>
            ))}
          </span>
        ))}

        {/* Phím tắt — phía phải */}
        <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
          {[
            { key: "B", label: "đậm" },
            { key: "I", label: "nghiêng" },
            { key: "K", label: "link" },
          ].map(({ key, label }) => (
            <span key={key} className="hidden sm:inline-flex items-center gap-1 text-[10px] text-gray-400">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded shadow-sm font-mono">
                ⌃{key}
              </kbd>
              <span>{label}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Editor area ── */}
      <div className={`flex-1 ${fullscreen ? "overflow-auto" : ""}`}>

        {/* H2 / H3 visual styles — chỉ load trong admin editor, không ảnh hưởng front-end */}
        <style>{`
          .prose-editor h2 {
            font-size: 1.35rem;
            font-weight: 800;
            color: #1e3a8a;
            margin-top: 1.75rem;
            margin-bottom: 0.6rem;
            padding: 0.5rem 0.85rem 0.5rem 1rem;
            border-left: 4px solid #2563eb;
            border-bottom: 2px solid #bfdbfe;
            background: linear-gradient(to right, #eff6ff, #f8fafc);
            border-radius: 0 8px 8px 0;
            line-height: 1.35;
          }
          .prose-editor h3 {
            font-size: 1.05rem;
            font-weight: 700;
            color: #4c1d95;
            margin-top: 1.25rem;
            margin-bottom: 0.4rem;
            padding: 0.3rem 0.75rem;
            border-left: 3px solid #7c3aed;
            background: linear-gradient(to right, #f5f3ff, transparent);
            border-radius: 0 6px 6px 0;
            line-height: 1.4;
          }
        `}</style>

        {/* Visual mode */}
        {pasteMsg && (
          <div className={`mx-3 mt-2 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 ${
            pasteMsg.type === "loading" ? "bg-blue-50 text-blue-700 border border-blue-200" :
            pasteMsg.type === "ok"      ? "bg-green-50 text-green-700 border border-green-200" :
                                          "bg-amber-50 text-amber-700 border border-amber-200"
          }`}>
            {pasteMsg.type === "loading" && <span className="animate-spin">⏳</span>}
            {pasteMsg.text}
          </div>
        )}
        <div
          ref={editorRef}
          contentEditable={mode === "visual"}
          suppressContentEditableWarning
          onInput={() => onChange(editorRef.current?.innerHTML || "")}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onClick={handleEditorClick}
          className={`prose-editor w-full p-5 focus:outline-none text-sm leading-relaxed text-gray-900 bg-white ${
            mode === "visual" ? "block" : "hidden"
          }`}
          style={{ minHeight: minH }}
        />

        {/* Code mode — giữ dark vì code editor đẹp hơn khi tối */}
        {mode === "code" && (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            spellCheck={false}
            className="w-full p-5 bg-gray-900 text-green-400 font-mono text-xs leading-relaxed focus:outline-none resize-none"
            style={{ minHeight: minH }}
            onKeyDown={(e) => {
              if (e.key === "Tab") {
                e.preventDefault();
                const ta = e.currentTarget;
                const s = ta.selectionStart;
                const next = ta.value.substring(0, s) + "  " + ta.value.substring(ta.selectionEnd);
                onChange(next);
                setTimeout(() => { ta.selectionStart = ta.selectionEnd = s + 2; }, 0);
              }
            }}
          />
        )}
      </div>

      {/* ── Status bar ── */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-gray-50 border-t border-gray-200 text-xs text-gray-400 flex-shrink-0">
        <span>{mode === "visual" ? "✏️ Chế độ trực quan" : "💻 Chế độ HTML"}</span>
        <span>{value.replace(/<[^>]+>/g, "").length.toLocaleString()} ký tự</span>
      </div>
    </div>

    {/* ── Image Modal ── */}
    {showImgModal && (
      <ImageModal
        onInsert={handleInsertImage}
        onClose={() => setShowImgModal(false)}
      />
    )}

    {/* ── Link Popover ── */}
    {linkPopover && mode === "visual" && (
      <LinkPopover
        href={linkPopover.href}
        top={linkPopover.top}
        left={linkPopover.left}
        onSave={handleLinkSave}
        onOpen={handleLinkOpen}
        onUnlink={handleLinkUnlink}
        onClose={() => setLinkPopover(null)}
      />
    )}

    {/* ── Image Popover ── */}
    {imagePopover && mode === "visual" && (
      <ImagePopover
        src={imagePopover.src}
        alt={imagePopover.alt}
        top={imagePopover.top}
        left={imagePopover.left}
        onSave={handleImageSave}
        onDelete={handleImageDelete}
        onClose={() => setImagePopover(null)}
      />
    )}
    </>
  );
}
