/*import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const exclude  = searchParams.get("exclude");   // slug bài hiện tại (để loại khỏi related)
  const limit    = Math.min(parseInt(searchParams.get("limit") || "100"), 50);

  const db = supabaseAdmin();
  let query = db
    .from("posts")
    .select("id, title, slug, excerpt, cover_image, created_at, category")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (category) query = query.eq("category", category);
  if (exclude)  query = query.neq("slug", exclude);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message, code: error.code }, { status: 500 });
  return NextResponse.json(data || [], {
    headers: {
      "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
    },
  });
}*/
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category")?.trim();
    const exclude  = searchParams.get("exclude")?.trim();
    
    // Ép kiểu chuẩn chỉnh, tránh trường hợp limit gửi lên là NaN hoặc số âm
    const parsedLimit = parseInt(searchParams.get("limit") || "10", 10);
    const limit = isNaN(parsedLimit) ? 10 : Math.max(1, Math.min(parsedLimit, 50));

    const db = supabaseAdmin();
    
    // Khởi tạo query cơ bản
    let query = db
      .from("posts")
      .select("id, title, slug, excerpt, cover_image, created_at, category")
      .eq("status", "published");

    // Áp dụng điều kiện lọc (chỉ lọc nếu có dữ liệu hợp lệ)
    if (category) {
      query = query.eq("category", category);
    }
    if (exclude) {
      query = query.neq("slug", exclude);
    }

    // Sắp xếp và giới hạn kết quả (Đảm bảo các trường này khớp với INDEX đã tạo ở Bước 1)
    query = query.order("created_at", { ascending: false }).limit(limit);

    const { data, error } = await query;

    if (error) {
      console.error("Supabase Error:", error); // Log ra server để dễ debug
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

    // Trả về kết quả kèm Cache-Control
    return NextResponse.json(data || [], {
      headers: {
        // s-maxage=600 (10 phút trên CDN), stale-while-revalidate=1800 (30 phút phục vụ cũ trong lúc chờ tải mới)
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1800",
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  }
}