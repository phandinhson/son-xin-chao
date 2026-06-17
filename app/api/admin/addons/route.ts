export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";

function checkAuth() {
  const session = cookies().get("admin_session")?.value;
  return session === process.env.ADMIN_SECRET;
}

export async function GET() {
  if (!checkAuth()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("addons")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
  if (!checkAuth()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("addons")
    .insert([{
      name: body.name,
      icon: body.icon || "⭐",
      price: body.price,
      unit: body.unit || "",
      sort_order: body.sort_order || 0,
      active: body.active !== undefined ? body.active : true,
    }])
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
