"use client";
import { useState, useEffect, useRef } from "react";

/* ─── Types ─────────────────────────────────────────────── */
interface ContactInfo {
  contact_phone:    string;
  contact_zalo:     string;
  contact_facebook: string;
  contact_email:    string;
  contact_youtube?: string;
}

/* ─── Data ─────────────────────────────────────────────── */
const WORKING_HOURS = [
  { day: "Thứ 2 – Thứ 6", time: "08:00 – 21:00", status: "open" },
  { day: "Thứ 7",          time: "08:00 – 18:00", status: "open" },
  { day: "Chủ nhật",       time: "09:00 – 17:00", status: "open" },
];

const PROCESS = [
  { step: "01", icon: "💬", title: "Gửi yêu cầu",   desc: "Điền form hoặc nhắn Zalo — nhận phản hồi trong 2 tiếng." },
  { step: "02", icon: "🎯", title: "Tư vấn 30'",    desc: "Phân tích nhu cầu, đề xuất giải pháp phù hợp nhất cho bạn." },
  { step: "03", icon: "📋", title: "Nhận báo giá",  desc: "Báo giá chi tiết, minh bạch — không phát sinh chi phí ẩn." },
  { step: "04", icon: "🚀", title: "Bắt đầu ngay",  desc: "Ký hợp đồng & triển khai. Báo cáo kết quả hàng tuần." },
];

const FAQS = [
  {
    q: "Tư vấn có mất phí không?",
    a: "Hoàn toàn miễn phí! Tôi cung cấp tư vấn 30 phút không ràng buộc. Bạn sẽ nhận được phân tích thực trạng website và đề xuất chiến lược cụ thể trước khi quyết định.",
  },
  {
    q: "Phản hồi sau bao lâu?",
    a: "Trong giờ làm việc (08:00–21:00), tôi phản hồi Zalo/Messenger trong vòng 30 phút. Email thường trong 2–4 tiếng. Ngoài giờ sẽ phản hồi vào đầu buổi sáng hôm sau.",
  },
  {
    q: "Tôi ở TP.HCM có làm được không?",
    a: "Hoàn toàn được! Tôi phục vụ toàn quốc qua Online. Với khách hàng tại TP.HCM, tôi có thể gặp trực tiếp tại quận 1 hoặc làm việc 100% online qua Zalo/Google Meet.",
  },
  {
    q: "Hợp đồng ký như thế nào?",
    a: "Hợp đồng điện tử hoặc bản cứng tùy theo nhu cầu. Thanh toán theo tháng, không yêu cầu trả trước nhiều tháng. Thông báo trước 15 ngày nếu muốn dừng hợp đồng.",
  },
  {
    q: "Có hỗ trợ sau khi hợp đồng kết thúc không?",
    a: "Có. Tôi hỗ trợ bảo trì 1 tháng sau khi kết thúc hợp đồng. Nếu bạn muốn tiếp tục, có gói duy trì hàng tháng với chi phí ưu đãi so với khách mới.",
  },
];

const SERVICES = [
  "SEO Organic (lên top Google)",
  "SEO Local (Google Map)",
  "SEO TP.HCM",
  "Google Ads",
  "Facebook & Instagram Ads",
  "TikTok Ads",
  "Thiết kế Website WordPress",
  "Audit & Tư vấn Marketing",
  "Combo Marketing toàn diện",
];

