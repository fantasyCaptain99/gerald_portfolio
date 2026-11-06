"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { ProjectMedia } from "./ProjectMedia";
import { cn } from "@/lib/utils";
import { useFinePointer, useReducedMotion } from "@/hooks/useMediaQuery";

/**
 * Reference-style project card: rounded 28px panel on #0a1020, gridded media
 * area with category pill + arrow disc, spring-based tilt toward the pointer,
 * a soft light that follows the cursor, and image zoom on hover.
 */
export function ProjectCard({
  project,
  feature = false,
  priority = false,
}: {
  project: Project;
  feature?: boolean;
  priority?: boolean;
}) {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const interactive = fine && !reduced;
  const [hover, setHover] = useState(false);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 380, damping: 30 };
  const rotateX = useSpring(useTransform(py, [0, 1], [4, -4]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-5, 5]), spring);
  const lx = useTransform(px, (v) => `${v * 100}%`);
  const ly = useTransform(py, (v) => `${v * 100}%`);
  const light = useMotionTemplate`radial-gradient(420px circle at ${lx} ${ly}, ${project.tint}26, transparent 60%)`;

  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (!interactive) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    setHover(false);
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative block h-full rounded-[28px] [perspective:1200px] focus-visible:outline-offset-4"
      onPointerEnter={() => setHover(true)}
      onPointerLeave={reset}
      onPointerMove={onMove}
      onFocus={() => setHover(true)}
      onBlur={reset}
      aria-label={`${project.title} — view case study`}
    >
      <motion.article
        style={interactive ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
        className="relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-surface shadow-[0_24px_60px_rgba(0,0,0,0.28)] transition-[border-color,box-shadow] duration-500 group-hover:border-white/20 group-hover:shadow-[0_30px_80px_-10px_rgba(0,0,0,0.6)]"
      >
        {/* cursor light */}
        {interactive ? (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: light }}
          />
        ) : null}

        <div
          className={cn(
            "relative w-full overflow-hidden",
            feature ? "h-64 sm:h-80 lg:h-[24rem]" : "h-56",
          )}
        >
          <div className="absolute inset-0 transition-transform duration-[1200ms] ease-[var(--ease-cinematic)] group-hover:scale-[1.06]">
            <ProjectMedia
              project={project}
              playing={hover}
              priority={priority}
              sizes={feature ? "(min-width:1024px) 66vw, 100vw" : "(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"}
            />
          </div>
          {/* grid overlay (reference) */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.14) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface/50" />

          <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-white/90 backdrop-blur-sm transition-[letter-spacing,border-color] duration-500 group-hover:border-white/40 group-hover:tracking-[0.3em]">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: project.tint }} />
            {project.category}
          </span>
          <span className="absolute right-4 top-4 font-display text-xs tracking-widest text-white/60">
            {project.number}
          </span>
          {!project.cover ? (
            <span className="absolute bottom-4 left-4 rounded-md bg-black/40 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white/60 backdrop-blur-sm">
              Concept visual
            </span>
          ) : null}
          <span className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/30 backdrop-blur-sm transition-all duration-500 group-hover:border-transparent group-hover:bg-primary group-hover:text-background">
            <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" aria-hidden />
          </span>
        </div>

        <div className="relative flex flex-1 flex-col px-6 pb-6 pt-5">
          <div className="flex items-start justify-between gap-4">
            <h3
              className={cn(
                "font-display font-semibold tracking-tight text-white",
                feature ? "text-2xl md:text-3xl" : "text-xl md:text-2xl",
              )}
            >
              {project.title}
            </h3>
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-400">{project.summary}</p>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div>
              <dt className="font-mono uppercase tracking-[0.18em] text-muted-foreground/70">Engine</dt>
              <dd className="mt-1 text-slate-200">{project.engine}</dd>
            </div>
            <div>
              <dt className="font-mono uppercase tracking-[0.18em] text-muted-foreground/70">Platform</dt>
              <dd className="mt-1 text-slate-200">{project.platforms.join(" · ")}</dd>
            </div>
          </dl>
          <div className="mt-5 flex flex-wrap gap-2">
            {project.highlights.slice(0, feature ? 5 : 3).map((t) => (
              <span key={t} className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-200">
                {t}
              </span>
            ))}
          </div>
          <div className="mt-auto flex items-center justify-between gap-3 pt-6">
            <span
              className={cn(
                "inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em]",
                project.status === "Released" ? "text-emerald-300/90" : "text-amber-200/80",
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  project.status === "Released" ? "bg-emerald-400" : "animate-pulse bg-amber-300/80",
                )}
              />
              {project.status}
            </span>
            <span className="font-display text-[11px] uppercase tracking-[0.2em] text-primary opacity-80 transition-opacity group-hover:opacity-100">
              View project
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
