-- ============================================================
--  Migration: Thêm cột category vào bảng posts
--  Mục đích: Lưu danh mục bài viết (liên kết với bảng categories.value)
--  Chạy trong: Supabase Dashboard → SQL Editor
--  URL: https://supabase.com/dashboard/project/kpgtiqepktofdfyxgsbw/editor/
-- ============================================================

ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT '';

-- Cập nhật published_at cho bài đã published (nếu chưa có)
ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

UPDATE posts
  SET published_at = created_at
  WHERE status = 'published' AND published_at IS NULL;

-- Kiểm tra kết quả
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'posts'
ORDER BY ordinal_position;
