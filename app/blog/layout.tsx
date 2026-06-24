// Blog Layout — import blog.css chỉ cho /blog/* routes
// Tách ra khỏi globals.css → tiết kiệm ~30KB CSS trên mọi trang không phải blog
import "./blog.css";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
