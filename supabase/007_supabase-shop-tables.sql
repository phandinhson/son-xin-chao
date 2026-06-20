-- ============================================================
-- SHOP SYSTEM — Chạy script này trong Supabase SQL Editor
-- https://app.supabase.com → SQL Editor → New Query
-- ============================================================

-- ── Bảng sản phẩm ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT        NOT NULL,
  slug             TEXT        UNIQUE NOT NULL,
  short_description TEXT,
  description      TEXT,
  price            BIGINT      NOT NULL DEFAULT 0,
  sale_price       BIGINT,
  images           TEXT[]      DEFAULT '{}',
  category         TEXT        DEFAULT 'Khác',
  tags             TEXT[]      DEFAULT '{}',
  status           TEXT        DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  featured         BOOLEAN     DEFAULT false,
  stock            INTEGER     DEFAULT -1,  -- -1 = không giới hạn
  sort_order       INTEGER     DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── Bảng đơn hàng ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number     TEXT        UNIQUE NOT NULL,
  customer_name    TEXT        NOT NULL,
  customer_phone   TEXT        NOT NULL,
  customer_email   TEXT,
  customer_address TEXT,
  items            JSONB       NOT NULL DEFAULT '[]',
  subtotal         BIGINT      NOT NULL DEFAULT 0,
  total            BIGINT      NOT NULL DEFAULT 0,
  note             TEXT,
  status           TEXT        DEFAULT 'pending'
                   CHECK (status IN ('pending','confirmed','shipping','delivered','cancelled')),
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── Trigger tự cập nhật updated_at ────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Row Level Security ────────────────────────────────────
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders   ENABLE ROW LEVEL SECURITY;

-- Ai cũng đọc được sản phẩm đã published
CREATE POLICY "Public read published products"
  ON products FOR SELECT
  USING (status = 'published');

-- Service role (admin) được làm mọi thứ
CREATE POLICY "Service role full products"
  ON products
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Service role quản lý đơn hàng
CREATE POLICY "Service role full orders"
  ON orders
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Ai cũng có thể tạo đơn hàng mới (đặt hàng)
CREATE POLICY "Anyone can insert orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- ── Dữ liệu mẫu (tuỳ chọn) ───────────────────────────────
-- Bỏ comment phần bên dưới nếu muốn thêm sản phẩm mẫu:
/*
INSERT INTO products (name, slug, short_description, price, sale_price, category, status, featured, sort_order)
VALUES
  (
    'Gói SEO Starter 3 tháng',
    'goi-seo-starter',
    'Phù hợp doanh nghiệp mới bắt đầu xây dựng hiện diện online. SEO on-page cơ bản, 10 từ khoá mục tiêu.',
    10500000,
    9500000,
    'Dịch vụ SEO',
    'published',
    true,
    1
  ),
  (
    'Gói Chạy Google Ads',
    'goi-google-ads',
    'Quản lý Google Search Ads chuyên nghiệp. Tối ưu CPA, tăng ROAS.',
    7000000,
    NULL,
    'Chạy quảng cáo',
    'published',
    false,
    2
  );
*/
