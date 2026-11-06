import { ArrowUpRight, Mail } from "lucide-react";
import { configuredSocials, social } from "@/data/social";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/ui/ContactForm";
import { BrandIcon } from "@/components/ui/BrandIcons";

export function Contact() {
  const socials = configuredSocials();
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative py-24 md:py-32">
      <div aria-hidden className="absolute inset-0 space-grid opacity-20" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          id="contact-title"
          label="04 / Contact"
          ghost="CONTACT"
          title="Have a game in mind?"
          description="Whether you're building a new game, expanding a development team, or exploring a technical partnership, I'd be happy to hear about your project."
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          }
        />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div data-reveal="up">
            <ContactForm fallbackEmail={social.email} />
          </div>

          <aside data-reveal="up" data-reveal-delay="0.1" className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-card/40 p-6">
              <h3 className="font-display text-xs uppercase tracking-[0.25em] text-foreground">Helpful to include</h3>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                {[
                  "The game concept or genre",
                  "Target platforms (PC, mobile, web)",
                  "Current stage — idea, prototype, or in production",
                  "Timeline and team setup",
                  "Budget range or partnership model",
                ].map((t) => (
                  <li key={t} className="flex gap-3">
                    <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-primary" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {social.email || socials.length || social.demos.length ? (
              <div className="rounded-2xl border border-white/10 bg-card/40 p-6">
                <h3 className="font-display text-xs uppercase tracking-[0.25em] text-foreground">Direct links</h3>
                <ul className="mt-4 space-y-2">
                  {social.email ? (
                    <li>
                      <a
                        href={`mailto:${social.email}`}
                        className="group flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-primary"
                      >
                        <Mail className="h-4 w-4" aria-hidden />
                        <span className="truncate">{social.email}</span>
                      </a>
                    </li>
                  ) : null}
                  {socials.map((s) => (
                    <li key={s.key}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-primary"
                      >
                        <BrandIcon name={s.key} />
                        {s.label}
                        <ArrowUpRight className="ml-auto h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                      </a>
                    </li>
                  ))}
                  {social.demos.map((d) => (
                    <li key={d.href}>
                      <a
                        href={d.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-primary"
                      >
                        <ArrowUpRight className="h-4 w-4" aria-hidden />
                        {d.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <p className="px-1 font-mono text-[10px] uppercase leading-5 tracking-[0.2em] text-muted-foreground/70">
              Your details are used only to reply to your message.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
