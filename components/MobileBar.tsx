"use client";
import { useEffect, useState } from "react";
import Link from "next/link"; // Tối ưu SPA chuyển trang không reload
import { useSettings } from "@/components/SettingsContext";

export default function MobileBar() {
  const s = useSettings();
  const phone    = (s.contact_phone    || "0968806360").replace(/\s/g, "");
  const zalo     = (s.contact_zalo     || "0968806360").replace(/\s/g, "");
  const facebook = s.contact_facebook  || "fb.com/sonxinchao";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  // Hàm xử lý tạo link Messenger chuẩn xác, chống lỗi chuỗi đầu vào
  const getMessengerUrl = (fbInput: string) => {
    if (!fbInput) return "https://m.me/";
    const cleanPath = fbInput
      .replace(/(https?:\/\/)?(www\.)?(facebook\.com|fb\.com)\//, "")
      .replace("profile.php?id=", "");
    return `https://m.me/${cleanPath}`;
  };

  const messengerUrl = getMessengerUrl(facebook);

  const openMenu = () => {
    window.dispatchEvent(new CustomEvent("toggle-mobile-menu"));
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <>
      {/* Spacer ngăn nội dung dưới chân trang bị che khuất */}
      <div className="h-20 md:hidden" />

      {/* Mobile sticky bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 md:hidden will-change-transform transition-transform duration-500 ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Đường line hiệu ứng mảnh phía trên thanh bar */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        <div className="bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div className="flex items-end justify-around px-2 pb-safe">

            {/* Menu */}
            <button
              onClick={openMenu}
              className="flex flex-col items-center gap-1 py-2 px-3 text-slate-500 active:text-blue-600 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              <span className="text-[10px] font-medium text-slate-600">Menu</span>
            </button>

            {/* Zalo */}
            <a
              href={`https://zalo.me/${zalo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 py-2 px-3 active:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 rounded-full bg-[#0068FF] flex items-center justify-center shadow-md">
                <img src="/logo-zalo-vector.svg" alt="Zalo" className="h-6 w-auto brightness-0 invert" />
              </div>
              <span className="text-[10px] font-medium text-slate-600">Zalo</span>
            </a>

            {/* Call — Nút gọi nổi bật ở trung tâm */}
            <a
              href={`tel:${phone}`}
              className="flex flex-col items-center gap-1 py-1 px-3 -mt-4 active:opacity-80 transition-opacity"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-40 scale-110" />
                <div className="absolute inset-0 rounded-full bg-red-300 animate-pulse opacity-30 scale-125" />
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-300 relative z-10">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-red-600 mt-1">Gọi ngay</span>
            </a>

            {/* Messenger */}
            <a
              href={messengerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 py-2 px-3 active:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.14.26.34.27.55l.05 1.72c.03.58.62.96 1.14.71l1.92-.85c.17-.07.36-.09.53-.05.88.24 1.82.37 2.78.37 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm5.96 7.67l-2.94 4.66c-.47.74-1.47.93-2.17.41l-2.34-1.75c-.21-.16-.5-.16-.72 0l-3.16 2.4c-.42.32-.97-.18-.69-.63l2.94-4.66c.47-.74 1.47-.93 2.17-.41l2.34 1.75c.21.16.5.16.72 0l3.16-2.4c.42-.32.97.18.69.63z" />
                </svg>
              </div>
              <span className="text-[10px] font-medium text-slate-600">Messenger</span>
            </a>

            {/* Contact */}
            <Link
              href="/contact"
              className="flex flex-col items-center gap-1 py-2 px-3 active:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <span className="text-[10px] font-medium text-slate-600">Liên hệ</span>
            </Link>

          </div>
          <div className="h-2" />
        </div>
      </div>
    </>
  );
}