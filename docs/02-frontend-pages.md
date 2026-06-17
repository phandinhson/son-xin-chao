# 02 — Frontend Pages

## Navbar (`components/Navbar.tsx`)

### Lỗi đã fix: Anchor links bị sai khi ở sub-page

**Vấn đề:** Khi đang ở `/blog`, bấm "Về Sơn" → đi tới `/blog#about` thay vì `/#about`

**Fix:** Đổi tất cả anchor link thành absolute path:

```tsx
// ❌ Sai — relative
{ href: "#about", label: "Về Sơn" }

// ✅ Đúng — absolute
{ href: "/#about", label: "Về Sơn" }
```

Áp dụng cho: desktop nav, SERVICES dropdown, mobile menu array, CTA button.

---

## Blog Listing (`app/blog/page.tsx`)

### Types

```tsx
type DbCategory = {
  id: string;
  label: string;       // "SEO", "Google Ads", ...
  value: string;       // "seo", "google-ads", ...
  icon: string;        // emoji
  color_key: string;   // "blue", "green", ...
  sub_topics: string[];
  sort_order: number;
};

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;    // khớp với DbCategory.value
  published_at: string;
  views?: number;
};
```

### Color Map

```tsx
const COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  blue:   { bg: "bg-blue-100",   text: "text-blue-700",   border: "border-blue-200" },
  green:  { bg: "bg-green-100",  text: "text-green-700",  border: "border-green-200" },
  purple: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" },
  orange: { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200" },
  red:    { bg: "bg-red-100",    text: "text-red-700",    border: "border-red-200" },
  yellow: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200" },
  teal:   { bg: "bg-teal-100",   text: "text-teal-700",   border: "border-teal-200" },
  gray:   { bg: "bg-gray-100",   text: "text-gray-700",   border: "border-gray-200" },
};

function getCatColor(colorKey: string) {
  return COLOR_MAP[colorKey] ?? COLOR_MAP.gray;
}
```

### Lấy tag cho bài viết

```tsx
function getTag(post: Post, categories: DbCategory[]) {
  // 1. Dùng field category trong DB
  if (post.category) {
    const cat = categories.find(c => c.value === post.category);
    if (cat) return cat;
  }
  // 2. Fallback: detect từ title (cũ, chỉ dự phòng)
  const title = post.title.toLowerCase();
  if (title.includes("seo")) return categories.find(c => c.value === "seo");
  // ...
  return null;
}
```

### Fetch dữ liệu

```tsx
// Fetch song song: posts + categories
const [postsRes, catsRes] = await Promise.all([
  fetch("/api/posts"),
  fetch("/api/categories"),
]);
const posts = await postsRes.json();
const categories = await catsRes.json();
```

### Category cards

Render từ DB categories (không hardcode), đếm số bài dựa trên `post.category` field:

```tsx
{categories.map(cat => {
  const count = posts.filter(p => p.category === cat.value).length;
  const color = getCatColor(cat.color_key);
  return (
    <div key={cat.id} className={`${color.bg} ${color.border} border rounded-xl p-4`}>
      <span>{cat.icon}</span>
      <span className={color.text}>{cat.label}</span>
      <span>{count} bài</span>
    </div>
  );
})}
```

---

## Blog Post (`app/blog/[slug]/page.tsx`)

### Giao diện

- **Theme:** Light (trắng), không phải dark
- **Style:** Giống GTV SEO — heading nổi bật, TOC bên trái, article bên phải
- **Layout:** `max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr]`

### Auto Table of Contents (TOC)

#### Type

```tsx
type TocItem = {
  level: 2 | 3;
  text: string;
  id: string;
};
```

#### Hàm slugify (Vietnamese → URL-safe ID)

```tsx
function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
```

#### Hàm buildTocAndInjectIds

