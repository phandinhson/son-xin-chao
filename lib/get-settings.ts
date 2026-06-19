import { cache } from "react";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * getSiteSettings — fetch site_settings từ Supabase.
 *
 * Dùng React.cache() để dedup trong cùng 1 render request:
 *   - generateMetadata()  ┐
 *   - RootLayout()        ├─ cả 3 share 1 kết quả, chỉ 1 DB query/request
 *   - page.tsx Home()     ┘
 *
 * Cache tự reset giữa các request (Next.js per-request cache).
 */
export const getSiteSettings = cache(async (): Promise<Record<string, string>> => {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return {};
    const db = supabaseAdmin();
    const { data } = await db.from("site_settings").select("key, value");
    if (!data) return {};
    return Object.fromEntries(data.map((r) => [r.key, r.value]));
  } catch {
    return {};
  }
});
