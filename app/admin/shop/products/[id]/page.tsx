"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";

type Product = {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  price: number;
  sale_price: number | null;
  category: string;
  tags: string[];
  images: string[];
  status: "draft" | "published";
  featured: boolean;
  stock: number;
  sort_order: number;
};

export default function EditProductPage() {
  const { id }                  = useParams<{ id: string }>();
  const [product, setProduct]   = useState<Product | null>(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetch(`/api/admin/products`)
      .then(r => r.json())
      .then((data: Product[]) => {
        const found = data.find(p => p.id === id);
        setProduct(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">Không tìm thấy sản phẩm</p>
        <Link href="/admin/shop/products" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          Quay lại
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/admin/shop/products" className="text-gray-500 hover:text-gray-700 text-sm">
            ← Sản phẩm
          </Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-xl font-bold text-gray-900 truncate">{product.name}</h1>
          <a href={`/shop/${product.slug}`} target="_blank"
            className="ml-auto px-3 py-1.5 text-xs border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5">
            🌐 Xem trang
          </a>
        </div>
      </div>
      <ProductForm
        mode="edit"
        initial={{
          id:                product.id,
          name:              product.name,
          slug:              product.slug,
          short_description: product.short_description,
          description:       product.description,
          price:             product.price.toString(),
          sale_price:        product.sale_price?.toString() || "",
          category:          product.category,
          tags:              product.tags?.join(", ") || "",
          images:            product.images?.join("\n") || "",
          status:            product.status,
          featured:          product.featured,
          stock:             product.stock.toString(),
          sort_order:        product.sort_order.toString(),
        }}
      />
    </div>
  );
}
