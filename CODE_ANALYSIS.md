# 🔍 Phân Tích Code — sonxinchao.com

> Ngày phân tích: 20/06/2026 | Phân tích bởi: Claude (Expert Code Review)

---

## TÓM TẮT ĐIỂM SỐ

| Hạng mục | Điểm | Mức độ |
|---|---|---|
| Bảo mật | 6/10 | ⚠️ Cần cải thiện |
| Hiệu suất | 7/10 | ✅ Khá tốt |
| Chất lượng code | 6/10 | ⚠️ Cần cải thiện |
| Kiến trúc | 7/10 | ✅ Khá tốt |
| SEO & Metadata | 9/10 | 🌟 Rất tốt |

---

## 🔴 VẤN ĐỀ BẢO MẬT (Ưu tiên cao nhất)

### 1. Không có Rate Limiting trên các API công khai nhận dữ liệu đầu vào

**File bị ảnh hưởng:**
- `app/api/contact/route.ts` — Form liên hệ, gửi email, lưu DB
- `app/api/orders/route.ts` — Đặt hàng, lưu vào DB
- `app/api/track/route.ts` — Theo dõi page view

**Rủi ro:** Kẻ tấn công có thể gửi hàng nghìn request/giây:
- Làm tràn bảng `contact_submissions` và `orders` trong Supabase
- Làm tràn quota email (nếu có gửi email thông báo)
- Tăng chi phí Supabase/Vercel không kiểm soát được

**Cách fix nhanh — dùng Map trong memory (phù hợp cho Vercel Edge):**

```typescript
// lib/rateLimit.ts
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(ip: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true; // allowed
  }
  
  if (entry.count >= limit) return false; // blocked
  entry.count++;
  return true;
}

// Dùng trong route handler:
const ip = req.headers.get("x-forwarded-for") ?? "unknown";
if (!checkRateLimit(ip, 5, 60_000)) {
  return NextResponse.json({ error: "Quá nhiều yêu cầu" }, { status: 429 });
}
```

> **Lưu ý:** Giải pháp trên chỉ hoạt động trong 1 instance. Nếu muốn rate limit chính xác hơn khi scale, dùng Upstash Redis (có free tier).

---

### 2. Middleware `ADMIN_ONLY_ROUTES` bị lỗi thời

**File:** `middleware.ts`

```typescript
// ❌ Hiện tại — /admin/hoc-ai không được bảo vệ đúng cách
const ADMIN_ONLY_ROUTES = [
  "/admin/analytics",
  "/admin/ai-tools",   // ← route cũ đã bị xóa
  // ...
  // /admin/hoc-ai bị THIẾU ← lỗ hổng
];
```

```typescript
// ✅ Cần sửa thành:
const ADMIN_ONLY_ROUTES = [
  "/admin/analytics",
  "/admin/portfolio",
  "/admin/pricing",
  "/admin/addons",
  "/admin/hoc-ai",      // ← thêm route mới
  "/admin/speed-cache",
  "/admin/settings",
  "/admin/gioi-thieu",
  "/admin/users",
  "/admin/navigation",  // ← thêm nếu chưa có
];
```

**Hậu quả nếu không fix:** User có role `editor` có thể truy cập `/admin/hoc-ai` mà không bị chặn ở middleware (dù API routes vẫn có `checkAuth`).

---

### 3. Trang `/admin/ai-tools` cũ vẫn còn tồn tại

**Files:**
- `app/admin/ai-tools/page.tsx` — trang admin cũ
- `app/api/admin/ai-tools/route.ts` — API cũ
- `app/api/admin/ai-tools/[id]/route.ts` — API cũ

Đây là dead code nhưng vẫn accessible qua URL. Nên xóa để tránh nhầm lẫn và giảm surface tấn công.

---

### 4. Thiếu Input Validation trên API đặt hàng

**File:** `app/api/orders/route.ts`

Hiện chỉ check `customer_name`, `customer_phone`, `items?.length`. Chưa validate:
- Độ dài tối đa của các trường (XSS qua stored data)
- Format số điện thoại (injection)
- Giá trị `price`, `quantity` có hợp lệ không (negative values)

---

## 🟡 VẤN ĐỀ HIỆU SUẤT

### 5. `supabaseAdmin()` được gọi 107 lần — mỗi lần tạo mới một instance

**Tìm thấy tại:** 107 file/vị trí trong toàn dự án

