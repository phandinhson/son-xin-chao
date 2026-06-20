export const dynamic = "force-dynamic";
import { checkAuth } from "@/lib/adminAuth";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";


export async function GET(req: NextRequest) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = supabaseAdmin();
  const now = new Date();

  // Mốc thời gian
  const today    = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const week     = new Date(now.getTime() - 7  * 24 * 60 * 60 * 1000).toISOString();
  const month    = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  // Tổng hợp song song
  const [allRows, todayRows, weekRows, monthRows] = await Promise.all([
    db.from("page_views").select("id, page, ip_hash, created_at", { count: "exact" }),
    db.from("page_views").select("id, ip_hash").gte("created_at", today),
    db.from("page_views").select("id, ip_hash").gte("created_at", week),
    db.from("page_views").select("id, ip_hash, page, created_at").gte("created_at", month),
  ]);

  const allData    = allRows.data    || [];
  const todayData  = todayRows.data  || [];
  const weekData   = weekRows.data   || [];
  const monthData  = monthRows.data  || [];

  // Unique visitors = số ip_hash duy nhất
  const uniqueAll   = new Set(allData.map((r) => r.ip_hash)).size;
  const uniqueToday = new Set(todayData.map((r) => r.ip_hash)).size;
  const uniqueWeek  = new Set(weekData.map((r) => r.ip_hash)).size;
  const uniqueMonth = new Set(monthData.map((r) => r.ip_hash)).size;

  // Chart 30 ngày: views & unique mỗi ngày
  const dailyMap: Record<string, { views: number; ips: Set<string> }> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    dailyMap[key] = { views: 0, ips: new Set() };
  }
  monthData.forEach((r) => {
    const key = r.created_at.slice(0, 10);
    if (dailyMap[key]) {
      dailyMap[key].views++;
      dailyMap[key].ips.add(r.ip_hash);
    }
  });
  const daily = Object.entries(dailyMap).map(([date, v]) => ({
    date,
    views: v.views,
    unique: v.ips.size,
  }));

  // Top pages (30 ngày)
  const pageCount: Record<string, number> = {};
  monthData.forEach((r) => {
    pageCount[r.page] = (pageCount[r.page] || 0) + 1;
  });
  const topPages = Object.entries(pageCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([page, views]) => ({ page, views }));

  return NextResponse.json({
    summary: {
      total_views:    allRows.count  || 0,
      total_unique:   uniqueAll,
      today_views:    todayData.length,
      today_unique:   uniqueToday,
      week_views:     weekData.length,
      week_unique:    uniqueWeek,
      month_views:    monthData.length,
      month_unique:   uniqueMonth,
    },
    daily,
    topPages,
  });
}
