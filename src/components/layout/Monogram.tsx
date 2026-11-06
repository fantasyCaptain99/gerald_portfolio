import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

/** Reference brand mark: rotating frame + corner ticks around a gradient monogram. */
export function Monogram({ className }: { className?: string }) {
  return (
    <span className={cn("relative flex h-10 w-10 shrink-0 items-center justify-center", className)} aria-hidden>
      <span className="absolute inset-0 animate-spin-slow rounded-lg border border-primary/40 transition-[border-color,box-shadow] duration-300 group-hover:border-primary group-hover:shadow-[0_0_12px_hsl(166_68%_69%/0.4)]" />
      <span className="relative flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-primary/20 to-primary/5 transition-colors duration-300 group-hover:from-primary/40 group-hover:to-primary/15">
        <span className="font-display text-[13px] font-bold text-gradient">{profile.monogram}</span>
      </span>
      <span className="absolute -left-0.5 -top-0.5 h-1.5 w-1.5 border-l border-t border-primary/60" />
      <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 border-r border-t border-primary/60" />
      <span className="absolute -bottom-0.5 -left-0.5 h-1.5 w-1.5 border-b border-l border-primary/60" />
      <span className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 border-b border-r border-primary/60" />
    </span>
  );
}
