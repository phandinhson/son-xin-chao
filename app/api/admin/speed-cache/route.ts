export const dynamic = "force-dynamic";
import { checkAuth } from "@/lib/adminAuth";
import { NextRequest, NextResponse } from "next/server";


// POST /api/admin/speed-cache
// body: { action: "purge_all" | "purge_pages", urls?: string[] }
export async function POST(req: NextRequest) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { action, urls } = body;

  const zoneId = process.env.CF_ZONE_ID;
  const apiToken = process.env.CF_API_TOKEN;

  if (!zoneId || !apiToken) {
    return NextResponse.json(
      { error: "Chưa cấu hình CF_ZONE_ID hoặc CF_API_TOKEN trong environment variables." },
      { status: 400 }
    );
  }

  try {
    let payload: Record<string, unknown>;

    if (action === "purge_all") {
      payload = { purge_everything: true };
    } else if (action === "purge_pages" && Array.isArray(urls) && urls.length > 0) {
      payload = { files: urls };
    } else {
      return NextResponse.json({ error: "Action không hợp lệ." }, { status: 400 });
    }

    const cfRes = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const cfData = await cfRes.json();

    if (!cfData.success) {
      const errMsg = cfData.errors?.[0]?.message || "Cloudflare API lỗi";
      return NextResponse.json({ error: errMsg }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Cache đã được xóa thành công!" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Lỗi không xác định";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
