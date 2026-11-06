import { ArrowUpRight, Info } from "lucide-react";
import { projects } from "@/data/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { CornerBrackets } from "@/components/ui/CornerBrackets";
import { cn } from "@/lib/utils";

/**
 * Asymmetric editorial grid built from the reference card design:
 *   row 1: [ 01 feature ×2 ][ 02 ]
 *   row 2: [ 03 ][ 04 feature ×2 ]
 *   row 3: [ 05 feature ×2 ][ 06 ]
 *   row 4: [ 07 ][ 08 ][ CTA tile ]
 * Extra projects beyond 8 fall back to single cards.
 */
const FEATURE = [true, false, false, true, true, false, false, false];

export function Projects() {
  const anyDraft = projects.some((p) => !p.verified);
  return (
    <section id="projects" aria-labelledby="projects-title" className="relative py-24 md:py-32">
      <div aria-hidden className="absolute inset-0 space-grid opacity-30" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          id="projects-title"
          label="02 / Selected Work"
          ghost="PROJECTS"
          title="Projects that bring ideas to life."
          description="Released games across Unity, Unreal Engine, Three.js, and mobile — co-op multiplayer, RTS, physics-driven driving, browser 3D, and strategy — each documented with its concept, stack, and gameplay systems."
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          }
        />

        {anyDraft ? (
          <p
            data-reveal="fade"
            className="mx-auto -mt-6 mb-12 flex max-w-2xl items-start justify-center gap-2 text-center text-xs leading-6 text-muted-foreground md:-mt-10"
          >
            <Info className="mt-1 h-3.5 w-3.5 shrink-0 text-amber-300/80" aria-hidden />
            <span>
              Project status is shown transparently on every card. Visuals marked “Concept visual” are original
              illustrations for projects whose captures are still being added.
            </span>
          </p>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <div
              key={p.slug}
              data-reveal="up"
              data-reveal-delay={(i % 3) * 0.06}
              className={cn("h-full", FEATURE[i] && "md:col-span-2")}
            >
              <ProjectCard project={p} feature={FEATURE[i]} priority={i === 0} />
            </div>
          ))}

          {/* CTA tile */}
          <div data-reveal="up">
            <a
              href="#contact"
              className="group relative flex h-full min-h-72 flex-col justify-between overflow-hidden rounded-[28px] border border-dashed border-secondary/40 bg-secondary/[0.04] p-8 transition-colors duration-500 hover:border-secondary hover:bg-secondary/[0.08]"
            >
              <CornerBrackets size="h-4 w-4" inset="4" className="border-secondary/70" />
              <div aria-hidden className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-secondary/20 blur-3xl transition-transform duration-700 group-hover:scale-125" />
              <p className="relative font-mono text-[11px] uppercase tracking-[0.3em] text-secondary">Project {String(projects.length + 1).padStart(2, "0")}</p>
              <div className="relative">
                <h3 className="font-display text-2xl font-bold uppercase leading-tight tracking-wide text-foreground">
                  Your game,
                  <br />
                  next.
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Have a concept or a prototype that needs an engineer? Let&apos;s scope it together.
                </p>
              </div>
              <span className="relative inline-flex items-center gap-2 font-display text-xs uppercase tracking-[0.2em] text-secondary">
                Start a conversation
                <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
