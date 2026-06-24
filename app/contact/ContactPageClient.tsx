"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";

/* ─── Types ─────────────────────────────────────────────── */
interface ContactInfo {
  contact_phone:    string;
  contact_zalo:     string;
  contact_facebook: string;
  contact_email:    string;
  contact_youtube?: string;
}

type CardType = {
  icon: React.ReactNode;
  name: string;
  desc: string;
  value: string;
  href: string;
  badge: string | null;
  color: string;
  bg: string;
  border: string;
};

/* ─── Data (Được tối ưu để gom gọn, chuẩn bị tách file nếu cần) ─── */
const WORKING_HOURS = [
  { day: "Thứ 2 – Thứ 6", time: "08:00 – 21:00" },
  { day: "Thứ 7",          time: "08:00 – 18:00" },
  { day: "Chủ nhật",       time: "09:00 – 17:00" },
];

const PROCESS = [
  { step: "01", icon: "💬", title: "Gửi yêu cầu",   desc: "Điền form hoặc nhắn Zalo — nhận phản hồi trong 2 tiếng." },
  { step: "02", icon: "🎯", title: "Tư vấn 30'",    desc: "Phân tích nhu cầu, đề xuất giải pháp phù hợp nhất cho bạn." },
  { step: "03", icon: "📋", title: "Nhận báo giá",  desc: "Báo giá chi tiết, minh bạch — không phát sinh chi phí ẩn." },
  { step: "04", icon: "🚀", title: "Bắt đầu ngay",  desc: "Ký hợp đồng & triển khai. Báo cáo kết quả hàng tuần." },
];

const FAQS = [
  { q: "Tư vấn có mất phí không?", a: "Hoàn toàn miễn phí! Tôi cung cấp tư vấn 30 phút không ràng buộc. Bạn sẽ nhận được phân tích thực trạng website và đề xuất chiến lược cụ thể trước khi quyết định." },
  { q: "Phản hồi sau bao lâu?", a: "Trong giờ làm việc (08:00–21:00), tôi phản hồi Zalo/Messenger trong vòng 30 phút. Email thường trong 2–4 tiếng. Ngoài giờ sẽ phản hồi vào đầu buổi sáng hôm sau." },
  { q: "Tôi ở TP.HCM có làm được không?", a: "Hoàn toàn được! Tôi phục vụ toàn quốc qua Online. Với khách hàng tại TP.HCM, tôi có thể gặp trực tiếp tại quận 1 hoặc làm việc 100% online qua Zalo/Google Meet." },
  { q: "Hợp đồng ký như thế nào?", a: "Hợp đồng điện tử hoặc bản cứng tùy theo nhu cầu. Thanh toán theo tháng, không yêu cầu trả trước nhiều tháng. Thông báo trước 15 ngày nếu muốn dừng hợp đồng." },
  { q: "Có hỗ trợ sau khi hợp đồng kết thúc không?", a: "Có. Tôi hỗ trợ bảo trì 1 tháng sau khi kết thúc hợp đồng. Nếu bạn muốn tiếp tục, có gói duy trì hàng tháng với chi phí ưu đãi so với khách mới." },
];

const SERVICES = [
  "SEO Organic (lên top Google)", "SEO Local (Google Map)", "SEO TP.HCM",
  "Google Ads", "Facebook & Instagram Ads", "TikTok Ads",
  "Thiết kế Website WordPress", "Audit & Tư vấn Marketing", "Combo Marketing toàn diện"
];

const INPUT_CLS = "w-full px-4 py-3 bg-[var(--th-bg)] border border-[var(--th-border)] rounded-xl text-[var(--th-text)] placeholder-[var(--th-text-3)] focus:outline-none focus:border-blue-400 transition-all text-sm";

/* ─── Sub-Components tối ưu hóa bằng React.memo ─── */
const ContactCardItem = React.memo(({ card }: { card: CardType }) => (
  <a
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
      <div className={`text-xs mt-2 font-semibold bg-gradient-to-r ${card.color} bg-clip-text text-transparent truncate max-w-[160px]`}>
        {card.value}
      </div>
    </div>
  </a>
));
ContactCardItem.displayName = "ContactCardItem";

