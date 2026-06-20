-- =============================================================
-- Migration: Bảng admin_users — phân quyền admin / user
-- Chạy trong Supabase Dashboard → SQL Editor
-- =============================================================

CREATE TABLE IF NOT EXISTS admin_users (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  email         TEXT        UNIQUE NOT NULL,
  password_hash TEXT        NOT NULL,
  name          TEXT        NOT NULL DEFAULT '',
  role          TEXT        NOT NULL DEFAULT 'user'
                            CHECK (role IN ('admin', 'user')),
  active        BOOLEAN     NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  last_login    TIMESTAMPTZ
);

-- Chỉ service role key mới được đọc/ghi bảng này
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Không cho phép bất kỳ ai qua Supabase client thông thường
-- (chỉ supabaseAdmin() dùng service key mới truy cập được)
CREATE POLICY "deny_all" ON admin_users FOR ALL USING (false);

-- =============================================================
-- Tài khoản mặc định
-- Email   : son@sonxinchao.com
-- Password: Admin@2026!   ← đổi ngay sau lần đầu đăng nhập
-- =============================================================
INSERT INTO admin_users (email, password_hash, name, role) VALUES (
  'son@sonxinchao.com',
  'pbkdf2:3090b66b02727e9e830a9f423567a7cc:b68ccd11ba0d1fb652e19a5d28dad47182ddc34d2a220b316e89be59ffc2e4e2',
  'Phan Đình Sơn',
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- =============================================================
-- Indexes
-- =============================================================
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users (email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role  ON admin_users (role);
