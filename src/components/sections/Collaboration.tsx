import { ArrowUpRight, BadgeCheck, FileText, Gamepad2, Gauge, Layers, ListChecks, Map as MapIcon, PiggyBank, Presentation, Workflow } from "lucide-react";
import { partnerResources, trustPillars } from "@/data/site";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { CornerBrackets } from "@/components/ui/CornerBrackets";
import { RevealWords } from "@/components/ui/RevealWords";

const PILLAR_ICONS = [FileText, Gamepad2, Layers, BadgeCheck, Workflow, Gauge];
const RESOURCE_ICONS = [Presentation, MapIcon, PiggyBank, ListChecks];

export function Collaboration() {
  return (
    <section id="collaborate" aria-labelledby="collab-title" className="relative overflow-hidden py-24 md:py-32">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div
          data-reveal="scale"
          className="relative overflow-hidden rounded-[32px] border border-white/10 bg-card/70 px-6 py-16 text-center sm:px-12 md:py-24"
        >
          {/* atmosphere */}
          <div aria-hidden className="absolute inset-0 space-grid opacity-50" />
          <div aria-hidden className="absolute -left-24 -top-24 h-80 w-80 animate-[drift_16s_ease-in-out_infinite] rounded-full bg-primary/20 blur-[90px]" />
          <div aria-hidden className="absolute -bottom-24 -right-24 h-96 w-96 animate-[drift_20s_ease-in-out_infinite_reverse] rounded-full bg-secondary/20 blur-[100px]" />
          <CornerBrackets size="h-6 w-6" inset="6" className="border-primary/70" />

          <p className="relative font-mono text-[11px] uppercase tracking-[0.4em] text-primary/85">
            For studios · publishers · founders · investors
          </p>
          <h2
            id="collab-title"
            className="relative mx-auto mt-6 max-w-4xl text-balance font-display text-3xl font-black uppercase leading-[1.05] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
          >
            <RevealWords text="Let's create the next interactive experience." wordClassName="text-gradient" />
          </h2>
          <p data-reveal="up" className="relative mx-auto mt-7 max-w-2xl text-pretty leading-relaxed text-foreground/75 md:text-lg">
            Have a game concept, a prototype to refine, or an ambitious interactive project? I collaborate with teams
            and partners to turn promising ideas into well-engineered game experiences.
          </p>
          <div data-reveal="up" className="relative mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <MagneticButton href="#contact" variant="primary">
              Discuss a Game Project
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </MagneticButton>
            <MagneticButton href="#projects" variant="ghost">
              Explore My Work
            </MagneticButton>
          </div>
        </div>

        {/* Credibility pillars */}
        <div className="mt-16 md:mt-20">
          <h3 data-reveal="fade" className="text-center font-mono text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
            How you can evaluate the work
          </h3>
          <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {trustPillars.map((p, i) => {
              const Icon = PILLAR_ICONS[i];
              return (
                <li key={p.title} data-reveal="fade" className="group relative bg-background p-7 transition-colors duration-500 hover:bg-card">
                  <Icon className="h-5 w-5 text-primary transition-transform duration-500 group-hover:-translate-y-0.5" aria-hidden />
                  <h4 className="mt-4 font-display text-sm font-semibold uppercase tracking-wider">{p.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{p.body}</p>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Partner resources */}
        <div className="mt-16 md:mt-20">
          <div className="flex flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left">
            <h3 data-reveal="fade" className="font-display text-lg font-bold uppercase tracking-wider">
              Partner resources
            </h3>
            <p data-reveal="fade" className="max-w-md text-sm text-muted-foreground">
              Project-specific materials are prepared for serious conversations. Request what you need below.
            </p>
          </div>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {partnerResources.map((r, i) => {
              const Icon = RESOURCE_ICONS[i];
              return (
                <li key={r.title} data-reveal="up" data-reveal-delay={i * 0.05}>
                  <a
                    href="#contact"
                    data-project-type="Investment / Partnership"
                    className="group relative flex h-full flex-col rounded-2xl border border-dashed border-white/15 p-6 transition-colors duration-500 hover:border-secondary/60 hover:bg-secondary/[0.04]"
                  >
                    <Icon className="h-5 w-5 text-secondary" aria-hidden />
                    <h4 className="mt-4 font-display text-sm font-semibold uppercase tracking-wider">{r.title}</h4>
                    <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{r.body}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-secondary">
                      Request
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
