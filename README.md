# Samuel Winner — Portfolio

Personal portfolio for Samuel Winner, product designer and design engineer.
Three routes: home, a featured case study, and an image gallery.

Built with Next.js (App Router), TypeScript and Tailwind CSS v4. Fully static —
every route prerenders at build time.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

| Script | What it does |
|---|---|
| `npm run dev` | Dev server on :3000 |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

## Structure

```
src/
  app/
    layout.tsx          root layout, fonts, metadata
    globals.css         design tokens + base layer
    page.tsx            home
    work/runbeta/       featured case study
    gallery/            image gallery
  components/
    Nav.tsx             sticky pill nav + the three variants
    Page.tsx            page shell and content column
    ui.tsx              Pill, Card, Panel, ButtonLink, BulletList, ImageFrame
  content/
    site.ts             home content
    runbeta.ts          case study content
    gallery.ts          gallery tiles
design-reference/       original HTML prototypes + the design handoff
```

Content lives in `src/content` as typed arrays, separate from layout. Adding a
work card, a toolkit chip, a process step or a gallery tile means editing an
array, not JSX.

## Design system

A neutral, type-led system in the vein of abatisamuel.pro and
ajanwachuku.work. Tokens live once in `src/app/globals.css` under `@theme`
and surface as Tailwind utilities (`bg-canvas`, `text-muted`, `shadow-tile`).

| Token | Hex | Use |
|---|---|---|
| `canvas` | `#f5f5f3` | page background |
| `surface` | `#ffffff` | white cards and tiles |
| `tile` / `tile-deep` | `#ebebe8` / `#e1e1dd` | neutral fills behind product shots |
| `tile-dark` | `#141413` | the dark tile, used sparingly |
| `ink` / `ink-soft` | `#111110` / `#3d3d3a` | headings / body |
| `muted` / `faint` | `#6f6f6a` / `#a6a6a1` | secondary text / placeholders |
| `line` | `#e3e3df` | hairline rows and pill borders |
| `live` | `#22c55e` | the one accent: the "available" dot |

Two rules carry the style. **The image is the card**: work and gallery
tiles are edge-to-edge product shots on a neutral fill with a 24px radius
and a caption beneath, never a bordered box with text inside. **Everything
else is a hairline row**: stats, process steps, side projects and contact
details sit on `border-line` rows with a muted label on the left.

Type is PP Mori throughout, self-hosted from `src/fonts`. With one face,
hierarchy comes from size and weight: display-scale text (the hero
statement, the contact headline) sits at regular, because at that size
weight adds nothing, while mid-size headings take semibold to hold their
place. There is no second display face.

Layout is responsive through `clamp()` type ramps and `auto-fit` grids, with
`sm`/`md` breakpoints only where a row genuinely stacks.

The earlier Passionfroot reference is kept at `design-reference/DESIGN.md`
for the record; it is no longer what the site follows.

## Filling in the placeholders

The design ships with deliberate gaps. Each is a content edit, not a layout one.

1. **Project images** — every project has its own folder in
   `public/images/work/<slug>/` (`runbeta`, `visio`, `governance-clout`, `penaid`,
   `gojaye`). Drop images in using the names below, as PNG, JPG or WebP,
   then point the matching `image` entry in `src/content/` at the file, for example
   `src: "/images/work/runbeta/hero.png"`. Until `src` is set, `ImageFrame` shows
   its placeholder note at the right shape, so a missing image never breaks a page.

   | File | Where it shows | Ratio | Export at |
   |---|---|---|---|
   | `thumbnail` | Home work grid, every project | 16:10 | 1600×1000 |
   | `hero` | Case study opening showcase | 16:9 | 2400×1350 |
   | `closing` | Case study closing composition | 16:9 | 2400×1350 |
   | `onboarding` | RunBeta, Onboarding | 16:10 | 2400×1500 |
   | `scheduled-vs-instant` | RunBeta, Scheduled vs Instant | 16:10 | 2400×1500 |
   | `book-with-ai` | RunBeta, Book with AI | 16:10 | 2400×1500 |
   | `active-booking` | RunBeta, Active booking | 16:10 | 2400×1500 |
   | `live-activities-ios`, `live-activities-android` | RunBeta, Live Activities | 4:5 | 1200×1500 |

   Jaye's chapter images go in `public/images/work/gojaye/` alongside its
   `thumbnail`, `hero` and `closing`:

   | File | Chapter | Ratio | Export at |
   |---|---|---|---|
   | `foundation` | Brand & foundation | 16:10 | 2400×1500 |
   | `affordability` | Affordability | 16:10 | 2400×1500 |
   | `driver-quality` | Driver quality | 16:10 | 2400×1500 |
   | `driver-business` | Driver business | 16:10 | 2400×1500 |
   | `mobility-services` | Mobility services | 16:10 | 2400×1500 |
   | `launch` | Launch | 16:10 | 2400×1500 |
2. **Writing and testimonials** — `writing` and `testimonials` in
   `src/content/site.ts` are empty arrays, so those two sections do not render.
   Add entries and they appear.
3. **The three remaining case studies** — Visio, Governance Clout and Penaid
   show an "under construction" toast when clicked. For each, add a
   content file shaped like `src/content/runbeta.ts`, a three-line page under
   `src/app/work/<slug>/` like `src/app/work/runbeta/page.tsx`, and give the entry
   in `work` an `href`.

## Shared game leaderboard

`/games/tetrix` and `/games/space-invaders` show one top ten that every
visitor sees, served by `src/app/api/scores/route.ts` from an Upstash Redis
database (one sorted set per game, trimmed to 100 entries). Each browser also
keeps its own history in `localStorage`, which is where "Your best" comes from.

Connect a database from the Vercel dashboard: Storage, then Upstash Redis.
The integration sets `KV_REST_API_URL` and `KV_REST_API_TOKEN` for the
project; `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` work too. To
run it locally, put the same pair in `.env.local`.

Without those variables the route reports `configured: false` and the pages
fall back to per-browser boards, which is what local development shows.

Scores are counted in the browser, so the route guards what it can: known
game, a score within a per-game cap, a cleaned 16-character name, and at most
12 saves a minute per address. Entries can be deleted in the Upstash console.

## Notes on the port

- The prototype's `<sc-if>` blocks became empty-array checks, which is what the
  handoff asked for: the section drops when its content collection is empty.
- The gallery's two wide tiles span two columns only once the grid actually has
  two columns. The prototype's unconditional `grid-column: span 2` forces an
  implicit second column at narrow widths and scrolls the page sideways
  (415px of content in a 360px viewport). This is the one intentional deviation.
- Focus rings use deep violet on light surfaces and pale violet inside the
  twilight bands.
- Prose is unchanged from the reviewed copy in `design-reference/README.md`.
