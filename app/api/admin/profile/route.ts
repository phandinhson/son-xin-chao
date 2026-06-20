export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyAdminToken, hashPassword, verifyPassword } from "@/lib/auth";

async function getMe(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

// GET — lấy thông tin profile của chính mình
export async function GET(req: NextRequest) {
  const me = await getMe(req);
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = supabaseAdmin();
  const { data, error } = await db
    .from("admin_users")
    .select("id, email, name, role, avatar_url, created_at, last_login")
    .eq("id", me.userId)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// PATCH — cập nhật profile (name, avatar_url, password)
export async function PATCH(req: NextRequest) {
  const me = await getMe(req);
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, avatar_url, current_password, new_password } = body;

  const updates: Record<string, unknown> = {};

  // Cập nhật tên
  if (name !== undefined) {
    if (!name.trim()) return NextResponse.json({ error: "Tên không được để trống" }, { status: 400 });
    updates.name = name.trim();
  }

  // Cập nhật avatar
  if (avatar_url !== undefined) {
    updates.avatar_url = avatar_url || null;
  }

  // Đổi mật khẩu
  if (new_password) {
    if (!current_password) {
      return NextResponse.json({ error: "Vui lòng nhập mật khẩu hiện tại" }, { status: 400 });
    }
    if (new_password.length < 8) {
      return NextResponse.json({ error: "Mật khẩu mới tối thiểu 8 ký tự" }, { status: 400 });
    }

    const db = supabaseAdmin();
    const { data: user } = await db
      .from("admin_users")
      .select("password_hash")
      .eq("id", me.userId)
      .single();

    if (!user) return NextResponse.json({ error: "Không tìm thấy tài khoản" }, { status: 404 });

    const valid = await verifyPassword(current_password, user.password_hash);
    if (!valid) return NextResponse.json({ error: "Mật khẩu hiện tại không đúng" }, { status: 400 });

    updates.password_hash = await hashPassword(new_password);
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Không có thay đổi nào" }, { status: 400 });
  }

  const db = supabaseAdmin();
  const { data, error } = await db
    .from("admin_users")
    .update(updates)
    .eq("id", me.userId)
    .select("id, email, name, role, avatar_url")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST — upload avatar lên Supabase Storage
export async function POST(req: NextRequest) {
  const me = await getMe(req);
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "Không có file" }, { status: 400 });

  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: "Chỉ hỗ trợ JPG, PNG, WebP" }, { status: 400 });
  }
  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json({ error: "File tối đa 2MB" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() || "jpg";
  const filename = `avatars/admin-${me.userId}-${Date.now()}.${ext}`;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const db = supabaseAdmin();
  const { error: uploadError } = await db.storage
    .from("images")
    .upload(filename, buffer, { contentType: file.type, upsert: true });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${filename}`;
  return NextResponse.json({ url });
}
