-- Tạo bảng addons (Dịch vụ bổ sung)
CREATE TABLE IF NOT EXISTS addons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '⭐',
  price TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed data: 6 add-on mặc định
INSERT INTO addons (name, icon, price, unit, sort_order, active) VALUES
  ('Thiết kế website WordPress cơ bản', '🌐', '5.000.000', 'đ', 1, TRUE),
  ('Landing Page chuyển đổi cao', '📄', '3.000.000', 'đ', 2, TRUE),
  ('Audit SEO website hiện tại', '🔎', '1.500.000', 'đ', 3, TRUE),
  ('Setup Google Ads từ đầu', '⚙️', '2.000.000', 'đ', 4, TRUE),
  ('Viết bài SEO chất lượng cao', '✍️', '300.000', 'đ/bài', 5, TRUE),
  ('Quản lý Google Business Profile', '📍', '500.000', 'đ/tháng', 6, TRUE);
