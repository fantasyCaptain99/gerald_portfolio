"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { SceneFallback } from "./SceneFallback";
import { SceneErrorBoundary } from "./SceneErrorBoundary";
import { useInViewport, usePageVisible, useWebGLSupport } from "@/hooks/useInViewport";
import { useIsMobile, useReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { useSiteReady } from "@/lib/site-ready";

// three.js + R3F are code-split out of the main bundle and never server-rendered.
const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => null,
});

export function HeroSceneMount({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewport(ref, "0px");
  const visible = usePageVisible();
  const webgl = useWebGLSupport();
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  const [failed, setFailed] = useState(false);
  const siteReady = useSiteReady();

  const fallback = <SceneFallback label="Floating game-world illustration" />;

  return (
    <div ref={ref} className={cn("relative", className)}>
      {webgl === false || failed ? (
        fallback
      ) : webgl ? (
        <SceneErrorBoundary fallback={fallback} onError={() => setFailed(true)}>
          <div className="absolute inset-0 animate-[fadeIn_1.2s_ease-out_0.35s_both]">
            <HeroScene active={inView && visible && siteReady} reduced={reduced} mobile={mobile} onFail={() => setFailed(true)} />
          </div>
        </SceneErrorBoundary>
      ) : null}
      <p className="sr-only">
        An interactive real-time 3D scene: a floating low-poly island with trees, a watchtower, a glowing crystal
        shrine, and a waterfall, drifting in a starry atmosphere. It responds to pointer movement.
      </p>
    </div>
  );
}
