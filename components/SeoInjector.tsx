"use client";
import { useEffect } from "react";

export default function SeoInjector() {
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (!d || d.error) return;

        // Helper: inject raw HTML vào <head>
        const injectHead = (html: string, id: string) => {
          if (!html?.trim()) return;
          const existing = document.getElementById(id);
          if (existing) existing.remove();
          const div = document.createElement("div");
          div.id = id;
          div.innerHTML = html;
          // Với <script> tag cần clone để browser thực thi
          Array.from(div.childNodes).forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const el = node as Element;
              if (el.tagName === "SCRIPT") {
                const s = document.createElement("script");
                Array.from(el.attributes).forEach((attr) =>
                  s.setAttribute(attr.name, attr.value)
                );
                s.textContent = el.textContent;
                document.head.appendChild(s);
              } else {
                document.head.appendChild(el.cloneNode(true));
              }
            }
          });
        };

        // Helper: inject raw HTML vào đầu <body>
        const injectBody = (html: string, id: string) => {
          if (!html?.trim()) return;
          const existing = document.getElementById(id);
          if (existing) existing.remove();
          const wrapper = document.createElement("div");
          wrapper.id = id;
          wrapper.innerHTML = html;
          document.body.insertBefore(wrapper, document.body.firstChild);
        };

        // 1. Schema Markup
        injectHead(d.seo_schema || "", "sxc-schema");

        // 2. Google Analytics
        injectHead(d.seo_google_analytics || "", "sxc-ga");

        // 3. Google Webmaster Tool (meta tag)
        injectHead(d.seo_webmaster || "", "sxc-webmaster");

        // 4. Head JS
        injectHead(d.seo_head_js || "", "sxc-head-js");

        // 5. Body JS
        injectBody(d.seo_body_js || "", "sxc-body-js");
      })
      .catch(() => {});
  }, []);

  return null;
}
