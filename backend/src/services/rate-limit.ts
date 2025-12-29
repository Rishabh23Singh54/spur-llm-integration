const hits = new Map<string, number[]>();

export function rateLimit(ip: string, limit = 30) {
  const now = Date.now();
  const windowMs = 60_000;

  const times = hits.get(ip)?.filter(t => now - t < windowMs) ?? [];
  if (times.length >= limit) return false;

  times.push(now);
  hits.set(ip, times);
  return true;
}