const FaqItem = React.memo(({ faq, isOpen, onToggle }: { faq: typeof FAQS[0]; isOpen: boolean; onToggle: () => void }) => (
  <div className="animate-on-scroll rounded-2xl border border-[var(--th-border)] bg-[var(--th-card)] overflow-hidden">
    <button
      className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[var(--th-card-hover)] transition-colors gap-4"
      onClick={onToggle}
      type="button"
    >
      <span className="font-semibold text-[var(--th-text)] text-sm leading-relaxed">{faq.q}</span>
      <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all ${isOpen ? "bg-blue-500 rotate-45" : "bg-[var(--th-border-lg)] text-[var(--th-text-2)]"}`}>
        +
      </span>
    </button>
    {isOpen && (
      <div className="px-6 pb-5 text-[var(--th-text-2)] text-sm leading-relaxed border-t border-[var(--th-border-sm)] pt-4 animate-in fade-in duration-200">
        {faq.a}
      </div>
    )}
  </div>
));
FaqItem.displayName = "FaqItem";


/* ─── Main Component ────────────────────────────────────── */
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
    contact_youtube:  "https://www.youtube.com/@hoccungson116",
  });

  /* Fetch settings ổn định */
  useEffect(() => {
    let isMounted = true;
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => { 
        if (isMounted && d && !d.error) setCfg((prev) => ({ ...prev, ...d })); 
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  /* ⚡ TỐI ƯU 1: Khắc phục lỗi rò rỉ bộ nhớ của IntersectionObserver */
  useEffect(() => {
    const currentRef = sectionRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { 
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target); // ⚡ Tiết kiệm CPU: Đã thấy hiệu ứng thì dừng quan sát el đó luôn
          }
        });
      },
      { threshold: 0.05 }
    );

    const elements = currentRef.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  // Tính toán trước các chuỗi giá trị bằng useMemo để tránh nối chuỗi lặp lại khi re-render
  const contactLinks = useMemo(() => {
    const cleanZalo = cfg.contact_zalo.replace(/\s/g, "");
    const cleanPhone = cfg.contact_phone.replace(/\s/g, "");
    const zaloHref = `https://zalo.me/${cleanZalo}`;
    const phoneHref = `tel:${cleanPhone}`;
    const fbHref = cfg.contact_facebook.startsWith("http") ? cfg.contact_facebook : `https://${cfg.contact_facebook}`;
    const ytHref = cfg.contact_youtube || "https://www.youtube.com/@hoccungson116";

    return { zaloHref, phoneHref, fbHref, ytHref };
  }, [cfg]);

  /* ⚡ TỐI ƯU 2: Cấu trúc mảng thẻ danh bạ thông minh tránh dựng lại SVG liên tục */
  const contactCards: CardType[] = useMemo(() => [
    {
      icon: <Image src="/logo-zalo-vector.svg" alt="Zalo" width={28} height={28} className="h-7 w-auto brightness-0 invert" unoptimized />,
      name: "Zalo", desc: "Phản hồi nhanh nhất", value: cfg.contact_zalo, href: contactLinks.zaloHref, badge: "Nhanh nhất",
      color: "from-blue-500 to-cyan-400", bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-800",
    },
    {
      icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-600"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>,
      name: "Điện thoại", desc: "Gọi trực tiếp", value: cfg.contact_phone, href: contactLinks.phoneHref, badge: null,
      color: "from-green-500 to-emerald-400", bg: "bg-green-50 dark:bg-green-950/30", border: "border-green-200 dark:border-green-800",
    },
    {
      icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-700"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
      name: "Facebook", desc: "Nhắn tin Messenger", value: "sonxinchao", href: contactLinks.fbHref, badge: null,
      color: "from-blue-600 to-indigo-500", bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-800",
    },
    {
      icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-rose-500"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>,
      name: "Email", desc: "Yêu cầu chi tiết", value: cfg.contact_email, href: `mailto:${cfg.contact_email}`, badge: null,
      color: "from-rose-500 to-pink-500", bg: "bg-rose-50 dark:bg-rose-950/30", border: "border-rose-200 dark:border-rose-800",
    },
  ], [cfg, contactLinks]);

  /* Xử lý Submit */
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

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleToggleFaq = useCallback((index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  }, []);

  return (
    <div className="min-h-screen bg-[var(--th-bg)] text-[var(--th-text)]" ref={sectionRef}>
      
      {/* ── HERO ── */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <div className="animate-on-scroll inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--th-border)] bg-[var(--th-card)] text-sm font-medium text-[var(--th-text-2)] mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Đang nhận tư vấn · Phản hồi trong 2 tiếng
          </div>
          <h1 className="animate-on-scroll text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6">
            Liên hệ với <span className="gradient-text">Sơn Xin Chào</span>
          </h1>
          <p className="animate-on-scroll text-[var(--th-text-2)] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Tư vấn miễn phí 30 phút — không ràng buộc. Gửi yêu cầu ngay và nhận đề xuất chiến lược phù hợp nhất.
          </p>
          <div className="animate-on-scroll flex flex-col sm:flex-row gap-4 justify-center">
            <a href={contactLinks.zaloHref} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-lg rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-blue-500/25">
              Nhắn Zalo ngay
            </a>
            <a href={contactLinks.phoneHref} className="flex items-center justify-center gap-3 px-8 py-4 border-2 border-[var(--th-border-lg)] text-[var(--th-text)] font-bold text-lg rounded-2xl hover:bg-[var(--th-card)] transition-all">
              {cfg.contact_phone}
            </a>
          </div>
        </div>
      </section>

      {/* ── CONTACT CARDS ── */}
      <section className="py-16 bg-[var(--th-bg-alt)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {contactCards.map((card, i) => (
              <ContactCardItem key={i} card={card} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FORM + SIDEBAR ── */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3 animate-on-scroll">
            <div className="rounded-3xl border border-[var(--th-border)] bg-[var(--th-card)] p-8 md:p-10">
              {submitted ? (
                <div className="text-center py-16">
                  <h3 className="text-2xl font-bold mb-3">Cảm ơn bạn đã liên hệ!</h3>
                  <button onClick={() => setSubmitted(false)} className="mt-4 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl text-sm">Gửi yêu cầu khác</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-2">Họ và tên *</label>
                      <input type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="Nguyễn Văn A" className={INPUT_CLS} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-2">Số điện thoại *</label>
                      <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} placeholder="0968 xxx xxx" className={INPUT_CLS} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-2">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="email@cong-ty.com" className={INPUT_CLS} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cp-service" className="block text-xs font-semibold mb-2">Dịch vụ quan tâm</label>
                      <select id="cp-service" name="service" aria-label="Chọn dịch vụ quan tâm" value={formData.service} onChange={handleInputChange} className={INPUT_CLS}>
                        <option value="">Chọn dịch vụ...</option>
                        {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="cp-budget" className="block text-xs font-semibold mb-2">Ngân sách / tháng</label>
                      <select id="cp-budget" name="budget" aria-label="Chọn ngân sách mỗi tháng" value={formData.budget} onChange={handleInputChange} className={INPUT_CLS}>
                        <option value="">Chưa xác định</option>
                        <option value="under3m">Dưới 3 triệu</option>
                        <option value="3-7m">3 – 7 triệu</option>
                        <option value="7-15m">7 – 15 triệu</option>
                        <option value="over15m">Trên 15 triệu</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-2">Mô tả ngắn</label>
                    <textarea name="message" rows={4} value={formData.message} onChange={handleInputChange} placeholder="Mô tả dự án..." className={`${INPUT_CLS} resize-none`} />
                  </div>
                  <button type="submit" disabled={sending} className="w-full py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold rounded-xl shadow-lg text-base disabled:opacity-60">
                    {sending ? "⏳ Đang gửi..." : "Gửi yêu cầu tư vấn miễn phí →"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            <div className="animate-on-scroll rounded-2xl border border-[var(--th-border)] bg-[var(--th-card)] p-6">
              <h3 className="font-bold text-lg mb-5">Quy trình làm việc</h3>
              <div className="space-y-4">
                {PROCESS.map((step, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-black text-xs shadow">{step.step}</div>
                    <div>
                      <div className="font-semibold text-sm">{step.icon} {step.title}</div>
                      <p className="text-[var(--th-text-3)] text-xs leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Câu hỏi thường gặp</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <FaqItem key={i} faq={faq} isOpen={openFaq === i} onToggle={() => handleToggleFaq(i)} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}