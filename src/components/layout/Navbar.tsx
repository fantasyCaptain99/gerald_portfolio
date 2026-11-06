"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navItems, type NavId } from "@/data/site";
import { profile } from "@/data/profile";
import { Monogram } from "./Monogram";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { useSiteReady } from "@/lib/site-ready";

/** Sections without their own nav item highlight the closest related one. */
const SECTION_TO_NAV: Record<string, NavId> = {
  home: "home",
  about: "about",
  projects: "projects",
  experience: "experience",
  process: "experience",
  collaborate: "contact",
  contact: "contact",
};

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const reduced = useReducedMotion();
  const siteReady = useSiteReady();
  const [active, setActive] = useState<NavId>("home");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  // Active section tracking
  useEffect(() => {
    if (!isHome) return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const nav = SECTION_TO_NAV[e.target.id];
            if (nav) setActive(nav);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [isHome]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile menu: Escape to close, focus management, background scroll lock
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    const t = window.setTimeout(() => firstLink.current?.focus(), 60);
    const btn = menuBtn.current;
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      window.clearTimeout(t);
      btn?.focus();
    };
  }, [open]);

  const href = (id: NavId) => (isHome ? `#${id}` : `/#${id}`);
  const introDelay = reduced ? 0 : isHome ? 1.3 : 0.15;

  return (
    <>
      <a
        href="#main"
        className="fixed left-4 top-4 z-[200] -translate-y-24 rounded-md bg-primary px-4 py-2 font-medium text-background transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>

      <motion.header
        initial={reduced ? false : { y: -40, opacity: 0 }}
        animate={siteReady || reduced ? { y: 0, opacity: 1 } : { y: -40, opacity: 0 }}
        transition={{ delay: introDelay, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4"
      >
        <nav
          aria-label="Primary"
          className={cn(
            "mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 rounded-2xl border px-3 pl-3 transition-[background-color,border-color,box-shadow] duration-500 sm:px-4",
            scrolled || !isHome
              ? "glass border-white/10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.7)]"
              : "border-transparent bg-transparent",
          )}
        >
          <Link href={isHome ? "#home" : "/"} className="group flex items-center gap-3 rounded-lg" aria-label={`${profile.name} — home`}>
            <Monogram />
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="font-display text-[13px] tracking-[0.2em] text-foreground transition-colors group-hover:text-primary">
                {profile.name.toUpperCase()}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/70">Game Developer</span>
            </span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const isActive = isHome && active === item.id;
              return (
                <li key={item.id}>
                  <Link
                    href={href(item.id)}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "group relative block rounded-lg px-3.5 py-2 font-display text-[11px] uppercase tracking-[0.18em] transition-colors duration-300",
                      isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-lg border border-primary/30 bg-primary/10"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    ) : null}
                    <span className="relative">{item.label}</span>
                    <span
                      aria-hidden
                      className="absolute inset-x-3.5 bottom-1 h-px origin-left scale-x-0 bg-primary/70 transition-transform duration-300 group-hover:scale-x-100"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <Link
              href={href("contact")}
              className="shimmer group relative hidden items-center gap-2 overflow-hidden rounded-lg border border-secondary/50 bg-secondary/10 px-4 py-2.5 font-display text-[10px] uppercase tracking-[0.18em] text-secondary transition-[border-color,box-shadow] duration-300 hover:border-secondary hover:shadow-[0_0_24px_-6px_var(--color-secondary)] sm:inline-flex"
            >
              Let&apos;s Build a Game
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </Link>
            <button
              ref={menuBtn}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-foreground transition-colors hover:border-primary/50 hover:text-primary lg:hidden"
            >
              {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-background/95 px-6 pb-10 pt-28 backdrop-blur-xl lg:hidden"
          >
            <div aria-hidden className="absolute inset-0 space-grid opacity-50" />
            <ul className="relative space-y-1">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    ref={i === 0 ? firstLink : undefined}
                    href={href(item.id)}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-baseline gap-4 border-b border-white/5 py-4 font-display text-2xl uppercase tracking-wider transition-colors",
                      isHome && active === item.id ? "text-primary" : "text-foreground hover:text-primary",
                    )}
                  >
                    <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative mt-10"
            >
              <Link
                href={href("contact")}
                onClick={() => setOpen(false)}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-secondary/60 bg-secondary/10 px-6 py-3 font-display text-xs uppercase tracking-[0.2em] text-secondary"
              >
                Let&apos;s Build a Game <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
              <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                {profile.headline}
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
