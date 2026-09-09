import type { Metadata } from "next";

import { Nav } from "@/components/Nav";
import { aboutNav, type Social } from "@/components/navItems";
import { PageShell, Section } from "@/components/Page";
import {
  ButtonLink,
  Eyebrow,
  ImageFrame,
  Pill,
  cx,
} from "@/components/ui";
import { about, contact, profile } from "@/content/site";

export const metadata: Metadata = {
  title: "About — Samuel Winner",
  description: about.paragraphs[0],
};

const email = contact.tiles.find((t) => t.label === "Email");
const socials: Social[] = [
  ...contact.tiles
    .filter((t) => t.label === "GitHub" || t.label === "LinkedIn")
    .map((t) => ({
      label: t.label,
      href: t.href,
      icon: t.label.toLowerCase() as Social["icon"],
    })),
  ...(email ? [{ label: "Email", href: email.href, icon: "mail" as const }] : []),
];

export default function AboutPage() {
  return (
    <PageShell>
      <Nav items={aboutNav} socials={socials} />

      <Section width={880} className="pt-[clamp(48px,8vw,104px)]">
        <Eyebrow>{profile.role}</Eyebrow>
        <h1 className="text-pretty-wrap m-0 mt-5 max-w-[20ch] text-[clamp(34px,5vw,58px)] font-normal leading-[1.1] tracking-[-0.025em]">
          {about.heading}
        </h1>
      </Section>

      {/* The source portrait is square, so it gets an upright frame beside
          the text rather than a wide one that would crop the head. */}
      <Section width={880} className="pt-[clamp(32px,5vw,56px)] pb-[clamp(40px,6vw,72px)]">
        <div className="grid items-start gap-8 md:grid-cols-[minmax(220px,300px)_1fr] md:gap-12">
          <ImageFrame
            slot={about.portrait}
            ratio="4/5"
            fill="surface"
            radius={20}
            ring
            priority
            sizes="(max-width: 768px) 100vw, 300px"
          />
          <div>
            {about.paragraphs.map((para, i) => (
              <p
                key={i}
                className={cx(
                  "m-0 max-w-[54ch] text-[clamp(16px,1.4vw,18px)] leading-[1.65] tracking-[-0.011em]",
                  i === 0 ? "text-ink" : "text-ink-soft",
                  i < about.paragraphs.length - 1 && "mb-5",
                )}
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      </Section>

      <Section width={880} className="pb-[clamp(40px,6vw,72px)]">
        <Eyebrow className="mb-4">Toolkit</Eyebrow>
        <div className="flex flex-wrap gap-2">
          {about.toolkit.map((tool) => (
            <Pill key={tool}>{tool}</Pill>
          ))}
        </div>
      </Section>

      <Section width={880} className="pb-[clamp(56px,8vw,112px)]">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-[28px] bg-surface p-8 shadow-tile">
          <div>
            <Eyebrow>Next</Eyebrow>
            <div className="mt-3 max-w-[24ch] text-[clamp(22px,2.6vw,30px)] font-semibold leading-[1.15] tracking-[-0.015em]">
              {contact.headline}
            </div>
          </div>
          <ButtonLink href="/#contact">Get in touch</ButtonLink>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-3 text-[13px] text-muted">
          <span>{profile.footer}</span>
          <span>{profile.copyright}</span>
        </div>
      </Section>
    </PageShell>
  );
}
