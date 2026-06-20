-- ============================================================
--  Migration: Thêm cột focus_keyword vào bảng posts
--  Chạy trong: Supabase Dashboard → SQL Editor
-- ============================================================

ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS focus_keyword TEXT;

-- Kiểm tra kết quả
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'posts'
ORDER BY ordinal_position;
