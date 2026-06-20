import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("posts")
    .select("id, title, slug, excerpt, cover_image, created_at, category")
    .eq("status", "published")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message, code: error.code }, { status: 500 });
  return NextResponse.json(data || [], {
    headers: {
      // Cache 60s ở Vercel Edge, serve stale 5 phút trong khi revalidate ngầm
      "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
    },
  });
}
