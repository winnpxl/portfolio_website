import type { Metadata } from "next";

import { Nav } from "@/components/Nav";
import { caseStudyNav } from "@/components/navItems";
import { PageShell, Section } from "@/components/Page";
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

const pad = "pb-[clamp(36px,5vw,64px)]";

export default function RunBetaCaseStudy() {
  return (
    <PageShell>
      <Nav items={caseStudyNav(runbeta.navLabel)} />

      {/* ------------------------------------------------------- Hero */}
      <Section width={1040} className="pt-[clamp(36px,7vw,80px)] pb-[clamp(24px,4vw,44px)]">
        <div className="mb-6 flex flex-wrap gap-3">
          {runbeta.hero.pills.map((pill) => (
            <Pill
              key={pill.label}
              tone={pill.tone}
              rotate={"rotate" in pill ? pill.rotate : undefined}
              className="px-4 py-[7px] text-[14px] font-bold"
            >
              {pill.label}
            </Pill>
          ))}
        </div>
        <h1 className="m-0 mb-5 max-w-[18ch] font-display text-[clamp(40px,8vw,96px)] font-extrabold leading-[.96] tracking-[-.02em]">
          {runbeta.hero.headline}
        </h1>
        <p className="text-pretty-wrap m-0 max-w-[58ch] text-[clamp(17px,2vw,22px)] leading-[1.5]">
          {runbeta.hero.lead}
        </p>
      </Section>

      {/* ------------------------------------------------------ Cover */}
      <Section width={1040} className="pb-[clamp(32px,5vw,60px)]">
        <ImageFrame slot={runbeta.cover} ratio="16/9" radius="26px" shadow="hard-8" />
      </Section>

      {/* ------------------------------------------------------ Facts */}
      <Section width={1040} className={pad}>
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))]">
          {runbeta.facts.map((fact) => (
            <div
              key={fact.label}
              className={cx(
                "rounded-[20px] border-2 border-maroon p-5 shadow-hard-6",
                "tone" in fact && fact.tone === "butter" ? "bg-butter" : "bg-cream",
              )}
            >
              <div className="mb-2 text-[12px] font-bold uppercase tracking-[.16em]">
                {fact.label}
              </div>
              <p className="m-0 text-[15px] leading-[1.45]">{fact.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------- Problem */}
      <Section width={1040} className={pad}>
        <Panel>
          <Eyebrow className="mb-[14px]">{runbeta.problem.eyebrow}</Eyebrow>
          <h2 className="m-0 mb-[18px] max-w-[24ch] font-display text-[clamp(26px,4vw,44px)] font-extrabold leading-[1.05]">
            {runbeta.problem.heading}
          </h2>
          {runbeta.problem.paragraphs.map((para, i) => (
            <p
              key={i}
              className={cx(
                "m-0 max-w-[62ch] text-[clamp(16px,1.8vw,19px)] leading-[1.55]",
                i < runbeta.problem.paragraphs.length - 1 && "mb-[14px]",
              )}
            >
              {para}
            </p>
          ))}
        </Panel>
      </Section>

      {/* -------------------------------------------------- Decisions */}
      <Section width={1040} className={pad}>
        <h2 className="m-0 mb-[clamp(18px,3vw,28px)] font-display text-[clamp(28px,4.6vw,56px)] font-extrabold leading-none">
          {runbeta.decisionsHeading}
        </h2>

        <div className="grid gap-[22px]">
          {/* 01 */}
          <Card as="article" className="p-[clamp(20px,3vw,34px)]">
            <div className="grid items-center gap-[clamp(18px,3vw,32px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]">
              <div>
                <Pill
                  tone="pink"
                  shadow={false}
                  className="mb-[14px] px-[13px] py-1 text-[12px] font-bold"
                >
                  {runbeta.decisionOne.pill}
                </Pill>
                <h3 className="m-0 mb-3 font-display text-[clamp(22px,2.8vw,32px)] font-extrabold leading-[1.06]">
                  {runbeta.decisionOne.heading}
                </h3>
                {runbeta.decisionOne.paragraphs.map((para, i) => (
                  <p
                    key={i}
                    className={cx(
                      "m-0 text-[16px] leading-[1.5]",
                      i < runbeta.decisionOne.paragraphs.length - 1 && "mb-3",
                    )}
                  >
                    {para}
                  </p>
                ))}
              </div>
              <ImageFrame slot={runbeta.decisionOne.image} ratio="4/3" radius="16px" />
            </div>
          </Card>

          {/* 02 */}
          <Card as="article" className="p-[clamp(20px,3vw,34px)]">
            <Pill
              tone="butter"
              shadow={false}
              className="mb-[14px] px-[13px] py-1 text-[12px] font-bold"
            >
              {runbeta.decisionTwo.pill}
            </Pill>
            <h3 className="m-0 mb-4 max-w-[28ch] font-display text-[clamp(22px,2.8vw,32px)] font-extrabold leading-[1.06]">
              {runbeta.decisionTwo.heading}
            </h3>
            <div className="mb-[18px] grid gap-[18px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]">
              <div className="rounded-[18px] border-2 border-maroon bg-pink p-5 text-cream">
                <div className="mb-3 text-[12px] font-bold uppercase tracking-[.16em]">
                  {runbeta.decisionTwo.before.label}
                </div>
                <div className="mb-2 font-display text-[36px] font-extrabold leading-none">
                  {runbeta.decisionTwo.before.value}
                </div>
                <p className="m-0 text-[15px] leading-[1.45]">
                  {runbeta.decisionTwo.before.body}
                </p>
              </div>
              <div className="rounded-[18px] border-2 border-maroon bg-butter p-5">
                <div className="mb-3 text-[12px] font-bold uppercase tracking-[.16em]">
                  {runbeta.decisionTwo.after.label}
                </div>
                <div className="mb-2 font-display text-[36px] font-extrabold leading-none">
                  {runbeta.decisionTwo.after.value}
                </div>
                <p className="m-0 text-[15px] leading-[1.45]">
                  {runbeta.decisionTwo.after.body}
                </p>
              </div>
            </div>
            <p className="m-0 max-w-[62ch] text-[16px] leading-[1.5]">
              {runbeta.decisionTwo.closing}
            </p>
          </Card>

          {/* 03 */}
          <Card as="article" className="p-[clamp(20px,3vw,34px)]">
            <Pill
              tone="rose"
              shadow={false}
              className="mb-[14px] px-[13px] py-1 text-[12px] font-bold"
            >
              {runbeta.decisionThree.pill}
            </Pill>
            <h3 className="m-0 mb-3 max-w-[30ch] font-display text-[clamp(22px,2.8vw,32px)] font-extrabold leading-[1.06]">
              {runbeta.decisionThree.heading}
            </h3>
            <p className="m-0 mb-4 max-w-[62ch] text-[16px] leading-[1.5]">
              {runbeta.decisionThree.body}
            </p>
            <div className="grid gap-[14px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr))]">
              {runbeta.decisionThree.cards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-[16px] border-2 border-maroon bg-[rgba(240,69,111,.10)] p-4"
                >
                  <div className="mb-1.5 font-display text-[17px] font-bold">
                    {card.title}
                  </div>
                  <p className="m-0 text-[14px] leading-[1.4]">{card.body}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* 04 */}
          <div className="on-maroon rounded-[24px] border-2 border-maroon bg-maroon p-[clamp(20px,3vw,34px)] text-cream shadow-deep-7">
            <Pill
              tone="butter"
              shadow={false}
              className="mb-[14px] px-[13px] py-1 text-[12px] font-bold text-maroon"
            >
              {runbeta.decisionFour.pill}
            </Pill>
            <h3 className="m-0 mb-3 max-w-[30ch] font-display text-[clamp(22px,2.8vw,32px)] font-extrabold leading-[1.06]">
              {runbeta.decisionFour.heading}
            </h3>
            <p className="m-0 max-w-[62ch] text-[16px] leading-[1.55] text-cream">
              {runbeta.decisionFour.body}
            </p>
          </div>
        </div>
      </Section>

      {/* ----------------------------------------- System & prototype */}
      <Section width={1040} className={pad}>
        <div className="grid items-start gap-[22px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr))]">
          <Panel className="p-[clamp(20px,3vw,34px)]">
            <Eyebrow className="mb-[14px]">{runbeta.system.eyebrow}</Eyebrow>
            <h2 className="m-0 mb-4 font-display text-[clamp(24px,3.4vw,40px)] font-extrabold leading-[1.04]">
              {runbeta.system.heading}
            </h2>
            <BulletList items={runbeta.system.bullets} size="lg" />
          </Panel>
          <ImageFrame
            slot={runbeta.system.image}
            ratio="3/4"
            radius="26px"
            shadow="hard-8"
          />
        </div>
      </Section>

      {/* ------------------------------------------------- Reflection */}
      <Section width={1040} className={pad}>
        <Panel tone="butter">
          <Eyebrow className="mb-[14px]">{runbeta.reflection.eyebrow}</Eyebrow>
          <p className="text-pretty-wrap m-0 max-w-[60ch] text-[clamp(17px,2vw,21px)] leading-[1.5]">
            {runbeta.reflection.body}
          </p>
        </Panel>
      </Section>

      {/* ------------------------------------------------------- Next */}
      <Section width={1040} className="pb-[clamp(48px,7vw,90px)]">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[26px] border-2 border-maroon bg-cream p-[clamp(20px,3vw,34px)] shadow-hard-8">
          <div>
            <Eyebrow className="mb-2">{runbeta.next.eyebrow}</Eyebrow>
            <div className="font-display text-[clamp(24px,3.2vw,36px)] font-extrabold leading-[1.05]">
              {runbeta.next.title}
            </div>
          </div>
          <ButtonLink href={runbeta.next.href}>{runbeta.next.cta}</ButtonLink>
        </div>
      </Section>
    </PageShell>
  );
}
