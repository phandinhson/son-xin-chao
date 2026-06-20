"use client";
import { useState } from "react";
import { useCart, formatVND } from "./CartContext";

type CheckoutState = "cart" | "form" | "success";

export default function CartDrawer() {
  const { items, open, closeCart, removeItem, updateQty, totalPrice, totalQty, clearCart } = useCart();
  const [step, setStep]     = useState<CheckoutState>("cart");
  const [loading, setLoading] = useState(false);
  const [form, setForm]     = useState({
    customer_name: "", customer_phone: "", customer_email: "", customer_address: "", note: "",
  });
  const [orderNumber, setOrderNumber] = useState("");

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customer_name || !form.customer_phone) return;
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setOrderNumber(data.order_number);
        clearCart();
        setStep("success");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    closeCart();
    if (step === "success") setStep("cart");
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          {step === "cart" && <h2 className="text-lg font-bold text-gray-900">🛒 Giỏ hàng ({totalQty})</h2>}
          {step === "form" && (
            <div className="flex items-center gap-2">
              <button onClick={() => setStep("cart")} className="text-gray-500 hover:text-gray-700">
                ← Quay lại
              </button>
              <h2 className="text-lg font-bold text-gray-900">Thông tin đặt hàng</h2>
            </div>
          )}
          {step === "success" && <h2 className="text-lg font-bold text-green-700">✅ Đặt hàng thành công!</h2>}
          <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 text-xl">×</button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">

          {/* STEP 1: Cart items */}
          {step === "cart" && (
            <div className="p-4">
              {items.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-5xl mb-4">🛒</div>
                  <p className="text-gray-500">Giỏ hàng trống</p>
                  <button onClick={handleClose} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                    Tiếp tục mua sắm
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 line-clamp-2">{item.name}</p>
                        <p className="text-blue-600 font-bold text-sm mt-1">{formatVND(item.price)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold"
                          >−</button>
                          <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold"
                          >+</button>
                        </div>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 p-1 text-lg">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Checkout form */}
          {step === "form" && (
            <form id="checkout-form" onSubmit={handleSubmit} className="p-4 space-y-4">
              {/* Order summary */}
              <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate mr-2">{item.name} × {item.quantity}</span>
                    <span className="font-medium text-gray-900 whitespace-nowrap">{formatVND(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-sm">
                  <span>Tổng cộng</span>
                  <span className="text-blue-600">{formatVND(totalPrice)}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Họ tên <span className="text-red-500">*</span></label>
                <input
                  required value={form.customer_name}
                  onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                <input
                  required type="tel" value={form.customer_phone}
                  onChange={e => setForm(f => ({ ...f, customer_phone: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0912 345 678"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
                <input
                  type="email" value={form.customer_email}
                  onChange={e => setForm(f => ({ ...f, customer_email: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="email@gmail.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Địa chỉ giao hàng</label>
                <input
                  value={form.customer_address}
                  onChange={e => setForm(f => ({ ...f, customer_address: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Số nhà, đường, phường/xã, tỉnh/thành"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Ghi chú</label>
                <textarea
                  rows={3} value={form.note}
                  onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Ghi chú thêm cho đơn hàng..."
                />
              </div>
            </form>
          )}

          {/* STEP 3: Success */}
          {step === "success" && (
            <div className="p-6 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center text-4xl">✅</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Đặt hàng thành công!</h3>
              <p className="text-gray-500 text-sm mb-4">
                Mã đơn hàng của bạn: <span className="font-bold text-blue-600">{orderNumber}</span>
              </p>
              <p className="text-gray-500 text-sm mb-6">
                Chúng tôi sẽ liên hệ xác nhận đơn hàng qua Zalo / điện thoại trong thời gian sớm nhất.
              </p>
              <button
                onClick={handleClose}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === "cart" && items.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600 text-sm">Tổng cộng ({totalQty} sản phẩm)</span>
              <span className="text-blue-600 font-bold text-lg">{formatVND(totalPrice)}</span>
            </div>
            <button
              onClick={() => setStep("form")}
              className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Đặt hàng ngay →
            </button>
          </div>
        )}

        {step === "form" && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <button
              type="submit" form="checkout-form"
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {loading ? "Đang xử lý..." : `Xác nhận đặt hàng — ${formatVND(totalPrice)}`}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