```tsx
function buildTocAndInjectIds(html: string): { toc: TocItem[]; html: string } {
  const toc: TocItem[] = [];
  const usedIds = new Map<string, number>();

  const processed = html.replace(
    /<(h[23])([^>]*)>([\s\S]*?)<\/h[23]>/gi,
    (match, tag, attrs, content) => {
      const level = parseInt(tag[1]) as 2 | 3;
      const text = content.replace(/<[^>]+>/g, "").trim();
      let id = slugify(text);

      // Đảm bảo ID unique
      if (usedIds.has(id)) {
        const count = usedIds.get(id)! + 1;
        usedIds.set(id, count);
        id = `${id}-${count}`;
      } else {
        usedIds.set(id, 0);
      }

      toc.push({ level, text, id });
      return `<${tag}${attrs} id="${id}">${content}</${tag}>`;
    }
  );

  return { toc, html: processed };
}
```

#### Component TableOfContents

```tsx
function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handler = () => {
      // Tìm heading đang trong viewport
      for (const item of [...items].reverse()) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveId(item.id);
          return;
        }
      }
      setActiveId("");
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [items]);

  return (
    <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <button onClick={() => setCollapsed(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <span className="font-bold text-sm">📋 Mục lục bài viết</span>
        <span>{collapsed ? "▼" : "▲"}</span>
      </button>
      {/* Items */}
      {!collapsed && (
        <nav className="p-3 max-h-[60vh] overflow-y-auto">
          {items.map(item => (
            <a key={item.id} href={`#${item.id}`}
              onClick={e => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`block py-1.5 text-sm transition-all ${
                item.level === 2
                  ? `pl-3 font-semibold ${activeId === item.id ? "text-blue-600" : "text-gray-800"}`
                  : `pl-6 text-gray-500 ${activeId === item.id ? "text-blue-500" : ""}`
              }`}
            >
              {item.level === 3 && <span className="mr-1 text-gray-400">›</span>}
              {item.text}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
```

### CSS cho nội dung bài viết (`.blog-content`)

Đặt trong `<style>` tag ngay trong component:

```css
.blog-content h2 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1e3a5f;
  margin: 2rem 0 1rem;
  padding: 0.75rem 1.25rem;
  border-left: 4px solid #2563eb;
  background: linear-gradient(to right, #eff6ff, #f8fafc);
  border-radius: 0 10px 10px 0;
  line-height: 1.4;
}

.blog-content h3 {
  font-size: 1.15rem;
  font-weight: 600;
  color: #1d4ed8;
  margin: 1.5rem 0 0.75rem;
  padding: 0.5rem 1rem;
  border-left: 3px solid #93c5fd;
  background: #f0f7ff;
  border-radius: 0 8px 8px 0;
}

.blog-content p {
  line-height: 1.8;
  color: #374151;
  margin-bottom: 1rem;
}

.blog-content ul, .blog-content ol {
  margin: 0.75rem 0 1rem 1.5rem;
  line-height: 1.8;
  color: #374151;
}

.blog-content li { margin-bottom: 0.4rem; }

.blog-content strong { color: #111827; font-weight: 700; }

.blog-content a {
  color: #2563eb;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.blog-content blockquote {
  border-left: 4px solid #3b82f6;
  background: #eff6ff;
  padding: 1rem 1.25rem;
  margin: 1.5rem 0;
  border-radius: 0 8px 8px 0;
  color: #1e40af;
  font-style: italic;
}

.blog-content table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
.blog-content th { background: #1e40af; color: white; padding: 0.75rem 1rem; text-align: left; }
.blog-content td { padding: 0.6rem 1rem; border-bottom: 1px solid #e5e7eb; color: #374151; }
.blog-content tr:nth-child(even) td { background: #f8fafc; }
```

### Sử dụng trong bài viết

```tsx
// Server component — inject IDs vào HTML
const { toc, html: processedHtml } = buildTocAndInjectIds(post.content);

// Client component — render
<article
  className="blog-content max-w-none"
  dangerouslySetInnerHTML={{ __html: processedHtml }}
/>
```
