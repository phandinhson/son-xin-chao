-- ============================================================
--  SƠN XIN CHÀO — Supabase Schema
--  Chạy file này trong Supabase SQL Editor
-- ============================================================

-- 1. POSTS (Bài viết blog)
CREATE TABLE IF NOT EXISTS posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  content     TEXT,
  excerpt     TEXT,
  cover_image TEXT,
  status      TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. PORTFOLIO (Dự án)
CREATE TABLE IF NOT EXISTS portfolio (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title          TEXT NOT NULL,
  industry       TEXT,
  category       TEXT NOT NULL CHECK (category IN ('SEO', 'Ads', 'Website')),
  result         TEXT,
  detail         TEXT,
  tags           TEXT[] DEFAULT '{}',
  metric_before  TEXT,
  metric_after   TEXT,
  metric_unit    TEXT,
  icon           TEXT DEFAULT '🔍',
  color          TEXT DEFAULT 'from-blue-600 to-cyan-500',
  sort_order     INT DEFAULT 0,
  active         BOOLEAN DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. PRICING (Bảng giá)
CREATE TABLE IF NOT EXISTS pricing (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  icon         TEXT DEFAULT '🌱',
  price        TEXT NOT NULL,
  unit         TEXT DEFAULT 'đ/tháng',
  description  TEXT,
  features     TEXT[] DEFAULT '{}',
  not_included TEXT[] DEFAULT '{}',
  is_popular   BOOLEAN DEFAULT false,
  cta_text     TEXT DEFAULT 'Bắt đầu ngay',
  sort_order   INT DEFAULT 0
);

-- 4. SITE SETTINGS (Cài đặt nội dung trang)
CREATE TABLE IF NOT EXISTS site_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger tự cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Seed: Cài đặt mặc định
INSERT INTO site_settings (key, value) VALUES
  ('hero_name',          'Sơn'),
  ('hero_tagline',       'Digital Marketing Specialist'),
  ('hero_description',   'Tôi giúp doanh nghiệp tăng traffic hữu cơ, tối ưu quảng cáo và xây dựng website chuyên nghiệp — mang lại kết quả thực tế, đo lường được.'),
  ('stat_years',         '3+'),
  ('stat_projects',      '50+'),
  ('stat_satisfaction',  '98%'),
  ('stat_roas',          '2x'),
  ('contact_phone',      '0968806360'),
  ('contact_zalo',       '0968806360'),
  ('contact_facebook',   'fb.com/sonxinchao'),
  ('contact_email',      'son@sonxinchao.com'),
  ('about_description',  'Với hơn 3 năm trong ngành Digital Marketing, tôi đã giúp hàng chục doanh nghiệp vừa và nhỏ tăng trưởng bền vững qua các kênh online.'),
  ('logo_url',           ''),
  ('logo_text',          'Sơn Xin Chào')
ON CONFLICT (key) DO NOTHING;

-- Seed: Portfolio mẫu
INSERT INTO portfolio (title, industry, category, result, detail, tags, metric_before, metric_after, metric_unit, icon, color, sort_order)
VALUES
  ('Showroom Xe Điện Nhơn Trạch', 'Xe điện / Yadea', 'SEO', '+340% traffic organic', 'Từ 200 → 880 lượt/tháng trong 5 tháng', ARRAY['SEO Local', 'Content', 'Google Map'], '200', '880', 'lượt/tháng', '🔍', 'from-blue-600 to-cyan-500', 1),
  ('Cửa hàng Sửa Chữa iPhone', 'Điện thoại / Sửa chữa', 'Ads', 'ROAS 5.2x — CPA giảm 40%', 'Google Search + Meta Ads đồng thời', ARRAY['Google Ads', 'Facebook Ads', 'Remarketing'], '2.1x', '5.2x', 'ROAS', '📱', 'from-violet-600 to-pink-500', 2),
  ('Website Bất Động Sản', 'Bất động sản', 'Website', '10 ngày ra mắt, 95 PageSpeed', 'WordPress + Elementor chuẩn SEO', ARRAY['WordPress', 'SEO', 'Tốc độ cao'], '45', '95', 'PageSpeed', '💻', 'from-emerald-600 to-teal-500', 3)
ON CONFLICT DO NOTHING;

-- Seed: Pricing mẫu
INSERT INTO pricing (name, icon, price, unit, description, features, not_included, is_popular, cta_text, sort_order)
VALUES
  ('Starter', '🌱', '3.500.000', 'đ/tháng', 'Phù hợp doanh nghiệp mới bắt đầu xây dựng hiện diện online', ARRAY['SEO on-page cơ bản (5 trang)', 'Nghiên cứu 10 từ khóa mục tiêu', 'Báo cáo thứ hạng hàng tháng', 'Tối ưu Google Business Profile', '1 bài blog SEO/tuần', 'Hỗ trợ qua Zalo'], ARRAY['Quảng cáo trả phí', 'Thiết kế website'], false, 'Bắt đầu ngay', 1),
  ('Growth', '🚀', '7.000.000', 'đ/tháng', 'Lựa chọn tốt nhất cho doanh nghiệp muốn tăng trưởng nhanh và bền vững', ARRAY['SEO toàn diện (on-page + technical)', 'Nghiên cứu 30+ từ khóa', 'Báo cáo traffic & thứ hạng hàng tuần', 'Quản lý Google Ads hoặc Facebook Ads', 'Ngân sách quảng cáo đề xuất: 5–15 triệu', '4 bài blog SEO/tháng + nội dung ads', 'Tối ưu trang đích (Landing Page)', 'Hỗ trợ ưu tiên 24/5'], '{}', true, 'Chọn gói này', 2),
  ('Pro', '👑', 'Liên hệ', 'báo giá riêng', 'Giải pháp tùy chỉnh toàn diện cho doanh nghiệp có nhu cầu đặc biệt', ARRAY['Toàn bộ dịch vụ gói Growth', 'Thiết kế / nâng cấp website WordPress', 'Quản lý đồng thời Google + Facebook Ads', 'Chiến lược content marketing toàn diện', 'Dashboard báo cáo tùy chỉnh', 'Hỗ trợ 7 ngày/tuần, phản hồi trong ngày'], '{}', false, 'Nhận báo giá', 3)
ON CONFLICT DO NOTHING;
