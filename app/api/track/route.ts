export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { createHash } from "crypto";

export async function POST(request: Request) {
  try {
    const { page, referrer } = await request.json();

    // Lấy IP và hash để đếm unique visitor (không lưu IP thật)
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    const ip_hash = createHash("sha256").update(ip + new Date().toDateString()).digest("hex").slice(0, 16);

    const user_agent = request.headers.get("user-agent") || "";

    // Bỏ qua bot/crawler
    const isBot = /bot|crawler|spider|crawling|googlebot|bingbot|facebookexternalhit/i.test(user_agent);
    if (isBot) return NextResponse.json({ ok: true });

    const db = supabaseAdmin();
    await db.from("page_views").insert([{
      page: page || "/",
      referrer: referrer || "",
      ip_hash,
      user_agent: user_agent.slice(0, 200),
    }]);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
