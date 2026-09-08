# Handoff: Samuel Winner Portfolio Website

## Overview
A three-page personal portfolio for Samuel Winner (Oluwasegun Samuel Folagbade), product designer and design engineer, 7+ years. Goal: land a senior/staff in-house role. Structure is home + case study pages, plus a drop-in image gallery.

Pages:
- `Home.dc.html` — hero, stats, 5 selected-work cards, process, about, side projects, gallery banner, writing, testimonials, contact
- `RunBeta Case Study.dc.html` — full case study for the featured project
- `Gallery.dc.html` — 12-tile image grid with captions

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes showing intended look and behavior, not production code to copy directly. The task is to **recreate these designs in the target codebase's existing environment** (React/Next.js, Astro, whatever is in play) using its established patterns, routing, and component conventions. If no codebase exists yet, Next.js + Tailwind is a good fit for this design: it is static content, three routes, no data layer.

Two mechanical notes about the source files:
- They are authored in a component runtime that loads a `support.js` shim and uses `<sc-if>` for conditionals. Treat those as authoring artifacts; in a real app the two `<sc-if>` blocks (Writing, Testimonials) become normal conditional renders driven by whether content exists.
- All styling is **inline** in the source. In the rebuild, move it into the codebase's normal styling layer (Tailwind classes, CSS modules, styled components). Do not ship 1,000 inline style attributes.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, radii, and shadow offsets are all specified below and in the source. Recreate pixel-faithfully. The only deliberately unfinished parts are content placeholders (see *Placeholders* below).

## Design Tokens

### Colors
| Token | Hex | Use |
|---|---|---|
| Pink ground | `#F0456F` | page background, accent bullets, "Featured" pill |
| Maroon ink | `#6B0F2C` | all body and display text, every border, every offset shadow, dark panels |
| Maroon deep | `#4E0A20` | shadow under maroon panels, link hover, button hover |
| Cream | `#FFF6EE` | card surfaces, nav bar, text on maroon |
| Butter | `#F7E5A0` | highlight cards, secondary pills, selection background |
| Rose | `#F6A8C4` | image-slot backing, tertiary pills, muted text on maroon |

Grid overlay on the page background (both axes):
```css
background-color: #F0456F;
background-image:
  repeating-linear-gradient(90deg, transparent 0 118px, rgba(107,15,44,.10) 118px 120px),
  repeating-linear-gradient(0deg,  transparent 0 118px, rgba(107,15,44,.10) 118px 120px);
```

Alpha variants used: `rgba(255,246,238,.35)` (empty-slot fill), `rgba(240,69,111,.10)` (inset sub-cards in the case study), `opacity:.6`/`.65` on de-emphasised meta text.

### Typography
Google Fonts: `Baloo 2` (600/700/800) for display, `Work Sans` (400/500/600/700 + italic 400) for text.

```
https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Work+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap
```

| Role | Font | Size | Weight | Line-height | Tracking |
|---|---|---|---|---|---|
| H1 hero | Baloo 2 | `clamp(42px, 8.2vw, 104px)` | 800 | .95 | -.02em |
| H1 case/gallery | Baloo 2 | `clamp(40px, 8vw, 96px)` | 800 | .96 | -.02em |
| Contact headline | Baloo 2 | `clamp(32px, 6vw, 74px)` | 800 | .98 | — |
| H2 section | Baloo 2 | `clamp(28px, 4.2vw, 52px)` (work: `clamp(30px,4.6vw,58px)`) | 800 | 1 | — |
| H3 featured card | Baloo 2 | `clamp(28px, 3.6vw, 46px)` | 800 | 1.02 | — |
| H3 work card | Baloo 2 | 26px | 800 | 1.05 | — |
| H3 side project | Baloo 2 | 23px | 800 | 1.08 | — |
| Stat number | Baloo 2 | 44px (case study: 36px) | 800 | 1 | — |
| Lead paragraph | Work Sans | `clamp(17px, 1.9vw, 21px)` | 400 | 1.5 | — |
| Body | Work Sans | 15–16px | 400 | 1.45–1.55 | — |
| Card meta / caption | Work Sans | 13–14px | 600 | 1.35–1.45 | — |
| Eyebrow (uppercase) | Work Sans | 12–13px | 700 | — | .14em–.18em |
| Pill label | Work Sans | 12–15px | 600/700 | — | — |

`text-wrap: pretty` on every long headline and lead paragraph.

