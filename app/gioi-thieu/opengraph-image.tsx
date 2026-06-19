import { ImageResponse } from "next/og";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const revalidate = 3600; // 1 hour
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function getPageData() {
  try {
    const db = supabaseAdmin();
    const { data } = await db
      .from("site_settings")
      .select("value")
      .eq("key", "page_gioi_thieu")
      .single();
    if (data?.value) return JSON.parse(data.value);
  } catch {}
  return null;
}

export default async function OGImage() {
  const cms = await getPageData();

  const name     = String(cms?.hero_name      ?? "Phan Đình Sơn");
  const jobTitle = String(cms?.hero_job_title ?? "Chuyên gia SEO · Google Ads · Facebook Ads · Website");
  const location = String(cms?.hero_location  ?? "Long Thành · Đồng Nai · Việt Nam");
  const avatarUrl = String(cms?.hero_avatar_url ?? "");

  const statYears    = String(cms?.stat_years    ?? "5+");
  const statProjects = String(cms?.stat_projects ?? "150+");
  const statClients  = String(cms?.stat_clients  ?? "80+");

  // Pre-compute arrays OUTSIDE JSX so Satori does not choke on inline array literals
  const skills: string[] = ["SEO Technical", "Google Ads", "Facebook Ads", "Website"];
  const stats: { v: string; l: string; c: string }[] = [
    { v: statYears,    l: "Năm kinh nghiệm", c: "#2563eb" },
    { v: statProjects, l: "Dự án",            c: "#7c3aed" },
    { v: statClients,  l: "Khách hàng",       c: "#059669" },
  ];

  // Fetch avatar and convert to base64 for ImageResponse
  let avatarSrc: string | null = null;
  if (avatarUrl && !avatarUrl.startsWith("data:")) {
    try {
      const res = await fetch(avatarUrl);
      if (res.ok) {
        const buf  = await res.arrayBuffer();
        const b64  = Buffer.from(buf).toString("base64");
        const mime = res.headers.get("content-type") ?? "image/jpeg";
        avatarSrc  = `data:${mime};base64,${b64}`;
      }
    } catch {}
  } else if (avatarUrl.startsWith("data:")) {
    avatarSrc = avatarUrl;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          background: "linear-gradient(135deg, #eef4ff 0%, #f5f0ff 50%, #fff0f7 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative blob — top right */}
        <div style={{
          position: "absolute", top: -100, right: -100,
          width: 450, height: 450, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(167,139,250,0.22) 0%, transparent 70%)",
          display: "flex",
        }} />
        {/* Decorative blob — bottom left */}
        <div style={{
          position: "absolute", bottom: -80, left: -80,
          width: 380, height: 380, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(96,165,250,0.18) 0%, transparent 70%)",
          display: "flex",
        }} />

        {/* LEFT PANEL */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", width: 340,
          padding: "60px 40px 60px 60px", gap: 20, flexShrink: 0,
        }}>
          {/* Avatar */}
          <div style={{
            width: 200, height: 200, borderRadius: "50%", overflow: "hidden",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 20px 60px rgba(99,102,241,0.28)",
            border: "5px solid white",
          }}>
            {avatarSrc ? (
              <img src={avatarSrc} alt={name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: 80, fontWeight: 900, color: "white" }}>S</span>
            )}
          </div>

          {/* Location badge */}
          <div style={{
            display: "flex", alignItems: "center",
            background: "#eff6ff", border: "1px solid #bfdbfe",
            borderRadius: 999, padding: "7px 16px",
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#2563eb" }}>
              {location}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          width: 1, margin: "60px 0", flexShrink: 0,
          background: "linear-gradient(to bottom, transparent, #cbd5e1 40%, #cbd5e1 60%, transparent)",
          display: "flex",
        }} />

        {/* RIGHT PANEL */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          justifyContent: "center", padding: "60px 60px 60px 50px", gap: 14,
        }}>
          {/* Greeting */}
          <div style={{ fontSize: 18, color: "#64748b", fontWeight: 500 }}>
            Xin chao! Minh la
          </div>

          {/* Name */}
          <div style={{
            fontSize: 54, fontWeight: 900, lineHeight: 1.1,
            color: "#1e40af", letterSpacing: "-1px",
          }}>
            {name}
          </div>

          {/* Job title */}
          <div style={{ fontSize: 18, color: "#4b5563", fontWeight: 600, lineHeight: 1.5 }}>
            {jobTitle}
          </div>

          {/* Skill tags */}
          <div style={{ display: "flex", flexDirection: "row", gap: 8, marginTop: 4 }}>
            {skills.map((s) => (
              <div key={s} style={{
                background: "white", border: "1px solid #e2e8f0",
                borderRadius: 999, padding: "5px 14px",
                fontSize: 13, fontWeight: 600, color: "#374151",
                boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
                display: "flex",
              }}>{s}</div>
            ))}
          </div>

          {/* Stats */}
          <div style={{
            display: "flex", flexDirection: "row", gap: 32, marginTop: 8,
            paddingTop: 16, borderTop: "1px solid #e2e8f0",
          }}>
            {stats.map((s) => (
              <div key={s.l} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontSize: 32, fontWeight: 900, color: s.c, lineHeight: 1 }}>
                  {s.v}
                </span>
                <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>
                  {s.l}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom accent bar */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 6,
          background: "linear-gradient(90deg, #2563eb, #7c3aed, #db2777)",
          display: "flex",
        }} />

        {/* Domain watermark */}
        <div style={{
          position: "absolute", top: 22, right: 28,
          fontSize: 13, color: "#94a3b8", fontWeight: 600,
          display: "flex",
        }}>
          sonxinchao.com
        </div>
      </div>
    ),
    { ...size }
  );
}
