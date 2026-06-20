export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyAdminToken, hashPassword } from "@/lib/auth";

async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return null;
  const payload = await verifyAdminToken(token);
  if (!payload || payload.role !== "admin") return null;
  return payload;
}

// GET — danh sách tất cả users (admin only)
export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Không có quyền" }, { status: 403 });
  }
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("admin_users")
    .select("id, email, name, role, active, created_at, last_login")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST — tạo user mới (admin only)
export async function POST(req: NextRequest) {
  const me = await requireAdmin(req);
  if (!me) return NextResponse.json({ error: "Không có quyền" }, { status: 403 });

  const { email, password, name, role } = await req.json();
  if (!email || !password || !name) {
    return NextResponse.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 });
  }
  if (!["admin", "user"].includes(role)) {
    return NextResponse.json({ error: "Role không hợp lệ" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Mật khẩu tối thiểu 8 ký tự" }, { status: 400 });
  }

  const password_hash = await hashPassword(password);
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("admin_users")
    .insert({ email: email.toLowerCase().trim(), password_hash, name, role })
    .select("id, email, name, role, active, created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Email này đã tồn tại" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// PATCH — cập nhật user (admin only)
export async function PATCH(req: NextRequest) {
  const me = await requireAdmin(req);
  if (!me) return NextResponse.json({ error: "Không có quyền" }, { status: 403 });

  const { id, name, role, active, password } = await req.json();
  if (!id) return NextResponse.json({ error: "Thiếu id" }, { status: 400 });

  // Không cho phép tự hạ quyền chính mình
  if (id === me.userId && role === "user") {
    return NextResponse.json({ error: "Không thể tự hạ quyền mình" }, { status: 400 });
  }
  // Không cho phép tự vô hiệu hoá chính mình
  if (id === me.userId && active === false) {
    return NextResponse.json({ error: "Không thể tự vô hiệu hoá mình" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = name;
  if (role !== undefined) updates.role = role;
  if (active !== undefined) updates.active = active;
  if (password) {
    if (password.length < 8) {
      return NextResponse.json({ error: "Mật khẩu tối thiểu 8 ký tự" }, { status: 400 });
    }
    updates.password_hash = await hashPassword(password);
  }

  const db = supabaseAdmin();
  const { data, error } = await db
    .from("admin_users")
    .update(updates)
    .eq("id", id)
    .select("id, email, name, role, active, created_at, last_login")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE — xoá user (admin only, không xoá chính mình)
export async function DELETE(req: NextRequest) {
  const me = await requireAdmin(req);
  if (!me) return NextResponse.json({ error: "Không có quyền" }, { status: 403 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Thiếu id" }, { status: 400 });
  if (id === me.userId) {
    return NextResponse.json({ error: "Không thể xoá tài khoản chính mình" }, { status: 400 });
  }

  // Đảm bảo còn ít nhất 1 admin
  const db = supabaseAdmin();
  const { data: admins } = await db
    .from("admin_users")
    .select("id")
    .eq("role", "admin")
    .eq("active", true);

  const targetIsAdmin = admins?.some((a) => a.id !== id) === false;
  if (targetIsAdmin && admins && admins.length <= 1) {
    return NextResponse.json({ error: "Phải có ít nhất 1 admin" }, { status: 400 });
  }

  const { error } = await db.from("admin_users").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
