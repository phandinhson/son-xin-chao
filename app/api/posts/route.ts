export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("posts")
    .select("id, title, slug, excerpt, cover_image, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message, code: error.code }, { status: 500 });
  return NextResponse.json(data || []);
}
