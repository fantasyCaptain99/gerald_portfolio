import type { ArtVariant } from "@/data/projects";

/**
 * Original procedural concept illustrations — used as clearly-labeled
 * placeholders until real gameplay screenshots are added to the project data.
 * Pure SVG: zero network cost, crisp at any size.
 */
export function ProjectArt({
  variant,
  tint,
  uid,
  className,
}: {
  variant: ArtVariant;
  tint: string;
  uid: string;
  className?: string;
}) {
  const g = (n: string) => `${uid}-${n}`;
  return (
    <svg
      viewBox="0 0 640 400"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label={`Concept illustration: ${LABELS[variant]}`}
    >
      <defs>
        <linearGradient id={g("sky")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#060914" />
          <stop offset="0.65" stopColor="#0b1226" />
          <stop offset="1" stopColor="#0a1020" />
        </linearGradient>
        <radialGradient id={g("glow")} cx="0.5" cy="0.62" r="0.6">
          <stop offset="0" stopColor={tint} stopOpacity="0.38" />
          <stop offset="0.5" stopColor={tint} stopOpacity="0.08" />
          <stop offset="1" stopColor={tint} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={g("tint")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={tint} />
          <stop offset="1" stopColor="#8E9EFF" />
        </linearGradient>
        <linearGradient id={g("fade")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a1020" stopOpacity="0" />
          <stop offset="1" stopColor="#0a1020" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <rect width="640" height="400" fill={`url(#${g("sky")})`} />
      <rect width="640" height="400" fill={`url(#${g("glow")})`} />
      <Stars />
      {variant === "coop" && <Coop tint={tint} g={g} />}
      {variant === "rts" && <Rts tint={tint} g={g} />}
      {variant === "combat" && <Combat tint={tint} g={g} />}
      {variant === "browser" && <Browser tint={tint} g={g} />}
      {variant === "mobile" && <Mobile tint={tint} g={g} />}
      {variant === "platformer" && <Platformer tint={tint} g={g} />}
      <rect y="260" width="640" height="140" fill={`url(#${g("fade")})`} />
    </svg>
  );
}

const LABELS: Record<ArtVariant, string> = {
  coop: "two players cooperatively carrying a crate",
  rts: "tactical units on an isometric battlefield",
  combat: "character performing a melee slash",
  browser: "wireframe 3D terrain inside a browser window",
  mobile: "touch-controlled game on a phone",
  platformer: "2D platformer level with a jumping character",
};

type P = { tint: string; g: (n: string) => string };

function Stars() {
  const pts = [
    [42, 38], [118, 72], [190, 26], [268, 58], [352, 30], [430, 66], [508, 22], [586, 54], [612, 110], [76, 120], [560, 140], [24, 170],
  ];
  return (
    <g fill="#cfe7ff" opacity="0.5">
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.4 : 0.9} />
      ))}
    </g>
  );
}

function PerspectiveFloor({ tint, horizon = 250 }: { tint: string; horizon?: number }) {
  const lines = [];
  for (let i = -8; i <= 8; i++) {
    lines.push(<line key={`v${i}`} x1={320 + i * 18} y1={horizon} x2={320 + i * 120} y2={400} />);
  }
  const rows = [0, 10, 24, 44, 72, 110, 150];
  return (
    <g stroke={tint} strokeOpacity="0.22" strokeWidth="1">
      {lines}
      {rows.map((r) => (
        <line key={`h${r}`} x1="0" y1={horizon + r} x2="640" y2={horizon + r} />
      ))}
    </g>
  );
}

