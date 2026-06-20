"use client";
import { useEffect, useState } from "react";

type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  active: boolean;
  created_at: string;
  last_login: string | null;
};

type FormData = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  active: boolean;
};

const EMPTY_FORM: FormData = { name: "", email: "", password: "", role: "user", active: true };

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

/* ── Modal ── */
function UserModal({
  mode,
  initial,
  onClose,
  onSave,
}: {
  mode: "create" | "edit";
  initial: FormData & { id?: string };
  onClose: () => void;
  onSave: (data: FormData & { id?: string }) => Promise<void>;
}) {
  const [form, setForm]       = useState(initial);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const set = (key: keyof FormData, val: string | boolean) =>
    setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "create" && form.password.length < 8) {
      setError("Mật khẩu tối thiểu 8 ký tự"); return;
    }
    if (mode === "edit" && form.password && form.password.length < 8) {
      setError("Mật khẩu tối thiểu 8 ký tự"); return;
    }
    setSaving(true); setError("");
    try {
      await onSave(form);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <h2 className="text-white font-bold text-lg">
            {mode === "create" ? "➕ Tạo tài khoản mới" : "✏️ Chỉnh sửa tài khoản"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Họ tên *</label>
            <input
              type="text" value={form.name} required
              onChange={e => set("name", e.target.value)}
              placeholder="Nguyễn Văn A"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>

          {/* Email — chỉ edit khi tạo mới */}
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Email *</label>
            <input
              type="email" value={form.email} required={mode === "create"}
              readOnly={mode === "edit"}
              onChange={e => set("email", e.target.value)}
              placeholder="user@sonxinchao.com"
              className={`w-full px-4 py-2.5 border rounded-xl text-white placeholder-gray-600 focus:outline-none transition-all
                ${mode === "edit"
                  ? "bg-white/3 border-white/5 text-gray-500 cursor-not-allowed"
                  : "bg-white/5 border-white/10 focus:border-blue-500/50"
                }`}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">
              Mật khẩu {mode === "create" ? "*" : "(để trống nếu không đổi)"}
            </label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                value={form.password}
                required={mode === "create"}
                onChange={e => set("password", e.target.value)}
                placeholder={mode === "create" ? "Tối thiểu 8 ký tự" : "••••••••"}
                className="w-full px-4 py-2.5 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPwd(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-sm"
              >
                {showPwd ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Phân quyền *</label>
            <div className="grid grid-cols-2 gap-3">
              {(["admin", "user"] as const).map(r => (
                <label
                  key={r}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all
                    ${form.role === r
                      ? r === "admin"
                        ? "border-blue-500/50 bg-blue-600/10"
                        : "border-emerald-500/50 bg-emerald-600/10"
                      : "border-white/10 bg-white/3 hover:border-white/20"
                    }`}
                >
                  <input
                    type="radio" name="role" value={r} checked={form.role === r}
                    onChange={() => set("role", r)}
                    className="mt-0.5 accent-blue-500"
                  />
                  <div>
                    <div className={`text-sm font-bold ${r === "admin" ? "text-blue-400" : "text-emerald-400"}`}>
                      {r === "admin" ? "👑 Admin" : "👤 User"}
                    </div>
                    <div className="text-gray-500 text-xs mt-0.5 leading-relaxed">
                      {r === "admin"
                        ? "Toàn quyền, cấu hình hệ thống"
                        : "Quản lý bài viết, quảng cáo, SEO"
                      }
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Active toggle — chỉ khi edit */}
          {mode === "edit" && (
            <div className="flex items-center justify-between p-4 bg-white/3 rounded-xl border border-white/10">
              <div>
                <div className="text-white text-sm font-medium">Trạng thái tài khoản</div>
                <div className="text-gray-500 text-xs mt-0.5">Vô hiệu hoá sẽ chặn đăng nhập</div>
              </div>
              <button
                type="button"
                onClick={() => set("active", !form.active)}
                className={`relative w-12 h-6 rounded-full transition-colors ${form.active ? "bg-emerald-600" : "bg-gray-700"}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.active ? "translate-x-6" : "translate-x-0.5"}`} />
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 rounded-xl text-sm transition-all"
            >
              Huỷ
            </button>
            <button
              type="submit" disabled={saving}
              className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 text-sm"
            >
              {saving ? "Đang lưu..." : mode === "create" ? "Tạo tài khoản" : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function UsersPage() {
  const [users, setUsers]         = useState<AdminUser[]>([]);
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState<null | { mode: "create" | "edit"; data: FormData & { id?: string } }>(null);
  const [deleteId, setDeleteId]   = useState<string | null>(null);
  const [deleting, setDeleting]   = useState(false);
  const [toast, setToast]         = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    if (res.ok) setUsers(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () =>
    setModal({ mode: "create", data: { ...EMPTY_FORM } });

  const openEdit = (u: AdminUser) =>
    setModal({ mode: "edit", data: { id: u.id, name: u.name, email: u.email, password: "", role: u.role, active: u.active } });

  const handleSave = async (data: FormData & { id?: string }) => {
    if (modal?.mode === "create") {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || "Tạo thất bại");
      }
    } else {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || "Cập nhật thất bại");
      }
    }
    setModal(null);
    showToast(modal?.mode === "create" ? "✅ Đã tạo tài khoản" : "✅ Đã cập nhật");
    load();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const res = await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deleteId }),
    });
    if (res.ok) {
      showToast("🗑️ Đã xoá tài khoản");
      setDeleteId(null);
      load();
    } else {
      const e = await res.json();
      showToast("❌ " + (e.error || "Xoá thất bại"));
    }
    setDeleting(false);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">👥 Quản lý tài khoản</h1>
          <p className="text-gray-500 text-sm mt-1">Phân quyền Admin / User cho nhóm làm việc</p>
        </div>
        <button
          onClick={openCreate}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all text-sm"
        >
          + Tạo tài khoản
        </button>
      </div>

      {/* Role info cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">👑</span>
            <div>
              <div className="text-blue-400 font-bold">Admin</div>
              <div className="text-gray-500 text-xs">Toàn quyền</div>
            </div>
          </div>
          <ul className="text-gray-400 text-xs space-y-1">
            <li>✅ Tất cả tính năng</li>
            <li>✅ Cài đặt & cấu hình hệ thống</li>
            <li>✅ Quản lý tài khoản người dùng</li>
            <li>✅ Analytics, Portfolio, Pricing</li>
          </ul>
        </div>
        <div className="bg-emerald-600/10 border border-emerald-500/20 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">👤</span>
            <div>
              <div className="text-emerald-400 font-bold">User</div>
              <div className="text-gray-500 text-xs">Content & Ads</div>
            </div>
          </div>
          <ul className="text-gray-400 text-xs space-y-1">
            <li>✅ Viết & quản lý bài viết SEO</li>
            <li>✅ Facebook Ads, danh mục</li>
            <li>✅ Thư viện ảnh & media</li>
            <li>❌ Cài đặt, pricing, analytics</li>
          </ul>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 rounded-2xl border border-white/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-white font-semibold">
            Danh sách tài khoản
            <span className="ml-2 text-gray-500 text-sm font-normal">({users.length})</span>
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Đang tải...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 text-4xl mb-3">👥</p>
            <p className="text-gray-400">Chưa có tài khoản nào</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-6 py-3 text-gray-500 text-xs uppercase tracking-wider">Tên / Email</th>
                <th className="text-left px-4 py-3 text-gray-500 text-xs uppercase tracking-wider">Quyền</th>
                <th className="text-left px-4 py-3 text-gray-500 text-xs uppercase tracking-wider">Trạng thái</th>
                <th className="text-left px-4 py-3 text-gray-500 text-xs uppercase tracking-wider">Đăng nhập lần cuối</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  {/* Name / Email */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0
                        ${u.role === "admin"
                          ? "bg-gradient-to-br from-blue-500 to-violet-600"
                          : "bg-gradient-to-br from-emerald-500 to-teal-600"
                        }`}>
                        {u.name.split(" ").map(w => w[0]).slice(-2).join("").toUpperCase()}
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">{u.name}</div>
                        <div className="text-gray-500 text-xs">{u.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold
                      ${u.role === "admin"
                        ? "bg-blue-500/15 text-blue-400"
                        : "bg-emerald-500/15 text-emerald-400"
                      }`}>
                      {u.role === "admin" ? "👑 Admin" : "👤 User"}
                    </span>
                  </td>

                  {/* Active */}
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold
                      ${u.active
                        ? "bg-green-500/15 text-green-400"
                        : "bg-red-500/15 text-red-400"
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${u.active ? "bg-green-400" : "bg-red-400"}`} />
                      {u.active ? "Hoạt động" : "Vô hiệu"}
                    </span>
                  </td>

                  {/* Last login */}
                  <td className="px-4 py-4">
                    <span className="text-gray-500 text-xs">{formatDate(u.last_login)}</span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => openEdit(u)}
                        className="px-3 py-1.5 text-xs text-gray-400 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all"
                      >
                        ✏️ Sửa
                      </button>
                      <button
                        onClick={() => setDeleteId(u.id)}
                        className="px-3 py-1.5 text-xs text-gray-500 hover:text-red-400 border border-white/10 hover:border-red-500/30 rounded-lg transition-all"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modal && (
        <UserModal
          mode={modal.mode}
          initial={modal.data}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {/* Delete confirm modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm bg-gray-900 rounded-2xl border border-white/10 p-8 text-center">
            <div className="text-5xl mb-4">🗑️</div>
            <h3 className="text-white font-bold text-lg mb-2">Xoá tài khoản?</h3>
            <p className="text-gray-400 text-sm mb-6">
              Hành động này không thể hoàn tác. Tài khoản sẽ bị xoá vĩnh viễn.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 border border-white/10 text-gray-400 hover:text-white rounded-xl text-sm transition-all"
              >
                Huỷ
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-sm transition-all disabled:opacity-50"
              >
                {deleting ? "Đang xoá..." : "Xoá"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 bg-gray-800 border border-white/10 rounded-xl text-white text-sm shadow-xl animate-in slide-in-from-bottom-4 duration-200">
          {toast}
        </div>
      )}
    </div>
  );
}
