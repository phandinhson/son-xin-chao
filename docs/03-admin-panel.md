# 03 — Admin Panel

## Đăng nhập

- URL: `http://localhost:3000/admin`
- Password: `Son@2026` (set trong `ADMIN_PASSWORD` env)
- Auth dùng cookie `admin_session` = giá trị `ADMIN_SECRET`
- Cookie check trong mọi API route admin: `req.cookies.get("admin_session")?.value === process.env.ADMIN_SECRET`

---

## Sidebar Layout (`app/admin/layout.tsx`)

```tsx
const navItems = [
  { href: "/admin/dashboard",  label: "Dashboard",        icon: "📊" },
  { href: "/admin/analytics",  label: "Phân tích",        icon: "📈" },
  { href: "/admin/posts",      label: "Bài viết",         icon: "📝" },
  { href: "/admin/categories", label: "Danh mục",         icon: "🏷️" },
  { href: "/admin/portfolio",  label: "Portfolio",        icon: "🗂️" },
  { href: "/admin/pricing",    label: "Bảng giá",         icon: "💰" },
  { href: "/admin/addons",     label: "Dịch vụ bổ sung",  icon: "➕" },
  { href: "/admin/settings",   label: "Cài đặt trang",    icon: "⚙️" },
];
```

Active state: `pathname.startsWith(item.href)`

---

## Admin Post Editor (`app/admin/posts/[id]/page.tsx`)

### Types

```tsx
type DbCategory = {
  id: string;
  label: string;
  value: string;
  icon: string;
  color_key: string;
};
```

### Fetch categories khi load trang

```tsx
useEffect(() => {
  fetch("/api/admin/categories", { credentials: "include" })
    .then(r => r.json())
    .then(setCategories);
}, []);
```

### Category selector

```tsx
<select
  value={form.category}
  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
  className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-2.5 text-white"
>
  <option value="">-- Chọn danh mục --</option>
  {categories.map(cat => (
    <option key={cat.id} value={cat.value}>
      {cat.icon} {cat.label}
    </option>
  ))}
</select>
```

### Liên kết với website chính

Trong header và actions bar có nút xem bài viết trực tiếp:

```tsx
// Header — luôn hiển thị
<a href={`/blog/${form.slug}`} target="_blank"
   className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-gray-300 hover:text-white text-sm">
  🔗 Xem trên website
</a>

// Actions bar — có điều kiện
{form.status === "published" ? (
  <a href={`/blog/${form.slug}`} target="_blank"
     className="... bg-green-600/20 text-green-400 ...">
    👁 Xem bài đăng
  </a>
) : (
  <a href={`/blog/${form.slug}`} target="_blank"
     className="... bg-white/10 text-gray-400 ...">
    🔍 Xem trước
  </a>
)}
```

---

## Admin Category Management (`app/admin/categories/page.tsx`)

### Tính năng

- ✅ Xem danh sách tất cả danh mục
- ✅ Thêm danh mục mới
- ✅ Sửa danh mục
- ✅ Xóa danh mục (có confirm dialog)
- ✅ Live preview badge màu trong form

### Form fields

| Field | Type | Mô tả |
|---|---|---|
| `label` | text | Tên hiển thị: "SEO", "Google Ads" |
| `value` | text | Slug: "seo", "google-ads" (tự gen từ label) |
| `icon` | text | Emoji: "🔍", "📊" |
| `sort_order` | number | Thứ tự hiển thị |
| `color_key` | select | Khóa màu: "blue", "green", ... |
| `sub_topics` | textarea | Mỗi dòng 1 topic, lưu thành array |

### Color options

```tsx
const COLOR_OPTIONS = [
  { key: "blue",   label: "Xanh dương",   preview: "bg-blue-100 text-blue-700" },
  { key: "green",  label: "Xanh lá",      preview: "bg-green-100 text-green-700" },
  { key: "purple", label: "Tím",          preview: "bg-purple-100 text-purple-700" },
  { key: "orange", label: "Cam",          preview: "bg-orange-100 text-orange-700" },
  { key: "red",    label: "Đỏ",           preview: "bg-red-100 text-red-700" },
  { key: "yellow", label: "Vàng",         preview: "bg-yellow-100 text-yellow-700" },
  { key: "teal",   label: "Xanh ngọc",    preview: "bg-teal-100 text-teal-700" },
  { key: "gray",   label: "Xám",          preview: "bg-gray-100 text-gray-700" },
];
```

### API calls

```tsx
// Lấy danh sách
const res = await fetch("/api/admin/categories", { credentials: "include" });

// Thêm mới
await fetch("/api/admin/categories", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify(formData),
});

// Sửa
await fetch(`/api/admin/categories/${id}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify(formData),
});

// Xóa
await fetch(`/api/admin/categories/${id}`, {
  method: "DELETE",
  credentials: "include",
});
```

### Auto-generate slug từ label

```tsx
function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// Khi user gõ label, tự điền value
onChange={e => {
  const label = e.target.value;
  setForm(f => ({
    ...f,
    label,
    value: f.value === toSlug(f.label) ? toSlug(label) : f.value
  }));
}}
```
