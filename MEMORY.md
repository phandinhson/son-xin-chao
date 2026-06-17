# MEMORY.md — Dữ liệu quan trọng cần nhớ

## Thông tin chủ website
| Thông tin | Giá trị |
|-----------|---------|
| Tên | Phan Đình Sơn |
| Nghề nghiệp | Digital Marketing Specialist |
| Chuyên môn | SEO, Google Ads, Facebook Ads, WordPress |
| Địa chỉ | Long Thành, Đồng Nai |
| Phục vụ | Toàn quốc online |
| Zalo/Phone | 0968806360 |
| Email | phandinhsonlp116@gmail.com |
| Gmail App Password | pskl njch llai dwhw |
| Facebook | fb.com/sonxinchao |
| Kinh nghiệm | 3+ năm |
| Số dự án | 50+ |

---

## Supabase Credentials
```
Project URL:  https://kpgtiqepktofdfyxgsbw.supabase.co
Anon Key:     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwZ3RpcWVwa3RvZmRmeXhnc2J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MTY4MTIsImV4cCI6MjA5NzE5MjgxMn0.f7Lazud5dCfPbxknNVEkoKlMuDwAmgDmjZHILYzmWk8
Service Role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwZ3RpcWVwa3RvZmRmeXhnc2J3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTYxNjgxMiwiZXhwIjoyMDk3MTkyODEyfQ.XzkvKILb8UQvhGVI7aEfnEEOJpwPcf6ST1oVDlcnPfg
SQL Editor:   https://supabase.com/dashboard/project/kpgtiqepktofdfyxgsbw/editor/
Region:       Singapore (ap-southeast-1)
```

## Admin Credentials
```
URL:           localhost:3000/admin
Password:      Son@2026
Admin Secret:  sonxinchao_secret_key_32chars_abc
```

---

## Database Tables

### posts
```sql
id, title, slug, content, excerpt, cover_image,
status ('draft'|'published'), created_at, updated_at
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

### site_settings
```sql
key (TEXT PRIMARY KEY), value, updated_at
```

### addons
```sql
id, name, icon, price, unit, sort_order, active, created_at
```
→ SQL: `supabase/seed-addons.sql`
→ Public API: `/api/addons`
→ Admin API: `/api/admin/addons`, `/api/admin/addons/[id]`
→ Admin UI: `/admin/addons`

---

## Bài viết đã có trong database (tính đến 16/06/2026)

| # | Title | Slug | Tag |
|---|-------|------|-----|
| 1 | Các Bước SEO Lên Top Google: Hướng Dẫn Toàn Diện Từ A–Z | cac-buoc-seo-len-top-google-huong-dan-tu-a-z | SEO |
| 2 | Google Ads vs Facebook Ads: Nên Chọn Kênh Nào Cho Doanh Nghiệp SME? | google-ads-vs-facebook-ads | Ads |
| 3 | Thiết Kế Website WordPress Chuẩn SEO: 10 Điều Bắt Buộc Phải Có | thiet-ke-website-wordpress-chuan-seo | Website |

---

## Quyết định kỹ thuật đã chọn

| Vấn đề | Quyết định | Lý do |
|--------|------------|-------|
| Auth admin | Cookie `admin_session` = env `ADMIN_SECRET` | Đơn giản, không cần JWT library |
| Database RLS | Tắt RLS (Run without RLS) | Site cá nhân, admin-only |
| Email | Nodemailer + Gmail App Password | Không cần service trả phí |
| Image storage | URL hoặc base64 trong site_settings | Không cần S3/storage riêng |
| Blog category | Auto-detect từ title | Không cần thêm column vào DB |
| API error | Trả về `[]` hoặc `{}` rỗng, không throw | Frontend luôn có fallback |
| Supabase key | Legacy format `eyJ...` | Tương thích với supabase-js v2 |

---

## Vấn đề đã gặp & cách fix

| Vấn đề | Nguyên nhân | Fix |
|--------|-------------|-----|
| "Sai mật khẩu" admin login | Chưa có file `.env.local` | Tạo file `.env.local` với đúng keys |
| Website không sync settings | Chưa có public `/api/settings` | Tạo route + các components fetch từ đó |
| 404 trang đọc blog | Chưa có `app/blog/[slug]/page.tsx` | Tạo page + API route `/api/posts/[slug]` |
| Blog hiện "Chưa có bài viết" | Chưa run SQL vào Supabase | Run SQL trong SQL Editor |
| npm 403 trong sandbox | Registry bị chặn | Viết code → user cài trên máy local |
| Next.js không nhận route mới | Cache `.next` cũ | `rm -rf .next && npm run dev` |
