"use client";
import { useEffect, useState } from "react";
import type { Pricing } from "@/lib/supabase";

// ─── Pricing constants ───────────────────────────────────────
const PRICING_ICONS = ["🌱", "🚀", "👑", "⭐", "💎", "🔥"];
const emptyPricingForm = {
  name: "", icon: "🌱", price: "", unit: "đ/tháng",
  description: "", features: "", not_included: "",
  is_popular: false, cta_text: "Bắt đầu ngay", sort_order: 0,
};

// ─── Addon types & constants ──────────────────────────────────
type Addon = { id: string; name: string; icon: string; price: string; unit: string; sort_order: number; active: boolean };
const ADDON_ICONS = ["🌐", "📄", "🔎", "⚙️", "✍️", "📍", "⭐", "🚀", "💎", "🔥", "📊", "💡", "🎯", "🛠️", "📱", "🖥️"];
const emptyAddonForm = { name: "", icon: "⭐", price: "", unit: "đ", sort_order: 0, active: true };

// ─── Shared input style ───────────────────────────────────────
const inp = "w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors";

export default function PricingAdminCombined() {
  const [tab, setTab] = useState<"pricing" | "addons">("pricing");

  // ── Pricing state ──
  const [pricing, setPricing] = useState<Pricing[]>([]);
  const [pricingLoading, setPricingLoading] = useState(true);
  const [showPricingForm, setShowPricingForm] = useState(false);
  const [editingPricing, setEditingPricing] = useState<Pricing | null>(null);
  const [pricingForm, setPricingForm] = useState(emptyPricingForm);
  const [savingPricing, setSavingPricing] = useState(false);

  // ── Addon state ──
  const [addons, setAddons] = useState<Addon[]>([]);
  const [addonsLoading, setAddonsLoading] = useState(true);
  const [showAddonForm, setShowAddonForm] = useState(false);
  const [editingAddon, setEditingAddon] = useState<Addon | null>(null);
  const [addonForm, setAddonForm] = useState(emptyAddonForm);
  const [savingAddon, setSavingAddon] = useState(false);
  const [deleteAddonId, setDeleteAddonId] = useState<string | null>(null);

  // ── Load data ──
  const loadPricing = async () => {
    const res = await fetch("/api/admin/pricing");
    if (res.ok) setPricing(await res.json());
    setPricingLoading(false);
  };
  const loadAddons = async () => {
    const res = await fetch("/api/admin/addons");
    if (res.ok) setAddons(await res.json());
    setAddonsLoading(false);
  };
  useEffect(() => { loadPricing(); loadAddons(); }, []);

  // ── Pricing CRUD ──
  const openNewPricing = () => {
    setEditingPricing(null);
    setPricingForm({ ...emptyPricingForm, sort_order: pricing.length + 1 });
    setShowPricingForm(true);
  };
  const openEditPricing = (item: Pricing) => {
    setEditingPricing(item);
    setPricingForm({
      name: item.name, icon: item.icon, price: item.price, unit: item.unit,
      description: item.description, features: item.features.join("\n"),
      not_included: item.not_included.join("\n"),
      is_popular: item.is_popular, cta_text: item.cta_text, sort_order: item.sort_order,
    });
    setShowPricingForm(true);
  };
  const savePricing = async () => {
    setSavingPricing(true);
    const payload = {
      ...pricingForm,
      features: pricingForm.features.split("\n").map((f) => f.trim()).filter(Boolean),
      not_included: pricingForm.not_included.split("\n").map((f) => f.trim()).filter(Boolean),
    };
    const url = editingPricing ? `/api/admin/pricing/${editingPricing.id}` : "/api/admin/pricing";
    const method = editingPricing ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (res.ok) { await loadPricing(); setShowPricingForm(false); }
    setSavingPricing(false);
  };
  const deletePricing = async (id: string, name: string) => {
    if (!confirm(`Xóa gói "${name}"?`)) return;
    await fetch(`/api/admin/pricing/${id}`, { method: "DELETE" });
    await loadPricing();
  };

  // ── Addon CRUD ──
  const openNewAddon = () => {
    setEditingAddon(null);
    setAddonForm({ ...emptyAddonForm, sort_order: addons.length + 1 });
    setShowAddonForm(true);
  };
  const openEditAddon = (item: Addon) => {
    setEditingAddon(item);
    setAddonForm({ name: item.name, icon: item.icon, price: item.price, unit: item.unit, sort_order: item.sort_order, active: item.active });
    setShowAddonForm(true);
  };
  const saveAddon = async () => {
    setSavingAddon(true);
    const method = editingAddon ? "PUT" : "POST";
    const url = editingAddon ? `/api/admin/addons/${editingAddon.id}` : "/api/admin/addons";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(addonForm) });
    if (res.ok) { setShowAddonForm(false); await loadAddons(); }
    setSavingAddon(false);
  };
  const deleteAddon = async (id: string) => {
    await fetch(`/api/admin/addons/${id}`, { method: "DELETE" });
    setDeleteAddonId(null);
    await loadAddons();
  };
  const toggleAddon = async (item: Addon) => {
    await fetch(`/api/admin/addons/${item.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, active: !item.active }),
    });
    await loadAddons();
  };
  const previewPrice = (price: string, unit: string) => {
    if (!unit || unit === "đ") return `${price}đ`;
    if (unit.startsWith("đ/")) return `${price}${unit}`;
    return `${price} ${unit}`;
  };

  return (
    <div className="p-8">
      {/* ── Page header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Bảng giá & Dịch vụ bổ sung</h1>
          <p className="text-gray-400 mt-1 text-sm">Quản lý gói dịch vụ và add-on hiển thị trên website</p>
        </div>
        {tab === "pricing"
          ? <button onClick={openNewPricing} className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all text-sm">+ Thêm gói</button>
          : <button onClick={openNewAddon} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors"><span className="text-lg">+</span> Thêm Add-on</button>
        }
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 p-1 bg-white/5 border border-white/10 rounded-2xl w-fit mb-8">
        <button
          onClick={() => setTab("pricing")}
          className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${tab === "pricing" ? "bg-white/10 text-white shadow" : "text-gray-400 hover:text-white"}`}
        >
          💰 Gói dịch vụ <span className="ml-1.5 text-xs opacity-60">({pricing.length})</span>
        </button>
        <button
          onClick={() => setTab("addons")}
          className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${tab === "addons" ? "bg-white/10 text-white shadow" : "text-gray-400 hover:text-white"}`}
        >
          ➕ Dịch vụ bổ sung <span className="ml-1.5 text-xs opacity-60">({addons.length})</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════
          TAB 1: GÓI DỊCH VỤ
         ══════════════════════════════════════════════════════ */}
      {tab === "pricing" && (
        pricingLoading ? (
          <div className="text-gray-500 text-center py-20">Đang tải...</div>
        ) : pricing.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <div className="text-5xl mb-4">💰</div>
            <p>Chưa có gói nào. Nhấn <span className="text-white">+ Thêm gói</span> để bắt đầu.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {pricing.map((item) => (
              <div key={item.id} className="relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 transition-all group">
                {item.is_popular && (
                  <div className="absolute -top-3 right-4 px-3 py-1 bg-gradient-to-r from-violet-600 to-pink-600 text-white text-xs font-bold rounded-full">⭐ Phổ biến</div>
                )}
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-white font-bold text-xl mb-1">{item.name}</h3>
                <p className="text-blue-400 font-bold text-lg mb-3">
                  {item.price} <span className="text-gray-500 text-sm font-normal">{item.unit}</span>
                </p>
                <ul className="text-gray-400 text-xs space-y-1 mb-4">
                  {item.features.slice(0, 3).map((f, i) => <li key={i}>✓ {f}</li>)}
                  {item.features.length > 3 && <li className="text-gray-600">+{item.features.length - 3} tính năng...</li>}
                </ul>
                <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditPricing(item)} className="flex-1 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-500/30 transition-all">Sửa</button>
                  <button onClick={() => deletePricing(item.id, item.name)} className="flex-1 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/30 transition-all">Xóa</button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* ══════════════════════════════════════════════════════
          TAB 2: DỊCH VỤ BỔ SUNG
         ══════════════════════════════════════════════════════ */}
      {tab === "addons" && (
        <>
          <div className="mb-5 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm">
            💡 Add-on đang <span className="font-semibold text-white">bật</span> sẽ hiển thị trên website. Tắt để ẩn tạm thời mà không xóa.
          </div>

          {addonsLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />)}
            </div>
          ) : addons.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <div className="text-5xl mb-4">📦</div>
              <p>Chưa có add-on nào. Nhấn <span className="text-white">+ Thêm Add-on</span> để bắt đầu.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {addons.map((item) => (
                <div key={item.id} className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${item.active ? "bg-white/5 border-white/10 hover:border-white/20" : "bg-white/2 border-white/5 opacity-50"}`}>
                  <span className="text-2xl w-10 text-center flex-shrink-0">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm ${item.active ? "text-white" : "text-gray-500"}`}>{item.name}</p>
                    <p className="text-blue-400 text-sm font-bold mt-0.5">{previewPrice(item.price, item.unit)}</p>
                  </div>
                  <span className="text-xs text-gray-600 w-8 text-center flex-shrink-0">#{item.sort_order}</span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleAddon(item)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${item.active ? "bg-blue-600" : "bg-gray-700"}`}
                      title={item.active ? "Đang hiện — click để ẩn" : "Đang ẩn — click để hiện"}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${item.active ? "translate-x-5" : "translate-x-0.5"}`} />
                    </button>
                    <button onClick={() => openEditAddon(item)} className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors">Sửa</button>
                    <button onClick={() => setDeleteAddonId(item.id)} className="px-3 py-1.5 text-xs font-medium text-red-500 hover:text-red-400 bg-red-500/5 hover:bg-red-500/10 rounded-lg transition-colors">Xoá</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ══════════════════════════════════════════════════════
          MODAL: PRICING FORM
         ══════════════════════════════════════════════════════ */}
      {showPricingForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-white/10 rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-6">{editingPricing ? "Sửa gói dịch vụ" : "Thêm gói mới"}</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Tên gói *</label>
                  <input value={pricingForm.name} onChange={(e) => setPricingForm({ ...pricingForm, name: e.target.value })}
                    placeholder="VD: Starter, Growth, Pro" className={inp} />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Icon</label>
                  <select value={pricingForm.icon} onChange={(e) => setPricingForm({ ...pricingForm, icon: e.target.value })}
                    className={inp}>
                    {PRICING_ICONS.map((i) => <option key={i} className="bg-gray-900">{i}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Giá *</label>
                  <input value={pricingForm.price} onChange={(e) => setPricingForm({ ...pricingForm, price: e.target.value })}
                    placeholder="3.500.000 hoặc Liên hệ" className={inp} />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Đơn vị</label>
                  <input value={pricingForm.unit} onChange={(e) => setPricingForm({ ...pricingForm, unit: e.target.value })}
                    placeholder="đ/tháng" className={inp} />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Thứ tự</label>
                  <input type="number" value={pricingForm.sort_order} onChange={(e) => setPricingForm({ ...pricingForm, sort_order: +e.target.value })}
                    className={inp} />
                </div>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Mô tả</label>
                <textarea rows={2} value={pricingForm.description} onChange={(e) => setPricingForm({ ...pricingForm, description: e.target.value })}
                  className={inp + " resize-none"} />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Tính năng bao gồm (mỗi dòng 1 tính năng)</label>
                <textarea rows={6} value={pricingForm.features} onChange={(e) => setPricingForm({ ...pricingForm, features: e.target.value })}
                  placeholder={"SEO on-page cơ bản\nNghiên cứu 10 từ khóa\nBáo cáo hàng tháng"}
                  className={inp + " resize-none font-mono"} />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Không bao gồm (mỗi dòng 1 mục)</label>
                <textarea rows={2} value={pricingForm.not_included} onChange={(e) => setPricingForm({ ...pricingForm, not_included: e.target.value })}
                  placeholder={"Quảng cáo trả phí\nThiết kế website"}
                  className={inp + " resize-none font-mono"} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Nút CTA</label>
                  <input value={pricingForm.cta_text} onChange={(e) => setPricingForm({ ...pricingForm, cta_text: e.target.value })}
                    className={inp} />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <span className="text-gray-400 text-sm">Gói nổi bật (Popular)</span>
                    <button onClick={() => setPricingForm({ ...pricingForm, is_popular: !pricingForm.is_popular })}
                      className={`w-11 h-6 rounded-full transition-colors ${pricingForm.is_popular ? "bg-violet-600" : "bg-gray-700"}`}>
                      <div className={`w-4 h-4 bg-white rounded-full mx-1 transition-transform ${pricingForm.is_popular ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowPricingForm(false)} className="flex-1 py-3 border border-white/20 text-gray-300 rounded-xl hover:bg-white/5 transition-all text-sm">Hủy</button>
              <button onClick={savePricing} disabled={savingPricing} className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all text-sm">
                {savingPricing ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          MODAL: ADDON FORM
         ══════════════════════════════════════════════════════ */}
      {showAddonForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 w-full max-w-lg shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">{editingAddon ? "Chỉnh sửa Add-on" : "Thêm Add-on mới"}</h2>
            <div className="space-y-5">
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Tên dịch vụ <span className="text-red-400">*</span></label>
                <input value={addonForm.name} onChange={(e) => setAddonForm({ ...addonForm, name: e.target.value })}
                  placeholder="Ví dụ: Thiết kế website WordPress cơ bản"
                  className={inp + " focus:bg-white/8"} />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {ADDON_ICONS.map((ic) => (
                    <button key={ic} onClick={() => setAddonForm({ ...addonForm, icon: ic })}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${addonForm.icon === ic ? "bg-blue-600 ring-2 ring-blue-400 scale-110" : "bg-white/5 hover:bg-white/10 border border-white/10"}`}>
                      {ic}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">Giá <span className="text-red-400">*</span></label>
                  <input value={addonForm.price} onChange={(e) => setAddonForm({ ...addonForm, price: e.target.value })}
                    placeholder="5.000.000" className={inp + " focus:bg-white/8"} />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">Đơn vị</label>
                  <input value={addonForm.unit} onChange={(e) => setAddonForm({ ...addonForm, unit: e.target.value })}
                    placeholder="đ / đ/bài / đ/tháng" className={inp + " focus:bg-white/8"} />
                  <p className="text-xs text-gray-600 mt-1">Gõ: đ, đ/bài, đ/tháng</p>
                </div>
              </div>
              {addonForm.price && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-2xl">{addonForm.icon}</span>
                  <div>
                    <p className="text-white text-sm font-medium">{addonForm.name || "Tên dịch vụ"}</p>
                    <p className="text-blue-400 text-sm font-bold">{previewPrice(addonForm.price, addonForm.unit)}</p>
                  </div>
                </div>
              )}
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Thứ tự hiển thị</label>
                <input type="number" value={addonForm.sort_order} onChange={(e) => setAddonForm({ ...addonForm, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors" />
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setAddonForm({ ...addonForm, active: !addonForm.active })}
                  className={`relative w-11 h-6 rounded-full transition-colors ${addonForm.active ? "bg-blue-600" : "bg-gray-700"}`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${addonForm.active ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
                <span className="text-sm text-gray-300">{addonForm.active ? "Hiển thị trên website" : "Ẩn (không hiển thị)"}</span>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowAddonForm(false)}
                className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors">
                Huỷ
              </button>
              <button onClick={saveAddon} disabled={savingAddon || !addonForm.name || !addonForm.price}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors">
                {savingAddon ? "Đang lưu..." : editingAddon ? "Lưu thay đổi" : "Thêm mới"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          MODAL: DELETE ADDON CONFIRM
         ══════════════════════════════════════════════════════ */}
      {deleteAddonId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="text-5xl mb-4">🗑️</div>
            <h3 className="text-white font-bold text-lg mb-2">Xác nhận xoá?</h3>
            <p className="text-gray-400 text-sm mb-6">Add-on này sẽ bị xoá vĩnh viễn và không thể khôi phục.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteAddonId(null)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors">
                Huỷ
              </button>
              <button onClick={() => deleteAddon(deleteAddonId)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors">
                Xoá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
