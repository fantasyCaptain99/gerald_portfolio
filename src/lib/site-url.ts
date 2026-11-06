/**
 * Resolves the absolute site URL for metadata, sitemap, and canonical links.
 * Priority: NEXT_PUBLIC_SITE_URL → Vercel production URL → Vercel deployment URL → localhost (dev only).
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (prod) return `https://${prod}`;
  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

/** True only when a real public domain has been configured. */
export const hasCanonicalDomain = Boolean(process.env.NEXT_PUBLIC_SITE_URL);
