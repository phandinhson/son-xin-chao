import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  // Rate limit: tối đa 3 đơn hàng/phút mỗi IP (đặt hàng ít hơn liên hệ)
  const ip = getClientIp(req.headers);
  if (!checkRateLimit(ip, 3, 60_000)) {
    return NextResponse.json(
      { error: "Quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút." },
      { status: 429 }
    );
  }

  const body = await req.json();
  const { customer_name, customer_phone, customer_email, customer_address, items, note } = body;

  if (!customer_name || !customer_phone || !items?.length) {
    return NextResponse.json({ error: "Thiếu thông tin đặt hàng" }, { status: 400 });
  }

  // Validate độ dài các trường
  if (
    customer_name.length > 100 ||
    customer_phone.length > 20 ||
    (customer_email && customer_email.length > 200) ||
    (customer_address && customer_address.length > 500) ||
    (note && note.length > 1000) ||
    items.length > 50
  ) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
  }

  // Validate price/quantity không âm
  const hasInvalidItems = items.some(
    (item: { price: number; quantity: number }) =>
      item.price < 0 || item.quantity < 1 || item.quantity > 100
  );
  if (hasInvalidItems) {
    return NextResponse.json({ error: "Thông tin sản phẩm không hợp lệ" }, { status: 400 });
  }

  // Tính tổng tiền từ items
  const subtotal: number = items.reduce(
    (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
    0
  );

  // Tạo mã đơn hàng
  const order_number = `ORD-${Date.now().toString().slice(-8)}`;

  const db = supabaseAdmin();
  const { data, error } = await db
    .from("orders")
    .insert([{
      order_number,
      customer_name,
      customer_phone,
      customer_email: customer_email || null,
      customer_address: customer_address || null,
      items,
      subtotal,
      total: subtotal,
      note: note || null,
      status: "pending",
    }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
