import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80svh] flex-col items-center justify-center overflow-hidden px-6 pt-28 text-center">
      <div aria-hidden className="absolute inset-0 space-grid opacity-60" />
      <div aria-hidden className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/15 blur-[100px]" />
      <p className="relative font-mono text-xs uppercase tracking-[0.4em] text-primary">Error 404</p>
      <h1 className="relative mt-4 font-display text-4xl font-black uppercase tracking-wider md:text-6xl">
        <span className="text-gradient">Out of bounds</span>
      </h1>
      <p className="relative mt-5 max-w-md text-muted-foreground">
        This level doesn&apos;t exist. Respawn at the start and try another route.
      </p>
      <Link
        href="/"
        className="relative mt-10 inline-flex min-h-12 items-center gap-2 rounded-lg border border-primary/60 px-7 py-3 font-display text-xs uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary hover:text-background"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden /> Respawn
      </Link>
    </section>
  );
}
