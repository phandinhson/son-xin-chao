import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// No dynamic data fetch — fully static OG image to avoid Satori prerender errors
export default function OGImage() {
  const skills = ["SEO Technical", "Google Ads", "Facebook Ads", "Website"];

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "row",
          background: "linear-gradient(135deg, #eef4ff 0%, #f5f0ff 50%, #fff0f7 100%)",
        }}
      >
        {/* LEFT PANEL */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: 340,
            padding: "60px 40px 60px 60px",
            gap: 20,
            flexShrink: 0,
          }}
        >
          {/* Avatar circle */}
          <div
            style={{
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "5px solid white",
            }}
          >
            <span style={{ fontSize: 72, fontWeight: 900, color: "white" }}>S</span>
          </div>

          {/* Location */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: 999,
              padding: "8px 16px",
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: "#2563eb" }}>
              Long Thanh - Dong Nai - Viet Nam
            </span>
          </div>
        </div>

        {/* DIVIDER */}
        <div
          style={{
            width: 1,
            alignSelf: "stretch",
            margin: "60px 0",
            background: "#cbd5e1",
            display: "flex",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 1, color: "transparent" }}> </span>
        </div>

        {/* RIGHT PANEL */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px 60px 60px 50px",
            gap: 14,
          }}
        >
          <div style={{ fontSize: 18, color: "#64748b", fontWeight: 500 }}>
            Xin chao! Minh la
          </div>

          <div
            style={{
              fontSize: 54,
              fontWeight: 900,
              color: "#1e40af",
              lineHeight: 1.1,
            }}
          >
            Phan Dinh Son
          </div>

          <div style={{ fontSize: 18, color: "#4b5563", fontWeight: 600 }}>
            Chuyen gia SEO · Google Ads · Facebook Ads · Website
          </div>

          {/* Skills */}
          <div style={{ display: "flex", flexDirection: "row", gap: 8, marginTop: 4 }}>
            {skills.map((s) => (
              <div
                key={s}
                style={{
                  background: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: 999,
                  padding: "5px 14px",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#374151",
                  display: "flex",
                }}
              >
                {s}
              </div>
            ))}
          </div>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 32,
              marginTop: 8,
              paddingTop: 16,
              borderTop: "1px solid #e2e8f0",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 32, fontWeight: 900, color: "#2563eb" }}>5+</span>
              <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>Nam kinh nghiem</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 32, fontWeight: 900, color: "#7c3aed" }}>150+</span>
              <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>Du an</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 32, fontWeight: 900, color: "#059669" }}>80+</span>
              <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>Khach hang</span>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "linear-gradient(90deg, #2563eb, #7c3aed, #db2777)",
            display: "flex",
          }}
        >
          <span style={{ fontSize: 1, color: "transparent" }}> </span>
        </div>

        {/* DOMAIN */}
        <div
          style={{
            position: "absolute",
            top: 22,
            right: 28,
            fontSize: 13,
            color: "#94a3b8",
            fontWeight: 600,
            display: "flex",
          }}
        >
          <span>sonxinchao.com</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
