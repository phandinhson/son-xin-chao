"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Không track trang admin
    if (pathname.startsWith("/admin")) return;

    // sendBeacon — hoàn toàn non-blocking, không ảnh hưởng render
    const payload = JSON.stringify({ page: pathname, referrer: document.referrer || "" });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([payload], { type: "application/json" }));
    } else {
      fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: payload, keepalive: true }).catch(() => {});
    }
  }, [pathname]);

  return null;
}
