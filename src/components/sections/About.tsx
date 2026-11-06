"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Boxes, CircleUserRound, Cpu, Crosshair, Layers, Repeat, Users, Wrench } from "lucide-react";
import { profile, toolkit } from "@/data/profile";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CornerBrackets } from "@/components/ui/CornerBrackets";
import { cn } from "@/lib/utils";

const PRINCIPLE_ICONS = [Crosshair, Wrench, Boxes, Layers, Repeat, Users];
const TABS = [
  { id: "profile", label: "Profile", Icon: CircleUserRound },
  { id: "toolkit", label: "Toolkit", Icon: Cpu },
] as const;
type TabId = (typeof TABS)[number]["id"];

export function About() {
  const { about } = profile;
  const [tab, setTab] = useState<TabId>("profile");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (i + (e.key === "ArrowRight" ? 1 : -1) + TABS.length) % TABS.length;
    setTab(TABS[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="about" aria-labelledby="about-title" className="relative overflow-hidden">
      <div className="paper-grid relative text-paper-ink">
        {/* reference paper ornaments */}
        <div aria-hidden className="paper-hatch absolute inset-0 opacity-[0.08]" />
        <CornerBrackets size="h-20 w-20 md:h-32 md:w-32" inset="8" className="border-gray-300/70" />
        <div aria-hidden className="absolute -left-24 top-1/3 h-72 w-72 animate-[drift_20s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,rgba(150,150,150,0.08),transparent_70%)]" />
        <div aria-hidden className="absolute -right-16 bottom-10 h-80 w-80 animate-[drift_26s_ease-in-out_infinite_reverse] rounded-full bg-[radial-gradient(circle,rgba(121,232,208,0.12),transparent_70%)]" />
        {/* book-spine shading on the left edge (reference) */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-stone-300/50 via-stone-200/30 to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl px-5 py-24 sm:px-8 md:py-32">
          <SectionHeading
            id="about-title"
            tone="light"
            label={about.label}
            ghost={about.ghost}
            title={about.title}
            icon={<Gamepad />}
          />

          {/* Pill toggle (reference) */}
          <div
            role="tablist"
            aria-label="About sections"
            data-reveal="up"
            className="mx-auto mb-12 flex max-w-md items-center justify-center rounded-full border border-gray-200 bg-gray-100 p-1.5"
          >
            {TABS.map(({ id, label, Icon }, i) => {
              const selected = tab === id;
              return (
                <button
                  key={id}
                  ref={(n) => {
                    tabRefs.current[i] = n;
                  }}
                  role="tab"
                  id={`tab-${id}`}
                  aria-selected={selected}
                  aria-controls={`panel-${id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setTab(id)}
                  onKeyDown={(e) => onKey(e, i)}
                  className={cn(
                    "relative flex flex-1 items-center justify-center gap-2.5 rounded-full px-6 py-3 text-sm font-medium transition-colors",
                    selected ? "text-white" : "text-gray-600 hover:text-gray-900",
                  )}
                >
                  {selected ? (
                    <motion.span
                      layoutId="about-tab-pill"
                      className="absolute inset-0 rounded-full bg-gray-900 shadow-lg"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  ) : null}
                  <Icon className="relative z-10 h-4 w-4" aria-hidden />
                  <span className="relative z-10">{label}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {tab === "profile" ? (
              <motion.div
                key="profile"
                role="tabpanel"
                id="panel-profile"
                aria-labelledby="tab-profile"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="grid items-center gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20"
              >
                <Portrait src={about.portrait} />
                <div>
                  <p className="font-serif text-2xl italic leading-snug text-stone-700 md:text-[1.7rem]">
                    “{profile.positioning}”
                  </p>
                  <p className="mt-6 leading-8 text-stone-600">
                    {about.description}
                  </p>
                  <ul className="mt-10 grid gap-4 sm:grid-cols-2">
                    {about.principles.map((p, i) => {
                      const Icon = PRINCIPLE_ICONS[i % PRINCIPLE_ICONS.length];
                      return (
                        <li
                          key={p.title}
                          className="group relative rounded-2xl border border-stone-200 bg-white/80 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-stone-300 hover:shadow-md"
                        >
                          <span className="absolute left-5 right-5 top-0 h-0.5 origin-left scale-x-0 rounded-b-full bg-gradient-to-r from-teal-400 via-cyan-400 to-indigo-400 transition-transform duration-500 group-hover:scale-x-100" />
                          <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-stone-700 transition-colors group-hover:bg-stone-900 group-hover:text-white">
                              <Icon className="h-4 w-4" aria-hidden />
                            </span>
                            <h3 className="font-display text-[13px] font-semibold uppercase tracking-wide text-stone-900">
                              {p.title}
                            </h3>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-stone-600">{p.body}</p>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="toolkit"
                role="tabpanel"
                id="panel-toolkit"
                aria-labelledby="tab-toolkit"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2"
              >
                {toolkit.map((group, gi) => (
                  <motion.div
                    key={group.group}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: gi * 0.06, duration: 0.45 }}
                    className={cn(
                      "relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-7 shadow-sm",
                      gi === toolkit.length - 1 && "md:col-span-2",
                    )}
                  >
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-stone-900">
                        {group.group}
                      </h3>
                      <span className="font-mono text-xs text-stone-400">{String(gi + 1).padStart(2, "0")}</span>
                    </div>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="rounded-md border border-stone-200 bg-stone-50 px-3 py-1.5 text-sm text-stone-700 transition-colors hover:border-stone-900 hover:bg-stone-900 hover:text-white"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
                <p className="text-center text-xs uppercase tracking-[0.2em] text-stone-400 md:col-span-2">
                  Capabilities — see project pages for how each is applied
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Gamepad() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7.5 7h9a5.5 5.5 0 0 1 5.38 6.63l-.86 4.05A2.9 2.9 0 0 1 16 18.9L13.9 16H10.1L8 18.9a2.9 2.9 0 0 1-5.02-1.22l-.86-4.05A5.5 5.5 0 0 1 7.5 7Zm-.75 3v1.25H5.5v1.5h1.25V14h1.5v-1.25H9.5v-1.5H8.25V10h-1.5Zm9.5.25a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm2 1.75a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" />
    </svg>
  );
}

/** Portrait frame — real photo when configured, otherwise a designed placeholder (no invented likeness). */
function Portrait({ src }: { src: string | null }) {
  const labels = [
    { t: "Unity · C#", cls: "-left-3 top-10 md:-left-8" },
    { t: "Unreal · C++", cls: "-right-3 top-1/3 md:-right-10" },
    { t: "Three.js · GLSL", cls: "-left-2 bottom-16 md:-left-10" },
    { t: "PC · Mobile · Web", cls: "-right-2 bottom-6 md:-right-6" },
  ];
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-stone-300 bg-stone-900 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.35)]">
        {src ? (
          <Image src={src} alt={`Portrait of ${profile.name}`} fill sizes="(min-width:1024px) 384px, 80vw" className="object-cover object-[50%_20%]" priority={false} />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div aria-hidden className="absolute inset-0 space-grid opacity-70" />
            <div aria-hidden className="absolute inset-x-0 top-0 h-1/3 animate-[scan_6s_linear_infinite] bg-gradient-to-b from-transparent via-primary/10 to-transparent" />
            <svg aria-hidden viewBox="0 0 200 200" className="absolute h-[78%] w-[78%] animate-spin-slow text-primary/40">
              <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeDasharray="4 10" />
              <circle cx="100" cy="100" r="74" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeDasharray="60 20" />
            </svg>
            <span className="relative font-display text-7xl font-black tracking-wider text-gradient">{profile.monogram}</span>
            <span className="relative mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">{profile.name}</span>
          </div>
        )}
        <CornerBrackets size="h-5 w-5" inset="4" className="border-primary/80" />
      </div>
      {labels.map((l, i) => (
        <span
          key={l.t}
          className={cn(
            "absolute z-10 rounded-full border border-stone-300 bg-white/95 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-stone-700 shadow-md",
            "animate-float",
            l.cls,
          )}
          style={{ animationDelay: `${i * 0.8}s` }}
        >
          {l.t}
        </span>
      ))}
    </div>
  );
}
