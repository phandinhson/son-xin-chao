import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const exclude  = searchParams.get("exclude");   // slug bài hiện tại (để loại khỏi related)
  const limit    = Math.min(parseInt(searchParams.get("limit") || "100"), 50);

  const db = supabaseAdmin();
  let query = db
    .from("posts")
    .select("id, title, slug, excerpt, cover_image, created_at, category")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (category) query = query.eq("category", category);
  if (exclude)  query = query.neq("slug", exclude);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message, code: error.code }, { status: 500 });
  return NextResponse.json(data || [], {
    headers: {
      "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
    },
  });
}
