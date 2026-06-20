import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search   = searchParams.get("q");

  const db = supabaseAdmin();
  let query = db
    .from("products")
    .select("id, name, slug, short_description, price, sale_price, images, category, featured, stock, sort_order")
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (category && category !== "all") query = query.eq("category", category);
  if (search) query = query.ilike("name", `%${search}%`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || [], {
    headers: { "Cache-Control": "s-maxage=30, stale-while-revalidate=120" },
  });
}
