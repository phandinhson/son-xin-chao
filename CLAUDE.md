# CLAUDE.md — Hướng dẫn làm việc với dự án Son Xin Chào

> **Cập nhật lần cuối**: 19/06/2026  
> Đọc file này TRƯỚC khi làm bất cứ việc gì với dự án.

---

## Thông tin nhanh

| Mục | Giá trị |
|-----|---------|
| **Brand** | Sơn Xin Chào |
| **Chủ** | Phan Đình Sơn — SEO · Google Ads · Facebook Ads · Website |
| **Domain** | https://www.sonxinchao.com |
| **Stack** | Next.js 14 App Router + TypeScript + Tailwind CSS + Supabase |
| **Local** | `localhost:3000` |
| **Admin** | `localhost:3000/admin` (pass: `Son@2026`) |
| **Thư mục** | `/Users/ericphan/Documents/Claude/Projects/Cá nhân hoá/son-xin-chao/` |
| **Bash path** | `/sessions/*/mnt/Cá nhân hoá/son-xin-chao/` |
| **Supabase** | `https://kpgtiqepktofdfyxgsbw.supabase.co` |

---

## ⚠️ Lưu ý sandbox quan trọng

**Sandbox KHÔNG thể `git push`** (proxy 403). Sau mỗi session, báo user chạy:
```bash
cd ~/Documents/Claude/Projects/Cá\ nhân\ hoá/son-xin-chao
rm -f .git/HEAD.lock .git/index.lock
git add -A && git commit -m "..." && git push origin main
```
Sandbox cũng không xóa được `.git/*.lock` → workaround: `GIT_INDEX_FILE=.git/index2 git add ...`

---

## Cấu trúc thư mục

```
son-xin-chao/
├── app/
│   ├── layout.tsx                  ← Root: font BeVietnamPro, ThemeInjector, SettingsProvider, Analytics
│   ├── page.tsx                    ← Trang chủ (Hero, About, Services, Portfolio, Pricing, Blog, Contact)
│   ├── globals.css                 ← CSS vars (--th-*), .gradient-text, .card-hover, .animate-on-scroll
│   ├── gioi-thieu/
│   │   ├── page.tsx                ← CMS từ site_settings key "page_gioi_thieu", revalidate=300
│   │   └── opengraph-image.tsx     ← OG image 1200×630 tự động (ImageResponse, runtime=nodejs)
│   ├── contact/
│   │   ├── page.tsx                ← Server: metadata + JSON-LD ContactPage
│   │   └── ContactPageClient.tsx   ← Client: form, 6 contact cards, FAQ, map, giờ làm việc
│   ├── blog/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── dich-vu/
│   │   ├── seo/           ├── google-ads/    ├── facebook-ads/
│   │   ├── tiktok-ads/    ├── thiet-ke-website/
│   │   ├── seo-local/     ├── seo-hcm/       └── audit-tu-van/
│   ├── cong-cu-ai/page.tsx         ← Fetch DB bảng ai_tools
│   ├── admin/                      ← Toàn bộ admin panel
│   ├── api/                        ← Routes (xem bảng bên dưới)
│   ├── sitemap.ts                  ← Static pages + dynamic blog posts
│   └── robots.ts
│
├── components/
│   ├── Navbar.tsx        ← Mega-menu, logo động
│   ├── Hero.tsx          ├── About.tsx       ├── Services.tsx
│   ├── Portfolio.tsx     ├── Pricing.tsx     ├── Blog.tsx
│   ├── Contact.tsx       ← Form + FAQ dùng trên homepage
│   ├── Footer.tsx        ├── MobileBar.tsx   ├── FloatingContacts.tsx
│   ├── PageTracker.tsx   ← Track pageview, keepalive:true
│   ├── SeoInjector.tsx   ← Inject schema/GA/custom JS từ admin
│   ├── ThemeInjector.tsx ← CSS vars theme từ admin
│   ├── SettingsContext.tsx
│   ├── RichEditor.tsx    ← WYSIWYG, light theme
│   └── SearchModal.tsx
│
├── lib/supabase.ts       ← supabaseAdmin() + Types
├── next.config.js        ← images.remotePatterns (Supabase), WebP/AVIF, 30d cache
├── middleware.ts         ← Bảo vệ /admin/*
├── CLAUDE.md             ← File này
├── MEMORY.md             ← Credentials + DB schema
└── docs/                 ← Tài liệu chi tiết
```

---

## API Routes

