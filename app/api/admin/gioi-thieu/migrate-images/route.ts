export const dynamic = "force-dynamic";
import { checkAuth } from "@/lib/adminAuth";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";

const PAGE_KEY  = "page_gioi_thieu";
const BUCKET    = "images";


/** Upload base64 string → Supabase Storage → return public URL */
async function uploadBase64(
  db: ReturnType<typeof supabaseAdmin>,
  base64: string,
  prefix: string
): Promise<string> {
  // Extract mime + raw bytes
  const match = base64.match(/^data:(image\/[a-z+]+);base64,(.+)$/);
  if (!match) throw new Error("Chuỗi base64 không hợp lệ");
  const mime = match[1];
  const ext  = mime.split("/")[1].replace("jpeg", "jpg").replace("svg+xml", "svg");
  const buffer = Buffer.from(match[2], "base64");
  const filename = `${prefix}-${Date.now()}.${ext}`;

  const { error } = await db.storage.from(BUCKET).upload(filename, buffer, {
    contentType: mime,
    upsert: false,
  });
  if (error) throw new Error(error.message);

  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filename}`;
}

export async function POST(req: NextRequest) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = supabaseAdmin();

  // 1. Read current JSON
  const { data, error: readErr } = await db
    .from("site_settings")
    .select("value")
    .eq("key", PAGE_KEY)
    .single();

  if (readErr || !data?.value) {
    return NextResponse.json({ error: "Không tìm thấy dữ liệu trang" }, { status: 404 });
  }

  let page: Record<string, unknown>;
  try { page = JSON.parse(data.value); }
  catch { return NextResponse.json({ error: "JSON không hợp lệ" }, { status: 400 }); }

  const migrated: string[] = [];
  const failed: string[] = [];

  // Helper: convert a single field if it's base64
  const migrateField = async (key: string, prefix: string) => {
    const val = page[key];
    if (typeof val === "string" && val.startsWith("data:image/")) {
      try {
        page[key] = await uploadBase64(db, val, prefix);
        migrated.push(key);
      } catch (e) {
        failed.push(`${key}: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
  };

  // 2. Migrate top-level image fields
  await migrateField("hero_avatar_url",  "avatar");
  await migrateField("story_image_url",  "story");

  // 3. Migrate values[].image_url
  if (Array.isArray(page.values)) {
    const values = page.values as Array<Record<string, unknown>>;
    for (let i = 0; i < values.length; i++) {
      const v = values[i];
      if (typeof v.image_url === "string" && v.image_url.startsWith("data:image/")) {
        try {
          v.image_url = await uploadBase64(db, v.image_url, `value-${i}`);
          migrated.push(`values[${i}].image_url`);
        } catch (e) {
          failed.push(`values[${i}].image_url: ${e instanceof Error ? e.message : String(e)}`);
        }
      }
    }
  }

  if (migrated.length === 0 && failed.length === 0) {
    return NextResponse.json({ message: "Không có ảnh base64 nào cần migrate." });
  }

  // 4. Save updated JSON back
  const { error: writeErr } = await db
    .from("site_settings")
    .upsert({ key: PAGE_KEY, value: JSON.stringify(page) }, { onConflict: "key" });

  if (writeErr) return NextResponse.json({ error: writeErr.message }, { status: 500 });

  revalidatePath("/gioi-thieu");

  return NextResponse.json({
    success: true,
    migrated,
    failed,
    message: `✅ Đã chuyển ${migrated.length} ảnh sang Supabase Storage.${failed.length > 0 ? ` ⚠️ ${failed.length} lỗi.` : ""}`,
  });
}
