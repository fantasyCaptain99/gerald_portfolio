/**
 * EXPERIENCE — practice areas / career timeline.
 *
 * ⚠️ No employment history has been invented. Each entry describes a
 * capability track. When you have real details, fill in `organization`,
 * `role`, `period`, and `contributions`, then set `verified: true`.
 * Unverified entries display a subtle "Details pending confirmation" tag.
 */
export interface ExperienceEntry {
  track: string;
  /** e.g. "Freelance", a studio name, or a client — leave null until confirmed. */
  organization: string | null;
  role: string | null;
  /** e.g. "2023 — Present" */
  period: string | null;
  summary: string;
  capabilities: string[];
  /** Concrete, verifiable contributions. Leave empty until confirmed. */
  contributions: string[];
  verified: boolean;
}

export const experience: ExperienceEntry[] = [
  {
    track: "Unity Game Development",
    organization: null,
    role: null,
    period: null,
    summary:
      "Building 2D and 3D gameplay in Unity with C# — from player controllers and physics interactions to UI and multiplayer systems.",
    capabilities: ["C# gameplay programming", "Physics systems", "Multiplayer mechanics", "2D & 3D pipelines"],
    contributions: [],
    verified: false,
  },
  {
    track: "Unreal Engine Development",
    organization: null,
    role: null,
    period: null,
    summary:
      "Developing 3D experiences in Unreal Engine using C++ and Blueprint, with a focus on combat, character control, and gameplay frameworks.",
    capabilities: ["C++ & Blueprint", "Combat systems", "Animation state logic", "Real-time rendering"],
    contributions: [],
    verified: false,
  },
  {
    track: "Web-Based 3D Experiences",
    organization: null,
    role: null,
    period: null,
    summary:
      "Creating browser games and interactive 3D interfaces with Three.js, React Three Fiber, and WebGL — fast to load, smooth to play.",
    capabilities: ["Three.js / R3F", "WebGL & GLSL", "Interactive cameras", "Browser performance"],
    contributions: [],
    verified: false,
  },
  {
    track: "Mobile Game Development",
    organization: null,
    role: null,
    period: null,
    summary:
      "Designing touch-first gameplay and interfaces for Android and iOS, with performance budgets suited to real devices.",
    capabilities: ["Touch controls", "Mobile UI", "Device profiling", "Store-ready builds"],
    contributions: [],
    verified: false,
  },
  {
    track: "Gameplay Systems & Prototyping",
    organization: null,
    role: null,
    period: null,
    summary:
      "Turning concepts into playable prototypes quickly, then hardening the systems that prove themselves into production-ready architecture.",
    capabilities: ["Rapid prototyping", "Enemy AI", "Game feel & feedback", "Technical architecture"],
    contributions: [],
    verified: false,
  },
];
