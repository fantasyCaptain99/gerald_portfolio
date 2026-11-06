"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight, Gamepad2 } from "lucide-react";
import { profile } from "@/data/profile";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { HeroSceneMount } from "@/components/three/HeroSceneMount";
import { onSiteReady } from "@/lib/site-ready";

gsap.registerPlugin(ScrollTrigger);

/**
 * HERO — reference composition: centered stack with a luminous centerpiece
 * above the headline (here, a live 3D game world), mono kicker, gradient
 * display title revealed word-by-word, chips, gradient divider and a
 * "Scroll to explore" cue. Intro is a single GSAP timeline.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const { hero, headline } = profile;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let intro: gsap.core.Timeline | null = null;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      // Built paused; plays when the loading screen starts to exit.
      const tl = (intro = gsap.timeline({ paused: true, defaults: { ease: "expo.out", duration: 1.2 } }));
      tl.fromTo(q("[data-hero-intro='atmo']"), { opacity: 0 }, { opacity: 1, duration: 1.6, ease: "power2.out" }, 0)
        .fromTo(q("[data-hero-intro='kicker']"), { opacity: 0, y: 18, letterSpacing: "0.7em" }, { opacity: 1, y: 0, letterSpacing: "0.4em" }, 0.35)
        .fromTo(q("[data-hero-intro='title']"), { opacity: 1 }, { opacity: 1, duration: 0.01 }, 0.45)
        .fromTo(q("[data-hero-word]"), { yPercent: 115, rotate: 3 }, { yPercent: 0, rotate: 0, stagger: 0.07, duration: 1.3 }, 0.5)
        .fromTo(q("[data-hero-intro='headline']"), { opacity: 0, y: 16 }, { opacity: 1, y: 0 }, 1.05)
        .fromTo(q("[data-hero-intro='desc']"), { opacity: 0, y: 18 }, { opacity: 1, y: 0 }, 1.15)
        .fromTo(q("[data-hero-intro='cta']"), { opacity: 0, y: 22 }, { opacity: 1, y: 0, stagger: 0.1 }, 1.3)
        .fromTo(q("[data-hero-intro='chip']"), { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, stagger: 0.06, duration: 0.6 }, 1.45)
        .fromTo(q("[data-hero-intro='divider']"), { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 1.4 }, 1.6)
        .fromTo(q("[data-hero-intro='scroll']"), { opacity: 0 }, { opacity: 1, duration: 1 }, 1.9);

      // Scroll-out parallax: content lifts and fades, scene recedes.
      gsap.to(q("[data-hero-parallax='content']"), {
        yPercent: -12,
        opacity: 0.15,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(q("[data-hero-parallax='scene']"), {
        yPercent: 18,
        scale: 0.94,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
    }, el);
    const stop = onSiteReady(() => intro?.play());
    return () => {
      stop();
      ctx.revert();
    };
  }, []);

  const titleWords = hero.titleLines.map((line) => line.split(" "));

  return (
    <section
      ref={root}
      id="home"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* Atmosphere — aurora blobs + space grid + vignette (reference) */}
      <div data-hero-intro="atmo" aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 space-grid opacity-60" />
        <div className="absolute -left-40 top-1/4 h-[28rem] w-[40rem] animate-[drift_18s_ease-in-out_infinite] rounded-full bg-primary/[0.09] blur-[90px]" />
        <div className="absolute -right-40 top-10 h-[26rem] w-[36rem] animate-[drift_22s_ease-in-out_infinite_reverse] rounded-full bg-secondary/[0.08] blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 h-[22rem] w-[60rem] -translate-x-1/2 rounded-full bg-accent/[0.08] blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgb(9_10_16/0.25)_55%,rgb(9_10_16/0.85)_100%)]" />
      </div>

      {/* Live 3D centerpiece */}
      <div
        data-hero-parallax="scene"
        className="absolute inset-x-0 top-16 h-[46svh] sm:top-20 sm:h-[52svh] md:h-[54svh]"
      >
        <HeroSceneMount className="h-full w-full" />
      </div>

      {/* Copy */}
      <div
        data-hero-parallax="content"
        className="pointer-events-none relative z-10 mx-auto mt-auto flex w-full max-w-5xl flex-col items-center px-6 pb-10 pt-[44svh] text-center sm:pt-[48svh] md:pt-[50svh]"
      >
        <p
          data-hero-intro="kicker"
          className="mb-5 font-mono text-[11px] uppercase tracking-[0.4em] text-primary/85 sm:text-sm"
        >
          {hero.kicker}
        </p>

        <h1
          id="hero-title"
          data-hero-intro="title"
          className="text-balance font-display text-[2.1rem] font-black uppercase leading-[0.98] tracking-tight min-[400px]:text-[2.5rem] sm:text-5xl md:text-6xl lg:text-7xl"
          style={{ textShadow: "0 0 28px hsl(166 68% 69% / 0.18)" }}
        >
          <span className="sr-only">{hero.titleLines.join(" ")}</span>
          <span aria-hidden className="block">
            {titleWords.map((words, li) => (
              <span key={li} className="block">
                {words.map((w, wi) => (
                  <span key={wi} className="mr-[0.26em] inline-block overflow-hidden pb-[0.06em] align-bottom last:mr-0">
                    <span data-hero-word className="text-gradient inline-block">
                      {w}
                    </span>
                  </span>
                ))}
              </span>
            ))}
          </span>
        </h1>

        <p
          data-hero-intro="headline"
          className="mt-6 max-w-2xl font-mono text-[11px] uppercase tracking-[0.2em] text-secondary/90 sm:text-sm"
        >
          {headline}
        </p>

        <p
          data-hero-intro="desc"
          className="mt-5 max-w-2xl text-pretty text-base font-light leading-relaxed text-foreground/75 sm:text-lg"
        >
          {hero.description}
        </p>

        <div className="pointer-events-auto mt-9 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <div data-hero-intro="cta">
            <MagneticButton href={hero.primaryCta.href} variant="primary">
              <Gamepad2 className="h-4 w-4" aria-hidden />
              {hero.primaryCta.label}
            </MagneticButton>
          </div>
          <div data-hero-intro="cta">
            <MagneticButton href={hero.secondaryCta.href} variant="ghost">
              {hero.secondaryCta.label}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </MagneticButton>
          </div>
        </div>

        <ul className="mt-9 flex flex-wrap justify-center gap-2.5" aria-label="Core technologies">
          {hero.highlights.map((h) => (
            <li
              key={h}
              data-hero-intro="chip"
              className="rounded-full border border-secondary/30 bg-primary/[0.08] px-4 py-2 text-[10px] font-semibold tracking-[0.26em] text-accent backdrop-blur-sm sm:text-[11px]"
            >
              {h}
            </li>
          ))}
        </ul>

        <div
          data-hero-intro="divider"
          aria-hidden
          className="mt-10 h-px w-36 bg-[linear-gradient(90deg,transparent,hsl(166_68%_69%/0.5),hsl(320_100%_66%/0.6),transparent)] md:w-48"
        />

        <a
          href="#about"
          data-hero-intro="scroll"
          className="pointer-events-auto mt-8 flex flex-col items-center gap-3 text-muted-foreground transition-colors hover:text-primary"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.35em]">Scroll to explore</span>
          <span aria-hidden className="h-10 w-1.5 origin-top animate-pulse-bar rounded-full bg-gradient-to-b from-secondary/70 to-transparent" />
          <ArrowDown className="sr-only" aria-hidden />
        </a>
      </div>

      <p className="pointer-events-none absolute right-6 top-28 hidden font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60 lg:block">
        Live WebGL · move your cursor · tap the crystal
      </p>
    </section>
  );
}
