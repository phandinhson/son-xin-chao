"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useCart, formatVND } from "@/components/CartContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ShopSearch from "@/components/ShopSearch";

type Product = {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  price: number;
  sale_price: number | null;
  images: string[];
  category: string;
  featured: boolean;
  stock: number;
};

// "Tất cả" luôn cố định ở đầu, phần còn lại fetch từ DB
const ALL_CAT = { key: "Tất cả", icon: "🏪", color: "#6366f1", bg: "#eef2ff" };

type ShopCategory = { id: string; name: string; icon: string; color: string; bg: string };

/* ── Product Card ──────────────────────────────────────────── */
function ProductCard({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();
  const actualPrice  = product.sale_price ?? product.price;
  const image        = product.images?.[0] || "";
  const outOfStock   = product.stock === 0;
  const discountPct  = product.sale_price
    ? Math.round((1 - product.sale_price / product.price) * 100) : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (outOfStock) return;
    addItem({ id: product.id, name: product.name, slug: product.slug, price: actualPrice, image });
    openCart();
  };

  return (
    <div className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">

      {/* Image area */}
      <Link href={`/shop/${product.slug}`} className="block relative bg-gray-50 overflow-hidden" style={{ aspectRatio: "1/1" }}>
        {image ? (
          <img
            src={image} alt={product.name}
            className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <span className="text-5xl">📦</span>
            <span className="text-xs text-gray-400">Chưa có ảnh</span>
          </div>
        )}

        {/* Discount badge */}
        {discountPct > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
            -{discountPct}%
          </span>
        )}

        {/* Featured badge */}
        {product.featured && (
          <span className="absolute top-2 left-2 bg-amber-400 text-amber-900 text-[11px] font-bold px-2 py-0.5 rounded-full">
            HOT
          </span>
        )}

        {/* Out of stock overlay */}
        {outOfStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-gray-200 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">Hết hàng</span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-3">
        {/* Category label */}
        <p className="text-[11px] text-gray-400 mb-1 truncate">{product.category}</p>

        {/* Name */}
        <Link href={`/shop/${product.slug}`}>
          <h3 className="text-[13px] font-medium text-gray-800 leading-snug mb-2 line-clamp-2 hover:text-blue-600 transition-colors" style={{ minHeight: "2.5rem" }}>
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="mb-3">
          <p className="text-base font-bold" style={{ color: "#d0021b" }}>
            {formatVND(actualPrice)}
          </p>
          {product.sale_price && (
            <p className="text-xs text-gray-400 line-through">{formatVND(product.price)}</p>
          )}
        </div>

        {/* Add to cart button */}
        <button
          onClick={handleAdd}
          disabled={outOfStock}
          className="w-full py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: outOfStock ? "#e5e7eb" : "linear-gradient(135deg,#f97316,#ef4444)",
            color: outOfStock ? "#9ca3af" : "#fff",
          }}
        >
          {outOfStock ? "Hết hàng" : "🛒 Thêm vào giỏ"}
        </button>
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────── */
export default function ShopPage() {
  const [products,   setProducts]   = useState<Product[]>([]);
  const [dbCats,     setDbCats]     = useState<ShopCategory[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [category,   setCategory]   = useState("Tất cả");
  const [search,     setSearch]     = useState("");
  const { totalQty, totalPrice, openCart } = useCart();

  // Fetch categories từ DB (đồng bộ với admin)
  useEffect(() => {
    fetch("/api/shop-categories")
      .then(r => r.ok ? r.json() : [])
      .then((data: ShopCategory[]) => { if (data.length > 0) setDbCats(data); })
      .catch(() => {});
  }, []);

  // Danh mục đầy đủ: "Tất cả" + DB cats
  const CATEGORIES = [
    ALL_CAT,
    ...dbCats.map(c => ({ key: c.name, icon: c.icon, color: c.color, bg: c.bg })),
  ];

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== "Tất cả") params.set("category", category);
    if (search) params.set("q", search);
    const res = await fetch(`/api/products?${params}`);
    if (res.ok) setProducts(await res.json());
    setLoading(false);
  }, [category, search]);

  useEffect(() => { load(); }, [load]);

  const featured  = products.filter(p => p.featured);
  const regular   = products.filter(p => !p.featured);

  return (
    <div className="min-h-screen pt-16" style={{ background: "#f5f5f5" }}>
      <Navbar />

      {/* ── Top promo strip ── */}
      <div
        className="w-full overflow-hidden"
        style={{ background: "linear-gradient(90deg,#f97316 0%,#ef4444 100%)" }}
      >
        <div className="max-w-6xl mx-auto px-3 h-11 flex items-center justify-between gap-2">

          {/* Left: icon + text */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xl flex-shrink-0">⚡</span>
            <span className="text-white text-xs sm:text-sm font-bold tracking-wide uppercase truncate">
              Dịch vụ SEO &amp; Marketing chuyên nghiệp
            </span>
          </div>

          {/* Right: badge */}
          <a
            href="https://zalo.me/0968806360"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-extrabold text-orange-600 text-xs sm:text-sm whitespace-nowrap transition-opacity hover:opacity-90"
            style={{ background: "#fff" }}
          >
            <span className="text-red-500 text-base">🔥</span>
            -20% ĐẶT NGAY
          </a>
        </div>
      </div>

      {/* ── Hero banner ── */}
      {/* overflow-visible để dropdown ShopSearch không bị clip */}
      <div className="relative" style={{ background: "linear-gradient(135deg,#1a56db 0%,#7c3aed 100%)" }}>
        {/* Decorative circles — dùng pointer-events-none để không block click */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10 bg-white pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 rounded-full opacity-10 bg-white pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-white">
            <p className="text-blue-200 text-sm font-medium mb-1 uppercase tracking-widest">Cửa hàng dịch vụ</p>
            <h1 className="text-3xl lg:text-4xl font-extrabold mb-2 leading-tight">
              Dịch vụ Marketing<br />
              <span className="text-yellow-300">Chất lượng cao</span>
            </h1>
            <p className="text-blue-100 text-sm max-w-md mb-4">
              SEO tổng thể, Google Ads, Facebook Ads, thiết kế website — đặt hàng online, nhận dịch vụ ngay.
            </p>

            {/* Search bar trong hero */}
            <div className="max-w-xl mb-4">
              <ShopSearch
                onSearch={q => { setSearch(q); }}
                onCategorySelect={cat => setCategory(cat)}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-full">
                <span className="text-yellow-300">✓</span>
                <span className="text-white text-xs font-medium">Cam kết kết quả</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-full">
                <span className="text-yellow-300">✓</span>
                <span className="text-white text-xs font-medium">Báo cáo minh bạch</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-full">
                <span className="text-yellow-300">✓</span>
                <span className="text-white text-xs font-medium">Hỗ trợ 24/7</span>
              </div>
            </div>
          </div>

          {/* Promo box */}
          <div className="flex-shrink-0 bg-white rounded-2xl p-5 shadow-xl text-center w-48">
            <p className="text-gray-500 text-xs mb-1">Tiết kiệm đến</p>
            <p className="text-4xl font-extrabold" style={{ color: "#d0021b" }}>30%</p>
            <p className="text-gray-600 text-xs mt-1 mb-3">khi đặt gói dài hạn</p>
            <a
              href="https://zalo.me/0968806360"
              target="_blank" rel="noopener noreferrer"
              className="block w-full py-2 rounded-xl text-xs font-bold text-white transition-colors"
              style={{ background: "linear-gradient(135deg,#f97316,#ef4444)" }}
            >
              Tư vấn miễn phí
            </a>
          </div>
        </div>
      </div>

      {/* ── Category grid ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">

          {/* Mobile: grid 4 cột kiểu icon card */}
          <div className="grid grid-cols-4 gap-2 sm:hidden">
            {CATEGORIES.map(cat => {
              const active = category === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setCategory(cat.key)}
                  className="flex flex-col items-center gap-1.5 py-2 rounded-xl transition-all"
                  style={{
                    background: active ? cat.bg : "transparent",
                    outline: active ? `2px solid ${cat.color}` : "none",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm transition-all"
                    style={{ background: active ? cat.color : cat.bg }}
                  >
                    <span style={{ filter: active ? "brightness(0) invert(1)" : "none" }}>
                      {cat.icon}
                    </span>
                  </div>
                  <span
                    className="text-[10px] font-semibold leading-tight text-center px-0.5 line-clamp-2"
                    style={{ color: active ? cat.color : "#374151" }}
                  >
                    {cat.key}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Desktop: tab pill ngang */}
          <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto">
            {CATEGORIES.map(cat => {
              const active = category === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setCategory(cat.key)}
                  className="flex items-center gap-1.5 flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all"
                  style={{
                    background: active ? cat.color : "#f3f4f6",
                    color: active ? "#fff" : "#374151",
                    boxShadow: active ? `0 2px 8px ${cat.color}55` : "none",
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.key}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-6xl mx-auto px-4 py-6">

        {loading ? (
          <div className="flex justify-center items-center py-24 bg-white rounded-xl">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400 text-sm">Đang tải sản phẩm...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl border border-gray-200">
            <div className="text-5xl mb-3">🔍</div>
            <p className="text-gray-700 font-semibold mb-1">Không tìm thấy sản phẩm</p>
            <p className="text-gray-400 text-sm mb-4">Thử từ khóa khác hoặc xóa bộ lọc</p>
            <button
              onClick={() => { setSearch(""); setInputVal(""); setCategory("Tất cả"); }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Xem tất cả sản phẩm
            </button>
          </div>
        ) : (
          <>
            {/* Featured products */}
            {featured.length > 0 && category === "Tất cả" && !search && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-1 h-5 bg-red-500 rounded-full inline-block" />
                    SẢN PHẨM NỔI BẬT
                  </h2>
                  <span className="text-xs text-gray-400">{featured.length} sản phẩm</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {featured.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              </div>
            )}

            {/* All products */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1 h-5 bg-blue-600 rounded-full inline-block" />
                  {category === "Tất cả" && !search ? "TẤT CẢ SẢN PHẨM" : `KẾT QUẢ${search ? ` — "${search}"` : ` — ${category}`}`}
                </h2>
                <span className="text-xs text-gray-400">{products.length} sản phẩm</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {(category === "Tất cả" && !search ? regular : products).map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Cart floating summary (when has items) */}
        {totalQty > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
            <button
              onClick={openCart}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-white text-sm font-semibold"
              style={{ background: "linear-gradient(135deg,#f97316,#ef4444)" }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{totalQty} sản phẩm</span>
              <span className="w-px h-4 bg-white/40" />
              <span>{formatVND(totalPrice)}</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-lg text-xs">Đặt hàng →</span>
            </button>
          </div>
        )}
      </div>

      {/* ── Bottom CTA ── */}
      <div className="mt-4 py-10 px-4 text-center border-t border-gray-200 bg-white">
        <p className="text-gray-800 font-bold text-lg mb-1">Cần tư vấn hoặc báo giá riêng?</p>
        <p className="text-gray-500 text-sm mb-5">Liên hệ trực tiếp — tư vấn miễn phí, phản hồi trong ngày</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="https://zalo.me/0968806360" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "#0068ff" }}>
            💬 Chat Zalo
          </a>
          <a href="tel:0968806360"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors">
            📞 0968 806 360
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
