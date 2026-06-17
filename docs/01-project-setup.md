# 01 — Project Setup & Môi Trường

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Deploy | Vercel |
| Domain | sonxinchao.com |

---

## Cấu trúc thư mục

```
son-xin-chao/
├── app/
│   ├── admin/
│   │   ├── layout.tsx          # Sidebar admin
│   │   ├── dashboard/
│   │   ├── analytics/
│   │   ├── posts/[id]/         # Chỉnh sửa bài viết
│   │   ├── categories/         # Quản lý danh mục
│   │   ├── portfolio/
│   │   ├── pricing/
│   │   ├── addons/
│   │   └── settings/
│   ├── api/
│   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── categories/
│   │   │   │   ├── route.ts    # GET + POST
│   │   │   │   └── [id]/route.ts # PUT + DELETE
│   │   │   └── posts/
│   │   └── categories/
│   │       └── route.ts        # Public GET
│   ├── blog/
│   │   ├── page.tsx            # Trang danh sách bài
│   │   └── [slug]/
│   │       └── page.tsx        # Trang bài viết
│   └── ...
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ...
├── lib/
│   └── supabase.ts
└── docs/                       # ← Tài liệu này
    ├── 01-project-setup.md
    ├── 02-frontend-pages.md
    ├── 03-admin-panel.md
    └── 04-api-database.md
```

---

## File `.env.local`

> ⚠️ KHÔNG commit file này lên git. Đã có trong `.gitignore`.

```env
VERCEL_OIDC_TOKEN="eyJhbG..."

NEXT_PUBLIC_SUPABASE_URL=https://kpgtiqepktofdfyxgsbw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

ADMIN_PASSWORD=Son@2026
ADMIN_SECRET=sonxinchao_secret_key_32chars_abc

GMAIL_USER=phandinhsonlp116@gmail.com
GMAIL_APP_PASSWORD=pskl njch llai dwhw

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> Khi deploy Vercel: thêm tất cả env này vào **Project Settings → Environment Variables**, đổi `NEXT_PUBLIC_SITE_URL` thành `https://sonxinchao.com`.

---

## Supabase Setup

### Kết nối Supabase trong code

File: `lib/supabase.ts`

```ts
import { createClient } from "@supabase/supabase-js";

// Client-side (anon key)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Server-side (service role — bypass RLS)
export function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
```

### RLS (Row Level Security)

- **`UNRESTRICTED` badge màu đỏ** trong Supabase Dashboard → bảng chưa bật RLS → không nguy hiểm nếu dùng `service_role` key ở server-side
- API routes dùng `supabaseAdmin()` → bypass RLS hoàn toàn → an toàn
- Nếu muốn sạch: vào Supabase → Table Editor → bảng đó → Enable RLS → thêm policy `SELECT` cho `anon`

---

## Truy cập website

| Môi trường | URL | Ai vào được |
|---|---|---|
| Local dev | `http://localhost:3000` | Chỉ máy bạn |
| Local network | `http://192.168.x.x:3000` | Cùng WiFi (test điện thoại) |
| Production | `https://sonxinchao.com` | Toàn thế giới |

**Test trên điện thoại (cùng WiFi):**
```bash
# Lấy IP máy Mac
ipconfig getifaddr en0
# Ví dụ: 192.168.1.5 → vào điện thoại gõ http://192.168.1.5:3000
```

---

## Deploy lên Vercel

```bash
# Lần đầu
npm i -g vercel
vercel

# Các lần sau
vercel --prod
```

Hoặc kết nối GitHub repo → Vercel tự động deploy khi push.
