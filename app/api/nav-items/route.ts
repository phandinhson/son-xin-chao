import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("nav_items")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error) return NextResponse.json([], { status: 200 }); // fallback graceful
  return NextResponse.json(data || [], {
    headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
  });
}
