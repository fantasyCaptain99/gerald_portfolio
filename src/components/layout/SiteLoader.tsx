"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { markSiteReady } from "@/lib/site-ready";

/**
 * Full-screen boot screen modeled on the reference portfolio's loader:
 * "LOADING_<TITLE>" neon wordmark, status line, shimmering progress bar,
 * percentage, pulsing dots, drifting aurora, meteor streaks, random
 * lightning, glitch shakes at 35 / 80 / 99 %, and a flash → blur exit.
 */
const COPY = {
  title: "Game Development",
  curating: "CURATING UNITY / UNREAL / THREE.JS",
  shaping: "SHAPING GAME WORLDS",
  ready: "READY TO WELCOME YOU IN",
  progressReady: "READY TO PLAY",
};

// Same palette as the hero (globals.css theme): primary mint, secondary pink, accent indigo.
// Hex so alpha suffixes like `${GREEN}99` are valid.
const GREEN = "#79E8D0"; // --color-primary  — "LOADING", bar, dots
const PINK = "#FF52C5"; // --color-secondary — title, glitch accents
const INDIGO = "#8E9EFF"; // --color-accent
const BG = "#0a0b12"; // --color-background

// Deterministic meteor layout (no hydration mismatch).
const METEORS = Array.from({ length: 8 }, (_, i) => ({
  top: [4, 18, 32, -6, 10, 26, 44, 2][i],
  left: [62, 88, 104, 40, 76, 96, 110, 120][i],
  len: [150, 190, 130, 170, 200, 140, 160, 180][i],
  delay: [0, 0.9, 1.7, 2.4, 0.4, 1.3, 2.9, 2.1][i],
  dur: [2.6, 3.1, 2.8, 3.4, 2.9, 3.6, 3.2, 2.7][i],
}));

