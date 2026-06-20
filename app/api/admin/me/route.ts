export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";

// GET /api/admin/me — trả về thông tin user đang đăng nhập
export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.json(null, { status: 401 });

  const payload = await verifyAdminToken(token);
  if (!payload) return NextResponse.json(null, { status: 401 });

  return NextResponse.json({
    userId: payload.userId,
    email: payload.email,
    name: payload.name,
    role: payload.role,
  });
}
