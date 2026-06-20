"use client";
import { useEffect, useRef, useState } from "react";

type Profile = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  avatar_url: string | null;
  created_at: string;
  last_login: string | null;
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function Avatar({ profile, size = 80 }: { profile: Profile | null; size?: number }) {
  const initials = profile?.name
    ? profile.name.split(" ").map((w) => w[0]).slice(-2).join("").toUpperCase()
    : "?";

  if (profile?.avatar_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={profile.avatar_url}
        alt={profile.name}
        style={{ width: size, height: size }}
        className="rounded-full object-cover ring-4 ring-white/10"
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.35 }}
      className={`rounded-full flex items-center justify-center text-white font-bold ring-4 ring-white/10
        ${profile?.role === "admin"
          ? "bg-gradient-to-br from-blue-500 to-violet-600"
          : "bg-gradient-to-br from-emerald-500 to-teal-600"
        }`}
    >
      {initials}
    </div>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading]   = useState(true);

  // Info form
  const [name, setName]           = useState("");
  const [savingInfo, setSavingInfo] = useState(false);
  const [infoMsg, setInfoMsg]     = useState<{ ok: boolean; text: string } | null>(null);

  // Password form
  const [curPwd, setCurPwd]     = useState("");
  const [newPwd, setNewPwd]     = useState("");
  const [conPwd, setConPwd]     = useState("");
  const [savingPwd, setSavingPwd] = useState(false);
  const [pwdMsg, setPwdMsg]     = useState<{ ok: boolean; text: string } | null>(null);
  const [showPwd, setShowPwd]   = useState(false);

  // Avatar
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarMsg, setAvatarMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/profile");
    if (res.ok) {
      const data = await res.json();
      setProfile(data);
      setName(data.name);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // ── Cập nhật tên ──
  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingInfo(true); setInfoMsg(null);
    const res = await fetch("/api/admin/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (res.ok) {
      setProfile(p => p ? { ...p, name: data.name } : p);
      setInfoMsg({ ok: true, text: "✅ Đã cập nhật tên" });
    } else {
      setInfoMsg({ ok: false, text: "❌ " + data.error });
    }
    setSavingInfo(false);
  };

  // ── Đổi mật khẩu ──
  const handleSavePwd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPwd !== conPwd) { setPwdMsg({ ok: false, text: "❌ Mật khẩu xác nhận không khớp" }); return; }
    if (newPwd.length < 8)  { setPwdMsg({ ok: false, text: "❌ Mật khẩu tối thiểu 8 ký tự" }); return; }
    setSavingPwd(true); setPwdMsg(null);
    const res = await fetch("/api/admin/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current_password: curPwd, new_password: newPwd }),
    });
    const data = await res.json();
    if (res.ok) {
      setCurPwd(""); setNewPwd(""); setConPwd("");
      setPwdMsg({ ok: true, text: "✅ Đã đổi mật khẩu" });
    } else {
      setPwdMsg({ ok: false, text: "❌ " + data.error });
    }
    setSavingPwd(false);
  };

  // ── Upload avatar ──
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true); setAvatarMsg(null);

    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/profile", { method: "POST", body: form });
    const data = await res.json();

    if (res.ok) {
      // Lưu URL vào profile
      const res2 = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar_url: data.url }),
      });
      if (res2.ok) {
        setProfile(p => p ? { ...p, avatar_url: data.url } : p);
        setAvatarMsg({ ok: true, text: "✅ Đã cập nhật ảnh đại diện" });
      } else {
        setAvatarMsg({ ok: false, text: "❌ Không lưu được URL" });
      }
    } else {
      setAvatarMsg({ ok: false, text: "❌ " + data.error });
    }
    setUploadingAvatar(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleRemoveAvatar = async () => {
    const res = await fetch("/api/admin/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatar_url: "" }),
    });
    if (res.ok) {
      setProfile(p => p ? { ...p, avatar_url: null } : p);
      setAvatarMsg({ ok: true, text: "✅ Đã xoá ảnh đại diện" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">👤 Hồ sơ cá nhân</h1>
        <p className="text-gray-500 text-sm mt-1">Quản lý thông tin tài khoản của bạn</p>
      </div>

      {/* ── Avatar Section ── */}
      <div className="bg-gray-900 rounded-2xl border border-white/5 p-6 mb-5">
        <h2 className="text-white font-semibold mb-5">Ảnh đại diện</h2>

        <div className="flex items-center gap-6">
          {/* Avatar preview */}
          <div className="relative flex-shrink-0">
            <Avatar profile={profile} size={88} />
            {uploadingAvatar && (
              <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-3">
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploadingAvatar}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all disabled:opacity-50"
              >
                {uploadingAvatar ? "Đang tải lên..." : "📷 Chọn ảnh"}
              </button>
              {profile?.avatar_url && (
                <button
                  onClick={handleRemoveAvatar}
                  className="px-4 py-2 border border-white/10 hover:border-red-500/30 text-gray-400 hover:text-red-400 text-sm rounded-lg transition-all"
                >
                  Xoá ảnh
                </button>
              )}
            </div>
            <p className="text-gray-600 text-xs">JPG, PNG hoặc WebP. Tối đa 2MB.</p>
            {avatarMsg && (
              <p className={`text-xs mt-2 ${avatarMsg.ok ? "text-emerald-400" : "text-red-400"}`}>
                {avatarMsg.text}
              </p>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
      </div>

      {/* ── Thông tin cá nhân ── */}
      <div className="bg-gray-900 rounded-2xl border border-white/5 p-6 mb-5">
        <h2 className="text-white font-semibold mb-5">Thông tin cá nhân</h2>

        <form onSubmit={handleSaveInfo} className="space-y-4">
          {/* Tên */}
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Họ tên</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>

          {/* Email — read only */}
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">
              Email
              <span className="ml-2 text-gray-600 text-xs">(không thể thay đổi)</span>
            </label>
            <div className="relative">
              <input
                type="email"
                value={profile?.email || ""}
                readOnly
                className="w-full px-4 py-2.5 bg-white/3 border border-white/5 rounded-xl text-gray-500 cursor-not-allowed"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-xs">🔒</span>
            </div>
          </div>

          {/* Role badge */}
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Phân quyền</label>
            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold
              ${profile?.role === "admin"
                ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
              }`}
            >
              {profile?.role === "admin" ? "👑 Admin" : "👤 User"}
            </div>
          </div>

          {infoMsg && (
            <p className={`text-sm ${infoMsg.ok ? "text-emerald-400" : "text-red-400"}`}>
              {infoMsg.text}
            </p>
          )}

          <button
            type="submit"
            disabled={savingInfo || name === profile?.name}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-40 text-sm"
          >
            {savingInfo ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </form>
      </div>

      {/* ── Đổi mật khẩu ── */}
      <div className="bg-gray-900 rounded-2xl border border-white/5 p-6 mb-5">
        <h2 className="text-white font-semibold mb-5">Đổi mật khẩu</h2>

        <form onSubmit={handleSavePwd} className="space-y-4">
          {/* Current password */}
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Mật khẩu hiện tại</label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                value={curPwd}
                onChange={(e) => setCurPwd(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2.5 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all"
              />
              <button type="button" onClick={() => setShowPwd(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                {showPwd ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* New password */}
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Mật khẩu mới</label>
            <input
              type={showPwd ? "text" : "password"}
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              required
              placeholder="Tối thiểu 8 ký tự"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>

          {/* Confirm */}
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Xác nhận mật khẩu mới</label>
            <input
              type={showPwd ? "text" : "password"}
              value={conPwd}
              onChange={(e) => setConPwd(e.target.value)}
              required
              placeholder="Nhập lại mật khẩu mới"
              className={`w-full px-4 py-2.5 bg-white/5 border rounded-xl text-white placeholder-gray-600 focus:outline-none transition-all
                ${conPwd && newPwd !== conPwd ? "border-red-500/50 focus:border-red-500/50" : "border-white/10 focus:border-blue-500/50"}`}
            />
            {conPwd && newPwd !== conPwd && (
              <p className="text-red-400 text-xs mt-1">Mật khẩu không khớp</p>
            )}
          </div>

          {/* Password strength */}
          {newPwd && (
            <div className="space-y-1">
              <div className="flex gap-1">
                {[8, 12, 16].map((len, i) => (
                  <div key={i}
                    className={`h-1 flex-1 rounded-full transition-colors
                      ${newPwd.length >= len
                        ? i === 0 ? "bg-yellow-500" : i === 1 ? "bg-blue-500" : "bg-emerald-500"
                        : "bg-white/10"
                      }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-600">
                {newPwd.length < 8 ? "Quá ngắn" : newPwd.length < 12 ? "Tạm được" : newPwd.length < 16 ? "Tốt" : "Rất mạnh"}
              </p>
            </div>
          )}

          {pwdMsg && (
            <p className={`text-sm ${pwdMsg.ok ? "text-emerald-400" : "text-red-400"}`}>
              {pwdMsg.text}
            </p>
          )}

          <button
            type="submit"
            disabled={savingPwd || !curPwd || !newPwd || !conPwd}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-40 text-sm"
          >
            {savingPwd ? "Đang lưu..." : "Đổi mật khẩu"}
          </button>
        </form>
      </div>

      {/* ── Thông tin tài khoản ── */}
      <div className="bg-gray-900 rounded-2xl border border-white/5 p-6">
        <h2 className="text-white font-semibold mb-4">Thông tin tài khoản</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-gray-500">Ngày tạo tài khoản</span>
            <span className="text-gray-300">{formatDate(profile?.created_at || null)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Đăng nhập lần cuối</span>
            <span className="text-gray-300">{formatDate(profile?.last_login || null)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
