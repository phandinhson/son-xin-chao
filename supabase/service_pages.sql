-- Bảng lưu nội dung có thể chỉnh sửa của các trang dịch vụ
CREATE TABLE IF NOT EXISTS service_pages (
  slug        TEXT PRIMARY KEY,
  title       TEXT,
  content     JSONB NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Seed dữ liệu mặc định cho trang seo-onpage
INSERT INTO service_pages (slug, title, content) VALUES (
  'seo-onpage',
  'SEO Onpage Chuyên Sâu: Quy Trình Thực Chiến Với AI 2026',
  '{
    "hero": {
      "headline": "Tối Ưu SEO Onpage Nhanh Gấp 5 Lần Với AI",
      "subtitle": "Quy trình 5 bước thực chiến dùng Claude AI + ChatGPT — kèm checklist 25 yếu tố và 2 case study thực tế tại Đồng Nai.",
      "cta_primary": "Xem AI Workflow →",
      "cta_secondary": "Tư vấn miễn phí",
      "hero_image": null,
      "stats": [
        {"val": "5×", "label": "Nhanh hơn với AI"},
        {"val": "25+", "label": "Tiêu chuẩn Onpage"},
        {"val": "3 tuần", "label": "Thấy kết quả"}
      ]
    },
    "case_studies": [
      {
        "client": "Cửa hàng nội thất Long Thành",
        "icon": "🪑",
        "tag": "E-Commerce",
        "challenge": "Trang sản phẩm tủ bếp đứng vị trí 18–25 suốt 8 tháng dù content khá tốt.",
        "issue": "Title không có từ khóa địa phương, thiếu Schema, 0 internal link, tốc độ tải 6.2s.",
        "actions": ["Rewrite title + meta với từ khóa tủ bếp Long Thành", "Thêm Schema Product + Review với Claude AI", "Tối ưu ảnh: 12 ảnh → WebP, giảm từ 4.8MB → 380KB", "Thêm 5 internal link từ blog liên quan"],
        "stats": [{"val": "Top 5", "label": "sau 5 tuần"}, {"val": "+340%", "label": "organic traffic"}, {"val": "12", "label": "leads/tháng"}],
        "image": null
      },
      {
        "client": "Phòng khám nha khoa Nhơn Trạch",
        "icon": "🦷",
        "tag": "Healthcare",
        "challenge": "Trang dịch vụ niềng răng bị đẩy khỏi top 20 sau Core Update tháng 3/2026.",
        "issue": "Google coi trang thiếu E-E-A-T: không có tên bác sĩ, thiếu chứng chỉ, thông tin địa chỉ mơ hồ.",
        "actions": ["Thêm author bio bác sĩ + chứng chỉ hành nghề", "Rewrite content theo Claude — thêm số liệu thực tế", "Thêm Schema MedicalBusiness + FAQPage", "Cập nhật NAP nhất quán"],
        "stats": [{"val": "Top 8", "label": "sau 6 tuần"}, {"val": "Ổn định", "label": "qua các update"}, {"val": "5 ngày", "label": "triển khai"}],
        "image": null
      }
    ],
    "pricing": [
      {
        "name": "SEO Audit Onpage",
        "price": "1.500.000đ",
        "note": "1 lần",
        "highlight": false,
        "cta": "Đặt Audit ngay",
        "features": ["Audit toàn bộ website (≤ 50 trang)", "Checklist 25 yếu tố Onpage", "Báo cáo chi tiết từng trang", "Danh sách lỗi ưu tiên cần sửa", "Hướng dẫn sửa từng mục cụ thể", "Không bao gồm triển khai"]
      },
      {
        "name": "SEO Onpage Cơ Bản",
        "price": "2.500.000đ",
        "note": "/tháng",
        "highlight": true,
        "cta": "Đăng ký gói này",
        "features": ["Tối ưu 10 trang/tháng (content + technical)", "Rewrite title, meta, heading chuẩn AI", "Tối ưu hình ảnh + alt text", "Thêm Schema markup phù hợp", "5 internal link/trang", "Báo cáo thứ hạng hàng tuần"]
      },
      {
        "name": "SEO Onpage Toàn Diện",
        "price": "4.500.000đ",
        "note": "/tháng",
        "highlight": false,
        "cta": "Tư vấn gói này",
        "features": ["Tối ưu không giới hạn số trang", "Core Web Vitals optimization", "Viết thêm 4 bài blog/tháng (AI-assisted)", "Toàn bộ Schema markup website", "Internal link strategy toàn site", "Báo cáo GA4 + Search Console hàng tuần"]
      }
    ],
    "faq": [
      {"q": "SEO Onpage là gì?", "a": "SEO Onpage là tập hợp các kỹ thuật tối ưu hóa trực tiếp trên trang web — bao gồm nội dung, cấu trúc HTML (title, meta, heading), URL, hình ảnh, tốc độ tải trang và internal link — nhằm giúp Google hiểu và xếp hạng trang cao hơn trên kết quả tìm kiếm."},
      {"q": "AI giúp ích gì trong SEO Onpage?", "a": "AI (Claude, ChatGPT) giúp tăng tốc SEO Onpage ở 5 khâu chính: nghiên cứu từ khóa LSI, viết title/meta description hàng loạt, tạo outline bài chuẩn E-E-A-T, tối ưu nội dung theo semantic search và đề xuất internal link. Công việc thủ công mất 4–6 giờ có thể rút xuống còn 45–90 phút."},
      {"q": "SEO Onpage mất bao lâu để thấy kết quả?", "a": "Sau khi tối ưu SEO Onpage đúng chuẩn, thông thường trang mới bắt đầu cải thiện thứ hạng sau 4–8 tuần. Trang đã có thứ hạng từ 11–30 có thể lên top 10 sau 2–4 tuần nếu technical SEO sạch và content đủ E-E-A-T."},
      {"q": "SEO Onpage khác SEO Offpage như thế nào?", "a": "SEO Onpage tối ưu các yếu tố trong tầm kiểm soát của bạn — nội dung, kỹ thuật, cấu trúc trang. SEO Offpage tập trung vào các tín hiệu bên ngoài — backlink, brand mention, social signal."},
      {"q": "Chi phí dịch vụ SEO Onpage tại Sơn Xin Chào?", "a": "Dịch vụ SEO Onpage tại Sơn Xin Chào bắt đầu từ 2.500.000đ/tháng cho gói cơ bản (audit + tối ưu 10 trang). Liên hệ trực tiếp để được tư vấn gói phù hợp với quy mô website và ngân sách của bạn."},
      {"q": "Prompt nào dùng Claude AI để viết title tag chuẩn SEO?", "a": "Prompt hiệu quả: Viết 5 title tag cho trang [chủ đề], từ khóa chính [từ khóa], đối tượng [mô tả khách hàng], USP [điểm nổi bật]. Mỗi title dưới 60 ký tự, có từ khóa gần đầu, không clickbait. Claude sẽ trả về 5 option từ đó bạn chọn tối ưu nhất."}
    ]
  }'
) ON CONFLICT (slug) DO NOTHING;

-- RLS: chỉ service role mới được write
ALTER TABLE service_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_service_pages" ON service_pages FOR SELECT USING (true);
