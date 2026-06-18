export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const IMAGES_DIR = path.join(process.cwd(), "public", "images");

function checkAuth(req: NextRequest) {
  return req.cookies.get("admin_session")?.value === process.env.ADMIN_SECRET;
}

// POST — nhận file đã nén từ Canvas API phía client, ghi đè bản gốc
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let formData: FormData;
  try { formData = await req.formData(); }
  catch { return NextResponse.json({ error: "Không đọc được form data" }, { status: 400 }); }

  const file = formData.get("file") as File | null;
  const originalName = formData.get("originalName") as string | null;

  if (!file || !originalName) {
    return NextResponse.json({ error: "Thiếu file hoặc originalName" }, { status: 400 });
  }

  // Chỉ cho phép tên file an toàn
  const safeName = path.basename(originalName);
  const destPath = path.join(IMAGES_DIR, safeName);

  if (!fs.existsSync(destPath)) {
    return NextResponse.json({ error: "File gốc không tồn tại" }, { status: 404 });
  }

  const originalSize = fs.statSync(destPath).size;
  const buffer = Buffer.from(await file.arrayBuffer());
  const newSize = buffer.length;

  // Chỉ lưu nếu thực sự nhỏ hơn
  if (newSize >= originalSize) {
    return NextResponse.json({
      skipped: true,
      message: "File nén không nhỏ hơn bản gốc, giữ nguyên.",
      originalSize,
      newSize,
    });
  }

  fs.writeFileSync(destPath, buffer);

  return NextResponse.json({
    success: true,
    originalSize,
    newSize,
    saved: originalSize - newSize,
    savedPercent: Math.round((1 - newSize / originalSize) * 100),
  });
}
