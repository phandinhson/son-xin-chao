export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const IMAGES_DIR = path.join(process.cwd(), "public", "images");
const META_FILE = path.join(IMAGES_DIR, "_meta.json");

function checkAuth(req: NextRequest) {
  return req.cookies.get("admin_session")?.value === process.env.ADMIN_SECRET;
}

function readMeta(): Record<string, ImageMeta> {
  try {
    if (fs.existsSync(META_FILE)) {
      return JSON.parse(fs.readFileSync(META_FILE, "utf-8"));
    }
  } catch { /* ignore */ }
  return {};
}

function writeMeta(data: Record<string, ImageMeta>) {
  fs.writeFileSync(META_FILE, JSON.stringify(data, null, 2), "utf-8");
}

type ImageMeta = {
  title?: string;
  alt?: string;
  description?: string;
  tags?: string[];
  focalX?: number; // 0-100 (%)
  focalY?: number; // 0-100 (%)
  updatedAt?: string;
};

// GET — lấy meta của 1 file hoặc tất cả
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const filename = req.nextUrl.searchParams.get("filename");
  const meta = readMeta();
  if (filename) {
    return NextResponse.json(meta[filename] ?? {});
  }
  return NextResponse.json(meta);
}

// PUT — lưu meta cho 1 file
export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as { filename: string } & ImageMeta;
  const { filename, title, alt, description, tags, focalX, focalY } = body;

  if (!filename) return NextResponse.json({ error: "Thiếu filename" }, { status: 400 });

  const meta = readMeta();
  meta[filename] = {
    ...(meta[filename] ?? {}),
    ...(title !== undefined && { title }),
    ...(alt !== undefined && { alt }),
    ...(description !== undefined && { description }),
    ...(tags !== undefined && { tags }),
    ...(focalX !== undefined && { focalX }),
    ...(focalY !== undefined && { focalY }),
    updatedAt: new Date().toISOString(),
  };
  writeMeta(meta);
  return NextResponse.json(meta[filename]);
}

// DELETE — xóa meta của 1 file
export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { filename } = await req.json();
  if (!filename) return NextResponse.json({ error: "Thiếu filename" }, { status: 400 });
  const meta = readMeta();
  delete meta[filename];
  writeMeta(meta);
  return NextResponse.json({ success: true });
}
