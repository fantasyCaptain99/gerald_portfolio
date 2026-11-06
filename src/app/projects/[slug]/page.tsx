import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, CircleDashed, Cpu, Gamepad2, ImageIcon, Monitor, Target } from "lucide-react";
import { getNextProject, getProject, projects, type Project } from "@/data/projects";
import { profile } from "@/data/profile";
import { ProjectMedia } from "@/components/ui/ProjectMedia";
import { ProjectArt } from "@/components/ui/ProjectArt";
import { CornerBrackets } from "@/components/ui/CornerBrackets";
import { RevealWords } from "@/components/ui/RevealWords";
import { hasCanonicalDomain } from "@/lib/site-url";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  const title = `${p.title} — ${p.engine} Case Study`;
  return {
    title,
    description: p.summary,
    alternates: hasCanonicalDomain ? { canonical: `/projects/${p.slug}` } : undefined,
    openGraph: { title: `${title} | ${profile.name}`, description: p.summary, url: `/projects/${p.slug}`, type: "article" },
    twitter: { card: "summary_large_image", title: `${title} | ${profile.name}`, description: p.summary },
  };
}

function tocFor(p: Project) {
  return [
    ["overview", "Overview"],
    ["concept", p.objectives.length ? "Concept & objectives" : "Game concept"],
    ["role", "Role"],
    ["stack", "Technical stack"],
    ["mechanics", "Core mechanics"],
    ...(p.challenges.length ? [["challenges", "Challenges & solutions"]] : []),
    ["media", "Screenshots & footage"],
    ["status", "Development status"],
  ] as [string, string][];
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const next = getNextProject(slug);
  const released = project.status === "Released";
  const toc = tocFor(project);

  return (
    <article style={{ ["--tint" as string]: project.tint }} className="relative">
      {/* ---------------- HERO ---------------- */}
      <header className="relative overflow-hidden pb-16 pt-32 md:pt-40">
        <div aria-hidden className="absolute inset-0 space-grid opacity-50" />
        <div
          aria-hidden
          className="absolute left-1/2 top-0 h-[34rem] w-[60rem] -translate-x-1/2 rounded-full opacity-25 blur-[120px]"
          style={{ background: project.tint }}
        />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <Link
            href="/#projects"
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden />
            All projects
          </Link>

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
            <div>
              <p data-reveal="fade" className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: project.tint }}>
                <span>Project {project.number}</span>
                <span className="h-px w-8 bg-current opacity-50" aria-hidden />
                <span className="text-muted-foreground">{project.category}</span>
              </p>
              <h1 className="mt-6 text-balance font-display text-4xl font-black uppercase leading-[1.02] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                <RevealWords text={project.title} />
              </h1>
              <p data-reveal="up" className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/75">
                {project.summary}
              </p>
            </div>

            <dl data-reveal="up" className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 text-sm lg:grid-cols-1">
              {[
                { k: "Engine", v: project.engine, Icon: Cpu },
                { k: "Platform", v: project.platforms.join(" · "), Icon: Monitor },
                { k: "Genre / Focus", v: project.tags.join(" · "), Icon: Gamepad2 },
                { k: "Status", v: project.status, Icon: CircleDashed },
              ].map(({ k, v, Icon }) => (
                <div key={k} className="bg-background/90 px-5 py-4">
                  <dt className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    <Icon className="h-3.5 w-3.5" aria-hidden /> {k}
                  </dt>
                  <dd
                    className={
                      k === "Status"
                        ? released
                          ? "mt-1 text-emerald-300"
                          : "mt-1 text-amber-200/90"
                        : v === "To be confirmed"
                          ? "mt-1 text-muted-foreground"
                          : "mt-1 text-foreground"
                    }
                  >
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div data-reveal="scale" className="relative mt-14 aspect-[16/9] overflow-hidden rounded-[28px] border border-white/10 bg-surface shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)] sm:aspect-[21/9]">
            <ProjectMedia project={project} priority sizes="(min-width:1280px) 1216px, 100vw" />
            <CornerBrackets size="h-5 w-5" inset="4" className="border-[var(--tint)]" />
            {!project.cover ? (
              <span className="absolute bottom-4 left-4 rounded-md bg-black/50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 backdrop-blur-sm">
                Concept visual — gameplay capture pending
              </span>
            ) : null}
          </div>

          {project.links?.length ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {project.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-primary/50 px-5 py-2.5 font-display text-xs uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary hover:text-background"
                >
                  {l.label} <ArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </header>

      {/* ---------------- BODY ---------------- */}
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-24 sm:px-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
        <nav aria-label="Case study sections" className="hidden lg:block">
          <ol className="sticky top-28 space-y-1 border-l border-white/10">
            {toc.map(([id, label], i) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="-ml-px flex items-baseline gap-3 border-l border-transparent py-1.5 pl-4 text-sm text-muted-foreground transition-colors hover:border-[var(--tint)] hover:text-foreground"
                >
                  <span className="font-mono text-[10px] text-muted-foreground/60">{String(i + 1).padStart(2, "0")}</span>
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="min-w-0 space-y-20 md:space-y-24">
          {!project.verified ? (
            <aside className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.04] p-5 text-sm leading-6 text-amber-100/80">
              <strong className="font-semibold text-amber-200">Transparency note:</strong> this case study describes the
              project type and the technical approach. Specific results, role details, and gameplay captures will be
              added once confirmed.
            </aside>
          ) : null}

          <Block id="overview" n="01" title="Overview">
            <p className="text-lg leading-8 text-foreground/80">{project.summary}</p>
          </Block>

          <Block id="concept" n="02" title={project.objectives.length ? "Game concept & objectives" : "Game concept"}>
            <p className="leading-8 text-muted-foreground">{project.concept}</p>
            {project.objectives.length ? (
            <ul className="mt-8 grid gap-4 md:grid-cols-3">
              {project.objectives.map((o, i) => (
                <li key={o} data-reveal="up" className="relative rounded-2xl border border-white/10 bg-card/60 p-6">
                  <Target className="h-5 w-5" style={{ color: project.tint }} aria-hidden />
                  <p className="mt-4 text-sm leading-6 text-foreground/85">{o}</p>
                  <span className="absolute right-5 top-5 font-mono text-[10px] text-muted-foreground/60">0{i + 1}</span>
                </li>
              ))}
            </ul>
            ) : null}
          </Block>

          <Block id="role" n="03" title="My role & responsibilities">
            {project.role?.length ? (
              <ul className="space-y-3">
                {project.role.map((r) => (
                  <li key={r} className="flex gap-3 leading-7 text-foreground/85">
                    <span aria-hidden className="mt-3 h-px w-4 shrink-0" style={{ background: project.tint }} />
                    {r}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="flex items-start gap-3 rounded-xl border border-dashed border-white/15 p-5 text-sm leading-6 text-muted-foreground">
                <CircleDashed className="mt-0.5 h-4 w-4 shrink-0 text-amber-300/80" aria-hidden />
                Role and responsibilities pending confirmation.
              </p>
            )}
          </Block>

          <Block id="stack" n="04" title="Engine & technical stack">
            <ul className="flex flex-wrap gap-3">
              {project.stack.map((s) => (
                <li
                  key={s}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 font-mono text-xs uppercase tracking-[0.12em] text-foreground/85 transition-colors hover:border-[var(--tint)]"
                >
                  {s}
                </li>
              ))}
            </ul>
          </Block>

          <Block id="mechanics" n="05" title="Core gameplay mechanics">
            <ol className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
              {project.mechanics.map((m, i) => (
                <li key={m} className="flex items-center gap-4 bg-background p-5 sm:last:odd:col-span-2">
                  <span className="font-display text-xl font-bold text-white/20">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-foreground/85">{m}</span>
                </li>
              ))}
            </ol>
          </Block>

          {project.challenges.length ? (
          <Block id="challenges" n="06" title="Technical challenges & solutions">
            {!project.verified ? (
              <p className="-mt-2 mb-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Technical focus areas &amp; intended approach
              </p>
            ) : null}
            <div className="space-y-4">
              {project.challenges.map((c) => (
                <div key={c.challenge} data-reveal="up" className="grid overflow-hidden rounded-2xl border border-white/10 md:grid-cols-2">
                  <div className="bg-card/60 p-6">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary">Challenge</p>
                    <p className="mt-2 font-display text-sm font-semibold uppercase leading-6 tracking-wide">{c.challenge}</p>
                  </div>
                  <div className="border-t border-white/10 bg-background p-6 md:border-l md:border-t-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: project.tint }}>
                      Approach
                    </p>
                    <p className="mt-2 text-sm leading-7 text-foreground/80">{c.approach}</p>
                  </div>
                </div>
              ))}
            </div>
          </Block>
          ) : null}

          <Block id="media" n={project.challenges.length ? "07" : "06"} title="Screenshots & gameplay footage">
            {project.gallery?.length || project.video ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {project.video ? (
                  <video
                    src={project.video}
                    controls
                    playsInline
                    preload="metadata"
                    className="aspect-video w-full rounded-2xl border border-white/10 bg-black sm:col-span-2"
                  />
                ) : null}
                {project.gallery?.map((g) => (
                  <div key={g.src} className="relative overflow-hidden rounded-2xl border border-white/10">
                    <Image
                      src={g.src}
                      alt={g.alt}
                      width={g.width}
                      height={g.height}
                      sizes="(min-width:1024px) 480px, 100vw"
                      className="h-auto w-full transition-transform duration-700 hover:scale-[1.03]"
                    />
                  </div>
                ))}
              </div>
            ) : project.cover ? (
              <div className="relative overflow-hidden rounded-2xl border border-white/10">
                <Image
                  src={project.cover.src}
                  alt={project.cover.alt}
                  width={project.cover.width}
                  height={project.cover.height}
                  sizes="(min-width:1024px) 960px, 100vw"
                  className="h-auto w-full"
                />
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex aspect-video flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] text-muted-foreground"
                  >
                    <ImageIcon className="h-5 w-5 opacity-60" aria-hidden />
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Capture pending</span>
                  </div>
                ))}
              </div>
            )}
          </Block>

          <Block id="status" n={project.challenges.length ? "08" : "07"} title="Development status">
            <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-card/60 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  {!released ? (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300/50" />
                  ) : null}
                  <span className={`relative inline-flex h-3 w-3 rounded-full ${released ? "bg-emerald-400" : "bg-amber-300"}`} />
                </span>
                <span className="font-display text-sm uppercase tracking-wider">{project.status}</span>
              </div>
              <Link
                href="/#contact"
                data-project-type="Investment / Partnership"
                className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-primary hover:underline"
              >
                Ask about this project <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          </Block>
        </div>
      </div>

      {/* ---------------- NEXT PROJECT ---------------- */}
      <Link
        href={`/projects/${next.slug}`}
        className="group relative block overflow-hidden border-t border-white/10"
        aria-label={`Next project: ${next.title}`}
      >
        <div aria-hidden className="absolute inset-0 opacity-30 transition-[opacity,transform] duration-[1200ms] group-hover:scale-105 group-hover:opacity-50">
          {next.cover ? (
            <Image src={next.cover.src} alt="" fill sizes="100vw" className="object-cover" />
          ) : (
            <ProjectArt variant={next.art} tint={next.tint} uid={`next-${next.slug}`} className="h-full w-full" />
          )}
        </div>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/30" />
        <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-20 sm:px-8 md:py-28">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Next project · {next.number}</p>
            <p className="mt-4 font-display text-3xl font-black uppercase tracking-tight transition-colors group-hover:text-primary md:text-5xl">
              {next.title}
            </p>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: next.tint }}>
              {next.category}
            </p>
          </div>
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-white/20 transition-all duration-500 group-hover:border-transparent group-hover:bg-primary group-hover:text-background md:h-20 md:w-20">
            <ArrowRight className="h-6 w-6 transition-transform duration-500 group-hover:translate-x-1" aria-hidden />
          </span>
        </div>
      </Link>
    </article>
  );
}

function Block({ id, n, title, children }: { id: string; n: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-28">
      <div data-reveal="fade" className="mb-8 flex items-center gap-4">
        <span className="font-mono text-xs text-[var(--tint)]">{n}</span>
        <span aria-hidden className="h-px w-10 bg-white/15" />
        <h2 id={`${id}-h`} className="font-display text-xl font-bold uppercase tracking-wider md:text-2xl">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
