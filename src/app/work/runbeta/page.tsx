import type { Metadata } from "next";

import { Nav } from "@/components/Nav";
import { caseStudyNav } from "@/components/navItems";
import { PageShell, Section, TwilightBand } from "@/components/Page";
import {
  BulletList,
  ButtonLink,
  Card,
  Eyebrow,
  ImageFrame,
  Panel,
  Pill,
  cx,
} from "@/components/ui";
import { runbeta } from "@/content/runbeta";

export const metadata: Metadata = {
  title: "RunBeta case study — Samuel Winner",
  description: runbeta.hero.lead,
};

const pad = "py-[clamp(40px,6vw,72px)]";

export default function RunBetaCaseStudy() {
  return (
    <PageShell>
      {/* ------------------------------------------- Hero, twilight band */}
      <TwilightBand className="pb-[clamp(48px,7vw,80px)]">
        <Nav items={caseStudyNav(runbeta.navLabel)} />

        <Section width={900} className="pt-[clamp(44px,7vw,80px)]">
          <div className="mb-6 flex flex-wrap gap-2">
            {runbeta.hero.pills.map((pill) => (
              <span
                key={pill.label}
                className="rounded-full border border-parchment-cream/25 bg-parchment-cream/10 px-[12px] py-[5px] text-[12px] font-medium"
              >
                {pill.label}
              </span>
            ))}
          </div>
          <h1 className="text-pretty-wrap m-0 max-w-[20ch] font-display text-[clamp(36px,6.4vw,64px)] font-normal leading-[1.1] tracking-[-0.023em] text-paper-white">
            {runbeta.hero.headline}
          </h1>
          <p className="text-pretty-wrap m-0 mt-6 max-w-[58ch] text-[clamp(16px,1.7vw,18px)] leading-[1.56] tracking-[-0.012em] text-parchment-cream/80">
            {runbeta.hero.lead}
          </p>
        </Section>
      </TwilightBand>

      {/* ------------------------------------------------------ Cover */}
      <Section width={900} className="pt-[clamp(32px,5vw,56px)]">
        <ImageFrame slot={runbeta.cover} ratio="16/9" radius="16px" />
      </Section>

      {/* ------------------------------------------------------ Facts */}
      <Section width={900} className={pad}>
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))]">
          {runbeta.facts.map((fact) => {
            const highlight = "highlight" in fact && fact.highlight;
            return (
            <Card key={fact.label} tone={highlight ? "lilac" : "paper"}>
              <Eyebrow className={highlight ? "text-deep-violet" : undefined}>
                {fact.label}
              </Eyebrow>
              <p className="m-0 mt-3 text-[14px] leading-[1.43] tracking-[-0.011em] text-charcoal-stone">
                {fact.body}
              </p>
            </Card>
            );
          })}
        </div>
      </Section>

      {/* ---------------------------------------------------- Problem */}
      <Section width={900} className={pad}>
        <Panel>
          <Eyebrow className="mb-4">{runbeta.problem.eyebrow}</Eyebrow>
          <h2 className="m-0 mb-5 max-w-[26ch] font-display text-[clamp(28px,4vw,44px)] font-normal leading-[1.2] tracking-[-0.013em]">
            {runbeta.problem.heading}
          </h2>
          {runbeta.problem.paragraphs.map((para, i) => (
            <p
              key={i}
              className={cx(
                "m-0 max-w-[62ch] text-[16px] leading-[1.5] tracking-[-0.011em] text-charcoal-stone",
                i < runbeta.problem.paragraphs.length - 1 && "mb-4",
              )}
            >
              {para}
            </p>
          ))}
        </Panel>
      </Section>

      {/* -------------------------------------------------- Decisions */}
      <Section width={900} className={pad}>
        <h2 className="m-0 mb-8 font-display text-[clamp(32px,5vw,48px)] font-normal leading-[1.2] tracking-[-0.013em]">
          {runbeta.decisionsHeading}
        </h2>

        <div className="grid gap-5">
          {/* 01 */}
          <Panel>
            <div className="grid items-center gap-8 [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]">
              <div>
                <Pill tone="lilac" className="mb-4 border-pale-violet text-deep-violet">
                  {runbeta.decisionOne.pill}
                </Pill>
                <h3 className="m-0 mb-4 font-display text-[clamp(22px,2.8vw,28px)] font-normal leading-[1.35] tracking-[-0.01em]">
                  {runbeta.decisionOne.heading}
                </h3>
                {runbeta.decisionOne.paragraphs.map((para, i) => (
                  <p
                    key={i}
                    className={cx(
                      "m-0 text-[15px] leading-[1.47] tracking-[-0.011em] text-charcoal-stone",
                      i < runbeta.decisionOne.paragraphs.length - 1 && "mb-3",
                    )}
                  >
                    {para}
                  </p>
                ))}
              </div>
              <ImageFrame slot={runbeta.decisionOne.image} ratio="4/3" />
            </div>
          </Panel>

          {/* 02 — before / after */}
          <Panel>
            <Pill className="mb-4">{runbeta.decisionTwo.pill}</Pill>
            <h3 className="m-0 mb-6 max-w-[30ch] font-display text-[clamp(22px,2.8vw,28px)] font-normal leading-[1.35] tracking-[-0.01em]">
              {runbeta.decisionTwo.heading}
            </h3>
            <div className="mb-5 grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]">
              <Card tone="tangerine">
                <div className="text-[12px] font-semibold uppercase tracking-[.12em] text-ink-black/70">
                  {runbeta.decisionTwo.before.label}
                </div>
                <div className="mt-2 font-display text-[40px] font-normal leading-[1.1] tracking-[-0.013em] text-ink-black">
                  {runbeta.decisionTwo.before.value}
                </div>
                <p className="mt-2 text-[14px] leading-[1.43] text-ink-black/85">
                  {runbeta.decisionTwo.before.body}
                </p>
              </Card>
              <Card tone="mint">
                <div className="text-[12px] font-semibold uppercase tracking-[.12em] text-ink-black/70">
                  {runbeta.decisionTwo.after.label}
                </div>
                <div className="mt-2 font-display text-[40px] font-normal leading-[1.1] tracking-[-0.013em] text-ink-black">
                  {runbeta.decisionTwo.after.value}
                </div>
                <p className="mt-2 text-[14px] leading-[1.43] text-ink-black/85">
                  {runbeta.decisionTwo.after.body}
                </p>
              </Card>
            </div>
            <p className="m-0 max-w-[62ch] text-[15px] leading-[1.47] tracking-[-0.011em] text-charcoal-stone">
              {runbeta.decisionTwo.closing}
            </p>
          </Panel>

          {/* 03 */}
          <Panel>
            <Pill className="mb-4">{runbeta.decisionThree.pill}</Pill>
            <h3 className="m-0 mb-4 max-w-[32ch] font-display text-[clamp(22px,2.8vw,28px)] font-normal leading-[1.35] tracking-[-0.01em]">
              {runbeta.decisionThree.heading}
            </h3>
            <p className="m-0 mb-6 max-w-[62ch] text-[15px] leading-[1.47] tracking-[-0.011em] text-charcoal-stone">
              {runbeta.decisionThree.body}
            </p>
            <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr))]">
              {runbeta.decisionThree.cards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-[12px] bg-lilac-mist p-4 ring-1 ring-pale-violet"
                >
                  <div className="text-[15px] font-semibold tracking-[-0.011em]">
                    {card.title}
                  </div>
                  <p className="m-0 mt-2 text-[13px] leading-[1.43] text-charcoal-stone">
                    {card.body}
                  </p>
                </div>
              ))}
            </div>
          </Panel>

          {/* 04 — the dark one */}
          <div className="on-twilight rounded-[16px] bg-twilight-indigo p-6 text-parchment-cream sm:p-8">
            <span className="mb-4 inline-block rounded-full bg-parchment-cream/12 px-[10px] py-[4px] text-[12px] font-medium ring-1 ring-parchment-cream/20">
              {runbeta.decisionFour.pill}
            </span>
            <h3 className="m-0 mb-4 max-w-[32ch] font-display text-[clamp(22px,2.8vw,28px)] font-normal leading-[1.35] tracking-[-0.01em] text-paper-white">
              {runbeta.decisionFour.heading}
            </h3>
            <p className="m-0 max-w-[62ch] text-[15px] leading-[1.5] tracking-[-0.011em] text-parchment-cream/80">
              {runbeta.decisionFour.body}
            </p>
          </div>
        </div>
      </Section>

      {/* ----------------------------------------- System & prototype */}
      <Section width={900} className={pad}>
        <div className="grid items-start gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr))]">
          <Panel>
            <Eyebrow className="mb-4">{runbeta.system.eyebrow}</Eyebrow>
            <h2 className="m-0 mb-5 font-display text-[clamp(24px,3.2vw,36px)] font-normal leading-[1.25] tracking-[-0.013em]">
              {runbeta.system.heading}
            </h2>
            <BulletList items={runbeta.system.bullets} size="md" />
          </Panel>
          <ImageFrame slot={runbeta.system.image} ratio="3/4" radius="16px" />
        </div>
      </Section>

      {/* ------------------------------------------------- Reflection */}
      <Section width={900} className={pad}>
        <Panel tone="linen">
          <Eyebrow className="mb-4">{runbeta.reflection.eyebrow}</Eyebrow>
          <p className="text-pretty-wrap m-0 max-w-[60ch] font-display text-[clamp(20px,2.4vw,28px)] font-normal leading-[1.35] tracking-[-0.01em]">
            {runbeta.reflection.body}
          </p>
        </Panel>
      </Section>

      {/* ------------------------------------------------------- Next */}
      <Section width={900} className="pb-[clamp(56px,8vw,96px)] pt-[clamp(16px,3vw,32px)]">
        <Panel className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Eyebrow className="mb-2">{runbeta.next.eyebrow}</Eyebrow>
            <div className="font-display text-[clamp(22px,2.8vw,28px)] font-normal leading-[1.35] tracking-[-0.01em]">
              {runbeta.next.title}
            </div>
          </div>
          <ButtonLink href={runbeta.next.href}>{runbeta.next.cta}</ButtonLink>
        </Panel>
      </Section>
    </PageShell>
  );
}
