export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";

function checkAuth(req: NextRequest) {
  return req.cookies.get("admin_session")?.value === process.env.ADMIN_SECRET;
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = supabaseAdmin();
  const { data, error } = await db.from("posts").select("*").eq("id", params.id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "Pragma": "no-cache",
    },
  });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const db = supabaseAdmin();

  // Chỉ update các field được phép — tránh gửi id/created_at/updated_at gây lỗi Supabase
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: Record<string, any> = {
    title:       body.title       ?? "",
    slug:        body.slug        ?? "",
    excerpt:     body.excerpt     ?? "",
    content:     body.content     ?? "",
    cover_image: body.cover_image ?? "",
    status:      body.status      ?? "draft",
    updated_at:  new Date().toISOString(),
  };

  // Fields từ migrations — chỉ thêm nếu có trong body (tránh lỗi khi cột chưa tồn tại)
  if (body.category     !== undefined) payload.category      = body.category;
  if (body.focus_keyword !== undefined) payload.focus_keyword = body.focus_keyword;

  // published_at: set khi publish lần đầu, không overwrite nếu đã có
  if (body.status === "published" && !body.published_at) {
    payload.published_at = new Date().toISOString();
  } else if (body.published_at) {
    payload.published_at = body.published_at;
  }

  const { data, error } = await db
    .from("posts")
    .update(payload)
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    console.error("[PUT /api/admin/posts]", error.message, error.details);
    return NextResponse.json({ error: error.message, details: error.details }, { status: 500 });
  }

  // Clear Next.js cache cho blog page sau khi save thành công
  try {
    revalidatePath(`/blog/${data.slug}`);
    revalidatePath("/blog");
  } catch {
    // revalidatePath có thể throw trong một số môi trường — không block response
  }

  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = supabaseAdmin();
  const { error } = await db.from("posts").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
