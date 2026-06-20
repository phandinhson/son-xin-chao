-- ============================================================
-- NAV ITEMS — Chạy trong Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS nav_items (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  label        TEXT        NOT NULL,
  href         TEXT        NOT NULL DEFAULT '#',
  icon         TEXT        DEFAULT '',
  description  TEXT        DEFAULT '',
  type         TEXT        DEFAULT 'link'
               CHECK (type IN ('link', 'group', 'item')),
  -- type='link'  → top-level đơn (không dropdown)
  -- type='group' → dropdown button (cha)
  -- type='item'  → item bên trong dropdown (con, có parent_id)
  parent_id    UUID        REFERENCES nav_items(id) ON DELETE CASCADE,
  sort_order   INTEGER     DEFAULT 0,
  active       BOOLEAN     DEFAULT true,
  open_new_tab BOOLEAN     DEFAULT false,
  badge        TEXT        DEFAULT '',   -- vd: "AI", "NEW", "HOT"
  badge_color  TEXT        DEFAULT '',   -- vd: "violet", "red", "green"
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_nav_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS nav_items_updated_at ON nav_items;
CREATE TRIGGER nav_items_updated_at
  BEFORE UPDATE ON nav_items
  FOR EACH ROW EXECUTE FUNCTION update_nav_updated_at();

-- RLS
ALTER TABLE nav_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read nav_items"   ON nav_items FOR SELECT USING (active = true);
CREATE POLICY "Service role nav_items"  ON nav_items USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ── Seed dữ liệu mặc định (menu hiện tại) ─────────────────
-- Top-level links
INSERT INTO nav_items (label, href, type, sort_order, active) VALUES
  ('Về Sơn',    '/gioi-thieu', 'link', 1, true),
  ('Portfolio', '/#portfolio', 'link', 4, true),
  ('Bảng giá',  '/pricing',    'link', 5, true),
  ('Cửa hàng',  '/shop',       'link', 6, true);

-- Dropdown groups
INSERT INTO nav_items (id, label, href, type, sort_order, badge, badge_color, active) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001', 'Seo AI',    '#', 'group', 2, 'AI', 'violet', true),
  ('aaaaaaaa-0000-0000-0000-000000000002', 'Dịch vụ',  '#', 'group', 3, '',   '',       true),
  ('aaaaaaaa-0000-0000-0000-000000000003', 'Kiến thức', '#', 'group', 7, '',   '',       true);

-- Items của SEO AI
INSERT INTO nav_items (label, href, icon, description, type, parent_id, sort_order) VALUES
  ('SEO Từ khóa',              '/contact',       '🔑', 'Nghiên cứu & chọn từ khóa tiềm năng bằng AI',       'item', 'aaaaaaaa-0000-0000-0000-000000000001', 1),
  ('SEO Tổng thể',             '/dich-vu/seo',   '🚀', 'Chiến lược SEO toàn diện cho website',               'item', 'aaaaaaaa-0000-0000-0000-000000000001', 2),
  ('Dịch vụ SEO hiệu quả cao', '/dich-vu/seo',   '📈', 'Cam kết top Google trong 3–6 tháng',                'item', 'aaaaaaaa-0000-0000-0000-000000000001', 3),
  ('SEO Onpage',               '/dich-vu/seo',   '📝', 'Tối ưu nội dung, cấu trúc, tốc độ trang',           'item', 'aaaaaaaa-0000-0000-0000-000000000001', 4);

-- Items của Dịch vụ
INSERT INTO nav_items (label, href, icon, description, type, parent_id, sort_order) VALUES
  ('SEO Organic',             '/dich-vu/seo',              '🔍', 'Lên top Google bền vững, tăng traffic tự nhiên',         'item', 'aaaaaaaa-0000-0000-0000-000000000002', 1),
  ('SEO TP.HCM',              '/dich-vu/seo-hcm',          '🏙️', 'Chuyên biệt cho doanh nghiệp tại TP. Hồ Chí Minh',       'item', 'aaaaaaaa-0000-0000-0000-000000000002', 2),
  ('Google Ads',              '/dich-vu/google-ads',       '📈', 'Quảng cáo tìm kiếm & display hiệu quả',                  'item', 'aaaaaaaa-0000-0000-0000-000000000002', 3),
  ('Facebook Ads',            '/dich-vu/facebook-ads',     '📣', 'Tiếp cận đúng khách hàng mục tiêu trên Meta',            'item', 'aaaaaaaa-0000-0000-0000-000000000002', 4),
  ('TikTok Ads',              '/dich-vu/tiktok-ads',       '🎵', 'Viral content & quảng cáo video TikTok',                 'item', 'aaaaaaaa-0000-0000-0000-000000000002', 5),
  ('Thiết kế Website',        '/dich-vu/thiet-ke-website', '💻', 'WordPress chuẩn SEO, tốc độ cao',                        'item', 'aaaaaaaa-0000-0000-0000-000000000002', 6),
  ('SEO Local (Google Map)',   '/dich-vu/seo-local',        '📍', 'Hiển thị khi khách tìm kiếm gần bạn',                   'item', 'aaaaaaaa-0000-0000-0000-000000000002', 7),
  ('Audit & Tư vấn',          '/dich-vu/audit-tu-van',     '🎯', 'Phân tích toàn diện & lộ trình chiến lược',              'item', 'aaaaaaaa-0000-0000-0000-000000000002', 8);

-- Items của Kiến thức
INSERT INTO nav_items (label, href, icon, description, type, parent_id, sort_order) VALUES
  ('Blog & Kiến thức',   '/blog',        '📖', 'Chia sẻ kiến thức thực chiến về Digital Marketing', 'item', 'aaaaaaaa-0000-0000-0000-000000000003', 1),
  ('Hướng dẫn SEO',     '/blog',        '🔍', 'Từ cơ bản đến nâng cao',                            'item', 'aaaaaaaa-0000-0000-0000-000000000003', 2),
  ('Google Ads',         '/blog',        '📊', 'Chạy quảng cáo hiệu quả, tiết kiệm chi phí',       'item', 'aaaaaaaa-0000-0000-0000-000000000003', 3),
  ('Website & WordPress','/blog',        '🌐', 'Xây dựng website chuẩn SEO',                        'item', 'aaaaaaaa-0000-0000-0000-000000000003', 4),
  ('Thủ thuật AI',       '/cong-cu-ai',  '🤖', 'Công cụ AI tạo ảnh, video, âm thanh & văn phòng',  'item', 'aaaaaaaa-0000-0000-0000-000000000003', 5);
