/** Navigation, process and collaboration copy. */

export const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

export type NavId = (typeof navItems)[number]["id"];

export const processSteps = [
  {
    n: "01",
    title: "Discover",
    body: "Understand the game concept, player experience, technical requirements, and project goals.",
    output: "Scope · risks · platform targets",
  },
  {
    n: "02",
    title: "Prototype",
    body: "Build the core mechanics and validate the gameplay loop through early playable versions.",
    output: "Playable core loop",
  },
  {
    n: "03",
    title: "Develop",
    body: "Implement gameplay systems, environments, interfaces, and platform-specific requirements.",
    output: "Feature-complete builds",
  },
  {
    n: "04",
    title: "Refine",
    body: "Improve responsiveness, polish visuals, test performance, and resolve gameplay issues.",
    output: "Polished, profiled build",
  },
  {
    n: "05",
    title: "Deliver",
    body: "Prepare stable builds, documentation, and handoff or launch support as appropriate.",
    output: "Stable build · docs · handoff",
  },
] as const;

export const trustPillars = [
  { title: "Documented projects", body: "Each project page explains the concept, the stack, and the technical approach." },
  { title: "Real-time proof", body: "The 3D scene at the top of this page is rendered live in your browser with Three.js." },
  { title: "Clear capabilities", body: "Unity, Unreal Engine, and Three.js — with the trade-offs of each explained." },
  { title: "Transparent status", body: "Every project shows its real development status. Nothing is overstated." },
  { title: "Disciplined process", body: "A five-stage workflow from first prototype to stable, documented builds." },
  { title: "Implementation quality", body: "This site itself is built with the same real-time stack offered to clients." },
] as const;

/** Partner resources — each routes to the contact form preset to "Investment / Partnership". */
export const partnerResources = [
  { title: "Pitch deck", body: "Concept, market, and production approach for a specific project." },
  { title: "Development roadmap", body: "Milestones from prototype to launch, with scope per phase." },
  { title: "Production budget", body: "Effort and cost breakdown aligned to the roadmap." },
  { title: "Playable demo", body: "Hands-on build access for evaluation." },
] as const;

export const projectTypes = [
  "Unity Game Development",
  "Unreal Engine Development",
  "Three.js / WebGL",
  "Mobile Game",
  "Multiplayer Game",
  "Game Prototype / MVP",
  "Investment / Partnership",
  "Other",
] as const;
