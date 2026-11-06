"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ScrollToFn = (target: string | number | HTMLElement, opts?: { offset?: number; immediate?: boolean }) => void;

const MotionContext = createContext<{ scrollTo: ScrollToFn }>({
  scrollTo: () => {},
});

export const useSmoothScroll = () => useContext(MotionContext);

const NAV_OFFSET = -84;

/**
 * Global motion system:
 *  • Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync.
 *  • Attribute-driven scroll reveals: any element with `data-reveal` animates in
 *    when it enters the viewport (variants: up | fade | left | right | scale | line).
 *  • Smooth in-page anchor navigation for `a[href^="#"]` and `/#id` links.
 *  • Fully disabled under prefers-reduced-motion (content is simply visible).
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  const scrollTo = useCallback<ScrollToFn>((target, opts) => {
    const el =
      typeof target === "string"
        ? (document.querySelector(target) as HTMLElement | null)
        : target;
    if (el === null) return;
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(el, {
        offset: typeof el === "number" ? 0 : (opts?.offset ?? NAV_OFFSET),
        immediate: opts?.immediate,
        duration: 1.4,
      });
    } else if (typeof el === "number") {
      window.scrollTo({ top: el });
    } else {
      const top = el.getBoundingClientRect().top + window.scrollY + (opts?.offset ?? NAV_OFFSET);
      window.scrollTo({ top, behavior: "auto" });
    }
  }, []);

  // ---- Lenis smooth scroll (once) ----
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Native touch scrolling on mobile feels best.
      syncTouch: false,
    });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // ---- Anchor interception ----
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href) return;
      let hash: string | null = null;
      if (href.startsWith("#")) hash = href;
      else if (href.startsWith("/#") && window.location.pathname === "/") hash = href.slice(1);
      if (!hash || hash === "#") return;
      const target = hash === "#home" ? document.body : document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      if (hash === "#home") scrollTo(0);
      else scrollTo(target as HTMLElement);
      history.replaceState(null, "", hash);
      // Move focus for keyboard / screen-reader users.
      const focusTarget = target as HTMLElement;
      if (!focusTarget.hasAttribute("tabindex")) focusTarget.setAttribute("tabindex", "-1");
      focusTarget.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [scrollTo]);

  // ---- Initial hash on load (e.g. arriving at /#projects from a project page) ----
  useEffect(() => {
    const hash = window.location.hash;
    if (pathname === "/" && hash.length > 1) {
      const el = document.querySelector(hash) as HTMLElement | null;
      if (el) requestAnimationFrame(() => scrollTo(el, { immediate: true }));
    } else {
      lenisRef.current?.scrollTo(0, { immediate: true });
    }
  }, [pathname, scrollTo]);

  // ---- Scroll reveals (re-run per route; layout effect = primed before paint) ----
  useLayoutEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      root.classList.remove("js-motion");
      return;
    }
    root.dataset.motionReady = "1";

    let io: IntersectionObserver | null = null;
    let sweep: (() => void) | null = null;
    const ctx = gsap.context(() => {
      const from: Record<string, gsap.TweenVars> = {
        up: { y: 42, opacity: 0 },
        fade: { opacity: 0 },
        left: { x: -48, opacity: 0 },
        right: { x: 48, opacity: 0 },
        scale: { scale: 0.92, opacity: 0 },
        word: { yPercent: 110, opacity: 0, rotate: 2 },
        line: { scaleX: 0, opacity: 0, transformOrigin: "left center" },
      };
      const els = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      els.forEach((el) => {
        const kind = el.dataset.reveal || "up";
        gsap.set(el, { ...from[kind] });
      });

      // Masked words start fully outside their overflow-hidden wrapper, so they'd be
      // reported as clipped forever — observe the wrapper and map back to the word.
      const pending = new Map<Element, HTMLElement>();
      els.forEach((el) => {
        const observed = el.dataset.reveal === "word" && el.parentElement ? el.parentElement : el;
        pending.set(observed, el);
      });

      const reveal = (observed: Element[]) => {
        const batch: HTMLElement[] = [];
        observed.forEach((o) => {
          const el = pending.get(o);
          if (!el) return;
          pending.delete(o);
          io?.unobserve(o);
          batch.push(el);
        });
        if (!batch.length) return;
        gsap.to(batch, {
          x: 0,
          y: 0,
          yPercent: 0,
          scale: 1,
          scaleX: 1,
          rotate: 0,
          opacity: 1,
          duration: 1.05,
          ease: "expo.out",
          stagger: 0.08,
          delay: (_i: number, target: HTMLElement) => Number(target.dataset.revealDelay ?? 0) || 0,
          overwrite: "auto",
          clearProps: "transform",
        });
      };

      // Primary detection: IntersectionObserver (uses real layout, so pinned-section
      // spacers and instant jumps are handled). GSAP performs the animation.
      io = new IntersectionObserver(
        (entries) => reveal(entries.filter((e) => e.isIntersecting).map((e) => e.target)),
        { rootMargin: "0px 0px -12% 0px", threshold: 0 },
      );
      pending.forEach((_el, observed) => io?.observe(observed));

      // Safety net: a very fast fling (or a slow frame) can carry an element from below
      // the viewport to above it between two IO checks. Reveal anything already passed.
      let last = 0;
      let trailing = 0;
      sweep = () => {
        if (!pending.size) return;
        const now = performance.now();
        if (now - last < 150) {
          window.clearTimeout(trailing);
          trailing = window.setTimeout(() => sweep?.(), 160);
          return;
        }
        last = now;
        const line = window.innerHeight * 0.88;
        const passed: Element[] = [];
        pending.forEach((_el, o) => {
          if (o.getBoundingClientRect().top < line) passed.push(o);
        });
        reveal(passed);
      };
      window.addEventListener("scroll", sweep, { passive: true });
    });
    // Recalculate scrubbed/pinned ScrollTrigger positions after fonts/images settle.
    const refresh = () => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };
    requestAnimationFrame(refresh);
    const t = window.setTimeout(refresh, 600);
    window.addEventListener("load", refresh);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("load", refresh);
      io?.disconnect();
      if (sweep) window.removeEventListener("scroll", sweep);
      ctx.revert();
    };
  }, [pathname]);

  return <MotionContext.Provider value={{ scrollTo }}>{children}</MotionContext.Provider>;
}
