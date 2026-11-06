/**
 * SOCIAL & CONTACT LINKS
 *
 * Leave a value as null to hide it. Nothing here is pre-filled with
 * invented accounts — add your real handles/URLs.
 */
export const social = {
  /** e.g. "hello@yourdomain.com" — shown as a direct-email fallback */
  email: null as string | null,
  github: null as string | null, // "https://github.com/your-handle"
  linkedin: null as string | null, // "https://www.linkedin.com/in/your-handle"
  upwork: null as string | null, // "https://www.upwork.com/freelancers/your-id"
  itchio: null as string | null, // "https://your-handle.itch.io"
  /** Playable demos — e.g. { label: "Browser 3D demo", href: "https://..." } */
  demos: [] as { label: string; href: string }[],
};

export type SocialKey = "github" | "linkedin" | "upwork" | "itchio";

export function configuredSocials() {
  const entries: { key: SocialKey; label: string; href: string }[] = [];
  if (social.github) entries.push({ key: "github", label: "GitHub", href: social.github });
  if (social.linkedin) entries.push({ key: "linkedin", label: "LinkedIn", href: social.linkedin });
  if (social.upwork) entries.push({ key: "upwork", label: "Upwork", href: social.upwork });
  if (social.itchio) entries.push({ key: "itchio", label: "itch.io", href: social.itchio });
  return entries;
}
