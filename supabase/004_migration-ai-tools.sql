-- Migration: Tạo bảng ai_tools
-- Chạy trong Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS ai_tools (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category    TEXT NOT NULL CHECK (category IN ('Hình ảnh', 'Video', 'Âm thanh', 'Văn phòng')),
  badge       TEXT NOT NULL DEFAULT 'Freemium' CHECK (badge IN ('Miễn phí', 'Freemium', 'Trả phí')),
  url         TEXT NOT NULL DEFAULT '',
  icon        TEXT NOT NULL DEFAULT '🤖',
  is_hot      BOOLEAN NOT NULL DEFAULT false,
  tags        TEXT[] NOT NULL DEFAULT '{}',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  active      BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index để sort nhanh
CREATE INDEX IF NOT EXISTS ai_tools_sort_idx ON ai_tools(sort_order ASC, created_at DESC);
CREATE INDEX IF NOT EXISTS ai_tools_category_idx ON ai_tools(category);
CREATE INDEX IF NOT EXISTS ai_tools_active_idx ON ai_tools(active);

-- Seed data từ hardcoded ban đầu
INSERT INTO ai_tools (name, description, category, badge, url, icon, is_hot, tags, sort_order) VALUES
  ('Midjourney',       'Tạo hình ảnh nghệ thuật chất lượng cao từ mô tả văn bản. Được dùng nhiều nhất bởi designers chuyên nghiệp.',   'Hình ảnh', 'Trả phí',  'https://www.midjourney.com',              '🎨', true,  ARRAY['Text-to-image','Nghệ thuật','Marketing'],     1),
  ('DALL-E 3',         'AI tạo ảnh của OpenAI, tích hợp trực tiếp trong ChatGPT. Hiểu prompt tiếng Việt rất tốt.',                     'Hình ảnh', 'Freemium', 'https://openai.com/dall-e-3',             '🖼️', false, ARRAY['Text-to-image','ChatGPT','Dễ dùng'],          2),
  ('Adobe Firefly',    'AI tạo ảnh và chỉnh sửa ảnh của Adobe. Tích hợp sẵn trong Photoshop & Illustrator.',                          'Hình ảnh', 'Freemium', 'https://firefly.adobe.com',               '🔥', false, ARRAY['Adobe','Photoshop','Thiết kế'],               3),
  ('Leonardo.ai',      'Nền tảng tạo ảnh AI mạnh mẽ với nhiều model khác nhau. Phù hợp làm ảnh sản phẩm, game art.',                 'Hình ảnh', 'Freemium', 'https://leonardo.ai',                     '🦁', true,  ARRAY['Sản phẩm','Game art','Nhiều model'],           4),
  ('Canva AI',         'Tạo hình ảnh, thiết kế banner, poster bằng AI ngay trong Canva. Không cần kỹ năng thiết kế.',                 'Hình ảnh', 'Freemium', 'https://www.canva.com/ai-image-generator', '✏️', false, ARRAY['Thiết kế','Social media','Banner'],            5),
  ('Remove.bg',        'Xóa nền ảnh tự động bằng AI chỉ trong 1 giây. Chuẩn cho ảnh sản phẩm thương mại điện tử.',                  'Hình ảnh', 'Freemium', 'https://www.remove.bg',                   '✂️', false, ARRAY['Xóa nền','Sản phẩm','E-commerce'],            6),
  ('Runway ML',        'Tạo và chỉnh sửa video bằng AI. Hỗ trợ text-to-video, xóa đối tượng, thay nền video.',                       'Video',    'Freemium', 'https://runwayml.com',                    '🎬', true,  ARRAY['Text-to-video','Chỉnh sửa','Xóa đối tượng'],  7),
  ('HeyGen',           'Tạo video với avatar AI biết nói. Chỉ cần nhập text là có video presenter chuyên nghiệp.',                    'Video',    'Freemium', 'https://www.heygen.com',                  '🧑‍💼',true,  ARRAY['Avatar AI','Presenter','Marketing'],          8),
  ('Pika Labs',        'Biến ảnh hoặc text thành video ngắn chuyển động mượt mà. Miễn phí và dễ dùng.',                              'Video',    'Freemium', 'https://pika.art',                        '⚡', false, ARRAY['Image-to-video','Ngắn','Social'],              9),
  ('CapCut AI',        'App chỉnh sửa video với hàng chục tính năng AI: xóa nền, tạo phụ đề, chuyển đổi giọng nói.',                 'Video',    'Miễn phí', 'https://www.capcut.com',                  '🎞️',false, ARRAY['Chỉnh sửa','Phụ đề','TikTok'],               10),
  ('Luma AI',          'Tạo video 3D, hiệu ứng cinematic chất lượng cao từ prompt. Video dài đến 5 giây.',                            'Video',    'Freemium', 'https://lumalabs.ai',                     '🌌', false, ARRAY['3D','Cinematic','High quality'],               11),
  ('InVideo AI',       'Tạo video quảng cáo, Reels, YouTube Shorts từ kịch bản văn bản. Có sẵn stock footage.',                       'Video',    'Freemium', 'https://invideo.io',                      '📱', false, ARRAY['Quảng cáo','Reels','Stock footage'],           12),
  ('ElevenLabs',       'Text-to-speech và nhân bản giọng nói chất lượng cao nhất hiện nay. Hỗ trợ tiếng Việt.',                      'Âm thanh', 'Freemium', 'https://elevenlabs.io',                   '🎙️',true,  ARRAY['Text-to-speech','Giọng Việt','Nhân bản giọng'],13),
  ('Suno AI',          'Tạo nhạc hoàn chỉnh (có lời, hòa âm) từ mô tả văn bản. Cho ra bài nhạc trong vài giây.',                    'Âm thanh', 'Freemium', 'https://suno.ai',                         '🎵', true,  ARRAY['Tạo nhạc','Có lời','Sáng tác'],               14),
  ('Adobe Podcast',    'Nâng cấp chất lượng âm thanh podcast/video tự động. Lọc tiếng ồn, cân bằng âm lượng.',                      'Âm thanh', 'Miễn phí', 'https://podcast.adobe.com',               '🎚️',false, ARRAY['Podcast','Lọc tiếng ồn','Adobe'],             15),
  ('Udio',             'Tạo nhạc AI chất lượng studio với nhiều thể loại: pop, EDM, nhạc phim, nhạc nền.',                           'Âm thanh', 'Freemium', 'https://www.udio.com',                    '🎼', false, ARRAY['Nhạc nền','Studio','Nhiều thể loại'],          16),
  ('Murf AI',          'Tạo giọng đọc chuyên nghiệp cho video, slide, e-learning. Có 120+ giọng đọc các ngôn ngữ.',                  'Âm thanh', 'Freemium', 'https://murf.ai',                         '🗣️',false, ARRAY['Giọng đọc','E-learning','Thuyết trình'],       17),
  ('ChatGPT',          'Trợ lý AI đa năng nhất hiện nay. Viết nội dung, phân tích dữ liệu, lập trình, dịch thuật.',                  'Văn phòng','Freemium', 'https://chat.openai.com',                 '🤖', true,  ARRAY['Viết nội dung','Phân tích','Đa năng'],         18),
  ('Claude',           'AI của Anthropic, xuất sắc trong phân tích tài liệu dài, viết văn chuyên sâu và lập trình.',                 'Văn phòng','Freemium', 'https://claude.ai',                       '💡', false, ARRAY['Phân tích','Viết chuyên sâu','An toàn'],       19),
  ('Notion AI',        'AI tích hợp trong Notion giúp viết tài liệu, tóm tắt, dịch thuật và quản lý dự án.',                        'Văn phòng','Freemium', 'https://www.notion.so/product/ai',        '📝', false, ARRAY['Quản lý dự án','Tài liệu','Tóm tắt'],          20),
  ('Gamma AI',         'Tạo slide thuyết trình, tài liệu, trang web đẹp từ prompt chỉ trong 30 giây.',                               'Văn phòng','Freemium', 'https://gamma.app',                       '📊', true,  ARRAY['Slide','Thuyết trình','Thiết kế nhanh'],       21),
  ('Microsoft Copilot','AI tích hợp trong Word, Excel, PowerPoint, Teams. Tự động viết báo cáo, phân tích dữ liệu.',                 'Văn phòng','Trả phí',  'https://copilot.microsoft.com',           '🪟', false, ARRAY['Word','Excel','PowerPoint'],                   22),
  ('Gemini',           'AI của Google tích hợp với Google Docs, Sheets, Gmail. Tóm tắt email, viết báo cáo.',                        'Văn phòng','Freemium', 'https://gemini.google.com',               '✨', false, ARRAY['Google Docs','Gmail','Google Workspace'],      23)
ON CONFLICT DO NOTHING;

-- Verify
SELECT id, name, category, badge, is_hot, active FROM ai_tools ORDER BY sort_order;
