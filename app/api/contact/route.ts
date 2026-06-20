export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  // Rate limit: tối đa 5 request/phút mỗi IP
  const ip = getClientIp(request.headers);
  if (!checkRateLimit(ip, 5, 60_000)) {
    return NextResponse.json(
      { error: "Bạn gửi quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút." },
      { status: 429 }
    );
  }

  const { name, phone, service, message } = await request.json();

  if (!name || !phone) {
    return NextResponse.json({ error: "Thiếu thông tin" }, { status: 400 });
  }

  // Validate độ dài để tránh spam nội dung khổng lồ
  if (name.length > 100 || phone.length > 20 || (message && message.length > 2000)) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
  }

  const serviceMap: Record<string, string> = {
    seo: "SEO Organic",
    ads: "Google / Facebook Ads",
    web: "Thiết kế Website WordPress",
    combo: "Combo Marketing toàn diện",
  };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0f1a; color: #e5e7eb; padding: 32px; border-radius: 16px;">
      <div style="background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 20px 24px; border-radius: 12px; margin-bottom: 24px;">
        <h2 style="margin: 0; color: white; font-size: 20px;">📩 Yêu cầu tư vấn mới từ website!</h2>
        <p style="margin: 6px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">sonxinchao.com</p>
      </div>

      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #1f2937; width: 40%; color: #9ca3af; font-size: 14px;">👤 Họ và tên</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #1f2937; color: #f9fafb; font-weight: bold;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #1f2937; color: #9ca3af; font-size: 14px;">📱 Số điện thoại</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #1f2937; color: #60a5fa; font-weight: bold; font-size: 16px;">${phone}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #1f2937; color: #9ca3af; font-size: 14px;">🎯 Dịch vụ</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #1f2937; color: #f9fafb;">${serviceMap[service] || "Chưa chọn"}</td>
        </tr>
        ${message ? `
        <tr>
          <td style="padding: 12px 0; color: #9ca3af; font-size: 14px; vertical-align: top;">💬 Mô tả dự án</td>
          <td style="padding: 12px 0; color: #d1d5db; line-height: 1.6;">${message.replace(/\n/g, "<br>")}</td>
        </tr>
        ` : ""}
      </table>

      <div style="margin-top: 24px; padding: 16px; background: #1f2937; border-radius: 8px; text-align: center;">
        <a href="https://zalo.me/0968806360" style="display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px;">
          💬 Nhắn Zalo ngay cho ${name}
        </a>
      </div>

      <p style="margin-top: 20px; color: #6b7280; font-size: 12px; text-align: center;">
        Email này được gửi tự động từ form liên hệ trên website Sơn Xin Chào
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Sơn Xin Chào Website" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `📩 [Tư vấn mới] ${name} - ${phone} - ${serviceMap[service] || "Chưa chọn dịch vụ"}`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Email error:", err);
    return NextResponse.json({ error: "Gửi email thất bại" }, { status: 500 });
  }
}
