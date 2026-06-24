"use client";
import { useEffect, useRef } from "react";
import { useSettings } from "@/components/SettingsContext";

/**
 * Client-side theme injector — cập nhật CSS variables live
 * khi admin thay đổi theme mà không cần reload trang.
 * Được gọi từ trang admin settings.
 */
export function applyTheme(settings: Record<string, string>) {
  const bg      = settings.theme_bg       || "";
  const bgAlt   = settings.theme_bg_alt   || "";
  const text    = settings.theme_text     || "";
  const text2   = settings.theme_text_2   || "";
  const text3   = settings.theme_text_3   || "";
  const accent  = settings.theme_accent   || "";
  const accent2 = settings.theme_accent_2 || "";
  const font    = settings.theme_font     || "";

  if (!bg && !text && !font) return;

  const hexToRgba = (hex: string, alpha: number) => {
    if (!hex || hex.length < 7) return "";
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const isLight = (hex: string) => {
    if (!hex || hex.length < 7) return false;
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return (0.299 * r + 0.587 * g + 0.114 * b) > 0.5;
  };

  const lightBg = isLight(bg);
  const resolvedBgAlt   = bgAlt || (lightBg ? "#f8f9fa" : "#111827");
  const resolvedText    = text  || (lightBg ? "#1a1a2e" : "#ffffff");
  const resolvedText2   = text2 || (lightBg ? "#444466" : "#d1d5db");
  const resolvedText3   = text3 || (lightBg ? "#666688" : "#9ca3af");
  const resolvedCard    = lightBg ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.05)";
  const resolvedCardH   = lightBg ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.10)";
  const resolvedBorder  = lightBg ? "rgba(0,0,0,0.10)" : "rgba(255,255,255,0.10)";
  const resolvedBorderSm = lightBg ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)";
  const resolvedBorderLg = lightBg ? "rgba(0,0,0,0.20)" : "rgba(255,255,255,0.20)";
  const resolvedNav     = bg ? hexToRgba(bg, 0.92) : "";

  const root = document.documentElement;
  if (bg)              root.style.setProperty("--th-bg",         bg);
  if (resolvedBgAlt)   root.style.setProperty("--th-bg-alt",     resolvedBgAlt);
  if (resolvedNav)     root.style.setProperty("--th-bg-nav",     resolvedNav);
  if (resolvedText)    root.style.setProperty("--th-text",       resolvedText);
  if (resolvedText2)   root.style.setProperty("--th-text-2",     resolvedText2);
  if (resolvedText3)   root.style.setProperty("--th-text-3",     resolvedText3);
  root.style.setProperty("--th-text-4",   lightBg ? "#888899" : "#6b7280");
  root.style.setProperty("--th-card",     resolvedCard);
  root.style.setProperty("--th-card-hover", resolvedCardH);
  root.style.setProperty("--th-border",   resolvedBorder);
  root.style.setProperty("--th-border-sm", resolvedBorderSm);
  root.style.setProperty("--th-border-lg", resolvedBorderLg);
  if (accent)          root.style.setProperty("--th-accent",     accent);
  if (accent2)         root.style.setProperty("--th-accent-2",   accent2);
  if (font) {
    root.style.setProperty("--th-font", `'${font}', 'Be Vietnam Pro', 'Inter', sans-serif`);
    // Dynamically load Google Font if needed
    const fontId = `gfont-${font.replace(/\s+/g, "-").toLowerCase()}`;
    if (!document.getElementById(fontId)) {
      const link = document.createElement("link");
      link.id = fontId;
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@300;400;500;600;700;800&display=swap`;
      document.head.appendChild(link);
    }
  }
}

export default function ThemeInjector() {
  const s = useSettings();
  // isFirstRun: true trên mount đầu tiên, false sau đó (admin preview)
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      // SSR đã inject <style id="site-theme"> với đúng theme → skip.
      // Gọi 12+ setProperty() khi values không đổi kích hoạt full-document
      // style recalculation (~236ms forced reflow [unattributed] trên Lighthouse).
      if (document.getElementById("site-theme")) return;
    }
    // Lần mount đầu mà không có #site-theme (không có custom theme):
    // globals.css dark defaults đã đúng → applyTheme() cũng return early
    // khi !bg && !text && !font, nên không gây reflow.
    // Lần sau (s thay đổi = admin preview): apply ngay để thấy live.
    if (s && Object.keys(s).length > 0) applyTheme(s);
  }, [s]);
  return null;
}
