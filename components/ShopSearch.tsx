"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatVND } from "@/components/CartContext";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  sale_price: number | null;
  images: string[];
  category: string;
};

const CATEGORY_SUGGESTIONS = [
  { label: "Dịch vụ SEO",      icon: "🔍" },
  { label: "Chạy quảng cáo",   icon: "📣" },
  { label: "Thiết kế website",  icon: "💻" },
  { label: "Tư vấn",           icon: "💬" },
  { label: "Khác",             icon: "📦" },
];

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

type Props = {
  onSearch?: (q: string) => void;
  onCategorySelect?: (cat: string) => void;
  placeholder?: string;
};

export default function ShopSearch({ onSearch, onCategorySelect, placeholder = "Tìm kiếm dịch vụ, sản phẩm..." }: Props) {
  const router            = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen]   = useState(false);
  const [products, setProducts]   = useState<Product[]>([]);
  const [searching, setSearching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef     = useRef<HTMLInputElement>(null);
  const debouncedQ   = useDebounce(query, 280);

  // Fetch suggestions khi query thay đổi
  useEffect(() => {
    if (!debouncedQ.trim()) { setProducts([]); return; }
    setSearching(true);
    fetch(`/api/products?q=${encodeURIComponent(debouncedQ)}`)
      .then(r => r.ok ? r.json() : [])
      .then((data: Product[]) => { setProducts(data.slice(0, 6)); setSearching(false); })
      .catch(() => setSearching(false));
  }, [debouncedQ]);

  // Click outside đóng dropdown
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    if (onSearch) {
      onSearch(query.trim());
    } else {
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleCategoryClick = (cat: string) => {
    setOpen(false);
    setQuery("");
    if (onCategorySelect) {
      onCategorySelect(cat);
    } else {
      router.push(`/shop?category=${encodeURIComponent(cat)}`);
    }
  };

  const handleProductClick = () => {
    setOpen(false);
    setQuery("");
  };

  const showDropdown = open && (query.trim().length === 0 || products.length > 0 || searching);
  const showCats     = query.trim().length === 0;   // Khi chưa gõ → show danh mục
  const showProducts = query.trim().length > 0;      // Khi gõ → show sản phẩm

  return (
    <div ref={containerRef} className="relative w-full">
      {/* ── Input bar ── */}
      <form onSubmit={handleSubmit} className="flex items-stretch shadow-lg rounded-xl overflow-hidden border-2 border-white/30 focus-within:border-white transition-all">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          className="flex-1 px-4 py-3.5 text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none"
        />
        {/* Clear button */}
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(""); setProducts([]); inputRef.current?.focus(); }}
            className="px-2 bg-white text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
          >×</button>
        )}
        {/* Search button */}
        <button
          type="submit"
          className="px-5 flex items-center gap-2 text-white text-sm font-bold transition-colors"
          style={{ background: "linear-gradient(135deg,#f97316,#ef4444)" }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="hidden sm:inline">Tìm kiếm</span>
        </button>
      </form>

      {/* ── Dropdown ── */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          style={{ maxHeight: 480, zIndex: 9999 }}>

          {/* Danh mục gợi ý (khi chưa gõ) */}
          {showCats && (
            <div>
              <div className="px-4 pt-3 pb-1.5 flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Danh mục gợi ý</span>
              </div>
              <ul className="pb-2">
                {CATEGORY_SUGGESTIONS.map(cat => (
                  <li key={cat.label}>
                    <button
                      onClick={() => handleCategoryClick(cat.label)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors text-left"
                    >
                      <span className="text-gray-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </span>
                      <span className="font-medium">{cat.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sản phẩm gợi ý (khi đang gõ) */}
          {showProducts && (
            <div>
              {searching ? (
                <div className="flex items-center gap-2 px-4 py-4 text-sm text-gray-400">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                  Đang tìm kiếm...
                </div>
              ) : products.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-gray-400">
                  <div className="text-3xl mb-2">🔍</div>
                  Không tìm thấy "{query}"
                </div>
              ) : (
                <>
                  <div className="px-4 pt-3 pb-1.5">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Sản phẩm gợi ý</span>
                  </div>
                  <ul className="pb-2">
                    {products.map(p => {
                      const actualPrice = p.sale_price ?? p.price;
                      const image       = p.images?.[0] || "";
                      return (
                        <li key={p.id}>
                          <Link
                            href={`/shop/${p.slug}`}
                            onClick={handleProductClick}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors group"
                          >
                            {/* Thumbnail */}
                            <div className="w-11 h-11 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                              {image
                                ? <Image src={image} alt="" width={44} height={44} className="w-full h-full object-contain p-0.5" unoptimized />
                                : <div className="w-full h-full flex items-center justify-center text-lg">📦</div>
                              }
                            </div>
                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-800 group-hover:text-blue-600 font-medium truncate transition-colors leading-snug">
                                {p.name}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-sm font-bold" style={{ color: "#d0021b" }}>
                                  {formatVND(actualPrice)}
                                </span>
                                {p.sale_price && (
                                  <span className="text-xs text-gray-400 line-through">{formatVND(p.price)}</span>
                                )}
                              </div>
                            </div>
                            {/* Arrow */}
                            <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-400 flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Xem tất cả */}
                  <div className="border-t border-gray-100 px-4 py-3">
                    <button
                      onClick={handleSubmit as unknown as React.MouseEventHandler}
                      className="flex items-center justify-center gap-1.5 w-full text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Xem tất cả kết quả cho &ldquo;<span className="max-w-[200px] truncate inline-block">{query}</span>&rdquo;
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
