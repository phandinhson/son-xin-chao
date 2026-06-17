# 04 — API Routes & Database

## Auth pattern (dùng cho mọi admin API)

```ts
function checkAuth(req: NextRequest) {
  const session = req.cookies.get("admin_session")?.value;
  return session === process.env.ADMIN_SECRET;
}

// Dùng trong mỗi handler:
if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
```

---

## API Routes Map

| Method | URL | Auth | Mô tả |
|---|---|---|---|
| GET | `/api/categories` | ❌ Public | Lấy tất cả danh mục (cho blog public) |
| GET | `/api/admin/categories` | ✅ Admin | Lấy tất cả danh mục (cho admin) |
| POST | `/api/admin/categories` | ✅ Admin | Tạo danh mục mới |
| PUT | `/api/admin/categories/[id]` | ✅ Admin | Cập nhật danh mục |
| DELETE | `/api/admin/categories/[id]` | ✅ Admin | Xóa danh mục |
| POST | `/api/admin/auth` | ❌ Public | Đăng nhập admin |
| DELETE | `/api/admin/auth` | ❌ Public | Đăng xuất admin |

---

## API Source Code

### `/api/categories/route.ts` (Public)

```ts
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("categories")
    .select("*")
    .order("sort_order");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
```

### `/api/admin/categories/route.ts` (GET + POST)

```ts
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function checkAuth(req: NextRequest) {
  return req.cookies.get("admin_session")?.value === process.env.ADMIN_SECRET;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = supabaseAdmin();
  const { data, error } = await db.from("categories").select("*").order("sort_order");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const db = supabaseAdmin();
  const { data, error } = await db.from("categories").insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
```

### `/api/admin/categories/[id]/route.ts` (PUT + DELETE)

```ts
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function checkAuth(req: NextRequest) {
  return req.cookies.get("admin_session")?.value === process.env.ADMIN_SECRET;
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("categories").update(body).eq("id", params.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = supabaseAdmin();
  const { error } = await db.from("categories").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
```

---

## Database Schema

### Bảng `posts`

```sql
CREATE TABLE posts (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text NOT NULL,
  slug         text UNIQUE NOT NULL,
  excerpt      text,
  content      text,          -- HTML từ rich text editor
  category     text,          -- khớp với categories.value (vd: "seo")
  status       text DEFAULT 'draft', -- 'draft' | 'published'
  views        int DEFAULT 0,
  published_at timestamptz,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);
```

### Bảng `categories` (MỚI — cần chạy migration)

```sql
-- Tạo bảng
CREATE TABLE categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label       text NOT NULL,        -- "SEO", "Google Ads", "Website"
  value       text UNIQUE NOT NULL, -- "seo", "google-ads", "website"
  icon        text DEFAULT '📁',
  color_key   text DEFAULT 'gray',  -- "blue"|"green"|"purple"|"orange"|"red"|"yellow"|"teal"|"gray"
  sub_topics  text[] DEFAULT '{}',
  sort_order  int DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

-- Seed 4 danh mục mặc định
INSERT INTO categories (label, value, icon, color_key, sort_order, sub_topics) VALUES
  ('SEO',        'seo',        '🔍', 'blue',   1, ARRAY['SEO Tổng thể', 'SEO Onpage', 'SEO Từ khóa', 'SEO Local']),
  ('Google Ads', 'google-ads', '📊', 'green',  2, ARRAY['Search Ads', 'Display Ads', 'Shopping Ads']),
  ('Website',    'website',    '🌐', 'purple', 3, ARRAY['WordPress', 'Next.js / React', 'Landing Page']),
  ('Tips',       'tips',       '💡', 'orange', 4, ARRAY['Mẹo SEO', 'Công cụ', 'Case Study']);
```

> ⚠️ Chạy SQL này trong **Supabase Dashboard → SQL Editor** nếu chưa có bảng `categories`.

### Kiểm tra bảng đã tạo chưa

```sql
SELECT * FROM categories ORDER BY sort_order;
```

---

## Supabase Tips

### Luôn dùng `supabaseAdmin()` trong API routes

```ts
// ✅ Đúng — bypass RLS, dùng service role
import { supabaseAdmin } from "@/lib/supabase";
const db = supabaseAdmin();

// ❌ Sai — dùng anon key trong server có thể bị RLS chặn
import { supabase } from "@/lib/supabase";
```

### `force-dynamic` cho API routes

Thêm vào đầu mỗi route file để tránh Next.js cache kết quả:

```ts
export const dynamic = "force-dynamic";
```

### Lấy một record

```ts
const { data, error } = await db
  .from("posts")
  .select("*")
  .eq("slug", slug)
  .single(); // Trả về object thay vì array
```

### Upsert (insert hoặc update)

```ts
const { data, error } = await db
  .from("posts")
  .upsert({ slug: "my-post", title: "..." })
  .select()
  .single();
```
