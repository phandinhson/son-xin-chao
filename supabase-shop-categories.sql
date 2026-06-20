-- ============================================================
-- SHOP CATEGORIES — Chạy trong Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS shop_categories (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        NOT NULL UNIQUE,
  icon       TEXT        DEFAULT '📦',
  color      TEXT        DEFAULT '#6366f1',
  bg         TEXT        DEFAULT '#eef2ff',
  sort_order INTEGER     DEFAULT 0,
  active     BOOLEAN     DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_shop_cat_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS shop_categories_updated_at ON shop_categories;
CREATE TRIGGER shop_categories_updated_at
  BEFORE UPDATE ON shop_categories
  FOR EACH ROW EXECUTE FUNCTION update_shop_cat_updated_at();

-- RLS
ALTER TABLE shop_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read shop_categories"
  ON shop_categories FOR SELECT USING (active = true);
CREATE POLICY "Service role shop_categories"
  ON shop_categories USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ── Seed dữ liệu mặc định ─────────────────────────────────
INSERT INTO shop_categories (name, icon, color, bg, sort_order) VALUES
  ('Dịch vụ SEO',      '🔍', '#0ea5e9', '#e0f2fe', 1),
  ('Chạy quảng cáo',   '📣', '#f97316', '#fff7ed', 2),
  ('Thiết kế website',  '💻', '#10b981', '#ecfdf5', 3),
  ('Tư vấn',           '💬', '#8b5cf6', '#f5f3ff', 4),
  ('Khác',             '📦', '#f59e0b', '#fffbeb', 5)
ON CONFLICT (name) DO NOTHING;