### Public
| Route | Mô tả |
|-------|-------|
| `GET /api/settings` | Tất cả site_settings → `{key: value}` |
| `GET /api/posts` | Bài viết published |
| `GET /api/posts/[slug]` | Bài theo slug |
| `GET /api/portfolio` | Portfolio active |
| `GET /api/pricing` | Bảng giá + addons |
| `GET /api/categories` | Categories blog |
| `POST /api/contact` | Gửi email (Nodemailer + Gmail) |
| `POST /api/track` | Track pageview |

### Admin (cookie `admin_session` required)
| Route | Mô tả |
|-------|-------|
| `/api/admin/posts` | CRUD bài viết |
| `/api/admin/portfolio` | CRUD portfolio |
| `/api/admin/pricing` | CRUD bảng giá |
| `/api/admin/addons` | CRUD add-ons |
| `/api/admin/settings` | Update site settings |
| `/api/admin/categories` | CRUD categories |
| `/api/admin/ai-tools` | CRUD ai_tools |
| `/api/admin/media` | CRUD media (Supabase Storage) |
| `/api/admin/gioi-thieu` | Lưu CMS page_gioi_thieu |

---

## Admin Pages

| URL | Chức năng |
|-----|-----------|
| `/admin` | Login |
| `/admin/dashboard` | Stats + analytics |
| `/admin/posts` + `/new` + `/[id]` | Blog CRUD (WordPress-style editor) |
| `/admin/portfolio` | Portfolio CRUD |
| `/admin/pricing` + `/addons` | Bảng giá CRUD |
| `/admin/settings` | SEO, theme (CSS vars), contact, hero, OG |
| `/admin/categories` | Categories blog |
| `/admin/ai-tools` | AI tools landing page |
| `/admin/media` | Thư viện ảnh (Supabase Storage) |
| `/admin/gioi-thieu` | CMS trang giới thiệu |
| `/admin/facebook-ads` | CMS trang facebook-ads |
| `/admin/speed-cache` | Purge Cloudflare, checklist tốc độ |

---

## Canonical URLs (tất cả đã đúng trong code)

> ⚠️ Live site vẫn sai (chưa được push) — cần `git push origin main`

```
/                        → https://www.sonxinchao.com
/gioi-thieu              → https://www.sonxinchao.com/gioi-thieu
/contact                 → https://www.sonxinchao.com/contact
/dich-vu/seo             → https://www.sonxinchao.com/dich-vu/seo
/dich-vu/google-ads      → https://www.sonxinchao.com/dich-vu/google-ads
/dich-vu/facebook-ads    → https://www.sonxinchao.com/dich-vu/facebook-ads
/dich-vu/tiktok-ads      → https://www.sonxinchao.com/dich-vu/tiktok-ads
/dich-vu/thiet-ke-website → https://www.sonxinchao.com/dich-vu/thiet-ke-website
/dich-vu/seo-local       → https://www.sonxinchao.com/dich-vu/seo-local
/dich-vu/seo-hcm         → https://www.sonxinchao.com/dich-vu/seo-hcm
/dich-vu/audit-tu-van    → https://www.sonxinchao.com/dich-vu/audit-tu-van
```

---

## Design System

### CSS Variables
```
--th-bg / --th-bg-alt / --th-bg-nav
--th-text / --th-text-2 / --th-text-3 / --th-text-4
--th-card / --th-card-hover
--th-border / --th-border-sm / --th-border-lg
--th-accent / --th-accent-2
--th-font
```

### Dùng trong JSX
```tsx
className="bg-[var(--th-bg)] text-[var(--th-text)] border border-[var(--th-border)]"
```

### Utility classes (globals.css)
- `.gradient-text` — gradient xanh-tím-hồng
- `.card-hover` — translateY(-6px) + shadow
- `.animate-on-scroll` — fade+slide in khi scroll (cần IntersectionObserver trong useEffect)

### Pattern trang mới (server component)
```tsx
export const revalidate = 300;
export const metadata: Metadata = {
  title: "...",
  alternates: { canonical: "https://www.sonxinchao.com/SLUG" },
  openGraph: { url: "https://www.sonxinchao.com/SLUG", type: "website" },
};
export default function Page() {
  return (<><script type="application/ld+json" .../><Navbar /><main>...</main><Footer /><MobileBar /></>);
}
```

---

## Performance Rules

| Rule | Chi tiết |
|------|---------|
| **No blur-3xl on mobile** | Dùng `hidden md:block` cho decorative blobs |
| **next/image thay img** | Tự động WebP/AVIF + srcset đúng kích thước |
| **LCP image → priority** | `<Image priority sizes="Xpx" />` |
| **Below-fold → lazy** | `<Image loading="lazy" sizes="..." />` |
| **revalidate=300** | Đủ cache, giảm Supabase cold-start 5× |
| **Font: bỏ weight 300** | Giảm 2 file woff2 |
| **keepalive: true** | Tracking fetch hoàn thành dù user navigate đi |

