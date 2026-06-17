export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Public endpoint — không cần auth, website đọc settings từ đây
export async function GET() {
  const db = supabaseAdmin();
  const { data, error } = await db.from("site_settings").select("*");
  if (error) return NextResponse.json({}, { status: 500 });
  const settings = Object.fromEntries((data || []).map((s) => [s.key, s.value]));
  return NextResponse.json(settings, {
    headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate" },
  });
}