### Spacing, radii, shadows
- Page gutter: `clamp(16px, 4vw, 48px)`. Content max-width: **1180px** (home, gallery), **1040px** (case study).
- Section bottom padding: `clamp(40px, 6vw, 72px)`; final section `clamp(48px, 7vw, 90px)`; hero top `clamp(40px, 8vw, 86px)`.
- Card padding: `clamp(18px, 2.4vw, 26px)` (small), `clamp(20px, 3vw, 34px)` (large), `clamp(22px, 3.4vw, 42px)` (panels).
- Radii: **999px** pills/buttons/nav, **28px** contact panel, **26px** large panels, **24px** cards, **20px** stat cards, **18px** process cards + contact tiles, **14–16px** image frames.
- Borders: **always** `2px solid #6B0F2C`. No 1px borders anywhere.
- Offset shadows (hard, no blur, the signature of the style):
  - pills: `4px 4px 0 #6B0F2C`
  - nav, buttons: `5px 5px 0 #6B0F2C` (maroon buttons: `5px 5px 0 #4E0A20`)
  - stat cards: `6px 6px 0`
  - work/side cards: `7px 7px 0`
  - large panels: `8px 8px 0` (maroon panels: `8px 8px 0 #4E0A20`)
- Playful rotations: `transform: rotate(-2deg)`, `rotate(-1.5deg)`, `rotate(1.5deg)` on selected pills only. Do not rotate cards.

### Grid patterns
Every multi-column block is `display:grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, Npx), 1fr)); gap: …` — so it collapses without media queries.
- Stats: N=190, gap 16
- Work cards: N=300, gap 22
- Process: N=200, gap 16
- About: N=290, gap 22
- Contact tiles: N=220, gap 16
- Gallery: `auto-fill`, N=280, gap 22; two tiles use `grid-column: span 2`

Sibling groups (pills, nav items, buttons, lists) use flex/grid + `gap`, never margins or whitespace.

## Screens / Views

### 1. Home
**Purpose:** convince a hiring manager in one scroll, then route to depth.

Sticky nav: `position:sticky; top:16px`, centred, cream pill, `5px 5px 0` shadow, `gap: clamp(8px,2vw,22px)`, wraps on narrow. Items: monogram `SW⚡` (Baloo 2 800/17px, the ⚡ in pink), Work, Process, About, Side projects, Gallery, then a maroon "Get in touch" pill button.

Sections in order:
1. **Hero** — two pills (name/title on butter, "Lagos, Nigeria · remote" on cream, rotated -2deg); H1 "Seven years turning unformed briefs into shipped products." at `max-width:16ch`; three capability pills (rose / cream rotated 1.5deg / butter); then a 2-up grid: 52ch lead paragraph + two buttons ("See the work" maroon, "Hire me" cream).
2. **Stats** — 4 cards: `7+` years; `3` design teams led; `4` countries (NG, UK, PT, US); `0→1` founding designer on three products. Last card is butter, others cream.
3. **Selected work** — heading row (H2 left, uppercase "Five projects, 2023 – 2026" right). One **featured card** (2-up: copy + 4:3 image slot) for RunBeta with two pills, 50ch summary, 3 bullets, and a maroon CTA linking to the case study. Then a 4-card grid: Visio, Governance Clout, Penaid SLA & PLA, Paying Friends — each 16:10 image slot, one role/year pill, summary, 2 bullets, and a bottom-pinned uppercase "Case study in progress" at `opacity:.65` (`margin-top:auto`, so cards align regardless of copy length).
4. **Process** — maroon panel, H2 in cream, rose sub-line, 5 numbered cards (01–05: Frame the brief, Research and map, Design the system, Specify for engineering, QA the build). Card 03 is butter, the rest cream.
5. **About** — 2-up: cream panel with three paragraphs + right column stacking a 1:1 portrait slot and a butter "Toolkit" card of 13 cream chips (Figma, FigJam, React, Next.js, React Native, Framer, Webflow, Bubble.io, Maze, Miro, Whimsical, Jira, Git).
6. **Side projects** — 3 cards: Framer Marketplace, Stellar / Soroban (links github.com/winnpxl), Banking studies.
7. **Gallery banner** — full-width butter card, whole card is the link to the gallery, hovers to cream.
8. **Writing** — 3 dashed empty slots (`2px dashed`, `rgba(255,246,238,.35)` fill). Conditional on content existing.
9. **Testimonials** — 2 dashed blockquote slots, quote in Baloo 2 700 `clamp(19px,2.2vw,25px)`. Conditional.
10. **Contact** — maroon panel: butter "Available now" pill with a pink dot, H1-scale headline "Let's build the version that actually ships.", rose availability paragraph, 4 cream tiles (Email, Phone +234 814 795 6593, GitHub winnpxl, LinkedIn) that hover to butter. Below the panel, a plain footer row: "Samuel Winner · Product designer & design engineer · Lagos, Nigeria" and "© 2026".

### 2. RunBeta Case Study
**Purpose:** show depth of thinking on the featured project.

Nav collapses to: "← All work", current-page label, Gallery, "Get in touch".

