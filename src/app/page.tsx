import Link from "next/link";

import { Nav } from "@/components/Nav";
import { homeNav } from "@/components/navItems";
import { PageShell, Section } from "@/components/Page";
import {
  BulletList,
  ButtonLink,
  Card,
  Eyebrow,
  ImageFrame,
  Panel,
  Pill,
  SectionHeading,
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

/** Every section but the last shares this bottom padding. */
const sectionPad = "pb-[clamp(40px,6vw,72px)]";

export default function HomePage() {
  return (
    <PageShell>
      <Nav items={homeNav} />

      {/* ------------------------------------------------------- Hero */}
      <Section id="top" className="pt-[clamp(40px,8vw,86px)] pb-[clamp(28px,5vw,52px)]">
        <div className="mb-[clamp(22px,3vw,34px)] flex flex-wrap items-center gap-[14px]">
          {hero.pills.map((pill) => (
            <Pill
              key={pill.label}
              tone={pill.tone as "butter" | "cream"}
              rotate={"rotate" in pill ? pill.rotate : undefined}
              className={cx(
                "px-[18px] py-2 text-[15px]",
                pill.tone === "butter" ? "font-bold" : "font-semibold",
              )}
            >
              {pill.label}
            </Pill>
          ))}
        </div>

        <h1 className="text-pretty-wrap m-0 max-w-[16ch] font-display text-[clamp(42px,8.2vw,104px)] font-extrabold leading-[.95] tracking-[-.02em]">
          {hero.headline}
        </h1>

        <div className="mt-[clamp(24px,4vw,38px)] flex flex-wrap gap-3">
          {hero.capabilities.map((cap) => (
            <Pill
              key={cap.label}
              tone={cap.tone as "rose" | "cream" | "butter"}
              rotate={"rotate" in cap ? cap.rotate : undefined}
              className="px-[18px] py-2 text-[clamp(14px,1.6vw,18px)] font-bold"
            >
              {cap.label}
            </Pill>
          ))}
        </div>

        <div className="mt-[clamp(30px,5vw,52px)] grid items-start gap-[clamp(18px,3vw,32px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]">
          <p className="text-pretty-wrap m-0 max-w-[52ch] text-[clamp(17px,1.9vw,21px)] leading-[1.5]">
            {hero.lead}
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="#work">See the work</ButtonLink>
            <ButtonLink href="#contact" tone="cream">
              Hire me
            </ButtonLink>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------ Stats */}
      <Section className={sectionPad}>
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,190px),1fr))]">
          {stats.map((stat) => (
            <div
              key={stat.value}
              className={cx(
                "rounded-[20px] border-2 border-maroon p-[22px] shadow-hard-6",
                stat.tone === "butter" ? "bg-butter" : "bg-cream",
              )}
            >
              <div className="font-display text-[44px] font-extrabold leading-none">
                {stat.value}
              </div>
              <div className="mt-1.5 text-[14px] font-semibold leading-[1.35]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------- Selected work */}
      <Section id="work" className={sectionPad}>
        <div className="mb-[clamp(20px,3vw,30px)] flex flex-wrap items-baseline justify-between gap-[14px]">
          <SectionHeading className="text-[clamp(30px,4.6vw,58px)]">
            Selected work
          </SectionHeading>
          <Eyebrow>Five projects, 2023 – 2026</Eyebrow>
        </div>

        {/* Featured card */}
        <article className="mb-[22px] rounded-[26px] border-2 border-maroon bg-cream p-[clamp(20px,3vw,34px)] shadow-hard-8">
          <div className="grid items-center gap-[clamp(20px,3vw,36px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))]">
            <div>
              <div className="mb-4 flex flex-wrap gap-[10px]">
                {featuredWork.pills.map((pill) => (
                  <Pill
                    key={pill.label}
                    tone={pill.tone}
                    shadow={false}
                    className="px-[14px] py-[5px] text-[13px] font-bold"
                  >
                    {pill.label}
                  </Pill>
                ))}
              </div>
              <h3 className="m-0 mb-3 font-display text-[clamp(28px,3.6vw,46px)] font-extrabold leading-[1.02]">
                {featuredWork.title}
              </h3>
              <p className="m-0 mb-[18px] max-w-[50ch] text-[clamp(16px,1.7vw,19px)] leading-[1.5]">
                {featuredWork.summary}
              </p>
              <div className="mb-[22px]">
                <BulletList items={featuredWork.bullets} />
              </div>
              <ButtonLink href={featuredWork.href} className="!py-[13px] !px-[24px]">
                {featuredWork.cta}
              </ButtonLink>
            </div>
            <ImageFrame
              slot={featuredWork.image}
              ratio="4/3"
              radius="18px"
            />
          </div>
        </article>

        {/* Remaining four */}
        <div className="grid gap-[22px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]">
          {work.map((project) => (
            <Card as="article" key={project.slug} className="flex flex-col gap-[14px]">
              <ImageFrame slot={project.image} ratio="16/10" />
              <div className="flex flex-wrap gap-2">
                <Pill
                  tone="butter"
                  shadow={false}
                  className="px-3 py-1 text-[12px] font-bold"
                >
                  {project.pill}
                </Pill>
              </div>
              <h3 className="m-0 font-display text-[26px] font-extrabold leading-[1.05]">
                {project.title}
              </h3>
              <p className="m-0 text-[15px] leading-[1.5]">{project.summary}</p>
              <BulletList items={project.bullets} size="sm" />
              {/* mt-auto pins the status line so cards align regardless of copy length */}
              <span className="mt-auto text-[13px] font-bold uppercase tracking-[.14em] opacity-65">
                {project.status}
              </span>
            </Card>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------- Process */}
      <Section id="process" className={sectionPad}>
        <Panel tone="maroon">
          <SectionHeading className="mb-2 text-cream">
            {process.heading}
          </SectionHeading>
          <p className="m-0 mb-[clamp(20px,3vw,32px)] max-w-[56ch] text-[16px] font-medium text-rose">
            {process.lead}
          </p>
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr))]">
            {process.steps.map((step) => (
              <div
                key={step.number}
                className={cx(
                  "rounded-[18px] border-2 border-maroon p-5",
                  "tone" in step && step.tone === "butter"
                    ? "bg-butter"
                    : "bg-cream",
                )}
              >
                <div className="mb-2 font-display text-[15px] font-extrabold tracking-[.14em]">
                  {step.number}
                </div>
                <div className="mb-2 font-display text-[20px] font-bold leading-[1.1]">
                  {step.title}
                </div>
                <p className="m-0 text-[14px] leading-[1.45]">{step.body}</p>
              </div>
            ))}
          </div>
        </Panel>
      </Section>

      {/* ------------------------------------------------------ About */}
      <Section id="about" className={sectionPad}>
        <div className="grid items-start gap-[22px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr))]">
          <Panel className="p-[clamp(20px,3vw,34px)]">
            <SectionHeading className="mb-[18px]">{about.heading}</SectionHeading>
            {about.paragraphs.map((para, i) => (
              <p
                key={i}
                className={cx(
                  "m-0 text-[clamp(16px,1.7vw,18px)] leading-[1.55]",
                  i < about.paragraphs.length - 1 && "mb-[14px]",
                )}
              >
                {para}
              </p>
            ))}
          </Panel>

          <div className="grid gap-[22px]">
            <ImageFrame
              slot={about.portrait}
              ratio="1/1"
              radius="26px"
              shadow="hard-8"
            />
            <div className="rounded-[26px] border-2 border-maroon bg-butter p-[clamp(18px,2.4vw,26px)] shadow-hard-8">
              <Eyebrow className="mb-[14px]">Toolkit</Eyebrow>
              <div className="flex flex-wrap gap-2">
                {about.toolkit.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full border-2 border-maroon bg-cream px-[13px] py-[5px] text-[13px] font-semibold"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------- Side projects */}
      <Section id="side" className={sectionPad}>
        <SectionHeading className="mb-[clamp(18px,3vw,28px)]">
          Side projects
        </SectionHeading>
        <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))]">
          {sideProjects.map((item) => (
            <Card key={item.title}>
              <Pill
                tone="rose"
                shadow={false}
                className="mb-[14px] px-3 py-1 text-[12px] font-bold"
              >
                {item.pill}
              </Pill>
              <h3 className="m-0 mb-[10px] font-display text-[23px] font-extrabold leading-[1.08]">
                {item.title}
              </h3>
              <p className={cx("m-0 text-[15px] leading-[1.5]", item.link && "mb-3")}>
                {item.body}
              </p>
              {item.link && (
                <a
                  href={item.link.href}
                  className="border-b-2 border-pink text-[14px] font-bold"
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
          className="flex flex-wrap items-center justify-between gap-[18px] rounded-[26px] border-2 border-maroon bg-butter p-[clamp(20px,3vw,36px)] shadow-hard-8 hover:bg-cream"
        >
          <div>
            <Eyebrow className="mb-[10px]">{galleryBanner.eyebrow}</Eyebrow>
            <div className="max-w-[22ch] font-display text-[clamp(26px,4vw,46px)] font-extrabold leading-[1.02]">
              {galleryBanner.title}
            </div>
          </div>
          <span className="whitespace-nowrap rounded-full border-2 border-maroon bg-maroon px-[26px] py-[14px] text-[16px] font-bold text-cream shadow-deep-5">
            {galleryBanner.cta}
          </span>
        </Link>
      </Section>

      {/* ---------------------------------------------------- Writing */}
      {writing.length > 0 && (
        <Section id="writing" className={sectionPad}>
          <div className="mb-[clamp(16px,2.4vw,24px)] flex flex-wrap items-baseline justify-between gap-3">
            <SectionHeading>Writing</SectionHeading>
          </div>
          <div className="grid gap-[14px]">
            {writing.map((post) => (
              <a
                key={post.href}
                href={post.href}
                className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border-2 border-maroon bg-cream px-6 py-5 hover:bg-butter"
              >
                <span className="font-display text-[20px] font-bold">
                  {post.title}
                </span>
                <span className="text-[14px] font-semibold">{post.blurb}</span>
              </a>
            ))}
          </div>
        </Section>
      )}

      {/* ----------------------------------------------- Testimonials */}
      {testimonials.length > 0 && (
        <Section id="testimonials" className={sectionPad}>
          <div className="mb-[clamp(16px,2.4vw,24px)] flex flex-wrap items-baseline justify-between gap-3">
            <SectionHeading>What people say</SectionHeading>
          </div>
          <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]">
            {testimonials.map((quote) => (
              <blockquote
                key={quote.attribution}
                className="m-0 rounded-[24px] border-2 border-maroon bg-cream p-[clamp(20px,2.6vw,30px)] shadow-hard-7"
              >
                <p className="m-0 mb-4 font-display text-[clamp(19px,2.2vw,25px)] font-bold leading-[1.25]">
                  {quote.quote}
                </p>
                <footer className="text-[14px] font-semibold">
                  {quote.attribution}
                </footer>
              </blockquote>
            ))}
          </div>
        </Section>
      )}

      {/* ---------------------------------------------------- Contact */}
      <Section id="contact" className="pb-[clamp(48px,7vw,90px)]">
        <div className="on-maroon rounded-[28px] border-2 border-maroon bg-maroon p-[clamp(24px,3.6vw,48px)] shadow-deep-8">
          <div className="mb-[22px] inline-flex items-center gap-[10px] rounded-full border-2 border-maroon bg-butter px-4 py-[7px] text-[13px] font-bold uppercase tracking-[.14em]">
            <span aria-hidden className="inline-block h-[9px] w-[9px] rounded-full bg-pink" />
            {contact.badge}
          </div>
          <h2 className="m-0 mb-4 max-w-[20ch] font-display text-[clamp(32px,6vw,74px)] font-extrabold leading-[.98] text-cream">
            {contact.headline}
          </h2>
          <p className="m-0 mb-[clamp(24px,3vw,36px)] max-w-[52ch] text-[clamp(16px,1.8vw,20px)] leading-[1.5] text-rose">
            {contact.availabilityNote}
          </p>
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))]">
            {contact.tiles.map((tile) => (
              <a
                key={tile.label}
                href={tile.href}
                className="rounded-[18px] border-2 border-cream bg-cream p-5 hover:border-butter hover:bg-butter"
              >
                <div className="mb-1.5 text-[12px] font-bold uppercase tracking-[.16em]">
                  {tile.label}
                </div>
                <div className="font-display text-[19px] font-bold leading-[1.1]">
                  {tile.value}
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-1.5 pt-[26px]">
          <span className="text-[14px] font-semibold">{profile.footer}</span>
          <span className="text-[14px] font-semibold">{profile.copyright}</span>
        </div>
      </Section>
    </PageShell>
  );
}
