import Image from "next/image";

import Link from "next/link";

import { LocalTime } from "@/components/LocalTime";
import { Nav } from "@/components/Nav";
import { homeNav, socials } from "@/components/navItems";
import { PageShell, Section } from "@/components/Page";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal, SplitText } from "@/components/motion";
import { Ticker } from "@/components/Ticker";
import {
  ButtonLink,
  Eyebrow,
  LiveDot,
  ProjectCard,
  Row,
  SectionHeader,
  SectionHeading,
  cx,
} from "@/components/ui";
import { tiles } from "@/content/gallery";
import {
  about,
  contact,
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

const email = contact.tiles.find((t) => t.label === "Email");

/** The names of everything on the work grid, for the hero's projects line. */
const projectNames = work.map((w) => w.title);

/** "Five projects, 2024 – 2026", worked out from the grid so it never goes stale. */
const counts = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
// A year can be a range such as "2023 – 2025"; every year in it counts.
const years = work.flatMap((w) => (w.year.match(/\d{4}/g) ?? []).map(Number));
const span = years.length
  ? Math.min(...years) === Math.max(...years)
    ? `${Math.min(...years)}`
    : `${Math.min(...years)} – ${Math.max(...years)}`
  : "";
const workSummary = [`${counts[work.length] ?? work.length} projects`, span].filter(Boolean).join(", ");

const sectionPad = "py-[clamp(48px,7vw,96px)]";

export default function HomePage() {
  return (
    <PageShell>
      <Nav items={homeNav} socials={socials} />

      {/* ------------------------------------------------------- Hero */}
      <Section className="pt-[clamp(56px,9vw,120px)] pb-[clamp(40px,6vw,72px)]">
        <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-6">
          {/* Name lockup: portrait, name, role beneath. */}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              {about.portrait.src ? (
                <Image
                  src={about.portrait.src}
                  alt={about.portrait.alt}
                  width={60}
                  height={60}
                  priority
                  className="h-[60px] w-[60px] rounded-[16px] object-cover"
                />
              ) : (
                <div className="h-[60px] w-[60px] rounded-[16px] bg-tile" />
              )}
              <span
                aria-hidden
                className="absolute -bottom-[3px] -right-[3px] h-[13px] w-[13px] rounded-full border-[3px] border-canvas bg-live"
              />
            </div>
            <div>
              <div className="text-[24px] font-semibold leading-none tracking-[-0.015em]">
                {profile.name}
              </div>
              <div className="mt-[6px] text-[14px] text-muted">{profile.role}</div>
            </div>
          </div>

          {/* Right column: where and when, and the fastest way in. */}
          <div className="text-[15px] leading-[1.6] sm:text-right">
            <div className="text-muted">{hero.pills[1].label}</div>
            <div>
              <LocalTime timeZone={profile.timeZone} />
            </div>
            {email && (
              <a
                href={email.href}
                className="inline-flex items-center gap-1.5 text-ink underline decoration-line underline-offset-[5px] transition-colors hover:decoration-ink"
              >
                {email.value}
                <span aria-hidden className="text-muted">
                  ↗
                </span>
              </a>
            )}
          </div>
        </div>

        <SplitText
          as="h1"
          text={hero.headline}
          delay={150}
          className="text-pretty-wrap m-0 mt-[clamp(40px,6vw,72px)] block max-w-[24ch] text-[clamp(32px,4.6vw,58px)] font-normal leading-[1.12] tracking-[-0.025em]"
        />

        <Reveal
          as="p"
          delay={450}
          className="text-pretty-wrap m-0 mt-6 max-w-[62ch] text-[clamp(17px,1.5vw,21px)] leading-[1.55] tracking-[-0.012em] text-muted"
        >
          {hero.lead}
        </Reveal>

        <Reveal as="p" delay={550} className="m-0 mt-6 max-w-[62ch] text-[clamp(16px,1.4vw,19px)] leading-[1.55] tracking-[-0.01em]">
          <span className="text-ink">Selected projects: </span>
          <span className="text-muted">{projectNames.join(", ")}.</span>
        </Reveal>

        <Reveal delay={650} className="mt-8 flex flex-wrap items-center gap-3">
          <ButtonLink href="#contact">
            Get in touch
            <LiveDot />
          </ButtonLink>
          <ButtonLink href="#work" tone="ghost">
            See my work
          </ButtonLink>
        </Reveal>

      </Section>

      {/* ------------------------------------------------------ Stats */}
      <Section className="pb-[clamp(40px,6vw,72px)]">
        <div className="grid border-t border-line [grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr))]">
          {stats.map((stat, i) => (
            <Reveal key={stat.value} delay={i * 80} className="border-b border-line py-6 pr-6">
              <div className="text-[clamp(30px,3.2vw,40px)] font-semibold leading-none tracking-[-0.02em]">
                {stat.value}
              </div>
              <div className="mt-3 max-w-[22ch] text-[14px] leading-[1.45] text-muted">
                {stat.label}
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------- Selected work */}
      <Section id="work" className={sectionPad}>
        <SectionHeader title="Selected work" aside={workSummary} />

        {/* One uniform grid: thumbnail, then name and a single sentence. */}
        <div className="grid gap-x-6 gap-y-12 [grid-template-columns:repeat(auto-fill,minmax(min(100%,340px),1fr))]">
          {work.map((project, i) => (
            <Reveal key={project.slug} delay={(i % 3) * 90}>
              <ProjectCard
                slug={project.slug}
                title={project.cardTitle ?? project.title}
                tagline={project.tagline}
                year={project.year}
                image={project.image}
                href={project.href}
                priority={i < 3}
              />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ----------------------------------------------------- Ticker */}
      <div className="py-[clamp(8px,2vw,24px)]">
        <Ticker tiles={tiles} />
      </div>

      {/* ---------------------------------------------------- Process */}
      <Section id="process" className={sectionPad}>
        <div className="mb-8 grid gap-4 md:grid-cols-[minmax(0,12rem)_1fr]">
          <SectionHeading>{process.heading}</SectionHeading>
          <p className="m-0 max-w-[56ch] text-[16px] leading-[1.55] text-muted md:pt-2">
            {process.lead}
          </p>
        </div>
        <ol className="m-0 list-none p-0">
          {process.steps.map((step, i) => (
            <Reveal
              as="li"
              key={step.number}
              delay={i * 60}
              className="grid gap-x-8 gap-y-2 border-t border-line py-6 last:border-b sm:grid-cols-[3rem_minmax(0,12rem)_1fr]"
            >
              <span className="text-[15px] text-muted">{step.number}</span>
              <span className="text-[17px] font-medium tracking-[-0.01em]">{step.title}</span>
              <p className="m-0 max-w-[56ch] text-[15px] leading-[1.55] text-muted">
                {step.body}
              </p>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* ---------------------------------------------- Side projects */}
      <Section id="side" className={sectionPad}>
        <SectionHeader title="Side projects" aside="Three, ongoing" />
        <div>
          {sideProjects.map((item, i) => (
            <Row key={item.title} label={item.pill} first={i === 0} className="last:border-b">
              <div className="text-[18px] font-medium tracking-[-0.012em]">{item.title}</div>
              <p className="m-0 mt-2 max-w-[60ch] text-[15px] leading-[1.55] text-muted">
                {item.body}
              </p>
              {item.link && (
                <a
                  href={item.link.href}
                  className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-medium underline decoration-line underline-offset-[5px] hover:decoration-ink"
                >
                  {item.link.label}
                  <span aria-hidden className="text-muted">
                    ↗
                  </span>
                </a>
              )}
            </Row>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------- Gallery banner */}
      <Section className={sectionPad}>
        <Link
          href="/gallery"
          data-sound
          className="on-dark group flex flex-wrap items-end justify-between gap-6 rounded-[28px] bg-tile-dark p-8 text-canvas sm:p-12"
        >
          <div>
            <Eyebrow className="text-canvas/50">{galleryBanner.eyebrow}</Eyebrow>
            <div className="mt-4 max-w-[20ch] text-[clamp(28px,3.6vw,44px)] font-semibold leading-[1.08] tracking-[-0.02em]">
              {galleryBanner.title}
            </div>
          </div>
          <span className="inline-flex items-center rounded-full bg-canvas px-[22px] py-[13px] text-[15px] font-medium leading-none text-ink transition-colors group-hover:bg-surface">
            {galleryBanner.cta}
          </span>
        </Link>
      </Section>

      {/* ---------------------------------------------------- Writing */}
      {writing.length > 0 && (
        <Section id="writing" className={sectionPad}>
          <SectionHeader title="Writing" />
          <div>
            {writing.map((post, i) => (
              <a
                key={post.href}
                href={post.href}
                className={cx(
                  "flex flex-wrap items-baseline justify-between gap-3 border-t border-line py-5 hover:text-ink-soft",
                  i === writing.length - 1 && "border-b",
                )}
              >
                <span className="text-[17px] font-medium">{post.title}</span>
                <span className="text-[14px] text-muted">{post.blurb}</span>
              </a>
            ))}
          </div>
        </Section>
      )}

      {/* ----------------------------------------------- Testimonials */}
      {testimonials.length > 0 && (
        <Section id="testimonials" className={sectionPad}>
          <SectionHeader title="What people say" />
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))]">
            {testimonials.map((quote) => (
              <blockquote
                key={quote.attribution}
                className="m-0 rounded-[24px] bg-surface p-7 shadow-tile"
              >
                <p className="m-0 text-[clamp(20px,2vw,26px)] font-normal leading-[1.3] tracking-[-0.01em]">
                  {quote.quote}
                </p>
                <footer className="mt-5 text-[14px] text-muted">{quote.attribution}</footer>
              </blockquote>
            ))}
          </div>
        </Section>
      )}

      {/* ---------------------------------------------------- Contact */}
      <SiteFooter />
    </PageShell>
  );
}
