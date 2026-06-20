/**
 * lib/adminAuth.ts
 * Shared auth helper cho tất cả /api/admin/* routes.
 * Thay thế checkAuth cũ (so sánh ADMIN_SECRET) bằng JWT verification.
 */
import { NextRequest } from "next/server";
import { verifyAdminToken, type AdminRole } from "@/lib/auth";

/** Trả về true nếu request có JWT hợp lệ */
export async function checkAuth(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return false;
  const payload = await verifyAdminToken(token);
  return payload !== null;
}

/** Trả về payload nếu hợp lệ, null nếu không */
export async function getAuthPayload(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

/** Kiểm tra role cụ thể */
export async function checkRole(req: NextRequest, role: AdminRole): Promise<boolean> {
  const payload = await getAuthPayload(req);
  return payload?.role === role;
}
