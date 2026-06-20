"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  sale_price: number | null;
  images: string[];
  category: string;
  status: "draft" | "published";
  featured: boolean;
  stock: number;
  sort_order: number;
  created_at: string;
};

function formatVND(n: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState<"all" | "published" | "draft">("all");

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/products");
    if (res.ok) setProducts(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Xóa sản phẩm "${name}"?`)) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    await load();
  };

  const handleToggle = async (p: Product) => {
    const newStatus = p.status === "published" ? "draft" : "published";
    await fetch(`/api/admin/products/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    await load();
  };

  const filtered   = products.filter(p => filter === "all" ? true : p.status === filter);
  const published  = products.filter(p => p.status === "published").length;
  const drafts     = products.filter(p => p.status === "draft").length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">🛒 Sản phẩm cửa hàng</h1>
            <p className="text-sm text-gray-500 mt-0.5">Quản lý danh sách sản phẩm & dịch vụ</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/shop/categories"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              🏷️ Danh mục
            </Link>
            <Link
              href="/admin/shop/orders"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              📦 Đơn hàng
            </Link>
            <Link
              href="/shop"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              🌐 Xem shop
            </Link>
            <Link
              href="/admin/shop/products/new"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <span>+</span> Thêm sản phẩm
            </Link>
          </div>
        </div>

        {/* Stats */}
        {products.length > 0 && (
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-sm">
              <span className="w-2 h-2 rounded-full bg-gray-400" />
              <span className="text-gray-600 font-medium">{products.length} sản phẩm</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-gray-600">{published} đang bán</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <span className="w-2 h-2 rounded-full bg-gray-300" />
              <span className="text-gray-600">{drafts} bản nháp</span>
            </div>
          </div>
        )}
      </div>

      {/* Filter tabs */}
      {products.length > 0 && (
        <div className="bg-white border-b border-gray-200 px-6">
          <div className="flex gap-0">
            {([
              { key: "all",       label: `Tất cả (${products.length})` },
              { key: "published", label: `Đang bán (${published})` },
              { key: "draft",     label: `Bản nháp (${drafts})` },
            ] as const).map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  filter === f.key ? "text-blue-600 border-blue-600" : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                }`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-6 py-5">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl border border-gray-200">
            <div className="text-5xl mb-4">📦</div>
            <p className="text-gray-500 mb-6">Chưa có sản phẩm nào</p>
            <Link href="/admin/shop/products/new"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Thêm sản phẩm đầu tiên
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[60px_1fr_120px_120px_80px_90px] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <span>Ảnh</span>
              <span>Sản phẩm</span>
              <span>Danh mục</span>
              <span className="text-right">Giá</span>
              <span className="text-center">Kho</span>
              <span className="text-right">Trạng thái</span>
            </div>

            <div className="divide-y divide-gray-100">
              {filtered.map(product => (
                <div key={product.id} className="grid grid-cols-[60px_1fr_120px_120px_80px_90px] gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group items-center">

                  {/* Image */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">📦</div>
                    )}
                  </div>

                  {/* Name */}
                  <div className="min-w-0">
                    <div className="flex items-start gap-2 flex-wrap">
                      <Link href={`/admin/shop/products/${product.id}`}
                        className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors leading-snug">
                        {product.name}
                      </Link>
                      {product.featured && (
                        <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded border border-amber-200">⭐ Nổi bật</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">/{product.slug}</p>
                    {/* Hover actions */}
                    <div className="mt-1.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/shop/products/${product.id}`}
                        className="px-2.5 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded border border-transparent hover:border-blue-200 transition-colors">Sửa</Link>
                      <span className="text-gray-300">|</span>
                      <a href={`/shop/${product.slug}`} target="_blank"
                        className="px-2.5 py-1 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded border border-transparent hover:border-gray-200 transition-colors">Xem</a>
                      <span className="text-gray-300">|</span>
                      <button onClick={() => handleToggle(product)}
                        className="px-2.5 py-1 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded border border-transparent hover:border-gray-200 transition-colors">
                        {product.status === "published" ? "→ Nháp" : "→ Đăng"}
                      </button>
                      <span className="text-gray-300">|</span>
                      <button onClick={() => handleDelete(product.id, product.name)}
                        className="px-2.5 py-1 text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 rounded border border-transparent hover:border-red-200 transition-colors">Xóa</button>
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[11px] font-medium rounded border border-blue-100">
                      {product.category || "—"}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatVND(product.sale_price ?? product.price)}
                    </p>
                    {product.sale_price && (
                      <p className="text-xs text-gray-400 line-through">{formatVND(product.price)}</p>
                    )}
                  </div>

                  {/* Stock */}
                  <div className="text-center">
                    {product.stock === -1 ? (
                      <span className="text-xs text-green-600 font-medium">∞</span>
                    ) : product.stock === 0 ? (
                      <span className="text-xs text-red-500 font-medium">Hết</span>
                    ) : (
                      <span className="text-xs text-gray-600 font-medium">{product.stock}</span>
                    )}
                  </div>

                  {/* Status */}
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                      product.status === "published"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-gray-100 text-gray-500 border-gray-200"
                    }`}>
                      {product.status === "published" ? "● Đang bán" : "○ Nháp"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
