import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { customer_name, customer_phone, customer_email, customer_address, items, note } = body;

  if (!customer_name || !customer_phone || !items?.length) {
    return NextResponse.json({ error: "Thiếu thông tin đặt hàng" }, { status: 400 });
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
