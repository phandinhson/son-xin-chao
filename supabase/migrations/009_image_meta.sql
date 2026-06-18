-- Migration 009: Tạo bảng image_meta cho Thư viện ảnh
-- Thay thế file _meta.json trên filesystem (không dùng được trên Vercel)

CREATE TABLE IF NOT EXISTS image_meta (
  id          BIGSERIAL PRIMARY KEY,
  filename    TEXT UNIQUE NOT NULL,
  title       TEXT,
  alt         TEXT,
  description TEXT,
  tags        TEXT[],
  focal_x     NUMERIC,
  focal_y     NUMERIC,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index để query theo filename nhanh hơn
CREATE INDEX IF NOT EXISTS idx_image_meta_filename ON image_meta (filename);

-- RLS: chỉ service role được thao tác (admin API dùng service role key)
ALTER TABLE image_meta ENABLE ROW LEVEL SECURITY;

-- Không cần public access cho bảng này
-- API routes dùng supabaseAdmin() (service role) nên không bị chặn bởi RLS
