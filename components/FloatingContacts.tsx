"use client";
import { useEffect, useState } from "react";
import { useSettings } from "@/components/SettingsContext";

export default function FloatingContacts() {
  const s = useSettings();
  const phone    = (s.contact_phone    || "0968806360").replace(/\s/g, "");
  const zalo     = (s.contact_zalo     || "0968806360").replace(/\s/g, "");
  const facebook = s.contact_facebook  || "fb.com/sonxinchao";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(t);
  }, []);

  const messengerUrl = facebook.includes("facebook.com")
    ? facebook.replace("facebook.com", "m.me").replace("/profile.php?id=", "")
    : `https://m.me/${facebook.replace(/.*fb\.com\//, "").replace(/.*facebook\.com\//, "")}`;

  const buttons = [
    {
      label: "Messenger",
      href: messengerUrl,
      bg: "bg-gradient-to-br from-blue-500 to-violet-600",
      shadow: "shadow-blue-300",
      icon: (
        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.14.26.34.27.55l.05 1.72c.03.58.62.96 1.14.71l1.92-.85c.17-.07.36-.09.53-.05.88.24 1.82.37 2.78.37 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm5.96 7.67l-2.94 4.66c-.47.74-1.47.93-2.17.41l-2.34-1.75c-.21-.16-.5-.16-.72 0l-3.16 2.4c-.42.32-.97-.18-.69-.63l2.94-4.66c.47-.74 1.47-.93 2.17-.41l2.34 1.75c.21.16.5.16.72 0l3.16-2.4c.42-.32.97.18.69.63z" />
        </svg>
      ),
    },
    {
      label: "Zalo",
      href: `https://zalo.me/${zalo}`,
      bg: "bg-[#0068FF]",
      shadow: "shadow-blue-400",
      icon: (
        <img src="/logo-zalo-vector.svg" alt="Zalo" className="h-7 w-auto brightness-0 invert" />
      ),
    },
    {
      label: "Gọi ngay",
      href: `tel:${phone}`,
      bg: "bg-gradient-to-br from-red-500 to-rose-600",
      shadow: "shadow-red-300",
      pulse: true,
      icon: (
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
        </svg>
      ),
    },
  ];

  return (
    <div
      className={`fixed right-4 bottom-32 z-40 hidden md:flex flex-col gap-3 transition-all duration-700 ${
        visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
      }`}
    >
      {buttons.map((btn) => (
        <a
          key={btn.label}
          href={btn.href}
          target={btn.href.startsWith("tel") ? undefined : "_blank"}
          rel="noopener noreferrer"
          title={btn.label}
          className={`group relative flex items-center justify-center w-12 h-12 rounded-full ${btn.bg} shadow-lg ${btn.shadow} hover:scale-110 active:scale-95 transition-transform duration-200`}
        >
          {/* Pulse ring for phone */}
          {btn.pulse && (
            <>
              <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-40" />
              <span className="absolute inset-0 rounded-full bg-red-300 animate-pulse opacity-25 scale-125" />
            </>
          )}
          {btn.icon}

          {/* Tooltip on hover */}
          <span style={{ color: "#ffffff", backgroundColor: "#1e293b" }} className="absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-1.5 text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
            {btn.label}
            <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent" style={{ borderLeftColor: "#1e293b" }} />
          </span>
        </a>
      ))}
    </div>
  );
}