function Coop({ tint, g }: P) {
  return (
    <g>
      <PerspectiveFloor tint={tint} />
      {/* warehouse silhouettes */}
      <g fill="#111a33" stroke={tint} strokeOpacity="0.25">
        <path d="M40 250 V170 L110 140 L180 170 V250 Z" />
        <path d="M470 250 V160 L540 128 L610 160 V250 Z" />
      </g>
      {/* mission marker */}
      <g className="origin-center">
        <path d="M320 92 l14 18 -14 18 -14 -18z" fill="none" stroke={tint} strokeWidth="2.5" />
        <line x1="320" y1="128" x2="320" y2="168" stroke={tint} strokeOpacity="0.5" strokeDasharray="4 4" />
      </g>
      {/* players */}
      <g>
        <ellipse cx="250" cy="304" rx="30" ry="7" fill="#000" opacity="0.4" />
        <rect x="232" y="222" width="36" height="78" rx="18" fill={`url(#${g("tint")})`} />
        <rect x="240" y="236" width="20" height="9" rx="4" fill="#0a1020" opacity="0.8" />
        <ellipse cx="390" cy="304" rx="30" ry="7" fill="#000" opacity="0.4" />
        <rect x="372" y="222" width="36" height="78" rx="18" fill="#ff6fd8" />
        <rect x="380" y="236" width="20" height="9" rx="4" fill="#0a1020" opacity="0.8" />
      </g>
      {/* shared crate */}
      <g>
        <rect x="282" y="236" width="76" height="56" rx="4" fill="#2a2f45" stroke={tint} strokeWidth="2" />
        <path d="M282 236 L358 292 M358 236 L282 292" stroke={tint} strokeOpacity="0.45" strokeWidth="2" />
        <line x1="268" y1="262" x2="282" y2="262" stroke="#cfe7ff" strokeWidth="5" strokeLinecap="round" />
        <line x1="358" y1="262" x2="372" y2="262" stroke="#cfe7ff" strokeWidth="5" strokeLinecap="round" />
      </g>
      {/* proximity voice ripples */}
      <g fill="none" strokeWidth="2">
        <path d="M232 204 a24 24 0 0 1 36 0" stroke={tint} strokeOpacity="0.8" />
        <path d="M224 194 a36 36 0 0 1 52 0" stroke={tint} strokeOpacity="0.45" />
        <path d="M372 204 a24 24 0 0 1 36 0" stroke="#ff6fd8" strokeOpacity="0.8" />
        <path d="M364 194 a36 36 0 0 1 52 0" stroke="#ff6fd8" strokeOpacity="0.45" />
      </g>
    </g>
  );
}

function Rts({ tint, g }: P) {
  const tiles = [];
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 9; c++) {
      const x = 320 + (c - r) * 40;
      const y = 150 + (c + r) * 20;
      tiles.push(
        <path
          key={`${r}-${c}`}
          d={`M${x} ${y} l40 20 -40 20 -40 -20z`}
          fill={(r + c) % 2 ? "#0f1830" : "#121d38"}
          stroke={tint}
          strokeOpacity="0.16"
        />,
      );
    }
  }
  const units = [
    [250, 270], [278, 284], [222, 284], [250, 298], [306, 270],
  ];
  return (
    <g>
      {tiles}
      {/* bunker */}
      <g>
        <path d="M430 210 l40 20 v22 l-40 20 -40 -20 v-22z" fill="#1e2a4a" stroke={tint} strokeOpacity="0.6" />
        <path d="M430 210 l40 20 -40 20 -40 -20z" fill="#27365d" />
        <rect x="424" y="222" width="12" height="4" fill={tint} opacity="0.8" />
      </g>
      {/* move order */}
      <path d="M262 278 Q 340 230 410 252" fill="none" stroke={tint} strokeWidth="2" strokeDasharray="6 6" />
      <circle cx="410" cy="252" r="6" fill="none" stroke={tint} strokeWidth="2" />
      {/* friendly squad */}
      {units.map(([x, y], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y + 6} rx="13" ry="6" fill="none" stroke={tint} strokeWidth="1.5" />
          <path d={`M${x} ${y - 14} l8 18 h-16z`} fill={`url(#${g("tint")})`} />
        </g>
      ))}
      {/* enemies */}
      {[
        [480, 300], [510, 286], [500, 318],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="7" fill="#ff5470" />
          <circle cx={x} cy={y} r="13" fill="none" stroke="#ff5470" strokeOpacity="0.35" />
        </g>
      ))}
    </g>
  );
}

