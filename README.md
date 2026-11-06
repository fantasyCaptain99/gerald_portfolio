# Gerald Baldoza — Game Developer Portfolio

**Game Developer | Unity, UE, Threejs | 2D/3D Games**

An interactive portfolio built with Next.js (App Router), TypeScript, Tailwind CSS v4, Three.js / React Three Fiber, GSAP + ScrollTrigger, Motion, and Lenis.

Highlights:

- **Live 3D hero:** a procedural floating game world that responds to the pointer. Tap the crystal to trigger it.
- **Project case studies:** a statically generated page for each project at `/projects/[slug]`.
- **Contact form:** working, with validation on both client and server. It never pretends a message was sent.
- **Graceful fallbacks:** handles missing WebGL, reduced motion, keyboard-only use, and mobile.

---

## 1. Install & run locally

Requires **Node.js 20.9+** (developed on Node 22).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # TypeScript only
```

> `npm run dev` and `npm run build` use webpack (`--webpack`). On some Windows machines, Turbopack fails with `EBUSY: resource busy or locked` while it writes `.next/**/server-reference-manifest.json`. This is a file-lock conflict, usually with antivirus real-time scanning. The webpack builder avoids it and produces the same output, including on Vercel. To try Turbopack, run `npm run dev:turbo` or `npx next build`. If you want Turbopack on Windows, excluding the project folder from Defender real-time scanning usually fixes it.

---

## 2. Project structure

```
src/
  app/
    layout.tsx              Root layout: fonts, metadata, JSON-LD, providers, nav, footer
    page.tsx                Home page: section order
    template.tsx            Route transition (fade/lift)
    globals.css             Tailwind v4 theme tokens + design-system utilities
    projects/[slug]/page.tsx  Case-study pages (static)
    api/contact/route.ts    Contact form endpoint (Resend)
    sitemap.ts, robots.ts, opengraph-image.tsx, icon.svg, not-found.tsx
    fonts/                  Self-hosted Orbitron, Space Grotesk, Crimson Pro, JetBrains Mono (OFL)
  components/
    layout/                 Navbar, Footer, Monogram
    sections/               Hero, About, Projects, Experience, Process,
                            Collaboration, Contact
    three/                  HeroScene, SceneFallback, error boundary, lazy mount
    ui/                     SectionHeading, RevealWords, MagneticButton, ProjectCard,
                            ProjectMedia, ProjectArt, ContactForm, ...
    providers/MotionProvider.tsx   Lenis + GSAP ScrollTrigger + scroll-reveal system
  data/                     ← ALL editable content lives here
    profile.ts  projects.ts  experience.ts  social.ts  site.ts
  hooks/  lib/
public/
  images/  videos/  models/
