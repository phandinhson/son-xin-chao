import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("products")
    .select("*")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();
  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}
