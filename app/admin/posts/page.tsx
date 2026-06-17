"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Post } from "@/lib/supabase";

export default function PostsAdmin() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const res = await fetch("/api/admin/posts");
    if (res.ok) setPosts(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Xóa bài "${title}"?`)) return;
    await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    await load();
  };

  const handleToggleStatus = async (post: Post) => {
    const newStatus = post.status === "published" ? "draft" : "published";
    await fetch(`/api/admin/posts/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    await load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Bài viết</h1>
          <p className="text-gray-400 mt-1">{posts.length} bài viết</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg"
        >
          + Viết bài mới
        </Link>
      </div>

      {loading ? (
        <div className="text-gray-500 text-center py-20">Đang tải...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📝</div>
          <p className="text-gray-400 mb-6">Chưa có bài viết nào. Bắt đầu viết thôi!</p>
          <Link href="/admin/posts/new" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:opacity-90 transition-all">
            Viết bài đầu tiên
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 transition-all group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-white font-semibold truncate">{post.title}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${
                    post.status === "published"
                      ? "bg-green-500/15 text-green-400 border border-green-500/20"
                      : "bg-gray-500/15 text-gray-400 border border-gray-500/20"
                  }`}>
                    {post.status === "published" ? "Đã đăng" : "Bản nháp"}
                  </span>
                </div>
                <p className="text-gray-500 text-sm truncate">{post.excerpt || "Chưa có mô tả"}</p>
                <p className="text-gray-600 text-xs mt-1">
                  {new Date(post.created_at).toLocaleDateString("vi-VN")} · /{post.slug}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleToggleStatus(post)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    post.status === "published"
                      ? "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30"
                      : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                  }`}
                >
                  {post.status === "published" ? "→ Draft" : "→ Đăng"}
                </button>
                <Link
                  href={`/admin/posts/${post.id}`}
                  className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-500/30 transition-all"
                >
                  Sửa
                </Link>
                <button
                  onClick={() => handleDelete(post.id, post.title)}
                  className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/30 transition-all"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
