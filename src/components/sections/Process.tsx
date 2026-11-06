"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Compass, FlaskConical, Hammer, Rocket, Sparkles } from "lucide-react";
import { processSteps } from "@/data/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CornerBrackets } from "@/components/ui/CornerBrackets";

gsap.registerPlugin(ScrollTrigger);

const ICONS = [Compass, FlaskConical, Hammer, Sparkles, Rocket];
const STRIPS = [
  "from-sky-500 via-cyan-400 to-teal-400",
  "from-teal-500 via-emerald-400 to-cyan-400",
  "from-indigo-500 via-sky-400 to-cyan-400",
  "from-fuchsia-500 via-pink-400 to-rose-400",
  "from-amber-500 via-orange-400 to-rose-400",
];

/**
 * Light "paper" section (reference Ideas section). On desktop the five stages
 * become a pinned horizontal journey scrubbed by scroll; on mobile/tablet and
 * under reduced motion they stack vertically with a connecting rail.
 */
export function Process() {
  const section = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const tr = track.current;
      const vp = viewport.current;
      const pinEl = section.current?.querySelector<HTMLElement>("[data-pin]");
      if (!tr || !vp || !pinEl) return;
      const distance = () => Math.max(0, tr.scrollWidth - vp.clientWidth);
      const tween = gsap.to(tr, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: pinEl,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: pinEl,
          scrub: 0.8,
          invalidateOnRefresh: true,
          refreshPriority: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });
      // Cards gently rise as they travel into view
      gsap.utils.toArray<HTMLElement>("[data-step]", tr).forEach((card) => {
        const article = card.querySelector("article");
        if (!article) return;
        gsap.fromTo(
          article,
          { y: 40, opacity: 0.35 },
          {
            y: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: "left 95%",
              end: "left 60%",
              scrub: true,
            },
          },
        );
      });
      // Triggers created earlier (scroll reveals) that sit below this pin must be
      // re-measured with the pin spacer in place.
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
      return () => tween.scrollTrigger?.kill();
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={section} id="process" aria-labelledby="process-title" className="relative overflow-hidden">
      <div className="paper-grid relative text-paper-ink">
        <div aria-hidden className="paper-hatch absolute inset-0 opacity-[0.06]" />
        <CornerBrackets size="h-16 w-16 md:h-24 md:w-24" inset="8" className="border-gray-300/70" />
        <div aria-hidden className="absolute right-1/4 top-20 h-40 w-40 rounded-full border border-gray-300/40" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-stone-300/50 via-stone-200/30 to-transparent" />

        <div data-pin className="relative z-10 py-24 md:py-28 lg:flex lg:min-h-screen lg:flex-col lg:justify-center lg:py-10">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
            <SectionHeading
              id="process-title"
              tone="light"
              label="Development Process"
              ghost="PROCESS"
              title="From first prototype to playable experience."
              description="Game development is a production discipline. Every project moves through five stages, each with a clear output you can review."
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 5v4.6l3.7 2.2-.8 1.3L11 12.4V7h2Z" />
                </svg>
              }
              className="mb-10 md:mb-14 lg:mb-8 [&_h2]:lg:text-4xl"
            />
          </div>

          <div ref={viewport} className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:overflow-visible">
            {/* desktop connecting line */}
            <div aria-hidden className="absolute left-8 right-8 top-[2.05rem] hidden h-px bg-stone-300 lg:block" />
            {/* mobile rail */}
            <div aria-hidden className="absolute bottom-6 left-[2.3rem] top-6 w-px bg-stone-300 sm:left-[2.55rem] lg:hidden" />

            <ol ref={track} className="relative flex flex-col gap-6 lg:w-max lg:flex-row lg:gap-7 lg:pr-[20vw]">
              {processSteps.map((s, i) => {
                const Icon = ICONS[i];
                return (
                  <li key={s.n} data-step className="relative pl-14 sm:pl-16 lg:w-[min(30rem,34vw)] lg:pl-0">
                    <div data-reveal="up" className="h-full">
                      {/* node */}
                      <span
                        aria-hidden
                        className="absolute left-4 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 bg-white font-display text-xs font-semibold text-stone-700 shadow-sm sm:left-5 lg:static lg:mb-4"
                      >
                        {s.n}
                      </span>
                      <article className="group relative h-full overflow-hidden rounded-2xl border border-stone-200 bg-white p-7 shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-stone-400 hover:shadow-lg md:p-8 lg:p-7">
                        <span className={`absolute left-8 right-8 top-0 h-1 rounded-b-full bg-gradient-to-r ${STRIPS[i]}`} />
                        <div className="flex items-center justify-between gap-3">
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-700 transition-colors group-hover:bg-stone-900 group-hover:text-white">
                            <Icon className="h-4 w-4" aria-hidden />
                          </span>
                          <span className="rounded-md bg-stone-100 px-3 py-1.5 font-display text-[10px] font-medium uppercase tracking-[0.18em] text-stone-600">
                            Stage {s.n}
                          </span>
                        </div>
                        <h3 className="mt-5 font-display text-xl font-semibold uppercase tracking-wide text-stone-900">
                          {s.title}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-stone-600">{s.body}</p>
                        <p className="mt-5 border-t border-dashed border-stone-200 pt-4 text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                          Output · <span className="text-stone-600">{s.output}</span>
                        </p>
                      </article>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* progress */}
          <div className="mx-auto mt-8 hidden w-full max-w-7xl items-center gap-4 px-8 lg:flex" aria-hidden>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone-400">Discover</span>
            <div className="h-px flex-1 bg-stone-200">
              <div ref={bar} className="h-full origin-left scale-x-0 bg-stone-800" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone-400">Deliver</span>
          </div>
        </div>
      </div>
    </section>
  );
}
