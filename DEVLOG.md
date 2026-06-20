# 📋 DevLog — sonxinchao.com

> Ghi lại các thay đổi đã thực hiện để tham khảo và chỉnh sửa nhanh sau này.

---

## [2026-06-20] — Code Optimization & Security Fixes

### 🔒 Bảo mật

#### Rate Limiting (chống spam/flood)
- **File mới:** `lib/rateLimit.ts`
  - In-memory rate limiter, không cần Redis
  - Hàm `checkRateLimit(key, limit, windowMs)` → trả về `true/false`
  - Hàm `getClientIp(headers)` → lấy IP từ Vercel/Cloudflare header
  - Tự dọn entry hết hạn mỗi 5 phút (tránh memory leak)

- **`app/api/contact/route.ts`** — Thêm rate limit 5 req/phút + validate độ dài input (name ≤100, phone ≤20, message ≤2000)
- **`app/api/orders/route.ts`** — Thêm rate limit 3 req/phút + validate độ dài + validate price/quantity không âm

#### Middleware fix
- **`middleware.ts`** — Cập nhật `ADMIN_ONLY_ROUTES`:
  - Xóa `/admin/ai-tools` (route cũ đã bị thay)
  - Thêm `/admin/hoc-ai` ← route mới
  - Thêm `/admin/navigation` ← route mới

### 🐛 Bug Fixes

#### Build crash — ProductForm
- **`components/admin/ProductForm.tsx`** dòng 62
  - Lỗi: `CATEGORIES[0]` — biến không tồn tại
  - Fix: đổi thành `FALLBACK_CATEGORIES[0]`
  - Nguyên nhân: typo, bị bỏ qua vì `ignoreBuildErrors: true`

#### Dead code — `/admin/ai-tools`
- **`app/admin/ai-tools/page.tsx`** — Thay toàn bộ content bằng `redirect("/admin/hoc-ai")`
- Route cũ giờ tự chuyển sang trang mới, không còn dead code

---

## [Trước đó] — Tính năng mới: Trang Học AI + Admin

### 📁 Files đã tạo

| File | Mô tả |
|---|---|
| `supabase-hoc-ai.sql` | Schema DB: bảng `hoc_ai_videos` + `hoc_ai_tools`, RLS, seed data |
| `app/api/hoc-ai-videos/route.ts` | Public GET — có hardcoded fallback nếu DB chưa có |
| `app/api/hoc-ai-tools/route.ts` | Public GET — có hardcoded fallback |
| `app/api/admin/hoc-ai-videos/route.ts` | Admin GET+POST (có auth) |
| `app/api/admin/hoc-ai-videos/[id]/route.ts` | Admin PUT+DELETE (có auth) |
| `app/api/admin/hoc-ai-tools/route.ts` | Admin GET+POST (có auth) |
| `app/api/admin/hoc-ai-tools/[id]/route.ts` | Admin PUT+DELETE (có auth) |
| `app/admin/hoc-ai/page.tsx` | Trang admin 2 tab: Video + AI Tools (848 dòng) |
| `lib/rateLimit.ts` | Rate limiting utility |

### 📝 Files đã sửa

| File | Thay đổi |
|---|---|
| `app/hoc-ai/page.tsx` | Fetch data từ DB, fallback về hardcoded nếu lỗi |
| `app/admin/layout.tsx` | Đổi menu: `/admin/ai-tools` → `/admin/hoc-ai` (icon 🎓) |
| `app/contact/ContactPageClient.tsx` | YouTube link → `@hoccungson116` |
| `app/contact/page.tsx` | JSON-LD sameAs YouTube → `@hoccungson116` |
| `middleware.ts` | ADMIN_ONLY_ROUTES cập nhật |
| `components/admin/ProductForm.tsx` | Fix typo CATEGORIES → FALLBACK_CATEGORIES |
| `app/api/contact/route.ts` | Rate limiting + input validation |
| `app/api/orders/route.ts` | Rate limiting + input validation |
| `app/admin/ai-tools/page.tsx` | Redirect sang `/admin/hoc-ai` |

---

## 🗺️ Cấu trúc Admin Routes

```
/admin
  /dashboard        — Tổng quan
  /posts            — Bài viết (editor + admin)
  /portfolio        — Portfolio (admin only)
  /pricing          — Bảng giá (admin only)
  /addons           — Add-ons (admin only)
  /hoc-ai           — 🎓 Video + AI Tools (admin only)  ← MỚI
  /navigation       — Menu điều hướng (admin only)      ← MỚI
  /shop/products    — Sản phẩm shop
  /shop/categories  — Danh mục shop
  /orders           — Đơn hàng
  /analytics        — Analytics (admin only)
  /speed-cache      — Cache (admin only)
  /settings         — Cài đặt (admin only)
  /gioi-thieu       — Trang giới thiệu (admin only)
  /users            — Quản lý user (admin only)
```

---

## 🔑 Kiến trúc quan trọng cần nhớ

### Auth pattern trong API routes
```typescript
// ✅ ĐÚNG — checkAuth trả về boolean
if (!(await checkAuth(req))) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// ❌ SAI — checkAuth KHÔNG trả về NextResponse
const authError = await checkAuth(req);
if (authError) return authError; // crash!
```

### Fallback pattern cho public API
```typescript
// Mọi public API route đều có hardcoded fallback
const { data, error } = await db.from("table").select("*");
if (error) return NextResponse.json(FALLBACK_DATA); // không crash
```

### Field mapping DB → Component (hoc-ai)
```
DB (snake_case)     →  Component (camelCase)
youtube_id          →  youtubeId
is_hot              →  hot
is_new              →  new
description         →  desc
```

### Supabase client
```typescript
// Hiện tại — tạo mới mỗi lần (107 chỗ trong codebase)
const db = supabaseAdmin();

// TODO: nâng cấp thành singleton trong lib/supabase.ts
```

---

## ⚠️ Việc còn lại (chưa làm)

- [ ] Bật lại TypeScript check — chạy `npx tsc --noEmit` rồi fix dần
- [ ] Đổi 25 thẻ `<img>` quan trọng sang `<Image>` của Next.js (ưu tiên: hero, portfolio)
- [ ] Tách `app/admin/hoc-ai/page.tsx` thành `VideoTab.tsx` + `ToolsTab.tsx`
- [ ] Chạy SQL `supabase-hoc-ai.sql` trong Supabase SQL Editor để tạo bảng
- [ ] Upstash Redis cho rate limiting khi traffic tăng (hiện dùng in-memory)
