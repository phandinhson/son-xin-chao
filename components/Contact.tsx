"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSettings } from "@/components/SettingsContext";

const faqs = [
  {
    q: "Bắt đầu hợp tác cần những gì?",
    a: "Chúng ta sẽ có một buổi tư vấn miễn phí 30 phút qua Zalo/Google Meet. Tôi sẽ hiểu mục tiêu của bạn và đề xuất giải pháp phù hợp trước khi ký hợp đồng.",
  },
  {
    q: "Bao lâu thì thấy kết quả SEO?",
    a: "SEO organic thường cần 3–6 tháng để thấy kết quả rõ. Tuy nhiên, bạn sẽ thấy cải thiện kỹ thuật ngay từ tháng đầu và traffic bắt đầu tăng từ tháng 2–3.",
  },
  {
    q: "Tôi có thể hủy hợp đồng không?",
    a: "Hợp đồng theo tháng, thông báo trước 15 ngày là có thể kết thúc. Tôi không lock bạn vào hợp đồng dài hạn — kết quả tốt là lý do bạn ở lại.",
  },
  {
    q: "Chi phí quảng cáo có tính thêm không?",
    a: "Phí quảng cáo (ngân sách chạy ads) là chi phí riêng, bạn thanh toán trực tiếp với Google/Facebook. Phí tôi thu là phí quản lý & tối ưu chiến dịch.",
  },
];