export function SiteLoader() {
  const [mounted, setMounted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [glitch, setGlitch] = useState(0); // shake intensity, 0 = none
  const [flash, setFlash] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [bolt, setBolt] = useState<{ x: number; y: number; rot: number } | null>(null);
  const timers = useRef<number[]>([]);
  const fired = useRef(new Set<number>());
  const finished = useRef(false);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  // Reduced motion: skip the boot screen entirely.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      markSiteReady();
      setMounted(false);
    }
  }, []);

  // Lock the page (scroll + focus) only while the loader is on screen.
  useEffect(() => {
    if (!mounted) return;
    window.scrollTo(0, 0);
    const root = document.documentElement;
    root.style.overflow = "hidden";
    const behind = Array.from(
      document.querySelectorAll<HTMLElement>("body > header, body > main, body > footer, body > a"),
    );
    behind.forEach((el) => el.setAttribute("inert", ""));
    return () => {
      root.style.overflow = "";
      behind.forEach((el) => el.removeAttribute("inert"));
    };
  }, [mounted]);

  // Clear any pending timers on unmount.
  useEffect(
    () => () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
    },
    [],
  );

  // Progress: +2% every 100 ms with glitch beats at 35 / 80 / 99 %.
  useEffect(() => {
    if (!mounted) return;
    const beat = (key: number, intensity: number, ms: number) => {
      if (fired.current.has(key)) return;
      fired.current.add(key);
      setGlitch(intensity);
      later(() => setGlitch(0), ms);
    };
    const id = window.setInterval(() => {
      setProgress((p) => {
        const n = Math.min(p + 2, 100);
        if (n >= 34 && n <= 38) beat(35, 4, 400);
        if (n >= 78 && n <= 82) beat(80, 8, 500);
        if (n >= 98 && n < 100) beat(99, 12, 600);
        if (n >= 100) window.clearInterval(id);
        return n;
      });
    }, 100);
    return () => window.clearInterval(id);
  }, [mounted, later]);

  // Random lightning strikes.
  useEffect(() => {
    if (!mounted) return;
    const strike = () => {
      setBolt({ x: 20 + Math.random() * 60, y: 10 + Math.random() * 40, rot: 15 + Math.random() * 30 });
      later(() => setBolt(null), 150);
      later(() => {
        setBolt((b) => b ?? { x: 20 + Math.random() * 60, y: 10 + Math.random() * 40, rot: 15 + Math.random() * 30 });
        later(() => setBolt(null), 80);
      }, 200);
    };
    const id = window.setInterval(() => {
      if (Math.random() > 0.5) strike();
    }, 2000);
    return () => window.clearInterval(id);
  }, [mounted, later]);

  // Completion: flash, flicker, then blur-out exit.
  useEffect(() => {
    if (progress !== 100 || finished.current) return;
    finished.current = true;
    setFlash(true);
    later(() => {
      setFlash(false);
      later(() => {
        setFlash(true);
        later(() => {
          setFlash(false);
          setExiting(true);
          markSiteReady();
        }, 100);
      }, 150);
    }, 150);
    later(() => setMounted(false), 1400);
  }, [progress, later]);

  const glitching = glitch > 0;
  const ready = progress >= 85;
  const shake = glitching
    ? {
        transform: `translate(${(Math.random() - 0.5) * glitch}px, ${(Math.random() - 0.5) * glitch}px) rotate(${(Math.random() - 0.5) * glitch * 0.3}deg)`,
      }
    : undefined;

  return (
    <AnimatePresence>
      {mounted ? (
        <motion.div
          key="site-loader"
          id="site-loader"
          role="status"
          aria-live="polite"
          aria-label={`Loading ${progress}%`}
          data-lenis-prevent
          initial={false}
          animate={{
            opacity: exiting ? 0 : 1,
            scale: exiting ? 1.1 : 1,
            filter: exiting ? "blur(10px)" : "blur(0px)",
          }}
          transition={{ duration: exiting ? 1 : 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[300] flex flex-col items-center justify-center overflow-hidden bg-background"
          style={shake}
        >
          {/* completion flash */}
          {flash ? (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.8, 1, 0] }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              style={{ background: `radial-gradient(circle at center, ${GREEN} 0%, ${PINK}cc 30%, ${BG} 70%)` }}
            />
          ) : null}

          {/* meteor streaks */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            {METEORS.map((m, i) => (
              <span
                key={i}
                className="loader-meteor absolute h-px"
                style={{
                  top: `${m.top}%`,
                  left: `${m.left}%`,
                  width: m.len,
                  animationDelay: `${m.delay}s`,
                  animationDuration: `${m.dur}s`,
                }}
              />
            ))}
          </div>

          {/* lightning */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute inset-0 z-20"
              style={{
                background: bolt
                  ? `radial-gradient(ellipse 60% 40% at ${bolt.x}% ${bolt.y}%, ${GREEN}99 0%, ${PINK}4d 30%, transparent 70%)`
                  : "none",
              }}
              animate={{ opacity: bolt ? [0, 1, 0.3, 0] : 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            />
            {bolt ? (
              <motion.div
                className="absolute z-20 h-[150px] w-[2px]"
                style={{
                  left: `${bolt.x}%`,
                  top: `${bolt.y}%`,
                  background: `linear-gradient(180deg, ${GREEN} 0%, ${PINK} 50%, transparent 100%)`,
                  filter: "blur(1px)",
                  boxShadow: `0 0 20px ${GREEN}, 0 0 40px ${PINK}`,
                  rotate: bolt.rot,
                }}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: [0, 1, 0], scaleY: [0, 1, 1] }}
                transition={{ duration: 0.1 }}
              />
            ) : null}

            {/* drifting aurora */}
            <motion.div
              className="absolute -bottom-20 -left-20 -right-20 h-[60%]"
              style={{
                background: glitching
                  ? `radial-gradient(ellipse 120% 80% at 50% 100%, hsl(166 68% 69% / 0.35) 0%, hsl(320 100% 66% / 0.2) 40%, transparent 70%)`
                  : `radial-gradient(ellipse 120% 80% at 50% 100%, hsl(166 68% 69% / 0.15) 0%, hsl(320 100% 66% / 0.08) 40%, transparent 70%)`,
                filter: glitching ? "blur(30px)" : "blur(40px)",
              }}
              animate={{ x: glitching ? [-50, 50, -50] : [-30, 30, -30], opacity: glitching ? [0.6, 0.9, 0.6] : [0.4, 0.5, 0.4] }}
              transition={{ duration: glitching ? 0.3 : 15, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -left-40 -right-40 top-1/3 h-1/2"
              style={{
                background: `radial-gradient(ellipse 100% 60% at 30% 50%, hsl(166 68% 69% / ${glitching ? 0.3 : 0.12}) 0%, transparent 60%)`,
                filter: glitching ? "blur(40px)" : "blur(60px)",
              }}
              animate={{ x: glitching ? [60, -60, 60] : [40, -40, 40], y: glitching ? [-40, 40, -40] : [-20, 20, -20] }}
              transition={{ duration: glitching ? 0.25 : 20, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -left-20 -right-20 -top-20 h-[40%]"
              style={{
                background: `radial-gradient(ellipse 80% 100% at 70% 0%, hsl(320 100% 66% / ${glitching ? 0.25 : 0.1}) 0%, transparent 50%)`,
                filter: glitching ? "blur(35px)" : "blur(50px)",
              }}
              animate={{ x: glitching ? [-40, 60, -40] : [-20, 40, -20], opacity: glitching ? [0.4, 0.7, 0.4] : [0.2, 0.35, 0.2] }}
              transition={{ duration: glitching ? 0.2 : 12, repeat: Infinity, ease: "easeInOut" }}
            />
            {Array.from({ length: 6 }).map((_, n) => (
              <motion.div
                key={n}
                className="absolute rounded-full"
                style={{
                  width: 150 + n * 50,
                  height: 80 + n * 30,
                  left: `${10 + n * 15}%`,
                  top: `${20 + (n % 3) * 25}%`,
                  background: `radial-gradient(ellipse, hsl(166 68% 69% / ${glitching ? 0.15 + n * 0.02 : 0.06 + n * 0.01}) 0%, transparent 70%)`,
                  filter: glitching ? "blur(20px)" : "blur(30px)",
                }}
                animate={{ x: [0, 30 - n * 10, 0], y: [0, 15 - n * 5, 0], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 8 + n * 2, repeat: Infinity, ease: "easeInOut", delay: n * 0.5 }}
              />
            ))}
          </div>

          {/* vignette */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse at center, transparent 0%, rgb(10 11 18 / 0.2) 50%, rgb(10 11 18 / 0.6) 100%)" }}
          />
          {glitching ? <div aria-hidden className="pointer-events-none absolute inset-0 z-20 animate-pulse bg-primary/10" /> : null}

          {/* content */}
          <div className="relative z-10 flex flex-col items-center gap-12 px-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: glitching ? [1, 1.02, 0.98, 1] : 1, opacity: 1 }}
              transition={{ duration: glitching ? 0.1 : 0.5, repeat: glitching ? Infinity : 0 }}
              className="relative"
            >
              <h1 className="text-center font-display text-3xl font-bold tracking-wider sm:text-4xl md:text-6xl">
                <span style={{ color: GREEN, textShadow: `0 0 10px ${GREEN}cc, 0 0 20px ${GREEN}99, 0 0 40px ${GREEN}66` }}>LOADING</span>
                <span className="text-foreground">_</span>
                <span
                  className="inline-block"
                  style={{ color: PINK, textShadow: `0 0 10px ${PINK}cc, 0 0 20px ${PINK}99, 0 0 40px ${PINK}66` }}
                >
                  {COPY.title.toUpperCase()}
                </span>
              </h1>
              <motion.div
                aria-hidden
                className="absolute -inset-4 -z-10 rounded-lg bg-primary/5"
                animate={{ opacity: glitching ? [0.3, 0.8, 0.3] : [0.3, 0.6, 0.3] }}
                transition={{ duration: glitching ? 0.1 : 2, repeat: Infinity }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center gap-4"
            >
              <p className="text-center font-body text-sm tracking-widest text-muted-foreground">
                {ready ? COPY.ready : COPY.curating}
              </p>
              <div className="relative h-1 w-64 overflow-hidden rounded-full bg-muted/50 backdrop-blur-sm md:w-80">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: glitching
                      ? `linear-gradient(90deg, ${PINK}, ${GREEN}, ${PINK})`
                      : `linear-gradient(90deg, ${GREEN}, ${INDIGO}, ${PINK})`,
                  }}
                  animate={glitching ? { opacity: [1, 0.7, 1] } : {}}
                  transition={{ duration: 0.1, repeat: glitching ? Infinity : 0 }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/20 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: glitching ? 0.3 : 1.5, repeat: Infinity }}
                />
              </div>
              <div className="flex items-center gap-2 font-display text-xs tracking-wider text-muted-foreground">
                <span>{ready ? COPY.progressReady : COPY.shaping}</span>
                <motion.span
                  style={{ color: GREEN }}
                  className="tabular-nums"
                  animate={glitching ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.1, repeat: glitching ? Infinity : 0 }}
                >
                  {progress}%
                </motion.span>
              </div>
            </motion.div>

            <motion.div className="flex gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} aria-hidden>
              {Array.from({ length: 5 }).map((_, n) => (
                <motion.span
                  key={n}
                  className="h-2 w-2 rounded-full"
                  style={{ background: glitching ? PINK : GREEN }}
                  animate={{ scale: glitching ? [1, 2, 1] : [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: glitching ? 0.15 : 1, repeat: Infinity, delay: glitching ? n * 0.03 : n * 0.15 }}
                />
              ))}
            </motion.div>
          </div>

          {/* scanlines during glitch */}
          {glitching ? (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-30"
              style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)" }}
            />
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