```typescript
// ❌ Pattern hiện tại — tạo client mới mỗi request
const db = supabaseAdmin();
const { data } = await db.from("posts").select("*");
```

Thực ra `supabaseAdmin()` là factory function tạo Supabase client mới mỗi lần gọi. Điều này không gây lỗi (Supabase SDK tự quản lý connection pool) nhưng lãng phí bộ nhớ và thêm overhead khởi tạo.

**Cách tối ưu — singleton pattern:**

```typescript
// lib/supabase.ts — thêm vào cuối file
let _adminClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseAdmin() {
  if (_adminClient) return _adminClient;
  _adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  return _adminClient;
}
```

---

### 6. Dùng `<img>` thay vì `<Image>` của Next.js — bỏ qua tối ưu ảnh

**Thống kê:** 25 thẻ `<img>` gốc vs chỉ 1 lần dùng `next/image`

**Mất gì khi dùng `<img>`:**
- Không có lazy loading tự động (load ảnh dù chưa scroll tới)
- Không có WebP/AVIF conversion tự động (bạn đã config trong `next.config.js` nhưng không được dùng)
- Không có `sizes` optimization (tải ảnh to hơn cần thiết trên mobile)
- Core Web Vitals bị ảnh hưởng: LCP chậm hơn

**Cách fix:**
```tsx
// ❌ Hiện tại
<img src={tool.icon} alt={tool.name} width={48} height={48} />

// ✅ Nên dùng
import Image from "next/image";
<Image src={tool.icon} alt={tool.name} width={48} height={48} />
```

> **Ưu tiên fix ảnh nào trước:** Ảnh hero, ảnh portfolio, ảnh sản phẩm — những thứ nằm trong viewport đầu tiên (ảnh hưởng LCP nhiều nhất).

---

### 7. Các file component quá lớn (700–850 dòng)

| File | Số dòng | Vấn đề |
|---|---|---|
| `app/admin/hoc-ai/page.tsx` | 848 dòng | Chứa 3+ components lớn |
| `app/admin/cong-cu-ai/page.tsx` | 732 dòng | Logic + UI lẫn lộn |
| `app/gioi-thieu/page.tsx` | 726 dòng | Hardcoded data + UI |
| `app/dich-vu/seo-hcm/page.tsx` | 723 dòng | Content dài |

**Tại sao cần tách:** File lớn = khó maintain, khó test, editor lag, build chậm hơn khi tree-shaking.

**Cách tách file `admin/hoc-ai/page.tsx`:**
```
app/admin/hoc-ai/
  page.tsx          ← chỉ giữ state tổng + tab switcher (~100 dòng)
  VideoTab.tsx      ← toàn bộ UI + logic video
  ToolsTab.tsx      ← toàn bộ UI + logic tools
  types.ts          ← interface Video, Tool
```

---

## 🟠 CHẤT LƯỢNG CODE

### 8. TypeScript và ESLint bị tắt trong build

**File:** `next.config.js`

```javascript
// ❌ Đang tắt hoàn toàn
typescript: { ignoreBuildErrors: true },
eslint: { ignoreDuringBuilds: true },
```

**Hậu quả:** Lỗi TypeScript và ESLint không bao giờ break build → lỗi tích lũy âm thầm, bugs khó phát hiện.

**Nên làm:** Bật lại từng bước:
1. Chạy `npx tsc --noEmit` để xem có bao nhiêu lỗi
2. Fix lỗi kiểu `any` và `unknown` trước
3. Sau khi fix xong, xóa `ignoreBuildErrors: true`

---

### 9. `console.error` trong production code

**Tìm thấy tại:**
- `app/admin/posts/[id]/page.tsx`
- `lib/sitemap.ts`
- `app/api/contact/route.ts`
- `app/api/admin/posts/[id]/route.ts`
- `app/api/admin/auth/route.ts`
- `app/api/ai-tools/route.ts`

**Vấn đề:** `console.error` trong production:
- Lộ thông tin kỹ thuật (stack trace, SQL error, env names) ra server logs có thể bị capture
- Không có cấu trúc → khó debug sau này

**Nên làm:** Tạo logger wrapper đơn giản:
```typescript
// lib/logger.ts
const isProd = process.env.NODE_ENV === "production";

export const logger = {
  error: (msg: string, ctx?: unknown) => {
    if (isProd) {
      // Chỉ log message, không log stack trace đầy đủ
      console.error(`[ERROR] ${msg}`, ctx instanceof Error ? ctx.message : ctx);
    } else {
      console.error(`[ERROR] ${msg}`, ctx);
    }
  },
  info: (msg: string, ctx?: unknown) => {
    if (!isProd) console.log(`[INFO] ${msg}`, ctx);
  },
};
```

