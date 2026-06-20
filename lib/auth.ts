/**
 * lib/auth.ts
 * JWT + PBKDF2 password hashing — zero external dependencies.
 * Works in both Edge runtime (middleware) and Node.js runtime (API routes).
 */

const getSecret = () =>
  process.env.JWT_SECRET || process.env.ADMIN_SECRET || "change-me-in-env";

// ── Base64url helpers (UTF-8 safe — hỗ trợ tiếng Việt) ──────────────────────
// btoa() chỉ xử lý Latin-1, phải encode UTF-8 trước khi base64
function objToB64url(obj: object): string {
  const json = JSON.stringify(obj);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  Array.from(bytes).forEach(b => { binary += String.fromCharCode(b); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function b64urlToObj(s: string): object {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/") +
    "===".slice(0, (4 - (s.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

// Encode raw string (ASCII only) — dùng cho JWT header
const b64url = (s: string) =>
  btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");

// ── Types ─────────────────────────────────────────────────────────────────────
export type AdminRole = "admin" | "user";

export type AdminPayload = {
  userId: string;
  email: string;
  name: string;
  role: AdminRole;
  exp?: number;
  iat?: number;
};

// ── HMAC-SHA256 ───────────────────────────────────────────────────────────────
async function hmacSign(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return b64url(String.fromCharCode(...Array.from(new Uint8Array(sig))));
}

// ── JWT ───────────────────────────────────────────────────────────────────────
export async function signAdminToken(
  payload: Omit<AdminPayload, "exp" | "iat">
): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60 * 24 * 7; // 7 ngày
  // JWT header chỉ dùng ASCII → b64url thường
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  // Payload có thể chứa tiếng Việt → dùng UTF-8 safe encoder
  const body = objToB64url({ ...payload, iat, exp });
  const sig = await hmacSign(`${header}.${body}`, getSecret());
  return `${header}.${body}.${sig}`;
}

export async function verifyAdminToken(token: string): Promise<AdminPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, body, sig] = parts;

    // Verify signature
    const expected = await hmacSign(`${header}.${body}`, getSecret());
    if (expected !== sig) return null;

    // Parse payload (UTF-8 safe)
    const payload = b64urlToObj(body) as AdminPayload;

    // Check expiry
    if (payload.exp && payload.exp < Date.now() / 1000) return null;

    return payload;
  } catch {
    return null;
  }
}

// ── PBKDF2 Password Hashing ───────────────────────────────────────────────────
// Format: "pbkdf2:{saltHex}:{hashHex}"
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: 100_000 },
    key,
    256
  );
  const hashHex = Array.from(new Uint8Array(bits))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `pbkdf2:${saltHex}:${hashHex}`;
}

export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  try {
    const [algo, saltHex, hashHex] = stored.split(":");
    if (algo !== "pbkdf2") return false;

    const salt = new Uint8Array(
      saltHex.match(/.{2}/g)!.map((b) => parseInt(b, 16))
    );
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveBits"]
    );
    const bits = await crypto.subtle.deriveBits(
      { name: "PBKDF2", hash: "SHA-256", salt, iterations: 100_000 },
      key,
      256
    );
    const computed = Array.from(new Uint8Array(bits))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Constant-time comparison
    if (computed.length !== hashHex.length) return false;
    let diff = 0;
    for (let i = 0; i < computed.length; i++) {
      diff |= computed.charCodeAt(i) ^ hashHex.charCodeAt(i);
    }
    return diff === 0;
  } catch {
    return false;
  }
}
