# 05 — Debug & Fix: Các lỗi thường gặp và cách sửa

> Tổng hợp các vấn đề đã gặp trong quá trình phát triển sonxinchao.com,
> nguyên nhân gốc và cách fix nhanh.

---

## 1. Blog không cập nhật sau khi nhấn "Cập nhật" trong admin

### Triệu chứng
- Nhấn "Cập nhật" → admin báo ✅ Đã lưu thành công
- PUT request trả về 200 OK
- Nhưng blog vẫn hiển thị nội dung cũ

### Nguyên nhân gốc
**Next.js 14 Data Cache** tự động cache các `fetch()` call — kể cả fetch nội bộ
của Supabase JS library. Dù route có `force-dynamic`, Supabase client tạo HTTP
request đến PostgREST và Next.js có thể cache response đó.

### Fix đã áp dụng

**`lib/supabase.ts`** — thêm `cache: "no-store"` vào global fetch:
```ts
export const supabaseAdmin = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
      global: {
        fetch: (url: RequestInfo | URL, options?: RequestInit) =>
          fetch(url, { ...options, cache: "no-store" }),
      },
    }
  );
```

**`app/api/admin/posts/[id]/route.ts`** — thêm `revalidatePath` sau khi save:
```ts
import { revalidatePath } from "next/cache";

// Sau khi update thành công:
try {
  revalidatePath(`/blog/${data.slug}`);
  revalidatePath("/blog");
} catch { /* không block response */ }
```

---

## 2. Ảnh Supabase Storage không hiển thị trên blog

### Triệu chứng
- Upload ảnh trong admin → URL có dạng `.../storage/v1/object/public/images/...`
- Ảnh không hiện trên website, trả về 400/403

### Nguyên nhân gốc
Bucket `images` trong Supabase ở chế độ **private**. URL `/object/public/` chỉ
hoạt động khi bucket được bật **Public** trong Supabase Settings — không phải
chỉ tạo RLS policy.

> **Lưu ý:** Tạo RLS policy `(bucket_id = 'images')` cho anon SELECT **KHÔNG**
> fix được URL `/object/public/`. Đây là 2 cơ chế khác nhau.

### Fix
1. Vào Supabase → **Storage** → bucket **`images`**
2. Click **⋮** → **Edit bucket**
3. Bật toggle **"Public bucket"** → **Save**

---

## 3. TypeError: a is not iterable — Vercel build lỗi tại /gioi-thieu/opengraph-image

### Triệu chứng
```
TypeError: a is not iterable
  at /gioi-thieu/opengraph-image
```
Build thất bại, không deploy được.

### Nguyên nhân gốc (Satori / `@vercel/og`)
Satori ném lỗi khi gặp:
1. **Element rỗng** (`<div />` self-closing không có children)
2. **Inline array** trong JSX: `[{...}].map(...)` trực tiếp trong return
3. **Emoji literal** trong text node mà không load emoji font
4. **Fetch Supabase** lúc static prerender (network fail → data undefined → iterate undefined)

### Fix áp dụng cho `app/gioi-thieu/opengraph-image.tsx`
- Xóa hoàn toàn Supabase fetch → fully static
- Pre-compute arrays **ngoài** JSX trước khi return
- Thêm dummy `<span style={{ fontSize: 1, color: "transparent" }}> </span>` vào
  mọi container element có thể rỗng
- Xóa tất cả emoji literal khỏi JSX

```tsx
export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  const skills = ["SEO Technical", "Google Ads", "Facebook Ads", "Website"];
  // Render JSX — mọi div đều có ít nhất 1 child
}
```

---

## 4. Git lock files chặn push

### Triệu chứng
```
fatal: Unable to create '.git/HEAD.lock': File exists
```

### Fix — chạy trong Terminal Mac
```bash
cd ~/Documents/Claude/Projects/Cá\ nhân\ hoá/son-xin-chao
rm -f .git/HEAD.lock \
      .git/packed-refs.lock \
      .git/refs/heads/main.lock \
      .git/objects/maintenance.lock
git push origin main
```

### Lưu ý với zsh — escape dấu ngoặc vuông
```bash
# SAI (zsh coi [id] là glob pattern)
git add app/api/admin/posts/[id]/route.ts

# ĐÚNG — dùng single quotes
git add 'app/api/admin/posts/[id]/route.ts'
```

---

## 5. CSS Blog Content — chuẩn gtvseo.com style

### Key properties áp dụng trong `.blog-content`

| Property | Giá trị | Lý do |
|---|---|---|
| `font-size` | `16px` | Dễ đọc hơn 15px |
| `color` | `#1a1a2e` | Đen sậm thay vì xám `#475569` |
| `text-align` | `justify` | Căn đều 2 bên như gtvseo.com |
| `line-height` | `1.9` | Thoáng hơn cho tiếng Việt |
| `word-break` | `break-word` | Tránh tràn chữ trên mobile |

---

## 6. Step List — ol.step-list

### HTML mẫu trong nội dung bài viết
```html
<ol class="step-list">
  <li>
    <strong>Tiêu đề bước</strong>
    Mô tả bước này làm gì...
    <em>Ví dụ cụ thể ở đây</em>
  </li>
</ol>
```

### CSS hiệu ứng
- Số thứ tự: hình tròn gradient xanh (blue → violet)
- `<strong>` → tiêu đề bước, in đậm đen
- `<em>` → khung xanh nhạt với icon 💡, không in nghiêng
- Card có viền, hover sáng nhẹ, bo góc đầu/cuối

---

## 7. Supabase — Media upload lưu vào Storage (không phải /public/images/)

### Luồng upload ảnh trong bài viết
```
Admin editor → paste/upload
  → POST /api/admin/media
  → Supabase Storage bucket "images"
  → URL: ${SUPABASE_URL}/storage/v1/object/public/images/${filename}
  → Lưu URL này vào field content của post
```

> **Không** lưu vào `/public/images/` trong filesystem — đó là thư mục
> static assets của Next.js, không dùng cho user-uploaded images.

### Kiểm tra ảnh có accessible không
Paste URL vào browser. Nếu trả về 400/403 → bucket chưa public (xem mục 2).

---

## 8. Checklist khi deploy lên Vercel

- [ ] Chạy `git push origin main` thành công
- [ ] Vercel build log không có lỗi (đặc biệt `/gioi-thieu/opengraph-image`)
- [ ] Sau khi deploy, test: chỉnh nội dung admin → nhấn Cập nhật → reload blog → nội dung mới hiển thị
- [ ] Kiểm tra ảnh trong bài hiển thị đúng (Supabase bucket public)
- [ ] `X-Vercel-Cache: MISS` trên GET `/api/posts/[slug]` (không bị cache CDN)

---

## 9. Environment Variables cần thiết (Vercel)

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ADMIN_SECRET=your-secret-here
```

---

*Cập nhật lần cuối: tháng 6/2026*
