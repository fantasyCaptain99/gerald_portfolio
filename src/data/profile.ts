/**
 * PROFILE — core identity and copy used across the site.
 * Edit freely; components read everything from here.
 */
export const profile = {
  name: "Gerald Baldoza",
  firstName: "Gerald",
  monogram: "GB",
  headline: "Game Developer | Unity, UE, Threejs | 2D/3D Games",
  identity: "Independent game developer specializing in cross-platform 2D and 3D game experiences.",
  positioning:
    "I develop interactive 2D/3D games, from gameplay prototypes and technical systems to polished player experiences across PC, mobile, and the web.",

  hero: {
    kicker: "Hello, I'm Gerald Baldoza",
    titleLines: ["Building worlds.", "Crafting gameplay."],
    description:
      "I develop immersive 2D and 3D games across PC, mobile, and the web—combining gameplay engineering, real-time graphics, and intuitive player experiences.",
    highlights: ["UNITY", "UNREAL ENGINE", "THREE.JS", "PC · MOBILE · WEB"],
    primaryCta: { label: "Explore My Projects", href: "#projects" },
    secondaryCta: { label: "Let's Collaborate", href: "#contact" },
  },

  about: {
    label: "01 / About",
    ghost: "ABOUT",
    title: "Engineering experiences players remember.",
    description:
      "I'm Gerald Baldoza, a game developer working across Unity, Unreal Engine, and web-based 3D technologies. I focus on building responsive gameplay systems, interactive environments, and engaging game experiences for PC, mobile, and browser platforms.",
    /**
     * Portrait image in /public/images (square or 4:5 works best).
     * While null, a designed placeholder frame is shown (no generated likeness).
     */
    portrait: "/images/portrait.png" as string | null,
    principles: [
      {
        title: "Gameplay-first development",
        body: "Every system starts from how it feels in the player's hands — input, feedback, and pacing come before polish.",
      },
      {
        title: "Technical problem-solving",
        body: "Breaking complex features into testable systems, and choosing the simplest architecture that holds up at scale.",
      },
      {
        title: "Real-time 3D engineering",
        body: "Scenes, cameras, lighting, and shaders built to look good while holding a stable frame rate.",
      },
      {
        title: "Cross-platform implementation",
        body: "Planning input, UI, and performance budgets for PC, mobile, and browser targets from day one.",
      },
      {
        title: "Iterative prototyping",
        body: "Getting a playable build in front of people early, then refining the core loop based on what actually happens.",
      },
      {
        title: "Collaborative development",
        body: "Clear communication, readable code, and documentation that lets designers, artists, and engineers move together.",
      },
    ],
  },
} as const;

/** Technology groups — capabilities, shown as a toolkit (no invented proficiency percentages). */
export const toolkit = [
  { group: "Game Engines", items: ["Unity", "Unreal Engine", "Three.js"] },
  { group: "Programming", items: ["C#", "C++", "JavaScript", "TypeScript", "Blueprint Visual Scripting"] },
  { group: "Web-Based 3D", items: ["Three.js", "React Three Fiber", "WebGL", "GLSL"] },
  { group: "Platforms", items: ["Windows / PC", "Steam-oriented builds", "Browser", "Android", "iOS"] },
  {
    group: "Gameplay Systems",
    items: ["Multiplayer & co-op", "Physics-based gameplay", "Combat & enemy AI", "Game UI/UX", "Performance optimization"],
  },
] as const;
