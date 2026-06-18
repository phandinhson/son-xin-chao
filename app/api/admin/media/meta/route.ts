export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function checkAuth(req: NextRequest) {
  return req.cookies.get("admin_session")?.value === process.env.ADMIN_SECRET;
}

type ImageMeta = {
  title?: string;
  alt?: string;
  description?: string;
  tags?: string[];
  focalX?: number;
  focalY?: number;
  updatedAt?: string;
};

// GET — lấy meta của 1 file hoặc tất cả (từ Supabase DB)
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const filename = req.nextUrl.searchParams.get("filename");
  const sb = supabaseAdmin();

  if (filename) {
    const { data } = await sb.from("image_meta").select("*").eq("filename", filename).single();
    if (!data) return NextResponse.json({});
    return NextResponse.json({
      title: data.title,
      alt: data.alt,
      description: data.description,
      tags: data.tags,
      focalX: data.focal_x,
      focalY: data.focal_y,
      updatedAt: data.updated_at,
    });
  }

  const { data } = await sb.from("image_meta").select("*");
  const result: Record<string, ImageMeta> = {};
  for (const row of data ?? []) {
    result[row.filename] = {
      title: row.title,
      alt: row.alt,
      description: row.description,
      tags: row.tags,
      focalX: row.focal_x,
      focalY: row.focal_y,
      updatedAt: row.updated_at,
    };
  }
  return NextResponse.json(result);
}

// PUT — lưu meta cho 1 file (upsert vào Supabase DB)
export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { filename?: string } & ImageMeta;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body không hợp lệ" }, { status: 400 });
  }

  const { filename, title, alt, description, tags, focalX, focalY } = body;
  if (!filename) return NextResponse.json({ error: "Thiếu filename" }, { status: 400 });

  const sb = supabaseAdmin();
  const { data, error } = await sb.from("image_meta").upsert({
    filename,
    ...(title !== undefined && { title }),
    ...(alt !== undefined && { alt }),
    ...(description !== undefined && { description }),
    ...(tags !== undefined && { tags }),
    ...(focalX !== undefined && { focal_x: focalX }),
    ...(focalY !== undefined && { focal_y: focalY }),
    updated_at: new Date().toISOString(),
  }, { onConflict: "filename" }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE — xóa meta của 1 file (từ Supabase DB)
export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { filename?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body không hợp lệ" }, { status: 400 });
  }

  const { filename } = body;
  if (!filename) return NextResponse.json({ error: "Thiếu filename" }, { status: 400 });

  const sb = supabaseAdmin();
  const { error } = await sb.from("image_meta").delete().eq("filename", filename);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
