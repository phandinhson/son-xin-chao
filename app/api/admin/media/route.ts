export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const IMAGES_DIR = path.join(process.cwd(), "public", "images");
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const MAX_SIZE_MB = 5;

function checkAuth(req: NextRequest) {
  const session = req.cookies.get("admin_session")?.value;
  return session === process.env.ADMIN_SECRET;
}

function ensureDir() {
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }
}

function getExt(filename: string) {
  return path.extname(filename).toLowerCase().replace(".", "");
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// GET — list all images
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  ensureDir();

  const files = fs.readdirSync(IMAGES_DIR)
    .filter(f => !f.startsWith(".") && /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f))
    .map(f => {
      const filePath = path.join(IMAGES_DIR, f);
      const stat = fs.statSync(filePath);
      return {
        name: f,
        url: `/images/${f}`,
        size: stat.size,
        sizeLabel: formatSize(stat.size),
        ext: getExt(f),
        uploadedAt: stat.mtime.toISOString(),
      };
    })
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

  return NextResponse.json(files);
}

// POST — upload image
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  ensureDir();

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Không thể đọc form data" }, { status: 400 });
  }

  const uploaded: string[] = [];
  const errors: string[] = [];

  const files = formData.getAll("files") as File[];
  if (!files || files.length === 0) {
    return NextResponse.json({ error: "Không có file nào được gửi lên" }, { status: 400 });
  }

  for (const file of files) {
    // Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      errors.push(`${file.name}: định dạng không hỗ trợ`);
      continue;
    }

    // Validate size
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      errors.push(`${file.name}: vượt quá ${MAX_SIZE_MB}MB`);
      continue;
    }

    // Build safe filename: keep original but sanitize
    const originalName = file.name;
    const ext = path.extname(originalName);
    const baseName = path.basename(originalName, ext)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9_-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    // Deduplicate: append timestamp if file exists
    let finalName = `${baseName}${ext.toLowerCase()}`;
    if (fs.existsSync(path.join(IMAGES_DIR, finalName))) {
      finalName = `${baseName}-${Date.now()}${ext.toLowerCase()}`;
    }

    const destPath = path.join(IMAGES_DIR, finalName);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(destPath, buffer);

    uploaded.push(finalName);
  }

  return NextResponse.json({ uploaded, errors });
}

// DELETE — xóa file
export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { filename } = await req.json();
  if (!filename || typeof filename !== "string") {
    return NextResponse.json({ error: "Thiếu tên file" }, { status: 400 });
  }

  // Prevent path traversal
  const safeName = path.basename(filename);
  const filePath = path.join(IMAGES_DIR, safeName);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File không tồn tại" }, { status: 404 });
  }

  fs.unlinkSync(filePath);
  return NextResponse.json({ success: true, deleted: safeName });
}
