"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowUp, Mail } from "lucide-react";
import { navItems } from "@/data/site";
import { profile } from "@/data/profile";
import { configuredSocials, social } from "@/data/social";
import { Monogram } from "./Monogram";
import { BrandIcon } from "@/components/ui/BrandIcons";
import { useSmoothScroll } from "@/components/providers/MotionProvider";

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { scrollTo } = useSmoothScroll();
  const socials = configuredSocials();
  const [year] = useState(() => new Date().getFullYear());

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--fx", `${e.clientX - r.left}px`);
    el.style.setProperty("--fy", `${e.clientY - r.top}px`);
  };

  return (
    <footer
      ref={ref}
      onPointerMove={onMove}
      className="group/footer relative overflow-hidden border-t border-border/50 bg-card/50"
    >
      {/* atmosphere (reference) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -bottom-20 -left-20 h-80 w-80 animate-[drift_14s_ease-in-out_infinite] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-10 right-1/4 h-60 w-60 animate-[drift_18s_ease-in-out_infinite_reverse] rounded-full bg-secondary/[0.07] blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
        {/* circuit traces, lit by a mouse-following spotlight */}
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <g fill="none" stroke="var(--color-primary)" strokeWidth="0.15" vectorEffect="non-scaling-stroke" opacity="0.18">
            <path d="M0 100 L0 60 L20 60 L20 40 L40 40" vectorEffect="non-scaling-stroke" />
            <path d="M100 100 L100 50 L80 50 L80 30 L60 30" vectorEffect="non-scaling-stroke" />
            <path d="M5 30 L35 30" vectorEffect="non-scaling-stroke" />
            <path d="M65 25 L95 25" vectorEffect="non-scaling-stroke" />
            <path d="M20 75 L45 75" vectorEffect="non-scaling-stroke" />
            <path d="M55 80 L85 80" vectorEffect="non-scaling-stroke" />
          </g>
        </svg>
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/footer:opacity-100"
          style={{
            background:
              "radial-gradient(260px circle at var(--fx, 50%) var(--fy, 50%), hsl(166 68% 69% / 0.10), transparent 70%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href={isHome ? "#home" : "/"} className="group inline-flex items-center gap-3">
              <Monogram />
              <span className="flex flex-col">
                <span className="font-display text-sm tracking-widest text-foreground transition-colors group-hover:text-primary">
                  {profile.name.toUpperCase()}
                </span>
                <span className="font-mono text-[10px] tracking-wider text-muted-foreground/70">{profile.headline}</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">{profile.positioning}</p>
          </div>

          <nav aria-label="Footer">
            <h2 className="mb-4 font-display text-xs uppercase tracking-[0.2em] text-foreground">Navigate</h2>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {navItems.map((n) => (
                <li key={n.id}>
                  <Link
                    href={isHome ? `#${n.id}` : `/#${n.id}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="mb-4 font-display text-xs uppercase tracking-[0.2em] text-foreground">Connect</h2>
            <div className="flex flex-wrap gap-3">
              {social.email ? (
                <a
                  href={`mailto:${social.email}`}
                  aria-label="Email"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                >
                  <Mail className="h-4 w-4" aria-hidden />
                </a>
              ) : null}
              {socials.map((s) => (
                <a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                >
                  <BrandIcon name={s.key} />
                </a>
              ))}
              <Link
                href={isHome ? "#contact" : "/#contact"}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                Contact form
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 sm:flex-row">
          <p className="font-mono text-[11px] tracking-wider text-muted-foreground" suppressHydrationWarning>
            © {year} {profile.name}. All rights reserved.
          </p>
          <button
            type="button"
            onClick={() => {
              scrollTo(0);
              document.getElementById("main")?.focus({ preventScroll: true });
            }}
            className="group inline-flex min-h-10 items-center gap-2 rounded-full border border-border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Back to top
            <span className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-white/5">
              <ArrowUp className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
