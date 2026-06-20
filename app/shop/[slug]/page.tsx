"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCart, formatVND } from "@/components/CartContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  sale_price: number | null;
  images: string[];
  category: string;
  featured: boolean;
  stock: number;
  tags: string[];
};

export default function ProductDetailPage() {
  const { slug }           = useParams<{ slug: string }>();
  const router             = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImg, setMainImg] = useState(0);
  const [qty, setQty]         = useState(1);
  const [added, setAdded]     = useState(false);
  const { addItem, openCart } = useCart();

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { setProduct(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen pt-16 bg-gray-50 flex items-center justify-center">
      <Navbar />
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen pt-16 bg-gray-50 flex flex-col items-center justify-center gap-4 text-center px-4">
      <Navbar />
      <div className="text-6xl">😕</div>
      <p className="text-gray-700 font-semibold text-lg">Sản phẩm không tồn tại</p>
      <Link href="/shop" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
        ← Quay lại cửa hàng
      </Link>
    </div>
  );

  const actualPrice = product.sale_price ?? product.price;
  const outOfStock  = product.stock === 0;
  const discount    = product.sale_price ? Math.round((1 - product.sale_price / product.price) * 100) : 0;
  const savings     = product.sale_price ? product.price - product.sale_price : 0;

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addItem({ id: product.id, name: product.name, slug: product.slug, price: actualPrice, image: product.images?.[0] || "" });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < qty; i++) {
      addItem({ id: product.id, name: product.name, slug: product.slug, price: actualPrice, image: product.images?.[0] || "" });
    }
    openCart();
  };

  return (
    <div className="min-h-screen pt-16" style={{ background: "#f5f5f5" }}>
      <Navbar />

      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
          <span className="text-gray-300">/</span>
          <Link href="/shop" className="hover:text-blue-600 transition-colors">Cửa hàng</Link>
          <span className="text-gray-300">/</span>
          <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-blue-600 transition-colors">{product.category}</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-700 font-medium truncate">{product.name}</span>
        </div>
      </div>

      {/* ── Product detail card ── */}
      <div className="max-w-5xl mx-auto px-4 py-5">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-[380px_1fr] gap-0">

            {/* ── Left: Images ── */}
            <div className="p-6 border-b md:border-b-0 md:border-r border-gray-100">
              {/* Main image */}
              <div className="relative rounded-xl overflow-hidden bg-gray-50 mb-3" style={{ aspectRatio: "1/1" }}>
                {product.images?.length > 0 ? (
                  <img
                    src={product.images[mainImg]}
                    alt={product.name}
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-7xl text-gray-200">📦</div>
                )}
                {discount > 0 && (
                  <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                    -{discount}%
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images?.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setMainImg(i)}
                      className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all bg-gray-50 ${
                        i === mainImg ? "border-blue-500 shadow-sm" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain p-1" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Right: Info ── */}
            <div className="p-6 flex flex-col">
              {/* Category + badges */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full border border-blue-100">
                  {product.category}
                </span>
                {product.featured && (
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
                    ⭐ Nổi bật
                  </span>
                )}
                {product.stock > 0 || product.stock === -1 ? (
                  <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                    {product.stock === -1 ? "Còn hàng" : `Còn ${product.stock} suất`}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-red-500 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" /> Hết hàng
                  </span>
                )}
              </div>

              {/* Name */}
              <h1 className="text-xl font-bold text-gray-900 leading-snug mb-4">{product.name}</h1>

              {/* Short description */}
              {product.short_description && (
                <p className="text-gray-600 text-sm leading-relaxed mb-4 pb-4 border-b border-gray-100">
                  {product.short_description}
                </p>
              )}

              {/* Price box */}
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-5">
                <div className="flex items-end gap-3 flex-wrap">
                  <span className="text-3xl font-extrabold" style={{ color: "#d0021b" }}>
                    {formatVND(actualPrice)}
                  </span>
                  {product.sale_price && (
                    <div className="flex items-center gap-2 pb-1">
                      <span className="text-gray-400 text-sm line-through">{formatVND(product.price)}</span>
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">-{discount}%</span>
                    </div>
                  )}
                </div>
                {savings > 0 && (
                  <p className="text-red-600 text-xs font-medium mt-1">
                    🎉 Tiết kiệm: {formatVND(savings)}
                  </p>
                )}
              </div>

              {/* Qty selector */}
              {!outOfStock && (
                <div className="flex items-center gap-4 mb-5">
                  <span className="text-sm text-gray-600 font-medium">Số lượng:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold text-lg transition-colors"
                    >−</button>
                    <span className="w-10 h-9 flex items-center justify-center text-gray-900 font-bold text-sm border-x border-gray-300">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty(q => q + 1)}
                      className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold text-lg transition-colors"
                    >+</button>
                  </div>
                  <span className="text-gray-400 text-sm">= {formatVND(actualPrice * qty)}</span>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 mb-5">
                <button
                  onClick={handleAdd}
                  disabled={outOfStock}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                    added
                      ? "border-green-500 bg-green-50 text-green-600"
                      : outOfStock
                      ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "border-orange-400 bg-orange-50 text-orange-600 hover:bg-orange-100"
                  }`}
                >
                  {added ? "✓ Đã thêm vào giỏ!" : outOfStock ? "Hết hàng" : "🛒 Thêm vào giỏ"}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={outOfStock}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40"
                  style={outOfStock ? { background: "#e5e7eb" } : { background: "linear-gradient(135deg,#f97316,#ef4444)" }}
                >
                  Đặt hàng ngay →
                </button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                {[
                  { icon: "🛡️", text: "Cam kết chất lượng dịch vụ" },
                  { icon: "📊", text: "Báo cáo kết quả hàng tuần" },
                  { icon: "🔄", text: "Hoàn tiền nếu không đạt KPI" },
                  { icon: "💬", text: "Hỗ trợ Zalo 24/7" },
                ].map((b, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                    <span className="text-base">{b.icon}</span>
                    <span className="text-xs text-gray-600 leading-snug">{b.text}</span>
                  </div>
                ))}
              </div>

              {/* Tags */}
              {product.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {product.tags.map((tag, i) => (
                    <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">#{tag}</span>
                  ))}
                </div>
              )}

              {/* Zalo CTA */}
              <div className="mt-auto pt-4 border-t border-gray-100 mt-4">
                <p className="text-xs text-gray-400 mb-2">Cần tư vấn thêm trước khi đặt hàng?</p>
                <a
                  href="https://zalo.me/0968806360"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-colors"
                  style={{ background: "#0068ff" }}
                >
                  💬 Chat Zalo — tư vấn miễn phí
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Description ── */}
        {product.description && (
          <div className="mt-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <span className="w-1 h-5 bg-blue-600 rounded-full inline-block" />
              <h2 className="font-bold text-gray-900">MÔ TẢ SẢN PHẨM</h2>
            </div>
            <div className="p-6">
              <div
                className="prose prose-sm prose-gray max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          </div>
        )}

        {/* ── Back ── */}
        <div className="mt-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 text-sm transition-colors"
          >
            ← Tiếp tục mua sắm
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
