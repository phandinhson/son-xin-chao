import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";

export default function NewProductPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/admin/shop/products" className="text-gray-500 hover:text-gray-700 text-sm">
            ← Sản phẩm
          </Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-xl font-bold text-gray-900">Thêm sản phẩm mới</h1>
        </div>
      </div>
      <ProductForm mode="create" />
    </div>
  );
}
