"use client";
import { useRef, useState, useEffect, useCallback } from "react";

type LibImg = { name: string; url: string; sizeLabel: string };

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
                onChange={e => { setUrl(e.target.value); setPreview(e.target.value); }}
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

const TOOLS = [
  { label: "b",         tag: "strong",     title: "In đậm (Ctrl+B)" },
  { label: "i",         tag: "em",         title: "In nghiêng (Ctrl+I)" },
  { label: "link",      tag: "a",          title: "Chèn liên kết (Ctrl+K)" },
  { label: "b-quote",   tag: "blockquote", title: "Trích dẫn" },
  { label: "del",       tag: "del",        title: "Gạch ngang" },
  { label: "ins",       tag: "ins",        title: "Gạch chân" },
  { label: "img",       tag: "img",        title: "Chèn ảnh" },
  { label: "ul",        tag: "ul",         title: "Danh sách không số" },
  { label: "ol",        tag: "ol",         title: "Danh sách có số" },
  { label: "li",        tag: "li",         title: "Mục danh sách" },
  { label: "code",      tag: "code",       title: "Code inline" },
  { label: "h2",        tag: "h2",         title: "Tiêu đề H2" },
  { label: "h3",        tag: "h3",         title: "Tiêu đề H3" },
  { label: "more",      tag: "more",       title: "Ngắt 'Đọc thêm'" },
  { label: "đóng thẻ", tag: "close",      title: "Đóng thẻ HTML cuối cùng" },
];

export default function RichEditor({ value, onChange }: Props) {
  const [mode, setMode] = useState<"visual" | "code">("visual");
  const [fullscreen, setFullscreen] = useState(false);
  const [showImgModal, setShowImgModal] = useState(false);
  const [pasteMsg, setPasteMsg] = useState<{ type: "loading" | "ok" | "err"; text: string } | null>(null);
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

  // ── Mode switch ───────────────────────────────────────────────────────────
  const goCode = () => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
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
      <div className="flex flex-wrap items-center gap-1 px-3 py-2 bg-gray-50 border-b border-gray-200 flex-shrink-0">
        {TOOLS.map((t) => (
          <button key={t.tag} onClick={() => handleTool(t.tag)} title={t.title}
            className={`px-2.5 py-1 text-xs rounded border transition-all font-mono ${
              t.tag === "strong"
                ? "bg-white border-gray-300 text-gray-900 hover:bg-gray-100 font-bold"
                : t.tag === "em"
                ? "bg-white border-gray-300 text-gray-700 hover:bg-gray-100 italic"
                : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}>
            {t.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-3 text-xs text-gray-400">
          <span>Ctrl+B: đậm</span>
          <span>Ctrl+I: nghiêng</span>
          <span>Ctrl+K: link</span>
        </div>
      </div>

      {/* ── Editor area ── */}
      <div className={`flex-1 ${fullscreen ? "overflow-auto" : ""}`}>
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
    </>
  );
}
