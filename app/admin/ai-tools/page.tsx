// Trang này đã được gộp vào /admin/hoc-ai
// Redirect tự động để không bị dead link
import { redirect } from "next/navigation";

export default function OldAiToolsPage() {
  redirect("/admin/hoc-ai");
}
