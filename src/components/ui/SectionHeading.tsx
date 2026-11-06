import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { RevealWords } from "./RevealWords";

/**
 * Reference section header: icon → 1px vertical line → giant ghost label
 * behind a display title → muted description. Centered.
 */
export function SectionHeading({
  label,
  ghost,
  title,
  description,
  icon,
  tone = "dark",
  className,
  id,
}: {
  label: string;
  ghost: string;
  title: string;
  description?: ReactNode;
  icon: ReactNode;
  tone?: "dark" | "light";
  className?: string;
  id?: string;
}) {
  const light = tone === "light";
  return (
    <header className={cn("mb-14 flex flex-col items-center text-center md:mb-20", className)}>
      <div aria-hidden className={cn("mb-2 animate-float", light ? "text-stone-700" : "text-foreground")}>
        {icon}
      </div>
      <div
        aria-hidden
        data-reveal="fade"
        className={cn("mb-5 h-8 w-px", light ? "bg-stone-400" : "bg-foreground/50")}
      />
      <p
        data-reveal="fade"
        className={cn(
          "mb-5 font-mono text-[11px] uppercase tracking-[0.4em]",
          light ? "text-stone-500" : "text-primary/80",
        )}
      >
        {label}
      </p>
      <div className="relative w-full overflow-x-clip px-2">
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-display text-6xl font-bold uppercase tracking-widest sm:text-7xl md:text-8xl",
            light ? "text-stone-200/80" : "text-muted/50",
          )}
        >
          {ghost}
        </span>
        <h2
          id={id}
          className={cn(
            "relative z-10 mx-auto max-w-4xl text-balance font-display text-2xl font-bold uppercase leading-tight tracking-wider sm:text-3xl md:text-4xl lg:text-[2.75rem]",
            light ? "text-stone-800" : "text-foreground",
          )}
        >
          <RevealWords text={title} />
        </h2>
      </div>
      {description ? (
        <p
          data-reveal="up"
          className={cn(
            "mx-auto mt-6 max-w-2xl text-pretty leading-relaxed",
            light ? "text-stone-600" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      ) : null}
    </header>
  );
}
