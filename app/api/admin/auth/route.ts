export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { signAdminToken, verifyPassword } from "@/lib/auth";

// POST /api/admin/auth — đăng nhập
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Thiếu email hoặc mật khẩu" }, { status: 400 });
    }

    const db = supabaseAdmin();
    const { data: user, error } = await db
      .from("admin_users")
      .select("id, email, name, role, password_hash, active")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (error || !user || !user.active) {
      return NextResponse.json({ error: "Email hoặc mật khẩu không đúng" }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: "Email hoặc mật khẩu không đúng" }, { status: 401 });
    }

    // Tạo JWT
    const token = await signAdminToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "admin" | "user",
    });

    // Cập nhật last_login (không block response)
    db.from("admin_users")
      .update({ last_login: new Date().toISOString() })
      .eq("id", user.id)
      .then(() => {});

    const response = NextResponse.json({ success: true, role: user.role, name: user.name });
    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "lax",
    });
    return response;
  } catch (err) {
    console.error("[auth] login error:", err);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// DELETE /api/admin/auth — đăng xuất
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_session", "", { maxAge: 0, path: "/" });
  return response;
}
