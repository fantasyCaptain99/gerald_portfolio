"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { motion, useSpring } from "motion/react";
import { cn } from "@/lib/utils";
import { useFinePointer, useReducedMotion } from "@/hooks/useMediaQuery";

type Variant = "primary" | "ghost" | "magenta";

const styles: Record<Variant, string> = {
  primary:
    "border-primary/60 bg-primary text-background font-semibold hover:shadow-[0_0_32px_-4px_var(--color-primary)]",
  ghost:
    "border-foreground/20 bg-white/[0.03] text-foreground backdrop-blur-sm hover:border-primary/70 hover:text-primary",
  magenta:
    "border-secondary/50 bg-secondary/10 text-secondary hover:border-secondary hover:shadow-[0_0_30px_-6px_var(--color-secondary)]",
};

/**
 * Button/link that subtly follows the pointer (magnetic hover) on fine-pointer
 * devices. Motion owns the wrapper's transform exclusively — GSAP never touches it.
 */
export function MagneticButton({
  href,
  children,
  variant = "primary",
  className,
  external,
  onClick,
  type = "button",
  disabled,
  ariaLabel,
}: {
  href?: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const x = useSpring(0, { stiffness: 260, damping: 18, mass: 0.4 });
  const y = useSpring(0, { stiffness: 260, damping: 18, mass: 0.4 });
  const active = fine && !reduced && !disabled;

  const onMove = (e: React.PointerEvent) => {
    if (!active || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.22);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const base = cn(
    "shimmer group relative inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden rounded-lg border px-7 py-3.5 font-display text-[11px] uppercase tracking-[0.18em] transition-[box-shadow,border-color,color,background-color,transform] duration-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:text-xs",
    styles[variant],
    className,
  );

  const inner = <span className="relative z-10 inline-flex items-center gap-2">{children}</span>;

  let el: ReactNode;
  if (href && external) {
    el = (
      <a href={href} target="_blank" rel="noopener noreferrer" className={base} aria-label={ariaLabel}>
        {inner}
      </a>
    );
  } else if (href) {
    el = (
      <Link href={href} className={base} aria-label={ariaLabel} onClick={onClick}>
        {inner}
      </Link>
    );
  } else {
    el = (
      <button type={type} className={base} onClick={onClick} disabled={disabled} aria-label={ariaLabel}>
        {inner}
      </button>
    );
  }

  return (
    <motion.span ref={ref} className="inline-flex" style={{ x, y }} onPointerMove={onMove} onPointerLeave={onLeave}>
      {el}
    </motion.span>
  );
}
