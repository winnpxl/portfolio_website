import type { Metadata } from "next";
import Link from "next/link";

import { Nav } from "@/components/Nav";
import { aboutNav, socials } from "@/components/navItems";
import { PageShell, Section } from "@/components/Page";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal, SplitText } from "@/components/motion";
import { ButtonLink, ImageFrame, cx } from "@/components/ui";
import { about, stats, work } from "@/content/site";

export const metadata: Metadata = {
  title: "About — Samuel Winner",
  description: about.paragraphs[0],
};

/** "Senior Product Designer · Sole Designer" reads as its first half here. */
const experience = work.map((w) => ({
  slug: w.slug,
  role: w.role.split(" · ")[0],
  company: w.title,
  year: w.year,
}));

const panel = "rounded-[28px] bg-tile-dark p-[clamp(24px,4vw,48px)] text-canvas";
const panelLabel = "text-[13px] font-medium tracking-[-0.005em] text-canvas/50";
const panelBody = "text-[clamp(17px,1.5vw,21px)] leading-[1.45] tracking-[-0.012em]";

function ListColumn({ label, items }: { label: string; items: readonly string[] }) {
  return (
    <div>
      <h3 className={cx(panelLabel, "m-0 font-medium")}>{label}</h3>
      <ul className="m-0 mt-4 list-none p-0">
        {items.map((item) => (
          <li key={item} className={cx(panelBody, "text-canvas/85")}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AboutPage() {
  return (
    <PageShell>
      <Nav items={aboutNav} socials={socials} />

      {/* Name, then where and what: the page's whole introduction. */}
      <Section className="pt-[clamp(40px,7vw,96px)]">
        <SplitText
          as="h1"
          by="char"
          text={about.title}
          delay={120}
          className="m-0 block whitespace-nowrap text-[clamp(64px,27.6vw,354px)] font-medium leading-[0.82] tracking-[-0.055em]"
        />
        <div className="mt-[clamp(28px,4vw,56px)] grid gap-4 md:grid-cols-2 md:gap-12">
          {about.intro.map((line, i) => (
            <Reveal
              as="p"
              key={i}
              delay={500 + i * 120}
              className={cx(
                "m-0 max-w-[34ch] text-[clamp(18px,1.6vw,22px)] leading-[1.35] tracking-[-0.012em] text-muted",
                i === 1 && "md:justify-self-end md:text-right",
              )}
            >
              {line}
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Bio beside the feature photo. */}
      <Section className="pt-[clamp(40px,6vw,80px)]">
        <Reveal className={cx(panel, "grid gap-10 md:grid-cols-2 md:gap-12")}>
          <div className="flex flex-col">
            <h2 className={cx(panelLabel, "m-0")}>Bio</h2>
            <div className="mt-5">
              {about.paragraphs.map((para, i) => (
                <p
                  key={i}
                  className={cx(
                    panelBody,
                    "m-0 max-w-[48ch]",
                    i === 0 ? "text-canvas" : "text-canvas/70",
                    i < about.paragraphs.length - 1 && "mb-5",
                  )}
                >
                  {para}
                </p>
              ))}
            </div>
            <div className="mt-8 md:mt-auto md:pt-10">
              <ButtonLink href="#contact" tone="light">
                Get in touch
              </ButtonLink>
            </div>
          </div>
          <ImageFrame
            slot={about.photos.feature}
            ratio="4/5"
            fill="deep"
            radius={20}
            priority
            focus="50% 60%"
            sizes="(max-width: 768px) 100vw, 560px"
          />
        </Reveal>
      </Section>

      <Section className="pt-[clamp(12px,1.6vw,20px)]">
        <Reveal>
          <ImageFrame
            slot={about.photos.wide}
            ratio="16/9"
            fill="deep"
            radius={28}
            focus="50% 72%"
            sizes="(max-width: 1280px) 100vw, 1136px"
            />
        </Reveal>
      </Section>

      {/* Experience from the work list; services and industries beside it. */}
      <Section className="pt-[clamp(12px,1.6vw,20px)]">
        <Reveal className={cx(panel, "grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16")}>
          <div>
            <h2 className={cx(panelLabel, "m-0")}>Experience</h2>
            <ul className="m-0 mt-4 list-none p-0">
              {experience.map((row) => (
                <li
                  key={row.slug}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-canvas/10 py-3 last:border-b-0"
                >
                  <span className={cx(panelBody, "text-canvas")}>
                    {row.role} <span className="text-canvas/50">at</span> {row.company}
                  </span>
                  <span className="text-[13px] font-medium tabular-nums text-canvas/50">
                    {row.year}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <ListColumn label="Services" items={about.services} />
            <ListColumn label="Industries" items={about.industries} />
          </div>

          <div className="border-t border-canvas/10 pt-8 lg:col-span-2">
            <h2 className={cx(panelLabel, "m-0")}>Toolkit</h2>
            <ul className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0">
              {about.toolkit.map((tool) => (
                <li
                  key={tool}
                  className="rounded-full border border-canvas/15 px-[11px] py-[6px] text-[12px] font-medium leading-none text-canvas/80"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Section>

      <Section className="pt-[clamp(40px,6vw,80px)]">
        <dl className="m-0 grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 80} className="flex flex-col-reverse justify-end border-t border-line pt-5">
              <dt className="mt-3 max-w-[24ch] text-[14px] leading-[1.45] text-muted">
                {stat.label}
              </dt>
              <dd className="m-0 text-[clamp(36px,4vw,52px)] leading-none tracking-[-0.03em]">
                {stat.value}
              </dd>
            </Reveal>
          ))}
        </dl>

        <Link
          href="/#work"
          data-sound
          className="group mt-[clamp(40px,6vw,72px)] inline-flex items-center gap-2 text-[clamp(18px,1.6vw,22px)] tracking-[-0.012em]"
        >
          View work
          <span aria-hidden className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      </Section>

      <SiteFooter />
    </PageShell>
  );
}