1. **Hero** — three pills (Founding Product Designer / 2026 to present / Two-sided marketplace); H1 "RunBeta: making strangers safe to transact with"; 58ch lead.
2. **Cover** — 16:9 image slot, `8px 8px 0` shadow.
3. **Facts** — 4 cards: Role, Surfaces, Team, and a butter "The hard part" card.
4. **Problem** — cream panel: eyebrow, H2 "Booking a plumber in Lagos is a trust problem, not a search problem", two paragraphs at 62ch.
5. **Four decisions** — H2 then 4 articles:
   - **01 Escrow + PIN handshake** — 2-up with a 4:3 image slot. Pink pill label.
   - **02 Provider information architecture** — a before/after pair: pink card "17" flat rows (text in cream), butter card "9" grouped entries. Numbers in Baloo 2 800/36px.
   - **03 Verification** — copy plus 3 inset sub-cards on `rgba(240,69,111,.10)`: Identity, Proof of work, Rejection states.
   - **04** — **maroon** card (cream text, butter pill): the 0 km default service radius defect.
6. **System & prototype** — 2-up: 4-bullet list + a 3:4 image slot.
7. **What the project taught me** — butter panel, single paragraph at 60ch.
8. **Next** — cream card with a "Back to work →" button.

### 3. Gallery
**Purpose:** a low-effort place to drop visual work without writing a case study.

Nav: "← Home", current label, Work, "Get in touch". Header: two pills ("Shots & studies", "Updated as I ship"), H1 "Gallery", 56ch lead. Then a 12-tile `auto-fill` grid: tiles 1 and 6 are 16:9 spanning 2 columns; the rest alternate 3:4, 1:1, and 4:3. Tile 3 is butter, tile 8 is rose (with a cream image backing), the rest cream. Each `<figure>` has a 14px padded frame, a bordered image slot, and a `<figcaption>` flex row: caption left, "Project, year" right at `opacity:.6`. Closing maroon CTA card links back to the case studies.

## Interactions & Behavior
Deliberately restrained. No scroll animations, no carousels, no parallax.
- **Nav:** sticky at `top:16px`, `z-index:40`, wraps rather than collapsing to a hamburger. Anchor links to `#work`, `#process`, `#about`, `#side`, `#contact`; cross-page links carry the hash (`Home.dc.html#work`).
- **Hover states** (all instant, no transition specified):
  - links `#6B0F2C` → `#4E0A20`
  - maroon buttons `#6B0F2C` → `#4E0A20`, text stays cream
  - cream buttons → butter `#F7E5A0`
  - contact tiles cream → butter (border matches fill)
  - gallery banner butter → cream
- **Image slots:** in the prototype these are a custom element that accepts a dropped file and persists it. In production they are plain `<img>` with `object-fit: cover` inside the bordered frame; the frames define the aspect ratios listed above.
- **Selection:** `::selection { background:#F7E5A0; color:#6B0F2C }`.
- **Responsive:** no media queries by design. Every grid uses `auto-fit`/`auto-fill` + `minmax(min(100%, Npx), 1fr)`, every type ramp uses `clamp()`, every pill row wraps. Verify at 360px, 768px, 1280px, 1600px.
- **Focus:** the prototype does not define focus rings. **Add them.** A `3px` `#6B0F2C` outline with `2px` offset on cream surfaces, and `#F7E5A0` on maroon surfaces, fits the system.

## State Management
Essentially none — this is static content. Two flags exist in the prototype and should map to "does content exist":
- `showWriting` (default true) — render the Writing section
- `showTestimonials` (default true) — render the Testimonials section
- `availabilityNote` (string) — the paragraph in the contact panel, so availability can change without a code edit

In a real build, drive these from content (MDX files, a CMS collection, or a typed `content.ts`) rather than booleans, and drop the section when its collection is empty. Work cards, process steps, side projects, toolkit chips, and gallery tiles should all become arrays mapped over — the prototype repeats them literally.

## Placeholders — must be filled before launch
1. **Email address** — contact tile says "Add your address", `href="mailto:hello@example.com"`.
2. **LinkedIn** — tile says "Add your handle", `href="https://linkedin.com"`.
3. **Writing** — three empty slots; needs title, one line, and a link each.
4. **Testimonials** — two empty slots; needs quote, name, role, company.
5. **All images** — hero/portrait, one per work card, four in the case study, twelve in the gallery.
6. **Four case study pages** — Visio, Governance Clout, Penaid, Paying Friends currently say "Case study in progress" and do not link anywhere. Build them on the RunBeta page's structure.

## Assets
No image assets are bundled — every image position is an empty slot. Fonts load from Google Fonts (self-host in production). `image-slot.js` is a prototyping helper for drag-and-drop placeholders; it has no production role and is included only so the HTML renders as designed.

## Files
| File | Contents |
|---|---|
| `Home.dc.html` | home page, all 10 sections |
| `RunBeta Case Study.dc.html` | featured case study |
| `Gallery.dc.html` | 12-tile image gallery |
| `image-slot.js` | prototype-only drag-and-drop image placeholder |

## Content note
All factual claims (roles, years, project descriptions, tools, the Mathematics degree from the University of Ilorin, the countries, the phone number) come from Samuel's resume. Do not rewrite the copy while porting — it was reviewed. Em dashes were deliberately removed from all prose; keep them out.