function Combat({ tint, g }: P) {
  return (
    <g>
      <PerspectiveFloor tint={tint} horizon={270} />
      {/* arena ring */}
      <ellipse cx="320" cy="318" rx="210" ry="38" fill="none" stroke={tint} strokeOpacity="0.4" strokeWidth="2" />
      <ellipse cx="320" cy="318" rx="150" ry="26" fill="none" stroke={tint} strokeOpacity="0.2" />
      {/* slash arc */}
      <path
        d="M170 150 Q 330 60 470 210"
        fill="none"
        stroke={`url(#${g("tint")})`}
        strokeWidth="16"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path d="M190 160 Q 330 90 450 205" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      {/* hero silhouette */}
      <g fill="#0d1328" stroke={tint} strokeWidth="2">
        <circle cx="262" cy="176" r="16" />
        <path d="M250 194 L276 194 L290 250 L282 306 L268 306 L264 262 L254 306 L240 306 L238 250 Z" />
        <path d="M274 202 L330 168 L336 176 L282 214 Z" />
      </g>
      {/* enemy */}
      <g fill="#1a0f1f" stroke="#ff5470" strokeWidth="2">
        <circle cx="430" cy="196" r="15" />
        <path d="M416 212 L446 212 L456 262 L448 310 L436 310 L431 270 L424 310 L412 310 L406 262 Z" />
      </g>
      {/* hit sparks */}
      <g stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
        <line x1="420" y1="214" x2="398" y2="200" />
        <line x1="420" y1="214" x2="402" y2="228" />
        <line x1="420" y1="214" x2="410" y2="188" />
      </g>
      <circle cx="420" cy="214" r="10" fill={tint} opacity="0.6" />
      {/* combo HUD */}
      <g transform="translate(40 96)" fontFamily="monospace" fill={tint}>
        <text fontSize="13" letterSpacing="3">COMBO</text>
        <text y="34" fontSize="32" fontWeight="700" fill="#fff">x3</text>
        <rect y="46" width="120" height="5" rx="2" fill="#ffffff22" />
        <rect y="46" width="84" height="5" rx="2" fill={tint} />
      </g>
    </g>
  );
}

function Browser({ tint, g }: P) {
  // Wireframe terrain mesh
  const rows = 9;
  const cols = 14;
  const pts: [number, number][][] = [];
  for (let r = 0; r < rows; r++) {
    const row: [number, number][] = [];
    for (let c = 0; c < cols; c++) {
      const depth = r / (rows - 1);
      const width = 160 + depth * 260;
      const x = 320 - width + (c / (cols - 1)) * width * 2;
      const h = Math.sin(c * 0.7 + r * 0.9) * 14 * (0.4 + depth) + Math.cos(c * 0.33) * 10 * depth;
      const y = 200 + depth * 150 - h;
      row.push([x, y]);
    }
    pts.push(row);
  }
  const lines: string[] = [];
  pts.forEach((row) => lines.push(row.map(([x, y]) => `${x},${y}`).join(" ")));
  for (let c = 0; c < cols; c++) lines.push(pts.map((row) => `${row[c][0]},${row[c][1]}`).join(" "));
  return (
    <g>
      {/* browser chrome */}
      <rect x="60" y="40" width="520" height="330" rx="14" fill="#0b1124" stroke={tint} strokeOpacity="0.35" />
      <rect x="60" y="40" width="520" height="34" rx="14" fill="#121a33" />
      <rect x="60" y="60" width="520" height="14" fill="#121a33" />
      <circle cx="84" cy="57" r="5" fill="#ff5f57" />
      <circle cx="102" cy="57" r="5" fill="#febc2e" />
      <circle cx="120" cy="57" r="5" fill="#28c840" />
      <rect x="150" y="49" width="300" height="16" rx="8" fill="#0a1020" />
      <text x="164" y="61" fontSize="10" fill="#93a1b5" fontFamily="monospace">
        play.example/game
      </text>
      <g clipPath="none" fill="none" stroke={tint} strokeOpacity="0.55" strokeWidth="1">
        {lines.map((d, i) => (
          <polyline key={i} points={d} />
        ))}
      </g>
      {/* low-poly player orb */}
      <g>
        <ellipse cx="320" cy="262" rx="22" ry="6" fill="#000" opacity="0.45" />
        <path d="M320 196 l26 22 -8 32 h-36 l-8 -32z" fill={`url(#${g("tint")})`} />
        <path d="M320 196 l-26 22 26 8 26 -8z" fill="#fff" opacity="0.25" />
      </g>
      <g fontFamily="monospace" fontSize="11" fill={tint}>
        <text x="476" y="96">60 FPS</text>
        <text x="476" y="112" fill="#93a1b5">WebGL2</text>
      </g>
    </g>
  );
}

