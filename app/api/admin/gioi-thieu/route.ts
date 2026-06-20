export const dynamic = "force-dynamic";
import { checkAuth } from "@/lib/adminAuth";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";

const KEY = "page_gioi_thieu";


export async function GET(req: NextRequest) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = supabaseAdmin();
  const { data } = await db.from("site_settings").select("value").eq("key", KEY).single();
  if (!data) return NextResponse.json({});
  try {
    return NextResponse.json(JSON.parse(data.value));
  } catch {
    return NextResponse.json({});
  }
}

export async function POST(req: NextRequest) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const db = supabaseAdmin();
  const { error } = await db
    .from("site_settings")
    .upsert({ key: KEY, value: JSON.stringify(body) }, { onConflict: "key" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Invalidate the public page cache immediately after save
  revalidatePath("/gioi-thieu");

  return NextResponse.json({ success: true });
}
