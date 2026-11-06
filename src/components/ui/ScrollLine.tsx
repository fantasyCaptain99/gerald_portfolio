"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

/** A vertical rail that fills as its parent section scrolls through the viewport. */
export function ScrollLine({ className }: { className?: string }) {
  const track = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!track.current || !fill.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(fill.current, { scaleY: 1 });
      return;
    }
    const tween = gsap.fromTo(
      fill.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: track.current, start: "top 70%", end: "bottom 60%", scrub: 0.6 },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div ref={track} aria-hidden className={cn("w-px bg-white/10", className)}>
      <div
        ref={fill}
        className="h-full w-full origin-top bg-gradient-to-b from-primary via-accent to-secondary shadow-[0_0_12px_var(--color-primary)]"
      />
    </div>
  );
}
