import { redirect } from "next/navigation";
export default function ShopAdminRedirect() {
  redirect("/admin/shop/products");
}