### next.config.js images
```js
remotePatterns: [
  { protocol:"https", hostname:"kpgtiqepktofdfyxgsbw.supabase.co", pathname:"/storage/v1/object/public/**" },
  { protocol:"https", hostname:"placehold.co" },   // placeholder blog cover
],
dangerouslyAllowSVG: true,          // placehold.co trả SVG
contentDispositionType: "attachment",
contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
formats: ["image/avif", "image/webp"],
minimumCacheTTL: 2592000,
```

---

## OG Image (/gioi-thieu)

File: `app/gioi-thieu/opengraph-image.tsx`
- `runtime = "nodejs"`, `revalidate = 3600`, `size = {width:1200, height:630}`
- Fetch CMS từ Supabase key `page_gioi_thieu`
- Convert avatar URL → base64 để embed
- **Satori không hỗ trợ `backgroundClip:"text"`** → dùng `color:"#1e40af"` solid

---

## CMS key "page_gioi_thieu"

JSON object lưu trong `site_settings`:
```json
{
  "hero_name", "hero_job_title", "hero_location", "hero_avatar_url",
  "hero_description", "hero_video_url", "story_image_url",
  "stat_years", "stat_projects", "stat_clients",
  "skills": [{"category","icon","colorBar","colorIcon","items":[{"name","level"}]}],
  "timeline": [{"year","title","desc","icon","color"}]
}
```

---

## Gửi email (Contact form)

```env
GMAIL_USER=phandinhsonlp116@gmail.com
GMAIL_APP_PASSWORD=pskl njch llai dwhw
```
- Package: `nodemailer` + `@types/nodemailer`
- API: `POST /api/contact` — body: `{name, phone, email?, service?, budget?, message}`

---

## Supabase Rules

```typescript
// ✅ Server-side (API routes, page.tsx server components)
import { supabaseAdmin } from "@/lib/supabase";
const db = supabaseAdmin();
const { data } = await db.from("table").select("...");

// ❌ Không dùng supabase client trong API routes
```

---

## Quy tắc icon & logo

### Logo Zalo
- File: `/public/logo-zalo-vector.svg` (SVG đen, fill="#000000", landscape 768×468)
- **Dùng trên nền màu (xanh/gradient):** `<img src="/logo-zalo-vector.svg" className="h-7 w-auto brightness-0 invert" />`
  - `brightness-0` → đen thuần, `invert` → trắng
- **Dùng trên nền sáng (footer):** `<img src="/logo-zalo-vector.svg" className="h-[18px] w-auto brightness-0 opacity-60" />`
  - `brightness-0 opacity-60` → xám nhạt
- Kích thước theo vị trí: floating nút `h-7`, mobile bar `h-6`, card icon `h-7`, CTA button `h-8`, footer `h-[18px]`

### Quy tắc navigation nội bộ
- **Luôn dùng `<Link href="...">` từ `next/link`** cho link nội bộ (`/`, `/blog`, `/#section`, v.v.)
- **Giữ `<a href="...">` cho:** `tel:`, `mailto:`, `target="_blank"` (social), external HTTPS
- Lý do: `<a>` gây hard reload, `<Link>` SPA không reload

---

## Bugs đã biết & fix

| Bug | Nguyên nhân | Fix |
|-----|-------------|-----|
| Live canonical sai | Commits chưa push | `git push origin main` |
| `.git/*.lock` không xóa | Sandbox permissions | User xóa thủ công hoặc `GIT_INDEX_FILE` |
| `blur-3xl` lag mobile | GPU filter:blur(96px) | `hidden md:block` |
| ISR slow (1.8s) | revalidate=60 cache miss | Tăng lên 300s |
| Ảnh không optimize | Thiếu remotePatterns | Thêm Supabase hostname |
| OG image rỗng | Satori `backgroundClip:text` | Dùng `color` solid |
| `git push` 403 | Proxy sandbox | User tự push từ terminal |
| placehold.co SVG bị block | next/image chặn SVG mặc định | `dangerouslyAllowSVG: true` trong next.config.js |
| Text white trên bg sáng | Dark theme remnant khi đổi theme | Thay `text-white/gray-300/gray-400` → `text-slate-800/slate-600` |
| Duplicate API call `/api/settings` | Mỗi component tự fetch | Dùng `useSettings()` từ SettingsContext |
