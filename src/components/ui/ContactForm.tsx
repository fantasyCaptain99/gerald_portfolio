"use client";

import { useEffect, useId, useState } from "react";
import { ChevronDown, CircleCheck, LoaderCircle, Mail, Send, TriangleAlert } from "lucide-react";
import { projectTypes } from "@/data/site";
import { validateContact, LIMITS, type ContactErrors, type ContactPayload } from "@/lib/contact-schema";
import { CornerBrackets } from "./CornerBrackets";
import { cn } from "@/lib/utils";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "unconfigured"; message: string }
  | { kind: "error"; message: string };

const EMPTY: ContactPayload = { name: "", email: "", projectType: "", message: "", company: "" };

export function ContactForm({ fallbackEmail }: { fallbackEmail: string | null }) {
  const uid = useId();
  const [values, setValues] = useState<ContactPayload>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ContactErrors, boolean>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  // Links elsewhere on the page can preset the project type via data-project-type.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.("[data-project-type]");
      const type = el?.getAttribute("data-project-type");
      if (type && (projectTypes as readonly string[]).includes(type)) {
        setValues((v) => ({ ...v, projectType: type }));
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const set = (k: keyof ContactPayload) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const next = { ...values, [k]: e.target.value };
    setValues(next);
    if (touched[k as keyof ContactErrors]) setErrors(validateContact(next));
  };
  const blur = (k: keyof ContactErrors) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validateContact(values));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validateContact(values);
    setErrors(errs);
    setTouched({ name: true, email: true, projectType: true, message: true });
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; errors?: ContactErrors };
      if (res.ok && data.ok) {
        setStatus({ kind: "sent" });
        setValues(EMPTY);
        setTouched({});
        return;
      }
      if (res.status === 503) {
        setStatus({ kind: "unconfigured", message: data.error ?? "The contact form isn't connected yet." });
        return;
      }
      if (res.status === 400 && data.errors) setErrors(data.errors);
      setStatus({ kind: "error", message: data.error ?? "Something went wrong. Please try again." });
    } catch {
      setStatus({ kind: "error", message: "Network error — please check your connection and try again." });
    }
  };

  const sending = status.kind === "sending";
  const err = (k: keyof ContactErrors) => (touched[k] ? errors[k] : undefined);

  const inputBase =
    "peer w-full rounded-lg border bg-background/80 px-4 text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-transparent focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60";
  const labelBase =
    "pointer-events-none absolute left-4 top-3.5 origin-left bg-transparent text-sm text-muted-foreground transition-all duration-200 peer-focus:-top-5 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-5 peer-[:not(:placeholder-shown)]:text-xs";

  if (status.kind === "sent") {
    return (
      <div className="relative rounded-2xl border border-primary/30 bg-card/60 p-10 text-center backdrop-blur-sm" role="status">
        <CornerBrackets />
        <CircleCheck className="mx-auto h-10 w-10 text-primary" aria-hidden />
        <h3 className="mt-4 font-display text-xl font-bold uppercase tracking-wider">Message sent</h3>
        <p className="mt-3 text-muted-foreground">Thanks for reaching out — I&apos;ll reply to the email you provided.</p>
        <button
          type="button"
          onClick={() => setStatus({ kind: "idle" })}
          className="mt-6 font-display text-xs uppercase tracking-[0.2em] text-primary underline-offset-4 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      aria-busy={sending}
      className="relative rounded-2xl border border-border bg-card/50 p-7 backdrop-blur-sm md:p-10"
    >
      <CornerBrackets />
      <div className="grid gap-x-6 gap-y-9 pt-3 md:grid-cols-2">
        <Field error={err("name")} id={`${uid}-name`}>
          <input
            id={`${uid}-name`}
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            maxLength={LIMITS.name}
            value={values.name}
            onChange={set("name")}
            onBlur={blur("name")}
            disabled={sending}
            aria-invalid={Boolean(err("name"))}
            aria-describedby={err("name") ? `${uid}-name-err` : undefined}
            required
            className={cn(inputBase, "h-12", err("name") ? "border-red-400/70" : "border-border")}
          />
          <label htmlFor={`${uid}-name`} className={labelBase}>
            Your Name
          </label>
        </Field>

        <Field error={err("email")} id={`${uid}-email`}>
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            maxLength={LIMITS.email}
            value={values.email}
            onChange={set("email")}
            onBlur={blur("email")}
            disabled={sending}
            aria-invalid={Boolean(err("email"))}
            aria-describedby={err("email") ? `${uid}-email-err` : undefined}
            required
            className={cn(inputBase, "h-12", err("email") ? "border-red-400/70" : "border-border")}
          />
          <label htmlFor={`${uid}-email`} className={labelBase}>
            Email Address
          </label>
        </Field>

        <Field error={err("projectType")} id={`${uid}-projectType`} className="md:col-span-2">
          <label htmlFor={`${uid}-projectType`} className="absolute -top-5 left-4 text-xs text-muted-foreground">
            Project Type
          </label>
          <select
            id={`${uid}-projectType`}
            name="projectType"
            value={values.projectType}
            onChange={set("projectType")}
            onBlur={blur("projectType")}
            disabled={sending}
            aria-invalid={Boolean(err("projectType"))}
            aria-describedby={err("projectType") ? `${uid}-projectType-err` : undefined}
            required
            className={cn(
              inputBase,
              "h-12 appearance-none pr-10",
              !values.projectType && "text-muted-foreground",
              err("projectType") ? "border-red-400/70" : "border-border",
            )}
          >
            <option value="" disabled>
              Select a project type…
            </option>
            {projectTypes.map((t) => (
              <option key={t} value={t} className="bg-card text-foreground">
                {t}
              </option>
            ))}
          </select>
          <ChevronDown aria-hidden className="pointer-events-none absolute right-4 top-4 h-4 w-4 text-muted-foreground" />
        </Field>

        <Field error={err("message")} id={`${uid}-message`} className="md:col-span-2">
          <textarea
            id={`${uid}-message`}
            name="message"
            rows={6}
            placeholder="Tell me about your project"
            maxLength={LIMITS.message}
            value={values.message}
            onChange={set("message")}
            onBlur={blur("message")}
            disabled={sending}
            aria-invalid={Boolean(err("message"))}
            aria-describedby={`${uid}-message-count${err("message") ? ` ${uid}-message-err` : ""}`}
            required
            className={cn(inputBase, "resize-y py-3.5 leading-7", err("message") ? "border-red-400/70" : "border-border")}
          />
          <label htmlFor={`${uid}-message`} className={labelBase}>
            Your Message
          </label>
          <span id={`${uid}-message-count`} className="absolute -bottom-6 right-1 font-mono text-[10px] text-muted-foreground/70">
            {values.message.length}/{LIMITS.message}
          </span>
        </Field>

        {/* Honeypot — hidden from humans and assistive tech */}
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor={`${uid}-company`}>Company</label>
          <input id={`${uid}-company`} name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={set("company")} />
        </div>
      </div>

      <div className="mt-10 flex flex-col-reverse items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div aria-live="polite" className="min-h-6 text-sm">
          {status.kind === "error" ? (
            <p className="flex items-start gap-2 text-red-300">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> {status.message}
            </p>
          ) : null}
          {status.kind === "unconfigured" ? (
            <div className="flex items-start gap-2 text-amber-200">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <p>
                {status.message}{" "}
                {fallbackEmail ? (
                  <a
                    className="inline-flex items-center gap-1 text-primary underline underline-offset-4"
                    href={`mailto:${fallbackEmail}?subject=${encodeURIComponent(`Game project: ${values.projectType || "Inquiry"}`)}&body=${encodeURIComponent(values.message)}`}
                  >
                    <Mail className="h-3.5 w-3.5" aria-hidden /> Email me directly
                  </a>
                ) : (
                  <span>Your message was not sent. Please use one of the contact links on this page instead.</span>
                )}
              </p>
            </div>
          ) : null}
        </div>
        <button
          type="submit"
          disabled={sending}
          className="shimmer group relative inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 overflow-hidden rounded-lg border border-primary/60 bg-primary px-8 py-3.5 font-display text-xs font-semibold uppercase tracking-[0.2em] text-background transition-shadow hover:shadow-[0_0_32px_-4px_var(--color-primary)] disabled:cursor-wait disabled:opacity-70 sm:w-auto"
        >
          {sending ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden /> Sending…
            </>
          ) : (
            <>
              Send Message
              <Send className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function Field({
  id,
  error,
  children,
  className,
}: {
  id: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      {children}
      {error ? (
        <p id={`${id}-err`} className="mt-2 text-xs text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
