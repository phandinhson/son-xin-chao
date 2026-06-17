# CLAUDE.md — Hướng dẫn làm việc với dự án Son Xin Chào

## Tổng quan dự án
Website portfolio cá nhân cho Phan Đình Sơn — Digital Marketing Specialist (SEO, Ads, WordPress).
- **Brand**: Sơn Xin Chào
- **Stack**: Next.js 14 App Router + TypeScript + Tailwind CSS + Supabase
- **Địa chỉ local**: `localhost:3000`
- **Admin**: `localhost:3000/admin`
- **Thư mục project**: `/Users/ericphan/Documents/Claude/Projects/Cá nhân hoá/son-xin-chao/`

---

## Quy tắc khi chỉnh sửa code

### Đọc file trước khi sửa
Luôn dùng `Read` tool đọc file trước khi dùng `Edit`. Nếu file chưa được đọc trong session hiện tại, bắt buộc đọc trước.

### Phân biệt API routes
| Loại | Path | Auth |
|------|------|------|
| Admin (CRUD) | `/api/admin/*` | Cookie `admin_session` |
| Public (đọc) | `/api/settings`, `/api/posts`, `/api/portfolio`, `/api/pricing` | Không |

### Supabase
- **Chỉ dùng `supabaseAdmin()`** trong API routes (server-side)
- **Không dùng** `supabase` (client) trong API routes — sẽ bị lỗi RLS
- URL: `https://kpgtiqepktofdfyxgsbw.supabase.co`
- Schema SQL ở: `supabase/schema.sql`

### Components fetch data
Tất cả components (Hero, About, Contact, Pricing, Portfolio, Blog, Navbar, Footer) đều fetch từ `/api/settings` hoặc endpoint tương ứng trong `useEffect`. Luôn có fallback data khi API lỗi.

### Restart server khi cần
Sau khi tạo file mới trong `app/api/`, Next.js cần restart để nhận route:
```bash
# Trong thư mục son-xin-chao
rm -rf .next && npm run dev
```

---

## Cấu trúc thư mục chính

```
son-xin-chao/
├── app/
│   ├── page.tsx              ← Trang chủ (gọi tất cả components)
│   ├── globals.css           ← CSS toàn cục + .prose-custom (blog)
│   ├── layout.tsx
│   ├── blog/[slug]/page.tsx  ← Trang đọc bài viết
│   ├── admin/                ← Toàn bộ trang admin
│   └── api/
│       ├── settings/         ← PUBLIC: site settings
│       ├── posts/            ← PUBLIC: bài viết published
│       ├── portfolio/        ← PUBLIC: portfolio active
│       ├── pricing/          ← PUBLIC: bảng giá
│       ├── contact/          ← Gửi email khi form liên hệ
│       └── admin/            ← ADMIN: CRUD đầy đủ
├── components/
│   ├── Navbar.tsx            ← Logo động từ settings
│   ├── Hero.tsx              ← Fetch hero_name, tagline, stats
│   ├── About.tsx             ← Fetch about_description
│   ├── Services.tsx          ← Static
│   ├── Portfolio.tsx         ← Fetch /api/portfolio
│   ├── Pricing.tsx           ← Fetch /api/pricing
│   ├── Blog.tsx              ← Fetch /api/posts + tab filter
│   ├── Contact.tsx           ← Form gửi email + FAQ
│   └── Footer.tsx            ← Logo, links động
├── lib/
│   └── supabase.ts           ← supabase client + supabaseAdmin + Types
├── middleware.ts             ← Bảo vệ /admin/* routes
├── supabase/
│   ├── schema.sql
│   ├── seed-blog-post-1.sql
│   └── seed-blog-post-2-3.sql
└── .env.local                ← Credentials (không commit)
```

---

## Admin Panel

### Đăng nhập
- URL: `/admin`
- Password: `Son@2026` (trong `.env.local` — key `ADMIN_PASSWORD`)

### Các trang admin
| Trang | Chức năng |
|-------|-----------|
| `/admin/dashboard` | Stats tổng quan |
| `/admin/posts` | Quản lý bài viết blog |
| `/admin/posts/new` | Viết bài mới |
| `/admin/portfolio` | CRUD portfolio |
| `/admin/pricing` | CRUD bảng giá |
| `/admin/settings` | Chỉnh logo, hero, stats, contact, about |

### Settings keys quan trọng (table: site_settings)
```
hero_name, hero_tagline, hero_description
stat_years, stat_projects, stat_satisfaction, stat_roas
contact_phone, contact_zalo, contact_facebook, contact_email
about_description
logo_url, logo_text
```

---

## Gửi email liên hệ

### Cấu hình
```env
GMAIL_USER=phandinhsonlp116@gmail.com
GMAIL_APP_PASSWORD=pskl njch llai dwhw
```
- Dùng Nodemailer + Gmail App Password
- API: `POST /api/contact`
- Package: `nodemailer` (cần cài: `npm install nodemailer @types/nodemailer`)

---

## Blog & SEO Content

### Auto-tagging logic (getTag function)
- Title chứa "seo" → tag **SEO** (màu xanh lá)
- Title chứa "ads"/"quảng cáo" → tag **Ads** (màu xanh dương)
- Title chứa "website"/"wordpress"/"web" → tag **Website** (màu tím)
- Còn lại → tag **Tips** (màu cam)

### Trang đọc bài
- URL: `/blog/[slug]`
- CSS cho content: class `.prose-custom` trong `globals.css`
- Layout: content chính + sidebar (author card + share buttons)

### Thêm bài viết mới
1. Viết SQL INSERT vào `supabase/` folder
2. Paste vào [Supabase SQL Editor](https://supabase.com/dashboard/project/kpgtiqepktofdfyxgsbw/editor/)
3. Run → bài xuất hiện ngay trên website

---

## Lệnh thường dùng

```bash
# Chạy dev server
cd /Users/ericphan/Documents/Claude/Projects/Cá\ nhân\ hoá/son-xin-chao
npm run dev

# Rebuild sạch (khi tạo file mới)
rm -rf .next && npm run dev

# Cài package
npm install nodemailer @types/nodemailer
```
