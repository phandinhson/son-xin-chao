-- Bảng theo dõi lượt truy cập
CREATE TABLE IF NOT EXISTS page_views (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page        TEXT NOT NULL DEFAULT '/',
  referrer    TEXT DEFAULT '',
  ip_hash     TEXT DEFAULT '',   -- hash IP để đếm unique visitor (không lưu IP thật)
  user_agent  TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index để query nhanh
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_page ON page_views(page);
CREATE INDEX IF NOT EXISTS idx_page_views_ip_hash ON page_views(ip_hash);
