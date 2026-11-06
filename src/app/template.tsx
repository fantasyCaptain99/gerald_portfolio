"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Route transition: each navigation re-mounts this template, giving pages a
 * short cinematic fade/lift. Motion owns only this wrapper's opacity/transform.
 * (No CSS filter here — filters/transforms on an ancestor would break
 * GSAP's fixed-position pinning in the Process section.)
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  return (
    <motion.div
      ref={ref}
      initial={reduced ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={() => {
        if (ref.current) ref.current.style.transform = "none";
      }}
    >
      {children}
    </motion.div>
  );
}
