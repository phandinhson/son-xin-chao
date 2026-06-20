-- ════════════════════════════════════════════════════════
--  HOC AI — Tables for /hoc-ai page management
--  Run once in Supabase SQL Editor
-- ════════════════════════════════════════════════════════

-- ── 1. Videos ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hoc_ai_videos (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  youtube_id  text NOT NULL,
  channel     text NOT NULL DEFAULT 'Sơn Xin Chào',
  duration    text NOT NULL DEFAULT '',
  views       text NOT NULL DEFAULT '',
  sort_order  int  NOT NULL DEFAULT 0,
  active      bool NOT NULL DEFAULT true,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE hoc_ai_videos ENABLE ROW LEVEL SECURITY;

-- Public: read active videos
CREATE POLICY "public read hoc_ai_videos"
  ON hoc_ai_videos FOR SELECT
  USING (active = true);

-- Service role: full access (API routes use supabaseAdmin)
CREATE POLICY "service full access hoc_ai_videos"
  ON hoc_ai_videos FOR ALL
  USING (true);

-- ── 2. AI Tools ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hoc_ai_tools (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  description text NOT NULL DEFAULT '',
  category    text NOT NULL DEFAULT 'Học tập',
  badge       text NOT NULL DEFAULT 'Freemium',
  url         text NOT NULL,
  icon        text NOT NULL DEFAULT '🤖',
  color       text NOT NULL DEFAULT '#6366f1',
  is_hot      bool NOT NULL DEFAULT false,
  is_new      bool NOT NULL DEFAULT false,
  tags        text[] NOT NULL DEFAULT '{}',
  sort_order  int  NOT NULL DEFAULT 0,
  active      bool NOT NULL DEFAULT true,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE hoc_ai_tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read hoc_ai_tools"
  ON hoc_ai_tools FOR SELECT
  USING (active = true);

CREATE POLICY "service full access hoc_ai_tools"
  ON hoc_ai_tools FOR ALL
  USING (true);

-- ── Seed: Videos ───────────────────────────────────────
INSERT INTO hoc_ai_videos (title, youtube_id, channel, duration, views, sort_order) VALUES
  ('ChatGPT Full Tutorial — Dùng AI như Pro từ A đến Z',           'JTxsNm9IdYU', 'Sơn Xin Chào', '18:42', '12K',  1),
  ('Midjourney V6 — Tạo ảnh AI đẹp không tưởng chỉ trong 5 phút', 'rnIgnS7EKZE', 'Sơn Xin Chào', '12:05', '8.4K', 2),
  ('Suno AI — Tạo bài hát hoàn chỉnh từ 1 câu mô tả',             'kgLklMwdPo4', 'Sơn Xin Chào', '9:30',  '6.1K', 3),
  ('Gamma AI — Tạo slide thuyết trình đẹp chỉ bằng 1 câu',        '9L6v25IKGp8', 'Sơn Xin Chào', '7:15',  '5.2K', 4),
  ('Runway Gen-3 — AI tạo video điện ảnh chuyên nghiệp',           'GJfSTy0FZNE', 'Sơn Xin Chào', '14:20', '4.8K', 5),
  ('Perplexity AI — Công cụ nghiên cứu thay thế Google Search',    'H73nvMIKPR8', 'Sơn Xin Chào', '11:08', '3.9K', 6)
ON CONFLICT DO NOTHING;

-- ── Seed: AI Tools ─────────────────────────────────────
INSERT INTO hoc_ai_tools (name, description, category, badge, url, icon, color, is_hot, is_new, tags, sort_order) VALUES
  -- Học tập
  ('ChatGPT',     'Trợ lý AI đa năng nhất thế giới — giải bài tập, viết luận, giải thích khái niệm, lập kế hoạch học tập.', 'Học tập',        'Freemium', 'https://chatgpt.com',                    '🤖', '#10a37f', true,  false, ARRAY['Trợ lý','Giáo dục','Viết'],           1),
  ('Perplexity AI','Công cụ nghiên cứu thông minh, trả lời có trích dẫn nguồn rõ ràng. Thay thế Google cho học thuật.',     'Học tập',        'Freemium', 'https://perplexity.ai',                  '🔬', '#1fb8cd', true,  false, ARRAY['Nghiên cứu','Search','Tóm tắt'],       2),
  ('NotebookLM',  'AI của Google phân tích tài liệu cá nhân — upload PDF, note, website rồi hỏi đáp, tạo podcast.',         'Học tập',        'Miễn phí', 'https://notebooklm.google.com',          '📓', '#4285f4', false, true,  ARRAY['Ghi chú','PDF','Podcast AI'],          3),
  ('Gamma AI',    'Tạo slide thuyết trình, website, tài liệu đẹp từ một dòng mô tả — không cần thiết kế.',                  'Học tập',        'Freemium', 'https://gamma.app',                      '🎯', '#7c3aed', true,  false, ARRAY['Slide','Thuyết trình','Website'],      4),
  ('Claude',      'AI của Anthropic — phân tích sâu, lý luận logic, viết sáng tạo và an toàn. Rất tốt cho học thuật.',      'Học tập',        'Freemium', 'https://claude.ai',                      '⚡', '#d97706', false, false, ARRAY['Phân tích','Viết','Lý luận'],          5),
  -- Thiết kế & Ảnh
  ('Midjourney',  'Tạo ảnh nghệ thuật chất lượng cao nhất hiện nay. Được dùng bởi designers, illustrators toàn cầu.',       'Thiết kế & Ảnh', 'Trả phí',  'https://midjourney.com',                '🎨', '#e11d48', true,  false, ARRAY['Text-to-image','Nghệ thuật','Concept'], 6),
  ('Adobe Firefly','AI tích hợp trong Photoshop & Illustrator — xóa vật thể, mở rộng ảnh, thay nền, tạo vector.',           'Thiết kế & Ảnh', 'Freemium', 'https://firefly.adobe.com',             '🔥', '#ff4500', true,  false, ARRAY['Photoshop','Illustrator','Edit'],      7),
  ('Canva AI',    'Thiết kế đồ họa với Magic Studio — tạo ảnh, xóa nền, viết caption, resize tự động cho mọi nền tảng.',    'Thiết kế & Ảnh', 'Freemium', 'https://canva.com',                     '✏️', '#00c4cc', false, false, ARRAY['Social media','Poster','Infographic'], 8),
  ('Ideogram',    'AI tạo ảnh cực tốt về chữ trong ảnh — logo, poster, thumbnail YouTube với text rõ nét.',                  'Thiết kế & Ảnh', 'Freemium', 'https://ideogram.ai',                   '🖼️', '#6366f1', false, true,  ARRAY['Logo','Text trong ảnh','Poster'],       9),
  -- Video & Film
  ('Runway Gen-3','Tạo và chỉnh sửa video bằng AI — text-to-video, image-to-video, xóa vật thể, thay đổi cảnh phim.',      'Video & Film',   'Freemium', 'https://runwayml.com',                  '🎬', '#ef4444', true,  false, ARRAY['Text-to-video','Film','VFX'],          10),
  ('HeyGen',      'Tạo video thuyết trình với avatar AI. Dịch video sang 40+ ngôn ngữ với môi khớp tự nhiên.',              'Video & Film',   'Freemium', 'https://heygen.com',                    '🧑‍💼','#0ea5e9', true,  false, ARRAY['Avatar AI','Dịch video','Thuyết trình'],11),
  ('CapCut AI',   'Chỉnh sửa video thông minh — tự cắt highlight, xóa nền, thêm caption tự động, template trending.',       'Video & Film',   'Freemium', 'https://capcut.com',                    '✂️', '#1d4ed8', false, false, ARRAY['TikTok','Reels','Auto caption'],       12),
  -- Âm thanh
  ('Suno AI',     'Tạo bài nhạc hoàn chỉnh với lời ca, melody, phối khí từ vài từ mô tả. Hỗ trợ mọi thể loại nhạc.',      'Âm thanh',       'Freemium', 'https://suno.com',                      '🎵', '#ec4899', true,  false, ARRAY['Nhạc','Lyrics','Sáng tác'],            13),
  ('ElevenLabs',  'Clone giọng nói, tạo voiceover với giọng tự nhiên nhất hiện nay. Hỗ trợ tiếng Việt.',                    'Âm thanh',       'Freemium', 'https://elevenlabs.io',                 '🎙️', '#f97316', true,  false, ARRAY['Voiceover','Clone giọng','Podcast'],   14),
  -- Văn phòng
  ('Microsoft Copilot','AI tích hợp vào Word, Excel, PowerPoint, Outlook — tóm tắt email, tạo báo cáo, phân tích dữ liệu.','Văn phòng',      'Trả phí',  'https://copilot.microsoft.com',         '📊', '#0078d4', true,  false, ARRAY['Word','Excel','Outlook'],              15),
  ('Notion AI',   'AI trong Notion — viết tài liệu, tóm tắt họp, tạo task list, dịch, phân tích nội dung trong workspace.', 'Văn phòng',      'Freemium', 'https://notion.so',                     '📝', '#374151', false, false, ARRAY['Ghi chú','Task','Tài liệu'],           16),
  -- Lập trình
  ('GitHub Copilot','AI viết code trong VSCode — gợi ý dòng tiếp theo, viết function, giải thích code, debug.',             'Lập trình',      'Trả phí',  'https://github.com/features/copilot',   '👨‍💻','#24292e', true,  false, ARRAY['VSCode','Code','Debug'],               17),
  ('Cursor',      'IDE AI thế hệ mới — chat với codebase, refactor toàn project, hiểu context toàn bộ dự án.',              'Lập trình',      'Freemium', 'https://cursor.sh',                     '🖥️', '#6366f1', true,  false, ARRAY['IDE','Refactor','Chat code'],          18),
  -- Marketing
  ('Jasper AI',   'Viết content marketing, email, quảng cáo, landing page với brand voice nhất quán — tối ưu SEO.',         'Marketing',      'Trả phí',  'https://jasper.ai',                     '✍️', '#7c3aed', false, false, ARRAY['Copywriting','Email','Ads'],           19),
  ('Copy.ai',     'Tạo nội dung marketing hàng loạt — viết 100 biến thể ad copy, email sequence, blog outline.',            'Marketing',      'Freemium', 'https://copy.ai',                       '📋', '#0ea5e9', false, false, ARRAY['Ad copy','Email','Batch'],             20)
ON CONFLICT DO NOTHING;