---

### 10. Dead Code — `/admin/ai-tools` vẫn tồn tại song song với `/admin/hoc-ai`

Sau khi merge vào `/admin/hoc-ai`, các file sau trở thành dead code:
- `app/admin/ai-tools/page.tsx`
- `app/api/admin/ai-tools/route.ts`
- `app/api/admin/ai-tools/[id]/route.ts`

Nên xóa để tránh nhầm lẫn và giảm bundle size.

---

## 🟢 ĐIỂM TỐT (Giữ nguyên)

### ✅ Kiến trúc xác thực tự triển khai rất tốt

`lib/auth.ts` sử dụng:
- WebCrypto API (native, không cần thư viện ngoài)
- PBKDF2 với 100,000 iterations (đúng chuẩn NIST)
- Constant-time comparison (chống timing attack)
- Edge Runtime compatible (hoạt động trên Vercel Edge)

→ **Đây là implementation chất lượng cao, không cần thay đổi.**

### ✅ Fallback pattern cho public API rất thông minh

Tất cả public API routes đều có hardcoded fallback data nếu DB chưa có bảng → site không bao giờ bị blank khi setup lần đầu.

### ✅ SEO & Metadata cực kỳ tốt

- Mỗi page có `metadata` riêng với title, description, keywords, OG, Twitter Card
- JSON-LD structured data trên Contact page, Blog posts
- `alternates.canonical` để tránh duplicate content
- `sitemap.ts` tự generate

### ✅ `React.cache()` trong `lib/get-settings.ts`

Đúng cách dùng React cache để dedup DB query trong cùng một request cycle.

### ✅ Middleware bảo vệ admin tốt

JWT verification trước khi vào bất kỳ route `/admin/*` nào. Headers `x-admin-role`, `x-admin-name` được truyền xuống Server Components — pattern chuẩn.

### ✅ Custom font tối ưu

`Be_Vietnam_Pro` với chỉ 3 weights, `display: "swap"` → không block render.

---

## 📋 DANH SÁCH VIỆC CẦN LÀM (Theo thứ tự ưu tiên)

### 🔴 Làm ngay (Security)
- [ ] Thêm Rate Limiting cho `/api/contact`, `/api/orders`
- [ ] Cập nhật `ADMIN_ONLY_ROUTES` trong `middleware.ts` — thêm `/admin/hoc-ai`, xóa `/admin/ai-tools`

### 🟡 Làm tuần này (Performance)
- [ ] Xóa dead code: `app/admin/ai-tools/`, `app/api/admin/ai-tools/`
- [ ] Đổi các `<img>` quan trọng (hero, portfolio) sang `<Image>` của Next.js
- [ ] Tách `app/admin/hoc-ai/page.tsx` thành `VideoTab.tsx` + `ToolsTab.tsx`

### 🟠 Làm tháng này (Code Quality)
- [ ] Bật lại TypeScript check: chạy `npx tsc --noEmit`, fix dần
- [ ] Thêm Input validation cho `/api/orders` (max length, phone format)
- [ ] Thay thế `console.error` bằng structured logger

### 🟢 Nice to have (Architecture)
- [ ] Singleton pattern cho `supabaseAdmin()` — export `getSupabaseAdmin()`
- [ ] Tách các file lớn > 500 dòng thành components nhỏ hơn
- [ ] Xem xét Upstash Redis cho rate limiting khi traffic tăng

---

## QUICK WINS (Fix trong 30 phút)

**1. Fix middleware ngay:**
```typescript
// middleware.ts — thay ADMIN_ONLY_ROUTES
const ADMIN_ONLY_ROUTES = [
  "/admin/analytics",
  "/admin/portfolio",
  "/admin/pricing",
  "/admin/addons",
  "/admin/hoc-ai",      // ← MỚI
  "/admin/speed-cache",
  "/admin/settings",
  "/admin/gioi-thieu",
  "/admin/users",
  "/admin/navigation",  // ← MỚI (nếu có)
];
```

**2. Xóa dead code:**
```bash
rm -rf app/admin/ai-tools
rm -rf app/api/admin/ai-tools
```

---

*Báo cáo này được tạo dựa trên phân tích toàn bộ codebase tại thời điểm 20/06/2026.*
