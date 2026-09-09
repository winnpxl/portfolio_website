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

Type is PP Mori for nearly everything, including the big hero statement at
regular weight and tight tracking. PP Palma is reserved for the name lockup
and section headings. Both are self-hosted from `src/fonts`.

Layout is responsive through `clamp()` type ramps and `auto-fit` grids, with
`sm`/`md` breakpoints only where a row genuinely stacks.

The earlier Passionfroot reference is kept at `design-reference/DESIGN.md`
for the record; it is no longer what the site follows.

## Filling in the placeholders

The design ships with deliberate gaps. Each is a content edit, not a layout one.

1. **Images** — `ImageFrame` renders its placeholder note until a `src` is set.
   Drop a file in `public/images/` and add `src` to the matching `image` entry in
   `src/content/`. The frame already fixes the aspect ratio.
2. **Email and LinkedIn** — `contact.tiles` in `src/content/site.ts`, both marked
   with `TODO`.
3. **Writing and testimonials** — `writing` and `testimonials` in
   `src/content/site.ts` are empty arrays, so those two sections do not render.
   Add entries and they appear.
4. **The four remaining case studies** — Visio, Governance Clout, Penaid and
   Paying Friends show "Case study in progress". Build them on
   `src/app/work/runbeta/page.tsx`, add a route under `src/app/work/<slug>/`,
   and give the entry in `work` an `href`.

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
