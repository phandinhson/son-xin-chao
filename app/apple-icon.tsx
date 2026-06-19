import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: "linear-gradient(135deg, #0a1a3e 0%, #050d1f 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Chữ S lớn gradient xanh */}
        <span
          style={{
            fontSize: 130,
            fontWeight: 900,
            fontFamily: "Arial Black, Impact, Arial, sans-serif",
            color: "#38beff",
            lineHeight: 1,
            letterSpacing: "-3px",
          }}
        >
          S
        </span>
        {/* Dấu mũi tên cam góc trên phải */}
        <span
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            fontSize: 36,
            color: "#ff8c00",
            lineHeight: 1,
            fontWeight: 900,
          }}
        >
          ↗
        </span>
      </div>
    ),
    { ...size }
  );
}
