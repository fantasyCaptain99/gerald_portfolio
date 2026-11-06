/** Tiny className joiner (no runtime dependency needed). */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}
