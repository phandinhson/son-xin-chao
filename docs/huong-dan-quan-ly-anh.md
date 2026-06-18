# Hướng dẫn quản lý hình ảnh — Son Xin Chao Website

## Nơi lưu trữ ảnh

| Loại ảnh | Nơi lưu | Lý do |
|---|---|---|
| OG image (share link Facebook/Zalo) | Supabase Storage | Chỉ bot crawl, không ảnh hưởng tốc độ trang |
| Ảnh blog, thumbnail bài viết | Supabase Storage | Tạm ổn — **nên resize xuống < 200KB trước khi upload** |
| Ảnh hero, banner hiển thị trên trang | `/public` folder trong source code | Load nhanh nhất, được Vercel CDN cache tự động |
| Logo, icon, favicon | `/public` folder | Luôn cần tốc độ cao, đặt trong source code |

---

## Supabase Storage

**Bucket:** `images` (PUBLIC)
**Project URL:** `https://kpgtiqepktofdfyxgsbw.supabase.co`
**Base URL ảnh:**
```
https://kpgtiqepktofdfyxgsbw.supabase.co/storage/v1/object/public/images/
```

### Danh sách ảnh đang lưu

| Tên file | Dùng cho | Trang |
|---|---|---|
| `_og-cong-cu-ai.jpg` | OG thumbnail khi share link | `/cong-cu-ai` |

### Cách upload ảnh mới lên Supabase Storage

1. Vào [Supabase Dashboard](https://supabase.com/dashboard) → **Storage** → **images**
2. Click **"Upload files"** → chọn file
3. Sau khi upload → click file → **"Get URL"** để copy đường dẫn
4. Dùng URL đó trong code (metadata, `<img src="...">`, v.v.)

### Lưu ý khi upload ảnh

- **OG image:** kích thước chuẩn **1200 x 630px**, dung lượng < 300KB
- **Thumbnail blog:** resize xuống **800 x 450px**, < 150KB
- **Tên file:** dùng chữ thường, dấu gạch ngang, không dấu — VD: `og-dich-vu-seo.jpg`
- **Định dạng:** ưu tiên `.jpg` (nhỏ hơn `.png`), dùng `.webp` nếu cần tối ưu hơn

---

## Cách cập nhật OG image cho từng trang

OG metadata được đặt trong file `layout.tsx` của từng trang (vì `page.tsx` dùng `"use client"`).

### Cấu trúc file layout.tsx

```
app/
  cong-cu-ai/
    layout.tsx   ← OG metadata cho /cong-cu-ai
    page.tsx
  dich-vu/
    seo/
      layout.tsx ← OG metadata cho /dich-vu/seo (nếu cần)
      page.tsx
```

### Ví dụ cập nhật OG image

Mở file `app/cong-cu-ai/layout.tsx`, tìm dòng `images:` và thay URL:

```typescript
images: [
  {
    url: "https://kpgtiqepktofdfyxgsbw.supabase.co/storage/v1/object/public/images/TÊN-FILE-MỚI.jpg",
    width: 1200,
    height: 630,
    alt: "Mô tả ảnh",
  },
],
```

---

## Checklist khi thêm trang mới

- [ ] Tạo file `app/[tên-trang]/layout.tsx` với metadata đầy đủ
- [ ] Upload OG image lên Supabase Storage (1200x630px, < 300KB)
- [ ] Cập nhật `og:image` URL trong layout.tsx
- [ ] Thêm URL trang vào `app/sitemap.ts`
- [ ] Thêm link trang vào Navbar (desktop + mobile)
- [ ] Commit & push → Vercel tự deploy

---

## Công cụ nén ảnh miễn phí (trước khi upload)

- **Squoosh** — https://squoosh.app (nén trực tiếp trên web, không cần cài đặt)
- **TinyPNG** — https://tinypng.com (kéo thả, hỗ trợ JPG + PNG)
- **GIMP / Photoshop** — Export for Web, chọn quality 75-85%
