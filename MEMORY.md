# MEMORY.md — Credentials & Database Schema

> **Cập nhật lần cuối**: 19/06/2026

---

## Thông tin chủ website

| Thông tin | Giá trị |
|-----------|---------|
| Tên | Phan Đình Sơn |
| Nghề nghiệp | Digital Marketing Specialist |
| Chuyên môn | SEO, Google Ads, Facebook Ads, WordPress |
| Địa chỉ | Long Thành, Đồng Nai |
| Phục vụ | Toàn quốc online |
| Zalo/Phone | 0968 806 360 |
| Email | son@sonxinchao.com |
| Gmail (gửi email) | phandinhsonlp116@gmail.com |
| Gmail App Password | `pskl njch llai dwhw` |
| Facebook | https://fb.com/sonxinchao |
| YouTube | https://youtube.com/@hoccungson116 |
| Zalo link | https://zalo.me/0968806360 |
| Kinh nghiệm | 5+ năm |
| Số dự án | 150+ |
| Số khách hàng | 80+ |

---

## Supabase Credentials

```
Project URL:    https://kpgtiqepktofdfyxgsbw.supabase.co
Anon Key:       eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwZ3RpcWVwa3RvZmRmeXhnc2J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MTY4MTIsImV4cCI6MjA5NzE5MjgxMn0.f7Lazud5dCfPbxknNVEkoKlMuDwAmgDmjZHILYzmWk8
Service Role:   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwZ3RpcWVwa3RvZmRmeXhnc2J3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTYxNjgxMiwiZXhwIjoyMDk3MTkyODEyfQ.XzkvKILb8UQvhGVI7aEfnEEOJpwPcf6ST1oVDlcnPfg
SQL Editor:     https://supabase.com/dashboard/project/kpgtiqepktofdfyxgsbw/editor/
Region:         Singapore (ap-southeast-1)
Storage bucket: site-images (public)
```

---

## Admin Credentials

```
URL:            localhost:3000/admin
Password:       Son@2026
Admin Secret:   sonxinchao_secret_key_32chars_abc
```

---

## Database Tables

### posts
```sql
id, title, slug, content (HTML), excerpt, cover_image (URL),
focus_keyword,    ← thêm 18/06/2026
status ('draft'|'published'), categories (text[]),
created_at, updated_at, published_at
```

### portfolio
```sql
id, title, industry, category ('SEO'|'Ads'|'Website'),
result, detail, tags[], metric_before, metric_after, metric_unit,
icon, color, sort_order, active, created_at
```

### pricing
```sql
id, name, icon, price, unit, description,
features[], not_included[], is_popular, cta_text, sort_order
```

### addons
```sql
id, name, icon, price, unit, sort_order, active, created_at
```

### categories
```sql
id, name, slug, color, sort_order, created_at
```

### site_settings
```sql
key TEXT PRIMARY KEY, value TEXT, updated_at
```

**Keys quan trọng:**
```
# Hero / homepage
hero_name, hero_tagline, hero_description
stat_years, stat_projects, stat_satisfaction, stat_roas

# Contact
contact_phone, contact_zalo, contact_facebook, contact_email, contact_youtube

# Brand
logo_url, logo_text

# SEO global
meta_title, meta_description, meta_keywords
og_title, og_description, og_image

# Theme (CSS vars)
theme_bg, theme_bg_alt, theme_text, theme_text_2, theme_text_3
theme_accent, theme_accent_2, theme_font

# Custom code
seo_schema, seo_google_analytics, seo_webmaster, seo_head_js, seo_body_js

# CMS pages (JSON string)
page_gioi_thieu    ← JSON {hero_name, hero_avatar_url, skills[], timeline[], ...}
```

### ai_tools
```sql
id, name, category, description, url, icon, tags[], is_free, sort_order, active
```

### page_views (analytics)
```sql
id, page, referrer, created_at
```

---

## Bài viết đã có (tính đến 18/06/2026)

| Slug | Title | Tag |
|------|-------|-----|
| `cac-buoc-seo-len-top-google-huong-dan-tu-a-z` | Các Bước SEO Lên Top Google | SEO |
| `google-ads-vs-facebook-ads` | Google Ads vs Facebook Ads | Ads |
| `thiet-ke-website-wordpress-chuan-seo` | Thiết Kế Website WordPress Chuẩn SEO | Website |

---

## Lịch sử commit quan trọng

| Commit | Nội dung |
|--------|---------|
| `17af994` | Fix canonical URL (cũ — đặt canonical homepage cho tất cả, SAI) |
| Sau `17af994` | Fix canonical per-page (đúng) — chưa push lên live |
| `4f5f681` | Font -1 variant, PageTracker keepalive, OG image /gioi-thieu |
| `aeb45a1` | Mobile perf: no blur, next/image, revalidate 300s, image CDN |
| 19/06/2026 | SPA Link navigation + logo Zalo SVG + fix placehold.co SVG |

> ⚠️ User cần `git push origin main` để deploy các fix lên Vercel

---

## Quyết định kỹ thuật

| Vấn đề | Quyết định | Lý do |
|--------|------------|-------|
| Auth admin | Cookie `admin_session` | Đơn giản, không cần JWT |
| Database RLS | Tắt RLS | Site cá nhân, admin-only |
| Email | Nodemailer + Gmail App Password | Không cần service trả phí |
| Image storage | Supabase Storage (bucket: site-images) | Thay thế base64 trong DB |
| Blog category | Column `categories text[]` + table categories | Flexible, filterable |
| API error | Trả `[]`/`{}` rỗng | Frontend có fallback |
| OG image | `opengraph-image.tsx` file convention | Next.js auto-inject vào metadata |
| Contact page | `/contact` riêng thay `/#contact` | SEO tốt hơn, URL rõ ràng |
| Canonical | `alternates: { canonical: "..." }` per-page | Tránh duplicate content |
| Internal nav | `<Link>` Next.js thay `<a>` | SPA routing, không reload trang |
| Zalo icon | `/public/logo-zalo-vector.svg` + `brightness-0 invert` | Logo chính hãng thay SVG tự vẽ |
| SVG từ external | `dangerouslyAllowSVG: true` trong next.config.js | placehold.co trả SVG, Next.js block mặc định |