export default function Contact() {
  const s = useSettings();
  const cfg = {
    contact_zalo:    s.contact_zalo    || "0968806360",
    contact_facebook: s.contact_facebook || "fb.com/sonxinchao",
    contact_email:   s.contact_email   || "son@sonxinchao.com",
    contact_phone:   s.contact_phone   || "0968806360",
  };

  const [formData, setFormData] = useState({
    name: "", phone: "", service: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const contactMethods = [
    {
      icon: <Image src="/logo-zalo-vector.svg" alt="Zalo" width={28} height={28} className="h-7 w-auto brightness-0 invert" unoptimized />, name: "Zalo", desc: "Phản hồi nhanh nhất",
      value: cfg.contact_zalo,
      href: `https://zalo.me/${cfg.contact_zalo.replace(/\s/g, "")}`,
      color: "from-blue-500 to-cyan-500", badge: "Nhanh nhất",
    },
    {
      icon: "📘", name: "Facebook", desc: "Nhắn tin qua Messenger",
      value: cfg.contact_facebook,
      href: cfg.contact_facebook.startsWith("http") ? cfg.contact_facebook : `https://${cfg.contact_facebook}`,
      color: "from-blue-600 to-indigo-600", badge: null,
    },
    {
      icon: "📧", name: "Email", desc: "Phù hợp yêu cầu chi tiết",
      value: cfg.contact_email,
      href: `mailto:${cfg.contact_email}`,
      color: "from-violet-600 to-purple-600", badge: null,
    },
    {
      icon: "📍", name: "Địa chỉ", desc: "Long Thành, Đồng Nai",
      value: "Phục vụ toàn quốc Online",
      href: "#", color: "from-pink-600 to-rose-600", badge: null,
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    const elements = sectionRef.current?.querySelectorAll(".animate-on-scroll");
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

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
      if (res.ok) {
        setSubmitted(true);
      } else {
        setSendError("Gửi thất bại, vui lòng thử lại hoặc nhắn Zalo trực tiếp.");
      }
    } catch {
      setSendError("Lỗi kết nối, vui lòng thử lại.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-gray-950 relative overflow-hidden" ref={sectionRef}>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
      <div className="absolute -top-20 right-0 w-80 h-80 bg-violet-600/5 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 animate-on-scroll">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-sm mb-6">
            Liên hệ
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Hãy nói chuyện<br />
            <span className="gradient-text">về dự án của bạn</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            Tư vấn miễn phí, không ràng buộc. Tôi sẽ phản hồi trong vòng 2 tiếng.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left: Contact methods + Form */}
          <div className="space-y-8">
            {/* Contact Cards */}
            <div className="grid grid-cols-2 gap-4 animate-on-scroll">
              {contactMethods.map((method, i) => (
                <a
                  key={i}
                  href={method.href}
                  target={method.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="relative group p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-white hover:border-slate-300 transition-all card-hover"
                >
                  {method.badge && (
                    <span className="absolute -top-2 -right-2 px-2.5 py-1 text-xs font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full">
                      {method.badge}
                    </span>
                  )}
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform`}>
                    {method.icon}
                  </div>
                  <div className="text-slate-800 font-semibold text-sm">{method.name}</div>
                  <div className="text-slate-500 text-xs">{method.desc}</div>
                  <div className={`text-xs mt-2 font-medium bg-gradient-to-r ${method.color} bg-clip-text text-transparent`}>
                    {method.value}
                  </div>
                </a>
              ))}
            </div>

            {/* Zalo CTA */}
            <a
              href={`https://zalo.me/${cfg.contact_zalo.replace(/\s/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="animate-on-scroll flex items-center justify-center gap-3 w-full py-5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-lg rounded-2xl hover:opacity-90 hover:scale-[1.02] transition-all shadow-xl shadow-blue-500/30"
            >
              <Image src="/logo-zalo-vector.svg" alt="Zalo" width={32} height={32} className="h-8 w-auto brightness-0 invert" unoptimized />
              Nhắn Zalo ngay — Miễn phí tư vấn
            </a>

            {/* FAQ */}
            <div className="animate-on-scroll space-y-3">
              <h3 className="text-slate-800 font-bold text-xl mb-4">Câu hỏi thường gặp</h3>
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-5 text-left text-slate-800 font-medium hover:bg-white transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="text-sm">{faq.q}</span>
                    <span className={`text-blue-600 transition-transform ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="animate-on-scroll">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 animate-bounce">🎉</div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">Cảm ơn bạn!</h3>
                  <p className="text-slate-600">
                    Tôi đã nhận được thông tin. Sẽ liên hệ lại trong vòng{" "}
                    <span className="text-blue-600 font-semibold">2 tiếng</span> nhé!
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setFormData({ name: "", phone: "", service: "", message: "" }); }}
                    className="mt-8 px-6 py-3 border border-slate-300 text-slate-600 rounded-xl hover:bg-white transition-colors text-sm"
                  >
                    Gửi yêu cầu khác
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Gửi yêu cầu tư vấn</h3>
                  <p className="text-slate-500 text-sm mb-8">
                    Điền thông tin bên dưới — tôi sẽ liên hệ lại trong 2 tiếng.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-600 text-sm mb-2">Họ và tên *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Nguyễn Văn A"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 text-sm mb-2">Số điện thoại *</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="0968 806 360"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Dịch vụ quan tâm</label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-400 focus:bg-white transition-all text-sm"
                      >
                        <option value="" className="bg-gray-900">Chọn dịch vụ...</option>
                        <option value="seo" className="bg-gray-900">SEO Organic</option>
                        <option value="ads" className="bg-gray-900">Google / Facebook Ads</option>
                        <option value="web" className="bg-gray-900">Thiết kế Website WordPress</option>
                        <option value="combo" className="bg-gray-900">Combo Marketing toàn diện</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Mô tả ngắn về dự án</label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Ví dụ: Tôi có showroom xe máy tại Đồng Nai, muốn tăng lead qua Google..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all resize-none text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold rounded-xl hover:opacity-90 hover:scale-[1.02] transition-all shadow-lg shadow-blue-500/25 text-base disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                    >
                      {sending ? "⏳ Đang gửi..." : "Gửi yêu cầu tư vấn miễn phí →"}
                    </button>

                    {sendError && (
                      <p className="text-center text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                        ⚠️ {sendError}
                      </p>
                    )}

                    <p className="text-center text-slate-500 text-xs">
                      Thông tin của bạn được bảo mật tuyệt đối.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
