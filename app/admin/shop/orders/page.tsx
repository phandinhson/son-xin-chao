"use client";
import { useEffect, useState } from "react";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  customer_address: string | null;
  items: OrderItem[];
  subtotal: number;
  total: number;
  note: string | null;
  status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
  created_at: string;
};

const STATUS_MAP = {
  pending:   { label: "Chờ xác nhận", color: "bg-amber-100 text-amber-700 border-amber-200" },
  confirmed: { label: "Đã xác nhận",  color: "bg-blue-100 text-blue-700 border-blue-200" },
  shipping:  { label: "Đang giao",    color: "bg-violet-100 text-violet-700 border-violet-200" },
  delivered: { label: "Đã giao",      color: "bg-green-100 text-green-700 border-green-200" },
  cancelled: { label: "Đã huỷ",       color: "bg-red-100 text-red-700 border-red-200" },
};

function formatVND(n: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
}

export default function AdminOrdersPage() {
  const [orders, setOrders]     = useState<Order[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState<string>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/orders");
    if (res.ok) setOrders(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdating(id);
    await fetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
    setUpdating(null);
  };

  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const totalRevenue = orders
    .filter(o => o.status === "delivered")
    .reduce((s, o) => s + o.total, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">📦 Quản lý đơn hàng</h1>
            <p className="text-sm text-gray-500 mt-0.5">Theo dõi và xử lý đơn đặt hàng</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Doanh thu (đã giao)</p>
            <p className="text-lg font-bold text-green-600">{formatVND(totalRevenue)}</p>
          </div>
        </div>

        {/* Stats bar */}
        {orders.length > 0 && (
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100 flex-wrap">
            <div className="text-sm text-gray-600 font-medium">{orders.length} đơn hàng</div>
            {Object.entries(STATUS_MAP).map(([key, val]) => (
              statusCounts[key] ? (
                <div key={key} className="flex items-center gap-1.5 text-sm">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${val.color}`}>{val.label}</span>
                  <span className="text-gray-600">{statusCounts[key]}</span>
                </div>
              ) : null
            ))}
          </div>
        )}
      </div>

      {/* Filter tabs */}
      {orders.length > 0 && (
        <div className="bg-white border-b border-gray-200 px-6 overflow-x-auto">
          <div className="flex gap-0 min-w-max">
            <button onClick={() => setFilter("all")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${filter === "all" ? "text-blue-600 border-blue-600" : "text-gray-500 border-transparent hover:text-gray-700"}`}>
              Tất cả ({orders.length})
            </button>
            {Object.entries(STATUS_MAP).map(([key, val]) => (
              <button key={key} onClick={() => setFilter(key)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${filter === key ? "text-blue-600 border-blue-600" : "text-gray-500 border-transparent hover:text-gray-700"}`}>
                {val.label} {statusCounts[key] ? `(${statusCounts[key]})` : ""}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-6 py-5">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl border border-gray-200">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-gray-500">Chưa có đơn hàng nào</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(order => {
              const s     = STATUS_MAP[order.status];
              const isExp = expanded === order.id;

              return (
                <div key={order.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  {/* Row summary */}
                  <div
                    className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setExpanded(isExp ? null : order.id)}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{order.order_number}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {new Date(order.created_at).toLocaleString("vi-VN", {
                            day: "2-digit", month: "2-digit", year: "numeric",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="hidden sm:block min-w-0">
                        <p className="text-sm font-semibold text-gray-800">{order.customer_name}</p>
                        <p className="text-xs text-gray-500">{order.customer_phone}</p>
                      </div>
                      <div className="hidden md:block">
                        <p className="text-sm text-gray-600">{order.items.length} sản phẩm</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-sm font-bold text-blue-600 hidden sm:block">{formatVND(order.total)}</span>
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${s.color}`}>{s.label}</span>
                      <span className="text-gray-400 text-sm">{isExp ? "▲" : "▼"}</span>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isExp && (
                    <div className="border-t border-gray-100 px-5 py-5 bg-gray-50 space-y-5">
                      {/* Customer info */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Khách hàng</h4>
                          <div className="space-y-1.5">
                            <p className="text-sm text-gray-800"><span className="font-medium">Tên:</span> {order.customer_name}</p>
                            <p className="text-sm text-gray-800"><span className="font-medium">SĐT:</span>
                              <a href={`tel:${order.customer_phone}`} className="text-blue-600 hover:underline ml-1">{order.customer_phone}</a>
                            </p>
                            {order.customer_email && (
                              <p className="text-sm text-gray-800"><span className="font-medium">Email:</span> {order.customer_email}</p>
                            )}
                            {order.customer_address && (
                              <p className="text-sm text-gray-800"><span className="font-medium">Địa chỉ:</span> {order.customer_address}</p>
                            )}
                            {order.note && (
                              <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1 mt-2">
                                📝 {order.note}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Order items */}
                        <div>
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Sản phẩm</h4>
                          <div className="space-y-2">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex items-center gap-2">
                                {item.image && (
                                  <img src={item.image} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-gray-800 truncate">{item.name}</p>
                                  <p className="text-xs text-gray-500">{formatVND(item.price)} × {item.quantity}</p>
                                </div>
                                <p className="text-xs font-bold text-gray-900 whitespace-nowrap">{formatVND(item.price * item.quantity)}</p>
                              </div>
                            ))}
                            <div className="pt-2 border-t border-gray-200 flex justify-between">
                              <span className="text-sm font-bold text-gray-700">Tổng</span>
                              <span className="text-sm font-bold text-blue-600">{formatVND(order.total)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status actions */}
                      <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Cập nhật trạng thái</h4>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(STATUS_MAP).map(([key, val]) => (
                            <button
                              key={key}
                              onClick={() => handleStatusChange(order.id, key)}
                              disabled={order.status === key || updating === order.id}
                              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                order.status === key
                                  ? `${val.color} ring-2 ring-offset-1 ring-blue-500`
                                  : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100"
                              }`}
                            >
                              {val.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
