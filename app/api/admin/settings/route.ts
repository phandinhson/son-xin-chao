export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function checkAuth(req: NextRequest) {
  return req.cookies.get("admin_session")?.value === process.env.ADMIN_SECRET;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = supabaseAdmin();
  const { data, error } = await db.from("site_settings").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  // Convert array to key-value object
  const settings = Object.fromEntries((data || []).map((s) => [s.key, s.value]));
  return NextResponse.json(settings);
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json(); // { key: value, key2: value2, ... }
  const db = supabaseAdmin();
  const rows = Object.entries(body).map(([key, value]) => ({ key, value }));
  const { error } = await db.from("site_settings").upsert(rows, { onConflict: "key" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
