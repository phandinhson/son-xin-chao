/*export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("posts")
    .select("*")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "Pragma": "no-cache",
    },
  });
}*/
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// BỎ hoàn toàn force-dynamic. Thay vào đó, cho phép Next.js cache tĩnh (ISR)
export const revalidate = 3600; // Tự động cập nhật lại bài viết sau mỗi 1 tiếng (3600 giây) nếu có lượt truy cập mới

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const db = supabaseAdmin();
    
    // TỐI ƯU: Chỉ select những cột thực sự cần thiết để hiển thị trang chi tiết
    // Tránh dùng select("*") nếu bảng posts của bạn có cột nội dung (content) quá dài.
    const { data, error } = await db
      .from("posts")
      .select("id, title, slug, content, excerpt, cover_image, created_at, category, status")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(data, {
      headers: {
        // Cho phép CDN cache bài viết này trong 10 phút, và giữ bản cũ tối đa 1 tiếng trong lúc revalidate ngầm
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
