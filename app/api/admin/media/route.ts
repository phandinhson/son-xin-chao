export const dynamic = "force-dynamic";
import { checkAuth } from "@/lib/adminAuth";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const BUCKET = "images";
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const MAX_SIZE_MB = 5;


function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getPublicUrl(filename: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filename}`;
}

// GET — list all images from Supabase Storage
export async function GET(req: NextRequest) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sb = supabaseAdmin();
  const { data, error } = await sb.storage.from(BUCKET).list("", {
    limit: 200,
    sortBy: { column: "created_at", order: "desc" },
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const files = (data || [])
    .filter(f => f.name && /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f.name))
    .map(f => ({
      name: f.name,
      url: getPublicUrl(f.name),
      size: f.metadata?.size ?? 0,
      sizeLabel: formatSize(f.metadata?.size ?? 0),
      ext: (f.name.split(".").pop() ?? "").toLowerCase(),
      uploadedAt: f.created_at ?? new Date().toISOString(),
    }));

  return NextResponse.json(files);
}

// POST — upload image(s) to Supabase Storage
export async function POST(req: NextRequest) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Không thể đọc form data" }, { status: 400 });
  }

  const files = formData.getAll("files") as File[];
  if (!files || files.length === 0) {
    return NextResponse.json({ error: "Không có file nào được gửi lên" }, { status: 400 });
  }

  const sb = supabaseAdmin();
  const uploaded: string[] = [];
  const urls: string[] = [];
  const errors: string[] = [];

  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      errors.push(`${file.name}: định dạng không hỗ trợ`);
      continue;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      errors.push(`${file.name}: vượt quá ${MAX_SIZE_MB}MB`);
      continue;
    }

    // Sanitize filename
    const ext = (file.name.split(".").pop() ?? "").toLowerCase();
    const baseName = file.name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9_-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    const finalName = `${baseName}-${Date.now()}.${ext}`;
    const buffer = await file.arrayBuffer();

    const { error } = await sb.storage.from(BUCKET).upload(finalName, buffer, {
      contentType: file.type,
      upsert: false,
    });

    if (error) {
      errors.push(`${file.name}: ${error.message}`);
    } else {
      uploaded.push(finalName);
      urls.push(getPublicUrl(finalName));
    }
  }

  return NextResponse.json({ uploaded, urls, errors });
}

// DELETE — remove image from Supabase Storage
export async function DELETE(req: NextRequest) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { filename?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body không hợp lệ" }, { status: 400 });
  }

  const { filename } = body;
  if (!filename || typeof filename !== "string") {
    return NextResponse.json({ error: "Thiếu tên file" }, { status: 400 });
  }

  const sb = supabaseAdmin();
  const { error } = await sb.storage.from(BUCKET).remove([filename]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, deleted: filename });
}