function Mobile({ tint, g }: P) {
  return (
    <g>
      <PerspectiveFloor tint={tint} horizon={300} />
      {/* phone */}
      <g transform="rotate(-8 320 210)">
        <rect x="228" y="34" width="184" height="340" rx="30" fill="#05070f" stroke={tint} strokeOpacity="0.6" strokeWidth="2" />
        <rect x="240" y="48" width="160" height="312" rx="20" fill="#0d1530" />
        <rect x="296" y="54" width="48" height="10" rx="5" fill="#05070f" />
        {/* lanes */}
        <g stroke={tint} strokeOpacity="0.25">
          <line x1="293" y1="80" x2="293" y2="340" />
          <line x1="347" y1="80" x2="347" y2="340" />
        </g>
        {/* obstacles & pickups */}
        <rect x="302" y="110" width="36" height="20" rx="5" fill="#ff5470" />
        <circle cx="266" cy="170" r="8" fill="#ffd166" />
        <circle cx="374" cy="200" r="8" fill="#ffd166" />
        {/* player */}
        <rect x="304" y="262" width="32" height="32" rx="9" fill={`url(#${g("tint")})`} />
        {/* score */}
        <text x="252" y="94" fontSize="12" fontFamily="monospace" fill="#fff">
          1240
        </text>
        {/* touch ripple */}
        <circle cx="350" cy="320" r="10" fill="#fff" opacity="0.7" />
        <circle cx="350" cy="320" r="20" fill="none" stroke="#fff" strokeOpacity="0.4" />
        <circle cx="350" cy="320" r="30" fill="none" stroke="#fff" strokeOpacity="0.2" />
      </g>
      {/* swipe hint */}
      <path d="M470 250 q 40 -10 70 -40" stroke={tint} strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="2 8" />
      <path d="M534 202 l8 6 -10 4" stroke={tint} strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  );
}

function Platformer({ tint, g }: P) {
  const tile = (x: number, y: number, w: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width={w} height="22" fill="#1a2547" stroke={tint} strokeOpacity="0.45" />
      <rect x={x} y={y} width={w} height="5" fill={tint} opacity="0.7" />
    </g>
  );
  return (
    <g>
      {/* parallax hills */}
      <path d="M0 290 Q 120 200 240 270 T 480 250 T 640 260 V400 H0Z" fill="#0e1631" />
      <path d="M0 320 Q 160 260 300 310 T 640 300 V400 H0Z" fill="#111c3d" />
      {tile(0, 340, 640)}
      {tile(90, 260, 110)}
      {tile(300, 210, 90)}
      {tile(470, 160, 120)}
      {/* coins */}
      {[
        [140, 230], [170, 230], [345, 180], [520, 130], [550, 130],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="8" fill="#ffd166" />
          <rect x={x - 1.5} y={y - 4} width="3" height="8" fill="#b8860b" />
        </g>
      ))}
      {/* jump trail */}
      <path d="M150 256 Q 220 120 300 206" fill="none" stroke={tint} strokeWidth="2.5" strokeDasharray="5 7" />
      {/* character mid-jump (squash & stretch) */}
      <g transform="translate(216 150) rotate(-10)">
        <rect width="28" height="34" rx="7" fill={`url(#${g("tint")})`} />
        <rect x="15" y="9" width="6" height="7" rx="2" fill="#0a1020" />
      </g>
      {/* goal flag */}
      <line x1="572" y1="160" x2="572" y2="96" stroke="#cfe7ff" strokeWidth="3" />
      <path d="M572 96 l34 10 -34 12z" fill="#ff6fd8" />
    </g>
  );
}
