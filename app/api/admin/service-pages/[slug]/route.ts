export const dynamic = "force-dynamic";
import { checkAuth } from "@/lib/adminAuth";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

type Params = { params: { slug: string } };

// Mapping slug → public path để revalidate ISR cache
const SLUG_TO_PATH: Record<string, string> = {
  "seo-onpage":   "/dich-vu/seo-onpage",
  "audit-tu-van": "/dich-vu/audit-tu-van",
};

// GET — lấy nội dung trang
export async function GET(req: NextRequest, { params }: Params) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("service_pages")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || { slug: params.slug, content: {} });
}

// PUT — cập nhật nội dung trang + bust ISR cache
export async function PUT(req: NextRequest, { params }: Params) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const sb = supabaseAdmin();

  const { data, error } = await sb
    .from("service_pages")
    .upsert(
      {
        slug: params.slug,
        content: body.content,
        title: body.title,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "slug" }
    )
    .select()
    .single();

  if (error) {
    console.error("[service-pages PUT]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Bust ISR cache ngay lập tức — trang public sẽ rebuild lần request tiếp theo
  const publicPath = SLUG_TO_PATH[params.slug];
  if (publicPath) {
    revalidatePath(publicPath);
  }

  return NextResponse.json({ ok: true, data });
}