```

**Motion system.** Any element with `data-reveal="up|fade|left|right|scale|word|line"` animates in when it scrolls into view. You can add an optional `data-reveal-delay="0.1"`. This lets static sections stay Server Components. GSAP handles scroll and timelines, and Motion handles hover and layout. The two libraries never animate the same element's transform. Everything respects `prefers-reduced-motion`.

---

## 3. Editing content

All copy is in `src/data/`. Components don't contain hard-coded content.

| File | What it controls |
|---|---|
| `profile.ts` | Name, headline, hero copy, About text, portrait path, toolkit |
| `projects.ts` | Every project card and case-study page |
| `experience.ts` | Experience timeline |
| `social.ts` | Email, GitHub, LinkedIn, Upwork, itch.io, demo links (`null` hides an entry) |
| `site.ts` | Nav items, process steps, trust pillars, contact project types |
| `components/layout/SiteLoader.tsx` → `COPY` | Loading-screen text ("LOADING_GAME DEVELOPMENT", status lines) |

### Replacing the draft projects

The six projects ship as **clearly marked drafts** (`verified: false`, status *"Details pending confirmation"*). They describe the types of work and the intended technical approach, not shipped products. For each real project:

1. Set `title`, `summary`, `concept`, `objectives`, `mechanics` and `challenges` to factual details.
2. Fill `role` with your actual responsibilities. While it's `null`, the page says it's pending.
3. Set `status` honestly: `"Concept" | "Prototype" | "In development" | "Released"`.
4. Set `verified: true`. This removes the transparency notes.
5. Add `links`, e.g. `[{ label: "Play demo", href: "https://..." }]`.
6. If you change the `slug`, the URL changes. The sitemap updates automatically.

To add a project, append an object to the `projects` array. Pick an `art` variant (`coop | rts | combat | browser | mobile | platformer`) to use as the fallback illustration.

---

## 4. Adding screenshots & gameplay video

1. Put images in `public/images/projects/<slug>/` (JPG, PNG or WebP; around 1920×1080 is ideal).
2. Reference them in `projects.ts`:

```ts
cover: { src: "/images/projects/multiplayer-coop-game/cover.jpg", alt: "Two players carrying a crate", width: 1920, height: 1080 },
gallery: [
  { src: "/images/projects/multiplayer-coop-game/01.jpg", alt: "Mission briefing UI", width: 1920, height: 1080 },
],
video: "/videos/multiplayer-coop-game.mp4",   // muted preview on card hover + player on the case-study page
```

Images are optimized automatically by `next/image` (AVIF/WebP, lazy-loaded, sized). Keep preview videos short (5–15 s), H.264 MP4, under about 8 MB. Once a `cover` is set, the "Concept visual" label disappears.

**Portrait:** add `public/images/portrait.jpg` and set `about.portrait: "/images/portrait.jpg"` in `profile.ts`.

---

## 5. Contact form setup

The form posts to `/api/contact`. Both client and server validate it, and the server also has a honeypot and a basic per-IP rate limit. Email is sent through [Resend](https://resend.com).

1. Create a Resend account, add and verify your domain, and create an API key.
2. Copy `.env.example` to `.env.local` and fill in:

```
RESEND_API_KEY=re_xxxxxxxx
CONTACT_TO_EMAIL=you@yourdomain.com
CONTACT_FROM_EMAIL="Portfolio <hello@yourdomain.com>"   # must be on your verified domain
```

For testing before your domain is verified, keep `CONTACT_FROM_EMAIL` set to `onboarding@resend.dev`. Resend will then only deliver to your own account email.

If the variables are missing, the API returns **503** and the visitor sees an honest *"not connected — your message was not sent"* message. If `social.email` is set, they also get a direct-email link. The form never shows a false success.

---

## 6. Push to GitHub

```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/<your-user>/<repo>.git
git push -u origin main
```

`.env*.local` and `.env` are git-ignored, so no secrets get committed.

## 7. Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repository. The framework is detected as **Next.js** automatically, so the default build settings are fine.
2. Under **Settings → Environment Variables**, add:
   - `NEXT_PUBLIC_SITE_URL`: your final URL, e.g. `https://geraldbaldoza.com`
   - `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`
3. Deploy. Every later push to `main` redeploys automatically.

## 8. Custom domain

In Vercel, go to **Settings → Domains** and add your domain. Then follow the DNS instructions: an `A` record to Vercel's IP, or a `CNAME` to `cname.vercel-dns.com`. Make sure `NEXT_PUBLIC_SITE_URL` matches the domain and redeploy. Canonical URLs, the sitemap, robots.txt and Open Graph tags all use it. Canonical tags are only emitted once this variable is set.

---

## Performance & accessibility notes

- Three.js and R3F are code-split. They load only on the client and only when WebGL is available.
- The hero canvas stops rendering when offscreen or when the tab is hidden. DPR is capped, and the hero lowers its DPR automatically if the frame rate drops. Geometries and materials are shared and disposed on unmount.
- Mobile gets fewer particles, no shadow maps and no MSAA.
- Without WebGL, a static illustration takes the canvas's place. If the 3D scene crashes, an error boundary contains it, so the rest of the site keeps working.
- There's a skip link, visible focus states, and keyboard-operable tabs and menu. The canvas has a text alternative.
- Lighthouse scores haven't been measured yet. Run Lighthouse on the deployed URL to get them.

## Fonts & licenses

Orbitron, Space Grotesk, Crimson Pro and JetBrains Mono are under the SIL Open Font License and are self-hosted from `src/app/fonts`. All illustrations and 3D scenes are original and procedural.
