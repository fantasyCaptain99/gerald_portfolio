import { cn } from "@/lib/utils";

/**
 * Static, lightweight stand-in shown while a 3D scene loads, or permanently
 * when WebGL is unavailable. Communicates the same idea without a canvas.
 */
export function SceneFallback({
  label = "Real-time 3D scene",
  message,
  className,
}: {
  label?: string;
  message?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative flex h-full w-full items-center justify-center overflow-hidden", className)}>
      <div aria-hidden className="absolute h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
      <svg aria-hidden viewBox="0 0 240 200" className="relative h-[70%] max-h-72 w-auto opacity-90">
        <defs>
          <linearGradient id="sf-top" x1="0" x2="1">
            <stop offset="0" stopColor="#2f8f78" />
            <stop offset="1" stopColor="#46c79f" />
          </linearGradient>
        </defs>
        <ellipse cx="120" cy="96" rx="92" ry="22" fill="url(#sf-top)" />
        <path d="M28 96 Q 120 210 212 96 Q 120 130 28 96Z" fill="#2a3352" />
        <path d="M78 92 l10 -34 10 34z M150 90 l9 -30 9 30z M60 98 l8 -24 8 24z" fill="#2fa186" />
        <rect x="128" y="48" width="16" height="40" fill="#c9d3e6" />
        <path d="M124 50 l12 -18 12 18z" fill="#ff52b8" />
        <path d="M104 40 l8 -14 8 14 -8 14z" fill="#79E8D0" />
      </svg>
      {message ? (
        <p className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          {message}
        </p>
      ) : null}
      <span className="sr-only">{label}</span>
    </div>
  );
}
