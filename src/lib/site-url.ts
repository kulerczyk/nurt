// P24 wymaga pełnych, publicznie dostępnych adresów https dla urlReturn/urlStatus —
// nie da się użyć ścieżek względnych, jak w linkach wewnętrznych Next.js.
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
