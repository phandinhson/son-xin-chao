import { ImageResponse } from "next/og";

export const size = { width: 48, height: 48 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: "linear-gradient(135deg, #0a1a3e 0%, #050d1f 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Chữ S gradient xanh */}
        <span
          style={{
            fontSize: 36,
            fontWeight: 900,
            fontFamily: "Arial Black, Impact, Arial, sans-serif",
            color: "#38beff",
            lineHeight: 1,
            letterSpacing: "-1px",
          }}
        >
          S
        </span>
        {/* Dấu mũi tên cam góc trên phải */}
        <span
          style={{
            position: "absolute",
            top: 5,
            right: 5,
            fontSize: 11,
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
