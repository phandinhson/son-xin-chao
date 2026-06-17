"use client";
import { useEffect, useState } from "react";

type Summary = {
  total_views: number;
  total_unique: number;
  today_views: number;
  today_unique: number;
  week_views: number;
  week_unique: number;
  month_views: number;
  month_unique: number;
};

type DailyData = { date: string; views: number; unique: number };
type TopPage   = { page: string; views: number };

type AnalyticsData = {
  summary: Summary;
  daily: DailyData[];
  topPages: TopPage[];
};

function fmt(n: number) {
  return n.toLocaleString("vi-VN");
}

function shortDate(iso: string) {
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

// SVG Bar + Line Chart
function Chart({ data, mode }: { data: DailyData[]; mode: "views" | "unique" }) {
  const values = data.map((d) => (mode === "views" ? d.views : d.unique));
  const maxVal = Math.max(...values, 1);
  const W = 800, H = 180, PAD = 8;
  const barW = (W - PAD * 2) / data.length - 2;

  // Hiển thị mỗi 5 ngày 1 label
  return (
    <svg viewBox={`0 0 ${W} ${H + 24}`} className="w-full" style={{ overflow: "visible" }}>
      {/* Grid lines */}
      {[0.25, 0.5, 0.75, 1].map((ratio) => (
        <line key={ratio}
          x1={PAD} x2={W - PAD}
          y1={H - H * ratio} y2={H - H * ratio}
          stroke="rgba(255,255,255,0.05)" strokeWidth="1"
        />
      ))}

      {/* Bars */}
      {data.map((d, i) => {
        const x = PAD + i * ((W - PAD * 2) / data.length) + 1;
        const val = mode === "views" ? d.views : d.unique;
        const bh  = val === 0 ? 2 : Math.max(4, (val / maxVal) * H);
        const color = mode === "views" ? "#3b82f6" : "#8b5cf6";
        return (
          <g key={i}>
            <rect
              x={x} y={H - bh} width={barW} height={bh}
              rx="3" fill={color} opacity="0.8"
            />
            {/* Label mỗi 5 ngày */}
            {i % 5 === 0 && (
              <text x={x + barW / 2} y={H + 16} textAnchor="middle"
                fill="#6b7280" fontSize="10">
                {shortDate(d.date)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartMode, setChartMode] = useState<"views" | "unique">("views");

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/analytics");
    if (res.ok) setData(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const s = data?.summary;

  const statCards = [
    { label: "Hôm nay",   views: s?.today_views,  unique: s?.today_unique,  icon: "📅", color: "from-blue-600/20 to-cyan-600/10",    border: "border-blue-500/20" },
    { label: "7 ngày",    views: s?.week_views,   unique: s?.week_unique,   icon: "📆", color: "from-violet-600/20 to-pink-600/10",  border: "border-violet-500/20" },
    { label: "30 ngày",   views: s?.month_views,  unique: s?.month_unique,  icon: "🗓️", color: "from-amber-600/20 to-orange-600/10", border: "border-amber-500/20" },
    { label: "Tổng cộng", views: s?.total_views,  unique: s?.total_unique,  icon: "📊", color: "from-green-600/20 to-emerald-600/10","border": "border-green-500/20" },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Phân tích truy cập</h1>
          <p className="text-gray-400 text-sm mt-1">Lượt xem trang & Số người truy cập theo thời gian thực</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 hover:text-white text-sm transition-all"
        >
          🔄 Làm mới
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((card) => (
              <div key={card.label}
                className={`p-5 rounded-2xl bg-gradient-to-br ${card.color} border ${card.border}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl">{card.icon}</span>
                  <span className="text-xs text-gray-500 font-medium">{card.label}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">{fmt(card.views ?? 0)}</span>
                    <span className="text-xs text-gray-500">lượt xem</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-semibold text-gray-300">{fmt(card.unique ?? 0)}</span>
                    <span className="text-xs text-gray-500">người</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold">30 ngày gần nhất</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setChartMode("views")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    chartMode === "views"
                      ? "bg-blue-600 text-white"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  📈 Lượt xem
                </button>
                <button
                  onClick={() => setChartMode("unique")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    chartMode === "unique"
                      ? "bg-violet-600 text-white"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  👤 Người dùng
                </button>
              </div>
            </div>

            {data?.daily && data.daily.length > 0 ? (
              <Chart data={data.daily} mode={chartMode} />
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-600">
                Chưa có dữ liệu — sẽ hiện sau khi có người truy cập website
              </div>
            )}
          </div>

          {/* Top Pages */}
          {data?.topPages && data.topPages.length > 0 && (
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-white font-semibold mb-5">Trang được xem nhiều nhất <span className="text-gray-500 text-sm font-normal">(30 ngày)</span></h3>
              <div className="space-y-3">
                {data.topPages.map((p, i) => {
                  const maxViews = data.topPages[0].views;
                  const pct = Math.round((p.views / maxViews) * 100);
                  return (
                    <div key={i} className="flex items-center gap-4">
                      <span className="text-gray-600 text-xs w-4 text-right flex-shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-gray-300 text-sm font-mono truncate">
                            {p.page === "/" ? "/ (Trang chủ)" : p.page}
                          </span>
                          <span className="text-blue-400 text-sm font-bold ml-4 flex-shrink-0">
                            {fmt(p.views)}
                          </span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
