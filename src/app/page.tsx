import Link from "next/link";

import { Nav } from "@/components/Nav";
import { homeNav } from "@/components/navItems";
import { PageShell, Section, TwilightBand } from "@/components/Page";
import {
  BulletList,
  ButtonLink,
  Card,
  Eyebrow,
  ImageFrame,
  Panel,
  Pill,
  SectionHeading,
  accentRotation,
  cx,
} from "@/components/ui";
import {
  about,
  contact,
  featuredWork,
  galleryBanner,
  hero,
  process,
  profile,
  sideProjects,
  stats,
  testimonials,
  work,
  writing,
} from "@/content/site";

/**
 * Lets a long email break after the "@" rather than mid-domain.
 */
function TileValue({ value }: { value: string }) {
  const at = value.indexOf("@");
  if (at === -1) return <>{value}</>;
  return (
    <>
      {value.slice(0, at + 1)}
      <wbr />
      {value.slice(at + 1)}
    </>
  );
}

/** DESIGN.md sets the section rhythm at 64px. */
const sectionPad = "py-[clamp(48px,7vw,80px)]";

export default function HomePage() {
  return (
    <PageShell>
      {/* ------------------------------------------- Hero, twilight band */}
      <TwilightBand className="pb-[clamp(56px,8vw,96px)]">
        <Nav items={homeNav} />

        <Section className="pt-[clamp(48px,8vw,88px)]">
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {hero.pills.map((pill) => (
              <span
                key={pill.label}
                className="rounded-full border border-parchment-cream/25 bg-parchment-cream/10 px-[12px] py-[5px] text-[12px] font-medium text-parchment-cream"
              >
                {pill.label}
              </span>
            ))}
          </div>

          <h1 className="text-pretty-wrap m-0 max-w-[18ch] font-display text-[clamp(40px,7vw,64px)] font-normal leading-[1.08] tracking-[-0.023em] text-paper-white">
            {hero.headline}
          </h1>

          <p className="text-pretty-wrap mt-6 max-w-[56ch] text-[clamp(16px,1.7vw,18px)] leading-[1.56] tracking-[-0.012em] text-parchment-cream/80">
            {hero.lead}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="#work" tone="paper">
              See the work
            </ButtonLink>
            <ButtonLink href="#contact" tone="ghost">
              Hire me
            </ButtonLink>
          </div>

          {/* Capability chips read as the product-peek row in this system. */}
          <div className="mt-10 flex flex-wrap gap-2">
            {hero.capabilities.map((cap) => (
              <span
                key={cap.label}
                className="rounded-full bg-parchment-cream/12 px-[14px] py-[6px] text-[13px] font-medium text-parchment-cream/90 ring-1 ring-parchment-cream/20"
              >
                {cap.label}
              </span>
            ))}
          </div>
        </Section>
      </TwilightBand>

      {/* ------------------------------------------------------ Stats */}
      <Section className={sectionPad}>
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr))]">
          {stats.map((stat) => (
            <Card key={stat.value}>
              <div className="font-display text-[clamp(32px,4vw,44px)] font-normal leading-[1.1] tracking-[-0.013em]">
                {stat.value}
              </div>
              <div className="mt-2 text-[14px] leading-[1.43] tracking-[-0.011em] text-slate-warm">
                {stat.label}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------- Selected work */}
      <Section id="work" className={sectionPad}>
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
          <SectionHeading>Selected work</SectionHeading>
          <Eyebrow>Five projects, 2023 – 2026</Eyebrow>
        </div>

        {/* Featured */}
        <Panel className="mb-5">
          <div className="grid items-center gap-8 [grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))]">
            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                <Pill tone="lilac" className="border-pale-violet text-deep-violet">
                  {featuredWork.pills[0].label}
                </Pill>
                <Pill>{featuredWork.pills[1].label}</Pill>
              </div>
              <h3 className="m-0 mb-3 font-display text-[clamp(28px,3.4vw,40px)] font-normal leading-[1.2] tracking-[-0.013em]">
                {featuredWork.title}
              </h3>
              <p className="m-0 mb-5 max-w-[52ch] text-[16px] leading-[1.5] tracking-[-0.011em] text-charcoal-stone">
                {featuredWork.summary}
              </p>
              <div className="mb-6">
                <BulletList items={featuredWork.bullets} />
              </div>
              <ButtonLink href={featuredWork.href}>{featuredWork.cta}</ButtonLink>
            </div>
            <ImageFrame slot={featuredWork.image} ratio="4/3" />
          </div>
        </Panel>

        <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]">
          {work.map((project) => (
            <Card as="article" key={project.slug} className="flex flex-col gap-4">
              <ImageFrame slot={project.image} ratio="16/10" />
              <Pill className="self-start">{project.pill}</Pill>
              <h3 className="m-0 font-display text-[28px] font-normal leading-[1.35] tracking-[-0.01em]">
                {project.title}
              </h3>
              <p className="m-0 text-[14px] leading-[1.43] tracking-[-0.011em] text-charcoal-stone">
                {project.summary}
              </p>
              <BulletList items={project.bullets} size="sm" />
              <span className="mt-auto text-[12px] font-medium uppercase tracking-[.12em] text-ash-gray">
                {project.status}
              </span>
            </Card>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------- Process */}
      <Section id="process" className={sectionPad}>
        <div className="mb-8 max-w-[60ch]">
          <SectionHeading>{process.heading}</SectionHeading>
          <p className="mt-4 text-[16px] leading-[1.5] tracking-[-0.011em] text-slate-warm">
            {process.lead}
          </p>
        </div>
        {/* The rainbow set as card rotation, which is what it is for. */}
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr))]">
          {process.steps.map((step, i) => (
            <Card key={step.number} tone={accentRotation[i % accentRotation.length]}>
              <div className="text-[12px] font-bold tracking-[.12em] text-ink-black/70">
                {step.number}
              </div>
              <div className="mt-3 text-[16px] font-semibold leading-[1.4] tracking-[-0.011em] text-ink-black">
                {step.title}
              </div>
              <p className="mt-2 text-[14px] leading-[1.43] tracking-[-0.011em] text-ink-black/85">
                {step.body}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------ About */}
      <Section id="about" className={sectionPad}>
        <div className="grid items-start gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr))]">
          <Panel>
            <SectionHeading className="mb-5">{about.heading}</SectionHeading>
            {about.paragraphs.map((para, i) => (
              <p
                key={i}
                className={cx(
                  "m-0 text-[16px] leading-[1.5] tracking-[-0.011em] text-charcoal-stone",
                  i < about.paragraphs.length - 1 && "mb-4",
                )}
              >
                {para}
              </p>
            ))}
          </Panel>

          <div className="grid gap-5">
            <ImageFrame slot={about.portrait} ratio="1/1" radius="16px" />
            <Panel tone="linen">
              <Eyebrow className="mb-4">Toolkit</Eyebrow>
              <div className="flex flex-wrap gap-2">
                {about.toolkit.map((tool) => (
                  <Pill key={tool}>{tool}</Pill>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------- Side projects */}
      <Section id="side" className={sectionPad}>
        <SectionHeading className="mb-8">Side projects</SectionHeading>
        <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))]">
          {sideProjects.map((item) => (
            <Card key={item.title}>
              <Pill className="mb-4">{item.pill}</Pill>
              <h3 className="m-0 mb-2 text-[20px] font-semibold leading-[1.4] tracking-[-0.012em]">
                {item.title}
              </h3>
              <p
                className={cx(
                  "m-0 text-[14px] leading-[1.43] tracking-[-0.011em] text-charcoal-stone",
                  item.link && "mb-3",
                )}
              >
                {item.body}
              </p>
              {item.link && (
                <a
                  href={item.link.href}
                  className="text-[14px] font-semibold text-deep-violet hover:underline"
                >
                  {item.link.label}
                </a>
              )}
            </Card>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------- Gallery banner */}
      <Section className={sectionPad}>
        <Link
          href="/gallery"
          className="flex flex-wrap items-center justify-between gap-5 rounded-[24px] bg-electric-violet p-6 sm:p-10"
        >
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-[.12em] text-ink-black/70">
              {galleryBanner.eyebrow}
            </div>
            <div className="mt-3 max-w-[22ch] font-display text-[clamp(28px,3.6vw,40px)] font-normal leading-[1.2] tracking-[-0.013em] text-ink-black">
              {galleryBanner.title}
            </div>
          </div>
          <span className="rounded-[12px] bg-ink-black px-5 py-[10px] text-[14px] font-semibold text-parchment-cream">
            {galleryBanner.cta}
          </span>
        </Link>
      </Section>

      {/* ---------------------------------------------------- Writing */}
      {writing.length > 0 && (
        <Section id="writing" className={sectionPad}>
          <SectionHeading className="mb-8">Writing</SectionHeading>
          <div className="grid gap-3">
            {writing.map((post) => (
              <a
                key={post.href}
                href={post.href}
                className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] bg-paper-white px-5 py-4 shadow-card hover:bg-linen-beige"
              >
                <span className="text-[16px] font-semibold tracking-[-0.011em]">
                  {post.title}
                </span>
                <span className="text-[14px] text-slate-warm">{post.blurb}</span>
              </a>
            ))}
          </div>
        </Section>
      )}

      {/* ----------------------------------------------- Testimonials */}
      {testimonials.length > 0 && (
        <Section id="testimonials" className={sectionPad}>
          <SectionHeading className="mb-8">What people say</SectionHeading>
          <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]">
            {testimonials.map((quote) => (
              <blockquote
                key={quote.attribution}
                className="m-0 rounded-[16px] bg-paper-white p-6 shadow-card"
              >
                <p className="m-0 mb-5 font-display text-[clamp(22px,2.4vw,28px)] font-normal leading-[1.35] tracking-[-0.01em]">
                  {quote.quote}
                </p>
                <footer className="text-[14px] font-medium text-slate-warm">
                  {quote.attribution}
                </footer>
              </blockquote>
            ))}
          </div>
        </Section>
      )}

      {/* ------------------------------------------ Contact, twilight */}
      <TwilightBand className="mt-[clamp(32px,5vw,56px)]">
        <Section id="contact" className="py-[clamp(56px,8vw,96px)]">
          <span className="inline-flex items-center gap-2 rounded-full border border-parchment-cream/25 bg-parchment-cream/10 px-[12px] py-[5px] text-[12px] font-medium uppercase tracking-[.12em]">
            <span aria-hidden className="h-[7px] w-[7px] rounded-full bg-mint-green" />
            {contact.badge}
          </span>

          <h2 className="m-0 mt-6 max-w-[20ch] font-display text-[clamp(32px,5.6vw,64px)] font-normal leading-[1.1] tracking-[-0.023em] text-paper-white">
            {contact.headline}
          </h2>
          <p className="m-0 mt-5 max-w-[52ch] text-[clamp(16px,1.7vw,18px)] leading-[1.56] tracking-[-0.012em] text-parchment-cream/75">
            {contact.availabilityNote}
          </p>

          <div className="mt-9 grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))]">
            {contact.tiles.map((tile) => (
              <a
                key={tile.label}
                href={tile.href}
                className="rounded-[12px] bg-parchment-cream/10 p-4 ring-1 ring-parchment-cream/20 hover:bg-parchment-cream/18"
              >
                <div className="text-[12px] font-medium uppercase tracking-[.12em] text-parchment-cream/60">
                  {tile.label}
                </div>
                <div className="mt-2 text-[16px] font-semibold tracking-[-0.011em] break-words">
                  <TileValue value={tile.value} />
                </div>
              </a>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-parchment-cream/15 pt-6 text-[14px] text-parchment-cream/60">
            <span>{profile.footer}</span>
            <span>{profile.copyright}</span>
          </div>
        </Section>
      </TwilightBand>
    </PageShell>
  );
}
