import { Fragment } from "react";

import type { Block, Callout, CaseStudy, Chapter, Visual } from "@/content/case-study";
import { profile, work } from "@/content/site";

import { Reveal, SplitText, WorkMorph } from "./motion";
import { Nav } from "./Nav";
import { caseStudyNav, socials } from "./navItems";
import { PageShell, Section } from "./Page";
import {
  BulletList,
  ButtonLink,
  Eyebrow,
  ImageFrame,
  LiveDot,
  Pill,
  buttonClass,
  cx,
  type Ratio,
} from "./ui";

/* ------------------------------------------------------------ helpers */

/** Renders **bold** spans, the only markup the content files use. */
function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split("**").map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-ink">
            {part}
          </strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

/** Hollow dot for designed-but-not-shipped work; the live dot is its filled sibling. */
function ProgressDot() {
  return (
    <span aria-hidden className="inline-block h-[7px] w-[7px] shrink-0 rounded-full border-[1.5px] border-current" />
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cx("shrink-0", className)}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

/** The corner chip, matching the year chip on the work thumbnails. */
const cornerChip =
  "absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-surface/85 px-3 py-[7px] text-[13px] leading-none tracking-[-0.005em] text-ink-soft shadow-tile backdrop-blur-sm";

/* ------------------------------------------------------------ visuals */

/** Compositions are 16:9 and screen sequences 16:10, the shapes the exports come in, so nothing crops. */
const ratioFor: Record<"showcase" | "flow" | "feature" | "timeline", Ratio> = {
  showcase: "16/9",
  flow: "16/10",
  feature: "16/10",
  timeline: "16/10",
};

function Figure({
  visual,
  inProgress,
  priority,
}: {
  visual: Visual;
  inProgress?: boolean;
  priority?: boolean;
}) {
  const chip = inProgress && (
    <span className={cornerChip}>
      <ProgressDot />
      Work in progress
    </span>
  );
  const caption = visual.caption && (
    <figcaption className="mt-4 text-[15px] font-medium tracking-[-0.01em] text-ink">
      {visual.caption}
    </figcaption>
  );

  if (visual.kind === "devices") {
    // Once any device has its image, show only the ones that do: a finished
    // mockup beside an empty frame reads as broken. The rest join as they land,
    // and a lone device keeps the size it would have in a pair.
    const ready = visual.items.filter((item) => item.image.src);
    const items = ready.length > 0 ? ready : visual.items;
    return (
      <figure className="m-0">
        <div
          className={cx(
            "grid gap-4",
            items.length > 1 ? "sm:grid-cols-2" : "mx-auto sm:max-w-[calc(50%-0.5rem)]",
          )}
        >
          {items.map((item) => (
            <div key={item.label}>
              <div className="relative">
                {chip}
                <ImageFrame
                  slot={item.image}
                  ratio="4/5"
                  fill="tile"
                  radius={24}
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </div>
              <div className="mt-3 text-[14px] text-muted">{item.label}</div>
            </div>
          ))}
        </div>
        {caption}
      </figure>
    );
  }

  return (
    <figure className="m-0">
      <div className="relative">
        {chip}
        {/* Product compositions sit on dark, so the page opens and closes on it. */}
        <ImageFrame
          slot={visual.image}
          ratio={ratioFor[visual.kind]}
          fill={visual.kind === "showcase" ? "dark" : "tile"}
          radius={28}
          priority={priority}
          sizes="(max-width: 1280px) 100vw, 1140px"
        />
      </div>
      {caption}
    </figure>
  );
}

/* ------------------------------------------------------------- blocks */

function CalloutCard({ callout, className }: { callout: Callout; className?: string }) {
  return (
    <div className={cx("rounded-[24px] bg-surface p-6 shadow-tile", className)}>
      <Eyebrow>{callout.label}</Eyebrow>
      {callout.lines && (
        <div className="mt-4 grid gap-3">
          {callout.lines.map((line) => {
            // A line that is bold from end to end is the point of the callout.
            const whole = /^\*\*(.+)\*\*$/.exec(line);
            return whole ? (
              <p
                key={line}
                className="m-0 text-[clamp(19px,1.8vw,22px)] font-semibold leading-[1.3] tracking-[-0.015em] text-ink"
              >
                {whole[1]}
              </p>
            ) : (
              <p key={line} className="m-0 text-[15px] leading-[1.55] text-ink-soft">
                <Inline text={line} />
              </p>
            );
          })}
        </div>
      )}
      {callout.items && <BulletList items={callout.items} className="mt-4" />}
    </div>
  );
}

function Steps({ label, items, aside }: { label: string; items: string[]; aside?: Callout }) {
  const last = items.length - 1;
  return (
    <div className={cx("grid items-start gap-8", aside && "md:grid-cols-[minmax(0,1fr)_minmax(0,17rem)]")}>
      <div>
        <Eyebrow className="mb-5">{label}</Eyebrow>
        <ol className="m-0 list-none p-0">
          {items.map((step, i) => (
            <li key={step} className="relative flex items-start gap-4 pb-4 last:pb-0">
              {/* The hairline tone vanishes over a 16px run, so the connector is one shade darker. */}
              {i < last && (
                <span aria-hidden className="absolute bottom-0 left-[13.5px] top-7 w-px bg-faint/40" />
              )}
              <span className="relative grid h-7 w-7 shrink-0 place-items-center rounded-full bg-surface text-[12px] font-medium tabular-nums text-muted shadow-tile">
                {i + 1}
              </span>
              <span
                className={cx(
                  "pt-[3px] text-[16px] leading-[1.45] tracking-[-0.01em]",
                  i === last ? "font-semibold text-ink" : "text-ink-soft",
                )}
              >
                {step}
              </span>
            </li>
          ))}
        </ol>
      </div>
      {aside && <CalloutCard callout={aside} />}
    </div>
  );
}

const bodyText =
  "m-0 max-w-[62ch] text-[clamp(16px,1.3vw,18px)] leading-[1.65] tracking-[-0.01em] text-ink-soft";

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "text":
      return (
        <p className={bodyText}>
          <Inline text={block.body} />
        </p>
      );
    case "emphasis":
      return (
        <p className="text-pretty-wrap m-0 max-w-[40ch] text-[clamp(19px,1.8vw,23px)] font-semibold leading-[1.35] tracking-[-0.015em] text-ink">
          {block.body}
        </p>
      );
    case "chips":
      return (
        <div>
          {block.label && <p className={cx(bodyText, "mb-4")}>{block.label}</p>}
          <div className="flex flex-wrap gap-2">
            {block.items.map((item) => (
              <Pill key={item} className="px-[14px] py-[8px] text-[14px]">
                {item}
              </Pill>
            ))}
          </div>
        </div>
      );
    case "cards":
      return (
        <div className={cx("grid gap-4", block.items.length === 3 ? "md:grid-cols-3" : "sm:grid-cols-2")}>
          {block.items.map((card) => (
            <div key={card.title} className="rounded-[24px] bg-surface p-6 shadow-tile">
              <div className="text-[17px] font-semibold tracking-[-0.01em] text-ink">{card.title}</div>
              <p className="m-0 mt-2 text-[15px] leading-[1.55] text-muted">
                <Inline text={card.body} />
              </p>
            </div>
          ))}
        </div>
      );
    case "quotes":
      return (
        <div>
          {block.label && <Eyebrow className="mb-5">{block.label}</Eyebrow>}
          <div className="grid gap-4 sm:grid-cols-2">
            {block.items.map((quote, i) => {
              const replaced = block.contrast && i === 0;
              return (
                <figure key={quote.body} className="m-0 flex flex-col">
                  <figcaption className="text-[14px] text-muted">{quote.lead}</figcaption>
                  <blockquote
                    className={cx(
                      "m-0 mt-3 flex-1 rounded-[24px] p-6 text-[clamp(18px,1.7vw,21px)] leading-[1.4] tracking-[-0.012em]",
                      replaced ? "text-muted ring-1 ring-inset ring-line" : "bg-surface text-ink shadow-tile",
                    )}
                  >
                    {quote.body}
                  </blockquote>
                </figure>
              );
            })}
          </div>
        </div>
      );
    case "steps":
      return <Steps label={block.label} items={block.items} aside={block.aside} />;
    case "callout":
      return <CalloutCard callout={block.callout} className="max-w-[34rem]" />;
    case "chain":
      return (
        <ul className="m-0 max-w-[40rem] list-none border-t border-line p-0">
          {block.items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 border-b border-line py-4 text-[clamp(16px,1.4vw,18px)] leading-[1.45] tracking-[-0.01em] text-ink"
            >
              <ArrowRight className="mt-[5px] text-faint" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "takeaway":
      return (
        <div className="rounded-[28px] bg-surface p-7 shadow-tile sm:p-9">
          <Eyebrow>Key takeaway</Eyebrow>
          <p className="text-pretty-wrap m-0 mt-4 max-w-[34ch] text-[clamp(21px,2.4vw,30px)] font-normal leading-[1.28] tracking-[-0.018em] text-ink">
            {block.body}
          </p>
        </div>
      );
    case "closing":
      return (
        <p className="text-pretty-wrap m-0 max-w-[30ch] border-t border-line pt-8 text-[clamp(24px,3vw,38px)] font-normal leading-[1.22] tracking-[-0.022em] text-ink">
          {block.body}
        </p>
      );
    case "note":
      return (
        <p className="m-0 flex items-center gap-2 text-[14px] text-muted">
          <ProgressDot />
          {block.body}
        </p>
      );
    case "visual":
      // Visuals break out to full width; the chapter places them.
      return null;
  }
}

/** Paragraphs sit close together; anything structured gets more room. */
const tight = new Set<Block["type"]>(["text", "emphasis", "note"]);
function gapBefore(prev: Block | undefined, block: Block) {
  if (!prev) return undefined;
  return tight.has(prev.type) && tight.has(block.type) ? "mt-5" : "mt-10";
}

/* ----------------------------------------------------------- chapters */

type Segment = { kind: "copy"; blocks: Block[] } | { kind: "visual"; visual: Visual };

/** Runs of copy stay in the reading column; each visual becomes its own full-width row. */
function segment(blocks: Block[]): Segment[] {
  const out: Segment[] = [];
  for (const block of blocks) {
    if (block.type === "visual") {
      out.push({ kind: "visual", visual: block.visual });
      continue;
    }
    const tail = out.at(-1);
    if (tail?.kind === "copy") tail.blocks.push(block);
    else out.push({ kind: "copy", blocks: [block] });
  }
  return out;
}

function ChapterSection({ chapter, number }: { chapter: Chapter; number: string }) {
  const segments = segment(chapter.blocks);
  const headed = segments.findIndex((s) => s.kind === "copy");

  return (
    <Section id={chapter.id}>
      <div className="grid gap-x-12 gap-y-8 border-t border-line py-[clamp(56px,8vw,112px)] lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
        <div className="flex flex-wrap items-center gap-3 lg:flex-col lg:items-start">
          <span className="text-[13px] font-medium tabular-nums text-faint">{number}</span>
          <span className="text-[13px] font-medium text-ink">{chapter.label}</span>
          {chapter.inProgress && (
            <Pill tone="ghost">
              <ProgressDot />
              Work in progress
            </Pill>
          )}
        </div>

        {segments.map((seg, i) =>
          seg.kind === "visual" ? (
            <div key={i} className="lg:col-span-2">
              <Figure visual={seg.visual} inProgress={chapter.inProgress} />
            </div>
          ) : (
            <div key={i} className="lg:col-start-2">
              {i === headed &&
                (chapter.title ? (
                  <SplitText
                    as="h2"
                    text={chapter.title}
                    className="text-pretty-wrap m-0 mb-8 block max-w-[24ch] text-[clamp(28px,3.6vw,44px)] font-normal leading-[1.12] tracking-[-0.022em]"
                  />
                ) : (
                  // No headline of its own: the rail label is its name, kept for screen readers too.
                  <h2 className="sr-only">{chapter.label}</h2>
                ))}
              {seg.blocks.map((block, j) => (
                <div key={j} className={gapBefore(seg.blocks[j - 1], block)}>
                  <BlockView block={block} />
                </div>
              ))}
            </div>
          ),
        )}
      </div>
    </Section>
  );
}

/* --------------------------------------------------------------- page */

/**
 * A full case study: title, intro and project facts, the opening
 * showcase, numbered chapters, and a link on to the next project.
 */
export function CaseStudyPage({ study }: { study: CaseStudy }) {
  // The next project in the work grid's order, wrapping round after the last.
  // Until it has a case study of its own, the button raises the under-construction toast.
  const next = work[(work.findIndex((p) => p.slug === study.slug) + 1) % work.length];

  return (
    <PageShell>
      <Nav items={caseStudyNav(study.name)} socials={socials} />

      <Section className="pt-[clamp(48px,8vw,104px)]">
        <Eyebrow>Case study</Eyebrow>
        <SplitText
          as="h1"
          text={study.title}
          delay={120}
          className="text-pretty-wrap m-0 mt-5 block max-w-[20ch] text-[clamp(34px,5.4vw,68px)] font-normal leading-[1.05] tracking-[-0.03em]"
        />
        <Reveal delay={400} className="mt-8 grid max-w-[62ch] gap-4">
          {study.intro.map((para, i) => (
            <p
              key={i}
              className={cx(
                "m-0 text-[clamp(17px,1.5vw,20px)] leading-[1.6] tracking-[-0.012em]",
                i === 0 ? "text-ink" : "text-ink-soft",
              )}
            >
              {para}
            </p>
          ))}
        </Reveal>
        {study.statement && (
          <p className="text-pretty-wrap m-0 mt-8 max-w-[40ch] text-[clamp(19px,1.8vw,23px)] font-semibold leading-[1.35] tracking-[-0.015em] text-ink">
            {study.statement}
          </p>
        )}

        <dl className="m-0 mt-[clamp(40px,6vw,64px)] grid grid-cols-2 border-t border-line md:grid-cols-4">
          {study.meta.map((item) => (
            <div key={item.label} className={cx("border-b border-line py-5 pr-6", item.live && "col-span-2")}>
              <dt className="text-[13px] font-medium text-muted">{item.label}</dt>
              <dd className="m-0 mt-2 flex items-start gap-2 text-[15px] leading-[1.45] tracking-[-0.01em] text-ink">
                {item.live && <LiveDot className="mt-[7px] shrink-0" />}
                <span>{item.value}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section className="pb-[clamp(56px,8vw,112px)] pt-[clamp(40px,6vw,72px)]">
        <WorkMorph slug={study.slug}>
          <div>
            <Figure visual={study.hero} priority />
          </div>
        </WorkMorph>
      </Section>

      {study.chapters.map((chapter, i) => (
        <ChapterSection key={chapter.id} chapter={chapter} number={String(i + 1).padStart(2, "0")} />
      ))}

      <Section className="pb-[clamp(56px,8vw,112px)]">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-[28px] bg-surface p-8 shadow-tile">
          <div>
            <Eyebrow>Next</Eyebrow>
            <div className="mt-3 max-w-[24ch] text-[clamp(22px,2.6vw,30px)] font-semibold leading-[1.15] tracking-[-0.015em]">
              See the next project
            </div>
          </div>
          {next.href ? (
            <ButtonLink href={next.href}>
              {next.title}
              <ArrowRight />
            </ButtonLink>
          ) : (
            <button
              type="button"
              data-sound
              data-unavailable={next.title}
              className={buttonClass("solid", "cursor-pointer")}
            >
              {next.title}
              <ArrowRight />
            </button>
          )}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-3 text-[13px] text-muted">
          <span>{profile.footer}</span>
          <span>{profile.copyright}</span>
        </div>
      </Section>
    </PageShell>
  );
}
