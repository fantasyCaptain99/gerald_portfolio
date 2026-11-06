/**
 * PROJECTS — centralized case-study data (8 projects).
 *   01–04  Unity & Unreal Engine (PC)
 *   05–06  Web browser games (Three.js)
 *   07–08  Mobile games
 *
 * To add or edit a project:
 *  1. Put media in /public/images/projects/<slug>/ and set `cover`
 *     (plus optional `gallery` and `video`, e.g. "/videos/<slug>.mp4").
 *  2. `role` = your actual responsibilities on the project.
 *  3. `objectives` and `challenges` are optional — sections hide when empty.
 *  4. `verified: false` shows a transparency note for draft entries.
 */

export type ProjectStatus =
  | "Details pending confirmation"
  | "Concept"
  | "Prototype"
  | "In development"
  | "Released";

/** Procedural concept-art variants used until real screenshots are supplied. */
export type ArtVariant = "coop" | "rts" | "combat" | "browser" | "mobile" | "platformer";

export interface MediaItem {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Project {
  slug: string;
  number: string;
  title: string;
  category: string;
  tags: string[];
  engine: string;
  platforms: string[];
  status: ProjectStatus;
  verified: boolean;
  summary: string;
  concept: string;
  /** Optional - section is hidden when empty. */
  objectives: string[];
  /** Your actual responsibilities. Leave null until confirmed. */
  role: string[] | null;
  stack: string[];
  mechanics: string[];
  /** Technical focus areas framed as challenge → approach. Optional - hidden when empty. */
  challenges: { challenge: string; approach: string }[];
  highlights: string[];
  art: ArtVariant;
  /** Accent hue for the card + detail page (CSS color). */
  tint: string;
  cover?: MediaItem;
  gallery?: MediaItem[];
  /** Optional muted looping preview, e.g. "/videos/coop-preview.mp4" */
  video?: string;
  links?: { label: string; href: string }[];
}

export const projects: Project[] = [
  // ------------------------------------------------------------------
  // 01–04 · Unity & Unreal Engine games
  // ------------------------------------------------------------------
  {
    slug: "moving-out-2",
    number: "01",
    title: "Moving Out 2",
    category: "Unity · Multiplayer · Physics",
    tags: ["Unity", "Multiplayer", "Physics"],
    engine: "Unity",
    platforms: ["PC (Steam)", "Consoles"],
    status: "Released",
    verified: true,
    summary:
      "A colorful 3D co-op moving simulation where up to four players haul furniture through physics-based obstacles and delivery missions.",
    concept:
      "A colorful 3D cooperative moving simulation where up to four players work together to transport furniture, overcome physics-based obstacles, and complete increasingly challenging delivery missions. Features local and online cross-platform multiplayer, interactive environments, character customization, and teamwork-driven gameplay.",
    objectives: [],
    role: ["Unity Multiplayer Game Developer / Gameplay Programmer"],
    stack: [
      "Unity",
      "C#",
      "Multiplayer Networking",
      "Co-op Gameplay",
      "Physics Interactions",
      "Cross-Platform Multiplayer",
      "Game Mechanics",
      "Controller Support",
      "Level Design",
    ],
    mechanics: [
      "Up to 4-player co-op",
      "Physics-based furniture carrying",
      "Local & online cross-platform multiplayer",
      "Interactive environments",
      "Character customization",
      "Delivery missions",
    ],
    challenges: [],
    highlights: ["Multiplayer Networking", "Physics Interactions", "Cross-Platform Multiplayer", "Co-op Gameplay", "Controller Support"],
    art: "coop",
    tint: "hsl(166 68% 69%)",
    cover: {
      src: "/images/projects/moving-out-2/cover.png",
      alt: "Top-down view of characters carrying furniture out of a colorful house into a moving truck",
      width: 1200,
      height: 675,
    },
    links: [{ label: "Steam Page", href: "https://store.steampowered.com/app/1641700/" }],
  },
  {
    slug: "thrive-heavy-lies-the-crown",
    number: "02",
    title: "Thrive: Heavy Lies The Crown",
    category: "Unity · RTS · City Building",
    tags: ["Unity", "RTS", "City Building"],
    engine: "Unity",
    platforms: ["PC (Steam)"],
    status: "Released",
    verified: true,
    summary:
      "A 3D medieval city-building and real-time strategy game combining kingdom management, resource production, and tactical warfare.",
    concept:
      "A 3D medieval city-building and real-time strategy game combining kingdom management, resource production, tactical warfare, and multiplayer cooperation. Players build settlements, command armies, expand territories, and make consequential leadership decisions while navigating dynamic economic and military challenges.",
    objectives: [],
    role: ["Unity Strategy Game Developer / RTS Gameplay Programmer"],
    stack: [
      "Unity",
      "C#",
      "RTS Game Systems",
      "AI & Pathfinding",
      "Resource Management",
      "City Building",
      "Unit Control",
      "Multiplayer Systems",
      "Game UI/UX",
    ],
    mechanics: [
      "Settlement building",
      "Resource production",
      "Army command & unit control",
      "Territory expansion",
      "Leadership decisions",
      "Multiplayer cooperation",
    ],
    challenges: [],
    highlights: ["RTS Game Systems", "AI & Pathfinding", "Resource Management", "City Building", "Multiplayer Systems"],
    art: "rts",
    tint: "hsl(38 92% 62%)",
    cover: {
      src: "/images/projects/thrive-heavy-lies-the-crown/cover.png",
      alt: "Medieval settlement with thatched houses, farms, roads and palisade walls below a mountain",
      width: 1490,
      height: 827,
    },
    links: [{ label: "Steam Page", href: "https://store.steampowered.com/app/1245250/" }],
  },
  {
    slug: "chained-wheels",
    number: "03",
    title: "Chained Wheels",
    category: "Unreal Engine 5 · Physics · Multiplayer",
    tags: ["Unreal Engine 5", "Physics", "Multiplayer"],
    engine: "Unreal Engine 5",
    platforms: ["PC (Steam)"],
    status: "Released",
    verified: true,
    summary:
      "A two-player co-op off-road driving adventure where both vehicles stay physically chained together.",
    concept:
      "A 3D cooperative driving adventure in which two players navigate challenging off-road environments while their vehicles remain physically connected by a chain. Features real-time multiplayer cooperation, vehicle physics, dynamic terrain challenges, environmental obstacles, and physics-based puzzles that require precise teamwork.",
    objectives: [],
    role: ["Unreal Engine Multiplayer Developer / Vehicle Physics Programmer"],
    stack: [
      "Unreal Engine 5",
      "C++ / Blueprints",
      "Multiplayer Networking",
      "Vehicle Physics",
      "Physics Constraints",
      "Co-op Mechanics",
      "3D Environments",
      "Collision Detection",
      "Gameplay Programming",
    ],
    mechanics: [
      "Two vehicles linked by a physical chain",
      "Real-time online co-op",
      "Off-road vehicle physics",
      "Dynamic terrain challenges",
      "Physics-based puzzles",
    ],
    challenges: [],
    highlights: ["Vehicle Physics", "Physics Constraints", "Multiplayer Networking", "Co-op Mechanics", "Collision Detection"],
    art: "coop",
    tint: "hsl(28 95% 60%)",
    cover: {
      src: "/images/projects/chained-wheels/cover.png",
      alt: "Two off-road vehicles connected by a chain crossing a wooden bridge in a desert canyon",
      width: 1490,
      height: 840,
    },
    links: [{ label: "Steam Page", href: "https://store.steampowered.com/app/4243690/" }],
  },
  {
    slug: "age-of-darkness-final-stand",
    number: "04",
    title: "Age of Darkness: Final Stand",
    category: "Unreal Engine · RTS · Tower Defense",
    tags: ["Unreal Engine", "RTS", "Tower Defense"],
    engine: "Unreal Engine",
    platforms: ["PC (Steam)"],
    status: "Released",
    verified: true,
    summary:
      "A dark fantasy survival RTS about defending fortified settlements against overwhelming, large-scale waves of enemies.",
    concept:
      "A dark fantasy real-time strategy game focused on large-scale enemy battles, tactical unit management, resource gathering, and base defense. Players establish fortified settlements, command armies, and survive overwhelming waves of enemies through dynamic combat systems and strategic planning. Features single-player campaigns and online cooperative gameplay.",
    objectives: [],
    role: ["Unreal Engine Gameplay Developer / RTS Systems Programmer"],
    stack: [
      "Unreal Engine",
      "C++ / Blueprints",
      "RTS Gameplay",
      "Enemy AI",
      "Pathfinding",
      "Large-Scale Combat",
      "Base Building",
      "Resource Systems",
      "Performance Optimization",
    ],
    mechanics: [
      "Large-scale enemy waves",
      "Tactical unit management",
      "Base building & fortification",
      "Resource gathering",
      "Single-player campaign",
      "Online co-op",
    ],
    challenges: [],
    highlights: ["Large-Scale Combat", "Enemy AI", "Pathfinding", "Base Building", "Performance Optimization"],
    art: "combat",
    tint: "hsl(170 80% 55%)",
    cover: {
      src: "/images/projects/age-of-darkness-final-stand/cover.png",
      alt: "Night battle: a fortified torch-lit settlement surrounded by hordes of glowing enemies",
      width: 1493,
      height: 839,
    },
    links: [{ label: "Steam Page", href: "https://store.steampowered.com/app/1426450/" }],
  },
  // ------------------------------------------------------------------
  // 05–06 · Web browser games
  // ------------------------------------------------------------------
  {
    slug: "omega-mmorpg",
    number: "05",
    title: "OMEGA",
    category: "Web Game · Three.js · MMORPG",
    tags: ["Web Game", "Three.js", "MMORPG"],
    engine: "Three.js",
    platforms: ["Browser"],
    status: "Released",
    verified: true,
    summary:
      "A browser-based 3D sci-fi MMORPG with real-time multiplayer combat, cooperative missions, character classes, and PvP arenas.",
    concept:
      "A browser-based 3D sci-fi MMORPG featuring real-time multiplayer combat, cooperative missions, character classes, and immersive first-person exploration. Players can customize weapons and equipment, battle enemies, participate in PvP arenas, and complete challenging raids. Built with Three.js and WebGL to deliver interactive 3D gameplay directly in modern browsers without installation.",
    objectives: [],
    role: ["Multiplayer Web Game Developer / Gameplay Programmer"],
    stack: [
      "Three.js",
      "JavaScript",
      "WebGL",
      "3D Game Development",
      "Multiplayer Networking",
      "FPS Mechanics",
      "Combat Systems",
      "Character Animation",
      "Game UI/UX",
      "Performance Optimization",
    ],
    mechanics: [
      "Real-time multiplayer combat",
      "Cooperative missions & raids",
      "Character classes",
      "Weapon & equipment customization",
      "PvP arenas",
      "First-person exploration",
    ],
    challenges: [],
    highlights: ["Multiplayer Networking", "Combat Systems", "FPS Mechanics", "Character Animation", "Game UI/UX"],
    art: "combat",
    tint: "hsl(90 70% 60%)",
    cover: {
      src: "/images/projects/omega-mmorpg/cover.png",
      alt: "Third-person combat in a desert sci-fi city with allied players and an ability bar",
      width: 1490,
      height: 840,
    },
    // Add a "Play Live Game" link here once you have the public URL.
  },
  {
    slug: "slow-roads",
    number: "06",
    title: "Slow Roads",
    category: "Web Game · Three.js · Simulation",
    tags: ["Web Game", "Three.js", "Simulation"],
    engine: "Three.js",
    platforms: ["Browser"],
    status: "Released",
    verified: true,
    summary:
      "An immersive browser-based driving simulator with endless procedurally generated roads, dynamic terrain, and atmospheric landscapes.",
    concept:
      "An immersive browser-based driving simulator featuring endless procedurally generated roads, dynamic terrain, realistic vehicle handling, and atmospheric landscapes. Designed for smooth real-time 3D rendering, responsive controls, and an enjoyable driving experience directly in the browser without installation.",
    objectives: [],
    role: ["3D Web Game Developer / Graphics Programmer"],
    stack: [
      "Three.js",
      "JavaScript",
      "WebGL",
      "Procedural Generation",
      "3D Graphics",
      "Vehicle Physics",
      "Shaders",
      "Performance Optimization",
    ],
    mechanics: [
      "Endless procedurally generated roads",
      "Dynamic terrain",
      "Vehicle handling",
      "Atmospheric landscapes",
      "Responsive in-browser controls",
    ],
    challenges: [],
    highlights: ["Procedural Generation", "Vehicle Physics", "Shaders", "WebGL", "Performance Optimization"],
    art: "browser",
    tint: "hsl(200 90% 66%)",
    cover: {
      src: "/images/projects/slow-roads/cover.png",
      alt: "Third-person view of a white car on a winding road through green hills",
      width: 1492,
      height: 840,
    },
    links: [{ label: "Play Live Game", href: "https://slowroads.io" }],
  },
  // ------------------------------------------------------------------
  // 07–08 · Mobile games
  // ------------------------------------------------------------------
  {
    slug: "battle-of-polytopia",
    number: "07",
    title: "The Battle of Polytopia",
    category: "Mobile Game · Unity · Turn-Based Strategy",
    tags: ["Mobile Game", "Unity", "Turn-Based Strategy"],
    engine: "Unity",
    platforms: ["iOS", "Android"],
    status: "Released",
    verified: true,
    summary:
      "A turn-based civilization strategy game combining city building, tactical battles, territory expansion, and technology research.",
    concept:
      "A mobile strategy game combining civilization building, tactical battles, territory expansion, and technology research. Features procedurally generated maps, strategic AI opponents, resource management, and single-player and multiplayer gameplay, with a polished low-poly visual style and intuitive touch controls.",
    objectives: [],
    role: ["Unity Game Developer / Strategy Gameplay Programmer"],
    stack: [
      "Unity",
      "C#",
      "Turn-Based Combat",
      "Strategy Game AI",
      "Procedural Map Generation",
      "Game State Management",
      "Multiplayer Systems",
      "Mobile Optimization",
      "UI/UX",
    ],
    mechanics: [
      "Civilization building",
      "Tactical turn-based battles",
      "Territory expansion",
      "Technology research",
      "Procedurally generated maps",
      "Single-player & multiplayer",
    ],
    challenges: [],
    highlights: ["Strategy Game AI", "Procedural Map Generation", "Turn-Based Combat", "Multiplayer Systems", "Mobile Optimization"],
    art: "rts",
    tint: "hsl(195 85% 60%)",
    cover: {
      src: "/images/projects/battle-of-polytopia/cover.png",
      alt: "Isometric low-poly map with cities, units, coastlines and varied terrain",
      width: 1488,
      height: 820,
    },
    links: [{ label: "View on App Store", href: "https://apps.apple.com/app/id1006393168" }],
  },
  {
    slug: "merge-archers",
    number: "08",
    title: "Merge Archers",
    category: "Mobile Game · 3D Archery · Casual Strategy",
    tags: ["Mobile Game", "3D Archery", "Casual Strategy"],
    // Engine not independently confirmed — replace with e.g. "Unity" once verified.
    engine: "To be confirmed",
    platforms: ["iOS", "Android"],
    status: "Released",
    verified: true,
    summary:
      "A casual 3D archery and castle-defense game with physics-based shooting, turn-based castle battles, and archer merging.",
    concept:
      "A casual 3D mobile strategy game combining physics-based archery, turn-based castle battles, and character merging mechanics. Players aim and launch arrows at enemy fortresses, upgrade their archer squads, unlock powerful weapons, and complete increasingly challenging levels through tactical gameplay.",
    objectives: [],
    role: ["Mobile Gameplay Programmer / Combat Systems Developer"],
    stack: [
      "3D Mobile Game Development",
      "Projectile Physics",
      "Turn-Based Combat",
      "Character Progression",
      "Touch Controls",
      "Level Design",
      "Mobile Performance",
      "Gameplay UI",
    ],
    mechanics: [
      "Physics-based archery",
      "Turn-based castle battles",
      "Archer merging & upgrades",
      "Weapon unlocks",
      "Progressive level challenges",
    ],
    challenges: [],
    highlights: ["Projectile Physics", "Turn-Based Combat", "Character Progression", "Touch Controls"],
    art: "mobile",
    tint: "hsl(10 90% 64%)",
    cover: {
      src: "/images/projects/merge-archers/cover.png",
      alt: "Stickman archers firing volleys of arrows between two castles",
      width: 699,
      height: 370,
    },
    links: [{ label: "View on App Store", href: "https://apps.apple.com/app/id1628121089" }],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string): Project {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}
