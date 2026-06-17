# SKILL.md — Kỹ năng & Pattern code trong dự án

## 1. Viết bài SEO chuẩn cho Blog

### Template SQL INSERT bài viết mới
```sql
INSERT INTO posts (title, slug, excerpt, content, status, cover_image)
VALUES (
  'Tiêu đề bài viết chuẩn SEO (50–60 ký tự)',
  'tieu-de-bai-viet-chuan-seo',
  'Meta description 150–160 ký tự, có từ khóa và call-to-action...',
  '<h2>Phần 1</h2><p>Nội dung...</p>
   <h2>Phần 2</h2><ul><li>...<li>...</ul>
   <h2>Kết luận</h2><p>...<a href="#contact">liên hệ tư vấn</a>.</p>',
  'published',
  NULL  -- hoặc URL ảnh bìa
);
```
→ Paste vào: https://supabase.com/dashboard/project/kpgtiqepktofdfyxgsbw/editor/

### Checklist bài viết SEO
- [ ] Độ dài: 1.000–2.000 từ
- [ ] H2 có từ khóa chính/phụ
- [ ] H3 chia nhỏ từng H2
- [ ] Bullet list với `<strong>Điểm quan trọng:</strong>`
- [ ] Số liệu cụ thể (%, năm, giá trị)
- [ ] Internal link về `#contact` ở cuối
- [ ] Escape `'` trong SQL thành `''` (hai dấu nháy)
- [ ] Escape `&` thành `&amp;` trong HTML

### Auto-tag category từ title
| Từ khóa trong title | Tag | Màu |
|---------------------|-----|-----|
| "seo" | SEO | `from-green-500 to-emerald-600` |
| "ads", "quảng cáo", "google ads", "facebook ads" | Ads | `from-blue-500 to-cyan-600` |
| "website", "wordpress", "web" | Website | `from-violet-500 to-purple-600` |
| (còn lại) | Tips | `from-orange-500 to-amber-600` |

---

## 2. Pattern API Route (Next.js App Router)

### Public API route
```typescript
// app/api/[resource]/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("table_name")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}
```

### Admin API route (có auth)
```typescript
// app/api/admin/[resource]/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";

function checkAuth() {
  const session = cookies().get("admin_session")?.value;
  return session === process.env.ADMIN_SECRET;
}

export async function GET() {
  if (!checkAuth()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = supabaseAdmin();
  const { data, error } = await db.from("table_name").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}
```

### API route có dynamic param
```typescript
// app/api/posts/[slug]/route.ts
export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("posts")
    .select("*")
    .eq("slug", params.slug)
    .single();
  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}
```

---

## 3. Pattern Component với Supabase fetch

### Client component fetch với fallback
```typescript
"use client";
import { useEffect, useState } from "react";

export default function MyComponent() {
  const [data, setData] = useState<MyType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/my-endpoint", { cache: "no-store" })
      .then(async (r) => {
        const text = await r.text();
        try {
          const d = JSON.parse(text);
          setData(Array.isArray(d) ? d : []);
        } catch { setData([]); }
        setLoading(false);
      })
      .catch(() => { setData([]); setLoading(false); });
  }, []);

  if (loading) return <div>Đang tải...</div>;
  // render data
}
```

### Fetch settings từ Supabase (pattern dùng nhiều)
```typescript
const [cfg, setCfg] = useState({ key1: "default1", key2: "default2" });

useEffect(() => {
  fetch("/api/settings")
    .then((r) => r.json())
    .then((d) => { if (d && !d.error) setCfg((prev) => ({ ...prev, ...d })); })
    .catch(() => {});
}, []);
```

---

## 4. Slug generation từ tiếng Việt

```typescript
function toSlug(str: string) {
  return str
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d").replace(/Đ/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
```

---

## 5. IntersectionObserver cho animation

```typescript
const sectionRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("visible");
    }),
    { threshold: 0.1 }
  );
  const els = sectionRef.current?.querySelectorAll(".animate-on-scroll");
  els?.forEach((el) => observer.observe(el));
  return () => observer.disconnect();
}, [deps]); // thêm deps khi data thay đổi cần re-observe
```

CSS (đã có trong globals.css):
```css
.animate-on-scroll { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
.animate-on-scroll.visible { opacity: 1; transform: translateY(0); }
```

---

## 6. Gửi email với Nodemailer (Gmail)

```typescript
// app/api/contact/route.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // App Password 16 ký tự
  },
});

await transporter.sendMail({
  from: `"Website Name" <${process.env.GMAIL_USER}>`,
  to: process.env.GMAIL_USER,
  subject: "Tiêu đề email",
  html: "<h1>Nội dung HTML</h1>",
});
```

Lấy App Password: https://myaccount.google.com/apppasswords (cần bật 2FA)

---

## 7. Middleware bảo vệ admin routes

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("admin_session")?.value;
  const isLoginPage = request.nextUrl.pathname === "/admin";

  // Đã đăng nhập + vào trang login → redirect về dashboard
  if (session === process.env.ADMIN_SECRET && isLoginPage) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }
  // Chưa đăng nhập + vào trang admin khác → redirect về login
  if (!isLoginPage && session !== process.env.ADMIN_SECRET) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
```

---

## 8. CSS prose-custom cho blog content

Class `.prose-custom` trong `globals.css` style các thẻ HTML trong nội dung bài viết:
- `h2` → gradient text (blue→violet), border-bottom
- `h3` → text trắng, nhỏ hơn h2
- `ul li` → bullet `▹` màu xanh dương
- `strong` → text trắng sáng
- `a` → màu xanh, underline mờ
- `blockquote` → border trái tím, bg mờ
- `code` → bg mờ, text hồng
- `table` → border, header xanh

---

## 9. Xử lý logo động

### Navbar & Footer — Fetch logo từ settings
```typescript
const [logoUrl, setLogoUrl] = useState("");
const [logoText, setLogoText] = useState("Sơn Xin Chào");

useEffect(() => {
  fetch("/api/settings").then(r => r.json()).then(d => {
    if (d?.logo_url) setLogoUrl(d.logo_url);
    if (d?.logo_text) setLogoText(d.logo_text);
  }).catch(() => {});
}, []);
```

### Render logo với fallback
```tsx
{logoUrl ? (
  <img src={logoUrl} alt="Logo" className="w-9 h-9 rounded-xl object-cover" />
) : (
  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
    S
  </div>
)}
```

### Admin — Upload ảnh thành base64
```typescript
const fileInputRef = useRef<HTMLInputElement>(null);

<input
  ref={fileInputRef}
  type="file"
  accept="image/*"
  className="hidden"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      setSettings({ ...settings, logo_url: base64 });
    };
    reader.readAsDataURL(file);
  }}
/>
```

---

## 10. Debugging Tips

### Blog không hiển thị dù API có data
1. Mở `localhost:3000/api/posts` — xem API response
2. Nếu API OK → restart server: `rm -rf .next && npm run dev`
3. Nếu vẫn lỗi → check Console DevTools

### Supabase không kết nối
1. Kiểm tra `.env.local` có đủ 3 Supabase keys
2. Restart server sau khi thêm/sửa `.env.local`
3. Dùng `supabaseAdmin()` (không phải `supabase`) trong API routes

### API route không nhận request
- Next.js có thể cần restart để nhận file route mới
- Chạy: `rm -rf .next && npm run dev`
