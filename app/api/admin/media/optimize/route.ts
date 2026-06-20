export const dynamic = "force-dynamic";
import { checkAuth } from "@/lib/adminAuth";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const BUCKET = "images";


// POST — nhận file đã nén từ Canvas API phía client, ghi đè lên Supabase Storage
export async function POST(req: NextRequest) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let formData: FormData;
  try { formData = await req.formData(); }
  catch { return NextResponse.json({ error: "Không đọc được form data" }, { status: 400 }); }

  const file = formData.get("file") as File | null;
  const originalName = formData.get("originalName") as string | null;

  if (!file || !originalName) {
    return NextResponse.json({ error: "Thiếu file hoặc originalName" }, { status: 400 });
  }

  const sb = supabaseAdmin();

  // Lấy kích thước file gốc từ Supabase Storage metadata
  const { data: listing } = await sb.storage.from(BUCKET).list("", { search: originalName });
  const originalSize = listing?.find(f => f.name === originalName)?.metadata?.size ?? 0;

  const buffer = await file.arrayBuffer();
  const newSize = buffer.byteLength;

  // Chỉ lưu nếu thực sự nhỏ hơn
  if (originalSize > 0 && newSize >= originalSize) {
    return NextResponse.json({
      skipped: true,
      message: "File nén không nhỏ hơn bản gốc, giữ nguyên.",
      originalSize,
      newSize,
    });
  }

  // Overwrite file trong Supabase Storage
  const { error } = await sb.storage.from(BUCKET).upload(originalName, buffer, {
    contentType: file.type,
    upsert: true,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    success: true,
    originalSize,
    newSize,
    saved: originalSize - newSize,
    savedPercent: originalSize > 0 ? Math.round((1 - newSize / originalSize) * 100) : 0,
  });
}
