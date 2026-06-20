/**
 * In-memory rate limiter — không cần Redis, hoạt động tốt trên single Vercel instance.
 * Nếu sau này cần multi-instance chính xác hơn, chuyển sang Upstash Redis.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Dọn dẹp các entry hết hạn mỗi 5 phút để tránh memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetAt) rateLimitMap.delete(key);
  }
}, 5 * 60 * 1000);

/**
 * Kiểm tra rate limit cho một key (thường là IP).
 * @param key       Định danh (IP address)
 * @param limit     Số request tối đa trong window (mặc định 5)
 * @param windowMs  Thời gian window tính bằng ms (mặc định 60 giây)
 * @returns true nếu được phép, false nếu bị chặn
 */
export function checkRateLimit(
  key: string,
  limit = 5,
  windowMs = 60_000
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

/**
 * Lấy IP từ request headers (hỗ trợ Vercel, Cloudflare, proxy).
 */
export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  );
}
