import type { Metadata } from "next";

import { Nav } from "@/components/Nav";
import { caseStudyNav } from "@/components/navItems";
import { PageShell, Section } from "@/components/Page";
import {
  BulletList,
  ButtonLink,
  Eyebrow,
  ImageFrame,
  Pill,
  Row,
  SectionHeading,
  cx,
} from "@/components/ui";
import { runbeta } from "@/content/runbeta";

export const metadata: Metadata = {
  title: "RunBeta case study — Samuel Winner",
  description: runbeta.hero.lead,
};

const pad = "py-[clamp(40px,6vw,80px)]";

function DecisionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="m-0 mt-4 max-w-[28ch] text-[clamp(22px,2.6vw,30px)] font-medium leading-[1.2] tracking-[-0.02em]">
      {children}
    </h3>
  );
}

export default function RunBetaCaseStudy() {
  return (
    <PageShell>
      <Nav items={caseStudyNav(runbeta.navLabel)} />

      {/* ------------------------------------------------------- Hero */}
      <Section width={880} className="pt-[clamp(48px,8vw,104px)]">
        <div className="flex flex-wrap gap-2">
          {runbeta.hero.pills.map((pill) => (
            <Pill key={pill.label}>{pill.label}</Pill>
          ))}
        </div>
        <h1 className="text-pretty-wrap m-0 mt-8 max-w-[22ch] text-[clamp(32px,4.6vw,56px)] font-normal leading-[1.1] tracking-[-0.025em]">
          {runbeta.hero.headline}
        </h1>
        <p className="text-pretty-wrap m-0 mt-6 max-w-[60ch] text-[clamp(17px,1.5vw,20px)] leading-[1.55] tracking-[-0.01em] text-muted">
          {runbeta.hero.lead}
        </p>
      </Section>

      {/* ------------------------------------------------------ Cover */}
      <Section className="pt-[clamp(40px,6vw,72px)]">
        <ImageFrame slot={runbeta.cover} ratio="16/9" fill="dark" radius={28} sizes="100vw" priority />
      </Section>

      {/* ------------------------------------------------------ Facts */}
      <Section width={880} className={pad}>
        <div className="grid border-t border-line [grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr))]">
          {runbeta.facts.map((fact) => {
            const highlight = "highlight" in fact && fact.highlight;
            return (
              <div key={fact.label} className="border-b border-line py-6 pr-6">
                <Eyebrow className={cx(highlight && "text-ink")}>{fact.label}</Eyebrow>
                <p className="m-0 mt-3 text-[15px] leading-[1.55] text-ink-soft">{fact.body}</p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ---------------------------------------------------- Problem */}
      <Section width={880} className={pad}>
        <Eyebrow>{runbeta.problem.eyebrow}</Eyebrow>
        <SectionHeading className="mt-4 max-w-[24ch] text-[clamp(28px,3.6vw,44px)]">
          {runbeta.problem.heading}
        </SectionHeading>
        <div className="mt-6 max-w-[62ch]">
          {runbeta.problem.paragraphs.map((para, i) => (
            <p
              key={i}
              className={cx(
                "m-0 text-[clamp(16px,1.3vw,18px)] leading-[1.6] tracking-[-0.01em] text-ink-soft",
                i < runbeta.problem.paragraphs.length - 1 && "mb-4",
              )}
            >
              {para}
            </p>
          ))}
        </div>
      </Section>

      {/* -------------------------------------------------- Decisions */}
      <Section width={880} className={pad}>
        <SectionHeading className="mb-4">{runbeta.decisionsHeading}</SectionHeading>

        {/* 01 */}
        <div className="border-t border-line py-10">
          <Pill>{runbeta.decisionOne.pill}</Pill>
          <DecisionHeading>{runbeta.decisionOne.heading}</DecisionHeading>
          <div className="mt-6 grid items-center gap-8 md:grid-cols-[1fr_1fr]">
            <div className="max-w-[52ch]">
              {runbeta.decisionOne.paragraphs.map((para, i) => (
                <p
                  key={i}
                  className={cx(
                    "m-0 text-[16px] leading-[1.6] text-ink-soft",
                    i < runbeta.decisionOne.paragraphs.length - 1 && "mb-4",
                  )}
                >
                  {para}
                </p>
              ))}
            </div>
            <ImageFrame slot={runbeta.decisionOne.image} ratio="4/3" fill="tile" />
          </div>
        </div>

        {/* 02 — before / after */}
        <div className="border-t border-line py-10">
          <Pill>{runbeta.decisionTwo.pill}</Pill>
          <DecisionHeading>{runbeta.decisionTwo.heading}</DecisionHeading>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="on-dark rounded-[24px] bg-tile-dark p-7 text-canvas">
              <Eyebrow className="text-canvas/50">{runbeta.decisionTwo.before.label}</Eyebrow>
              <div className="mt-6 font-display text-[64px] font-medium leading-none tracking-[-0.03em]">
                {runbeta.decisionTwo.before.value}
              </div>
              <p className="m-0 mt-4 text-[15px] leading-[1.55] text-canvas/70">
                {runbeta.decisionTwo.before.body}
              </p>
            </div>
            <div className="rounded-[24px] bg-surface p-7 shadow-tile">
              <Eyebrow>{runbeta.decisionTwo.after.label}</Eyebrow>
              <div className="mt-6 font-display text-[64px] font-medium leading-none tracking-[-0.03em]">
                {runbeta.decisionTwo.after.value}
              </div>
              <p className="m-0 mt-4 text-[15px] leading-[1.55] text-muted">
                {runbeta.decisionTwo.after.body}
              </p>
            </div>
          </div>
          <p className="m-0 mt-6 max-w-[60ch] text-[16px] leading-[1.6] text-ink-soft">
            {runbeta.decisionTwo.closing}
          </p>
        </div>

        {/* 03 */}
        <div className="border-t border-line py-10">
          <Pill>{runbeta.decisionThree.pill}</Pill>
          <DecisionHeading>{runbeta.decisionThree.heading}</DecisionHeading>
          <p className="m-0 mt-5 max-w-[60ch] text-[16px] leading-[1.6] text-ink-soft">
            {runbeta.decisionThree.body}
          </p>
          <div className="mt-6 grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr))]">
            {runbeta.decisionThree.cards.map((card) => (
              <div key={card.title} className="rounded-[20px] bg-surface p-5 shadow-tile">
                <div className="text-[15px] font-medium tracking-[-0.01em]">{card.title}</div>
                <p className="m-0 mt-2 text-[14px] leading-[1.5] text-muted">{card.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 04 */}
        <div className="border-t border-b border-line py-10">
          <Pill tone="solid">{runbeta.decisionFour.pill}</Pill>
          <DecisionHeading>{runbeta.decisionFour.heading}</DecisionHeading>
          <p className="m-0 mt-5 max-w-[60ch] text-[16px] leading-[1.6] text-ink-soft">
            {runbeta.decisionFour.body}
          </p>
        </div>
      </Section>

      {/* ----------------------------------------- System & prototype */}
      <Section width={880} className={pad}>
        <div className="grid items-start gap-8 md:grid-cols-[1fr_minmax(240px,320px)] md:gap-14">
          <div>
            <Eyebrow>{runbeta.system.eyebrow}</Eyebrow>
            <SectionHeading className="mt-4 mb-6">{runbeta.system.heading}</SectionHeading>
            <BulletList items={runbeta.system.bullets} />
          </div>
          <ImageFrame slot={runbeta.system.image} ratio="3/4" fill="tile" sizes="(max-width: 768px) 100vw, 320px" />
        </div>
      </Section>

      {/* ------------------------------------------------- Reflection */}
      <Section width={880} className={pad}>
        <Row label={runbeta.reflection.eyebrow} first className="border-b">
          <p className="text-pretty-wrap m-0 max-w-[40ch] font-display text-[clamp(22px,2.6vw,32px)] font-medium leading-[1.25] tracking-[-0.015em]">
            {runbeta.reflection.body}
          </p>
        </Row>
      </Section>

      {/* ------------------------------------------------------- Next */}
      <Section width={880} className="pb-[clamp(56px,8vw,112px)] pt-[clamp(16px,3vw,32px)]">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-[28px] bg-surface p-8 shadow-tile">
          <div>
            <Eyebrow>{runbeta.next.eyebrow}</Eyebrow>
            <div className="mt-3 font-display text-[clamp(22px,2.6vw,30px)] font-medium leading-[1.15] tracking-[-0.015em]">
              {runbeta.next.title}
            </div>
          </div>
          <ButtonLink href={runbeta.next.href}>{runbeta.next.cta}</ButtonLink>
        </div>
      </Section>
    </PageShell>
  );
}
