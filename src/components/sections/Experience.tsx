import { experience } from "@/data/experience";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollLine } from "@/components/ui/ScrollLine";

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="relative overflow-hidden py-24 md:py-32">
      <div aria-hidden className="absolute inset-0 space-grid opacity-25" />
      <div aria-hidden className="absolute -right-40 top-1/4 h-96 w-96 rounded-full bg-accent/[0.07] blur-[100px]" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          id="experience-title"
          label="03 / Experience"
          ghost="PRACTICE"
          title="Built through practice. Refined through experience."
          description="The practice areas behind the work — what each involves and the capabilities it brings to a project."
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M10 3h4a2 2 0 0 1 2 2v1h3a2 2 0 0 1 2 2v3H3V8a2 2 0 0 1 2-2h3V5a2 2 0 0 1 2-2Zm0 3h4V5h-4v1Zm-7 7h7v1.5h4V13h7v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6Z" />
            </svg>
          }
        />

        <div className="relative">
          <ScrollLine className="absolute bottom-4 left-[15px] top-4 md:left-[calc(12rem+15px)]" />
          <ol className="space-y-10 md:space-y-14">
            {experience.map((e, i) => (
              <li key={e.track} className="relative grid gap-4 pl-12 md:grid-cols-[12rem_1fr] md:gap-0 md:pl-0">
                {/* left meta (desktop) */}
                <div data-reveal="fade" className="hidden pr-10 pt-1 text-right md:block">
                  <p className="font-display text-3xl font-bold text-white/15">{String(i + 1).padStart(2, "0")}</p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    {e.period ?? "Practice area"}
                  </p>
                </div>

                {/* node */}
                <span
                  aria-hidden
                  className="absolute left-[8px] top-2 flex h-4 w-4 items-center justify-center rounded-full border border-primary/60 bg-background md:left-[calc(12rem+8px)]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--color-primary)]" />
                </span>

                <article
                  data-reveal="left"
                  className="group relative rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur-sm transition-colors duration-500 hover:border-primary/40 md:ml-12 md:p-8"
                >
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <h3 className="font-display text-base font-bold uppercase tracking-wider text-foreground md:text-lg">
                      {e.track}
                    </h3>
                    {!e.verified ? (
                      <span className="rounded-full border border-amber-300/25 bg-amber-300/[0.06] px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-amber-200/80">
                        Details pending confirmation
                      </span>
                    ) : null}
                  </div>
                  {e.organization || e.role ? (
                    <p className="mt-2 text-sm text-primary">
                      {[e.role, e.organization].filter(Boolean).join(" · ")}
                    </p>
                  ) : null}
                  <p className="mt-3 leading-7 text-muted-foreground">{e.summary}</p>
                  {e.contributions.length ? (
                    <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-foreground/80 marker:text-primary">
                      {e.contributions.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  ) : null}
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {e.capabilities.map((c) => (
                      <li
                        key={c}
                        className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-200 transition-colors group-hover:border-primary/25"
                      >
                        {c}
                      </li>
                    ))}
                  </ul>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