/* ─── Component ─────────────────────────────────────────── */
export default function ContactPageClient() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [formData, setFormData] = useState({
    name: "", phone: "", email: "", service: "", budget: "", message: "",
  });

  const [cfg, setCfg] = useState<ContactInfo>({
    contact_phone:    "0968 806 360",
    contact_zalo:     "0968806360",
    contact_facebook: "https://fb.com/sonxinchao",
    contact_email:    "son@sonxinchao.com",
    contact_youtube:  "https://youtube.com/@sonxinchao",
  });

  /* Fetch settings */
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => { if (d && !d.error) setCfg((prev) => ({ ...prev, ...d })); })
      .catch(() => {});
  }, []);

  /* Animate on scroll */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.08 }
    );
    sectionRef.current?.querySelectorAll(".animate-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const zaloHref    = `https://zalo.me/${cfg.contact_zalo.replace(/\s/g, "")}`;
  const phoneHref   = `tel:${cfg.contact_phone.replace(/\s/g, "")}`;
  const fbHref      = cfg.contact_facebook.startsWith("http") ? cfg.contact_facebook : `https://${cfg.contact_facebook}`;
  const ytHref      = cfg.contact_youtube || "https://youtube.com/@sonxinchao";

  /* Submit */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSendError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) setSubmitted(true);
      else setSendError("Gửi thất bại — vui lòng thử lại hoặc nhắn Zalo trực tiếp.");
    } catch {
      setSendError("Lỗi kết nối, vui lòng thử lại.");
    } finally {
      setSending(false);
    }
  };

  const inputCls = "w-full px-4 py-3 bg-[var(--th-bg)] border border-[var(--th-border)] rounded-xl text-[var(--th-text)] placeholder-[var(--th-text-3)] focus:outline-none focus:border-blue-400 transition-all text-sm";

  /* ── Social / contact cards ── */
  const CONTACT_CARDS = [
    {
      icon: (
        <img src="/logo-zalo-vector.svg" alt="Zalo" className="h-7 w-auto brightness-0 invert" />
      ),
      name: "Zalo",
      desc: "Phản hồi nhanh nhất",
      value: cfg.contact_zalo,
      href: zaloHref,
      badge: "Nhanh nhất",
      color: "from-blue-500 to-cyan-400",
      bg: "bg-blue-50 dark:bg-blue-950/30",
      border: "border-blue-200 dark:border-blue-800",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-600">
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
        </svg>
      ),
      name: "Điện thoại",
      desc: "Gọi trực tiếp",
      value: cfg.contact_phone,
      href: phoneHref,
      badge: null,
      color: "from-green-500 to-emerald-400",
      bg: "bg-green-50 dark:bg-green-950/30",
      border: "border-green-200 dark:border-green-800",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-700">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      name: "Facebook",
      desc: "Nhắn tin Messenger",
      value: "sonxinchao",
      href: fbHref,
      badge: null,
      color: "from-blue-600 to-indigo-500",
      bg: "bg-blue-50 dark:bg-blue-950/30",
      border: "border-blue-200 dark:border-blue-800",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-rose-500">
          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
      ),
      name: "Email",
      desc: "Yêu cầu chi tiết",
      value: cfg.contact_email,
      href: `mailto:${cfg.contact_email}`,
      badge: null,
      color: "from-rose-500 to-pink-500",
      bg: "bg-rose-50 dark:bg-rose-950/30",
      border: "border-rose-200 dark:border-rose-800",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-600">
          <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
        </svg>
      ),
      name: "YouTube",
      desc: "Xem video chia sẻ",
      value: "@sonxinchao",
      href: ytHref,
      badge: null,
      color: "from-red-500 to-rose-500",
      bg: "bg-red-50 dark:bg-red-950/30",
      border: "border-red-200 dark:border-red-800",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-violet-600">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      ),
      name: "Địa chỉ",
      desc: "Long Thành · Đồng Nai",
      value: "Phục vụ toàn quốc Online",
      href: "https://maps.google.com/?q=Long+Thanh,+Dong+Nai,+Vietnam",
      badge: null,
      color: "from-violet-500 to-purple-500",
      bg: "bg-violet-50 dark:bg-violet-950/30",
      border: "border-violet-200 dark:border-violet-800",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--th-bg)] text-[var(--th-text)]" ref={sectionRef}>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        {/* Decorative blobs — desktop only */}
        <div className="hidden md:block absolute top-10 right-0 w-[500px] h-[500px] rounded-full bg-blue-500/8 blur-3xl pointer-events-none" />
        <div className="hidden md:block absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-violet-500/8 blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <div className="animate-on-scroll inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--th-border)] bg-[var(--th-card)] text-sm font-medium text-[var(--th-text-2)] mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Đang nhận tư vấn · Phản hồi trong 2 tiếng
          </div>

          <h1 className="animate-on-scroll text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6">
            Liên hệ với{" "}
            <span className="gradient-text">Sơn Xin Chào</span>
          </h1>

          <p className="animate-on-scroll text-[var(--th-text-2)] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Tư vấn miễn phí 30 phút — không ràng buộc. Gửi yêu cầu ngay và nhận đề xuất chiến lược
            <strong className="text-[var(--th-text)]"> phù hợp nhất</strong> cho doanh nghiệp của bạn.
          </p>

          <div className="animate-on-scroll flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={zaloHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-lg rounded-2xl hover:opacity-90 hover:scale-105 transition-all shadow-xl shadow-blue-500/25"
            >
              <img src="/logo-zalo-vector.svg" alt="Zalo" className="h-8 w-auto brightness-0 invert flex-shrink-0" />
              Nhắn Zalo ngay
            </a>
            <a
              href={phoneHref}
              className="flex items-center justify-center gap-3 px-8 py-4 border-2 border-[var(--th-border-lg)] text-[var(--th-text)] font-bold text-lg rounded-2xl hover:bg-[var(--th-card)] hover:border-blue-400 transition-all"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-500 flex-shrink-0">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              {cfg.contact_phone}
            </a>
          </div>
        </div>

        {/* Stats bar */}
        <div className="animate-on-scroll max-w-3xl mx-auto px-6 mt-16">
          <div className="grid grid-cols-3 gap-px rounded-2xl overflow-hidden border border-[var(--th-border)] bg-[var(--th-border)]">
            {[
              { icon: "⚡", label: "Phản hồi",  value: "< 2 tiếng" },
              { icon: "🎁", label: "Tư vấn",    value: "Miễn phí" },
              { icon: "✅", label: "Ràng buộc", value: "Không có" },
            ].map((s) => (
              <div key={s.label} className="bg-[var(--th-bg)] px-6 py-5 text-center">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="font-bold text-[var(--th-text)] text-sm">{s.value}</div>
                <div className="text-[var(--th-text-3)] text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT CARDS ──────────────────────────────────── */}
      <section className="py-16 bg-[var(--th-bg-alt)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="animate-on-scroll text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--th-text)] mb-3">Kênh liên hệ</h2>
            <p className="text-[var(--th-text-2)] text-sm">Chọn kênh phù hợp nhất với bạn</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {CONTACT_CARDS.map((card, i) => (
              <a
                key={i}
                href={card.href}
                target={card.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className={`animate-on-scroll relative group flex flex-col items-center text-center gap-3 p-6 rounded-2xl border ${card.border} ${card.bg} hover:scale-105 hover:shadow-lg transition-all duration-300`}
              >
                {card.badge && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 text-xs font-bold bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-full whitespace-nowrap shadow">
                    {card.badge}
                  </span>
                )}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  <span className="[&_svg]:!text-white [&_svg]:!fill-white">{card.icon}</span>
                </div>
                <div>
                  <div className="font-bold text-[var(--th-text)] text-sm">{card.name}</div>
                  <div className="text-[var(--th-text-3)] text-xs mt-0.5">{card.desc}</div>
                  <div className={`text-xs mt-2 font-semibold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                    {card.value}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORM + SIDEBAR ─────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-12">

            {/* ── Form ── */}
            <div className="lg:col-span-3 animate-on-scroll">
              <div className="rounded-3xl border border-[var(--th-border)] bg-[var(--th-card)] p-8 md:p-10">
                {submitted ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-5">🎉</div>
                    <h3 className="text-2xl font-bold text-[var(--th-text)] mb-3">Cảm ơn bạn đã liên hệ!</h3>
                    <p className="text-[var(--th-text-2)] mb-2">
                      Tôi đã nhận được thông tin và sẽ liên hệ lại trong{" "}
                      <strong className="text-blue-500">2 tiếng</strong> nhé!
                    </p>
                    <p className="text-[var(--th-text-3)] text-sm mb-8">
                      Hoặc bạn có thể nhắn thẳng qua Zalo để được hỗ trợ nhanh hơn.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <a href={zaloHref} target="_blank" rel="noopener noreferrer"
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl hover:opacity-90 transition-all text-sm">
                        💬 Nhắn Zalo ngay
                      </a>
                      <button
                        onClick={() => { setSubmitted(false); setFormData({ name: "", phone: "", email: "", service: "", budget: "", message: "" }); }}
                        className="px-6 py-3 border border-[var(--th-border)] text-[var(--th-text-2)] rounded-xl hover:bg-[var(--th-card-hover)] transition-all text-sm"
                      >
                        Gửi yêu cầu khác
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-[var(--th-text)] mb-2">
                        Gửi yêu cầu tư vấn
                      </h2>
                      <p className="text-[var(--th-text-2)] text-sm">
                        Điền thông tin bên dưới · Phản hồi trong <strong className="text-blue-500">2 tiếng</strong>
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Row 1 */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[var(--th-text-2)] text-xs font-semibold uppercase tracking-wide mb-2">
                            Họ và tên <span className="text-red-400">*</span>
                          </label>
                          <input type="text" required value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Nguyễn Văn A"
                            className={inputCls} />
                        </div>
                        <div>
                          <label className="block text-[var(--th-text-2)] text-xs font-semibold uppercase tracking-wide mb-2">
                            Số điện thoại <span className="text-red-400">*</span>
                          </label>
                          <input type="tel" required value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="0968 xxx xxx"
                            className={inputCls} />
                        </div>
                      </div>

                      {/* Row 2 */}
                      <div>
                        <label className="block text-[var(--th-text-2)] text-xs font-semibold uppercase tracking-wide mb-2">
                          Email
                        </label>
                        <input type="email" value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="email@cong-ty.com"
                          className={inputCls} />
                      </div>

                      {/* Row 3 */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[var(--th-text-2)] text-xs font-semibold uppercase tracking-wide mb-2">
                            Dịch vụ quan tâm
                          </label>
                          <select value={formData.service}
                            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                            className={inputCls}>
                            <option value="">Chọn dịch vụ...</option>
                            {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[var(--th-text-2)] text-xs font-semibold uppercase tracking-wide mb-2">
                            Ngân sách / tháng
                          </label>
                          <select value={formData.budget}
                            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                            className={inputCls}>
                            <option value="">Chưa xác định</option>
                            <option value="under3m">Dưới 3 triệu</option>
                            <option value="3-7m">3 – 7 triệu</option>
                            <option value="7-15m">7 – 15 triệu</option>
                            <option value="over15m">Trên 15 triệu</option>
                          </select>
                        </div>
                      </div>

                      {/* Row 4 */}
                      <div>
                        <label className="block text-[var(--th-text-2)] text-xs font-semibold uppercase tracking-wide mb-2">
                          Mô tả ngắn về dự án
                        </label>
                        <textarea rows={4} value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Ví dụ: Tôi có showroom xe máy tại Long Thành, muốn tăng traffic organic và lên top Google cho từ khóa địa phương..."
                          className={`${inputCls} resize-none`} />
                      </div>

                      {/* Submit */}
                      <button type="submit" disabled={sending}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold rounded-xl hover:opacity-90 hover:scale-[1.02] transition-all shadow-lg shadow-blue-500/20 text-base disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100">
                        {sending ? "⏳ Đang gửi..." : "Gửi yêu cầu tư vấn miễn phí →"}
                      </button>

                      {sendError && (
                        <p className="text-center text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                          ⚠️ {sendError}
                        </p>
                      )}

                      <p className="text-center text-[var(--th-text-3)] text-xs">
                        🔒 Thông tin của bạn được bảo mật tuyệt đối · Không spam
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>

            {/* ── Sidebar ── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Process */}
              <div className="animate-on-scroll rounded-2xl border border-[var(--th-border)] bg-[var(--th-card)] p-6">
                <h3 className="font-bold text-[var(--th-text)] text-lg mb-5">Quy trình làm việc</h3>
                <div className="space-y-4">
                  {PROCESS.map((step, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-black text-xs shadow">
                        {step.step}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span>{step.icon}</span>
                          <span className="font-semibold text-[var(--th-text)] text-sm">{step.title}</span>
                        </div>
                        <p className="text-[var(--th-text-3)] text-xs leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Working Hours */}
              <div className="animate-on-scroll rounded-2xl border border-[var(--th-border)] bg-[var(--th-card)] p-6">
                <h3 className="font-bold text-[var(--th-text)] text-lg mb-4">
                  🕐 Giờ làm việc
                </h3>
                <div className="space-y-2.5">
                  {WORKING_HOURS.map((row) => (
                    <div key={row.day} className="flex items-center justify-between py-2.5 border-b border-[var(--th-border-sm)] last:border-0">
                      <span className="text-[var(--th-text-2)] text-sm">{row.day}</span>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-[var(--th-text)] font-semibold text-sm">{row.time}</span>
                      </div>
                    </div>
                  ))}
                  <p className="text-[var(--th-text-3)] text-xs pt-1">
                    * Ngoài giờ? Vẫn nhắn Zalo — tôi phản hồi sớm nhất có thể.
                  </p>
                </div>
              </div>

              {/* Social quick links */}
              <div className="animate-on-scroll rounded-2xl border border-[var(--th-border)] bg-[var(--th-card)] p-6">
                <h3 className="font-bold text-[var(--th-text)] text-lg mb-4">📱 Mạng xã hội</h3>
                <div className="space-y-3">
                  {[
                    { icon: "💬", label: "Zalo", sub: "Nhắn nhanh nhất", href: zaloHref, color: "text-blue-500" },
                    { icon: "📘", label: "Facebook", sub: "fb.com/sonxinchao", href: fbHref, color: "text-blue-700" },
                    { icon: "🎥", label: "YouTube", sub: "@sonxinchao", href: ytHref, color: "text-red-500" },
                    { icon: "📧", label: "Email", sub: cfg.contact_email, href: `mailto:${cfg.contact_email}`, color: "text-violet-500" },
                  ].map((link) => (
                    <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--th-card-hover)] transition-colors group">
                      <span className="text-xl">{link.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[var(--th-text)] text-sm group-hover:text-blue-500 transition-colors">{link.label}</div>
                        <div className="text-[var(--th-text-3)] text-xs truncate">{link.sub}</div>
                      </div>
                      <svg className="w-4 h-4 text-[var(--th-text-3)] group-hover:text-blue-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAP ────────────────────────────────────────────── */}
      <section className="py-12 bg-[var(--th-bg-alt)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="animate-on-scroll mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[var(--th-text)]">📍 Vị trí</h2>
              <p className="text-[var(--th-text-2)] text-sm mt-1">
                Long Thành, Đồng Nai — Phục vụ toàn quốc Online &amp; tại TP.HCM
              </p>
            </div>
            <a
              href="https://maps.google.com/?q=Long+Thanh,+Dong+Nai,+Vietnam"
              target="_blank" rel="noopener noreferrer"
              className="text-sm font-semibold text-blue-500 hover:underline flex-shrink-0"
            >
              Mở Google Maps →
            </a>
          </div>
          <div className="animate-on-scroll rounded-2xl overflow-hidden border border-[var(--th-border)] shadow-sm">
            <iframe
              title="Long Thành, Đồng Nai"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31380.07!2d107.03!3d10.80!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d7d5c1a9a7a7%3A0x0!2sLong+Thanh%2C+Dong+Nai!5e0!3m2!1svi!2svn!4v1"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="animate-on-scroll text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--th-text)] mb-3">
              Câu hỏi thường gặp
            </h2>
            <p className="text-[var(--th-text-2)] text-sm">
              Vẫn còn thắc mắc? Nhắn trực tiếp qua{" "}
              <a href={zaloHref} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline font-medium">Zalo</a>
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="animate-on-scroll rounded-2xl border border-[var(--th-border)] bg-[var(--th-card)] overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[var(--th-card-hover)] transition-colors gap-4"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-[var(--th-text)] text-sm leading-relaxed">{faq.q}</span>
                  <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all ${openFaq === i ? "bg-blue-500 rotate-45" : "bg-[var(--th-border-lg)] text-[var(--th-text-2)]"}`}>
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-[var(--th-text-2)] text-sm leading-relaxed border-t border-[var(--th-border-sm)] pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ─────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-br from-blue-600 via-violet-600 to-pink-600">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="animate-on-scroll">
            <p className="text-blue-100 text-sm font-medium mb-3">Vẫn đang phân vân?</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
              Cứ nhắn — tôi tư vấn miễn phí<br />không cần cam kết gì cả 🤝
            </h2>
            <p className="text-blue-100 mb-8 text-base">
              Chỉ mất 30 phút · Hoàn toàn miễn phí · Phân tích website thực tế
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={zaloHref} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-700 font-bold text-lg rounded-2xl hover:scale-105 transition-all shadow-xl">
                💬 Nhắn Zalo ngay
              </a>
              <a href={phoneHref}
                className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/40 text-white font-bold text-lg rounded-2xl hover:bg-white/10 transition-all">
                📞 {cfg.contact_phone}
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
