import Image from "next/image";
import Link from "next/link";

import { LocalTime } from "@/components/LocalTime";
import { Nav } from "@/components/Nav";
import { homeNav, type Social } from "@/components/navItems";
import { PageShell, Section } from "@/components/Page";
import {
  BulletList,
  ButtonLink,
  Eyebrow,
  ImageFrame,
  LiveDot,
  Pill,
  Row,
  SectionHeader,
  SectionHeading,
  cx,
  tileRotation,
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

/** The names of everything on the work grid, for the hero's projects line. */
const projectNames = [featuredWork.title, ...work.map((w) => w.title)];

/** Lets a long email break after the "@" rather than mid-domain. */
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

        <h1 className="text-pretty-wrap m-0 mt-[clamp(40px,6vw,72px)] max-w-[24ch] text-[clamp(32px,4.6vw,58px)] font-normal leading-[1.12] tracking-[-0.025em]">
          {hero.headline}
        </h1>

        <p className="text-pretty-wrap m-0 mt-6 max-w-[62ch] text-[clamp(17px,1.5vw,21px)] leading-[1.55] tracking-[-0.012em] text-muted">
          {hero.lead}
        </p>

        <p className="m-0 mt-6 max-w-[62ch] text-[clamp(16px,1.4vw,19px)] leading-[1.55] tracking-[-0.01em]">
          <span className="text-ink">Selected projects: </span>
          <span className="text-muted">{projectNames.join(", ")}.</span>
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <ButtonLink href="#contact">
            Get in touch
            <LiveDot />
          </ButtonLink>
          <ButtonLink href="#work" tone="ghost">
            See the work
          </ButtonLink>
        </div>

      </Section>

      {/* ------------------------------------------------------ Stats */}
      <Section className="pb-[clamp(40px,6vw,72px)]">
        <div className="grid border-t border-line [grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr))]">
          {stats.map((stat) => (
            <div key={stat.value} className="border-b border-line py-6 pr-6">
              <div className="text-[clamp(30px,3.2vw,40px)] font-semibold leading-none tracking-[-0.02em]">
                {stat.value}
              </div>
              <div className="mt-3 max-w-[22ch] text-[14px] leading-[1.45] text-muted">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------- Selected work */}
      <Section id="work" className={sectionPad}>
        <SectionHeader title="Selected work" aside="Five projects, 2023 – 2026" />

        {/* Featured: the one project with a case study gets the full width. */}
        <article className="grid gap-6 rounded-[28px] bg-surface p-3 shadow-tile md:grid-cols-[1.15fr_1fr] md:gap-8">
          <ImageFrame
            slot={featuredWork.image}
            ratio="4/3"
            fill="dark"
            radius={20}
            sound
            sizes="(max-width: 768px) 100vw, 55vw"
          />
          <div className="flex flex-col justify-center px-3 pb-4 md:py-6 md:pr-8">
            <div className="flex flex-wrap gap-2">
              <Pill tone="solid">{featuredWork.pills[0].label}</Pill>
              <Pill>{featuredWork.pills[1].label}</Pill>
            </div>
            <h3 className="m-0 mt-5 text-[clamp(28px,3vw,36px)] font-semibold leading-[1.1] tracking-[-0.015em]">
              {featuredWork.title}
            </h3>
            <p className="m-0 mt-3 max-w-[48ch] text-[15px] leading-[1.55] text-ink-soft">
              {featuredWork.summary}
            </p>
            <BulletList items={featuredWork.bullets} size="sm" className="mt-5" />
            <div className="mt-7">
              <ButtonLink href={featuredWork.href}>{featuredWork.cta}</ButtonLink>
            </div>
          </div>
        </article>

        {/* The rest: the image is the card, caption beneath. */}
        <div className="mt-6 grid gap-x-6 gap-y-10 [grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr))]">
          {work.map((project, i) => (
            <article key={project.slug} className="flex flex-col">
              <ImageFrame
                slot={project.image}
                ratio="4/5"
                fill={tileRotation[i % tileRotation.length]}
                ring={tileRotation[i % tileRotation.length] === "surface"}
                sound
              />
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <h3 className="m-0 text-[19px] font-medium leading-none tracking-[-0.015em]">
                  {project.title}
                </h3>
                <Pill>{project.pill}</Pill>
              </div>
              <p className="m-0 mt-3 max-w-[52ch] text-[15px] leading-[1.55] text-muted">
                {project.summary}
              </p>
              <BulletList items={project.bullets} size="sm" className="mt-4" />
              <Eyebrow className="mt-4 text-faint">{project.status}</Eyebrow>
            </article>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------- Process */}
      <Section id="process" className={sectionPad}>
        <div className="mb-8 grid gap-4 md:grid-cols-[minmax(0,12rem)_1fr]">
          <SectionHeading>{process.heading}</SectionHeading>
          <p className="m-0 max-w-[56ch] text-[16px] leading-[1.55] text-muted md:pt-2">
            {process.lead}
          </p>
        </div>
        <ol className="m-0 list-none p-0">
          {process.steps.map((step) => (
            <li
              key={step.number}
              className="grid gap-x-8 gap-y-2 border-t border-line py-6 last:border-b sm:grid-cols-[3rem_minmax(0,12rem)_1fr]"
            >
              <span className="text-[15px] text-muted">{step.number}</span>
              <span className="text-[17px] font-medium tracking-[-0.01em]">{step.title}</span>
              <p className="m-0 max-w-[56ch] text-[15px] leading-[1.55] text-muted">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ------------------------------------------------------ About */}
      <Section id="about" className={sectionPad}>
        <div className="grid items-start gap-8 md:grid-cols-[minmax(240px,360px)_1fr] md:gap-14">
          <ImageFrame
            slot={about.portrait}
            ratio="1/1"
            fill="surface"
            ring
            sizes="(max-width: 768px) 100vw, 360px"
          />
          <div>
            <SectionHeading className="mb-6">{about.heading}</SectionHeading>
            {about.paragraphs.map((para, i) => (
              <p
                key={i}
                className={cx(
                  "m-0 max-w-[62ch] text-[clamp(16px,1.3vw,18px)] leading-[1.6] tracking-[-0.01em] text-ink-soft",
                  i < about.paragraphs.length - 1 && "mb-4",
                )}
              >
                {para}
              </p>
            ))}
            <Eyebrow className="mt-8 mb-3">Toolkit</Eyebrow>
            <div className="flex flex-wrap gap-2">
              {about.toolkit.map((tool) => (
                <Pill key={tool}>{tool}</Pill>
              ))}
            </div>
          </div>
        </div>
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
      <Section id="contact" className="pt-[clamp(48px,7vw,96px)] pb-[clamp(32px,4vw,48px)]">
        <Pill tone="line">
          <LiveDot />
          {contact.badge}
        </Pill>
        <h2 className="text-pretty-wrap m-0 mt-6 max-w-[18ch] text-[clamp(34px,5vw,64px)] font-normal leading-[1.05] tracking-[-0.025em]">
          {contact.headline}
        </h2>
        <p className="m-0 mt-5 max-w-[56ch] text-[clamp(16px,1.4vw,19px)] leading-[1.55] text-muted">
          {contact.availabilityNote}
        </p>

        <div className="mt-10">
          {contact.tiles.map((tile, i) => (
            <a
              key={tile.label}
              href={tile.href}
              data-sound
              className={cx(
                "group grid items-baseline gap-x-8 gap-y-1 border-t border-line py-5 sm:grid-cols-[minmax(0,12rem)_1fr_auto]",
                i === contact.tiles.length - 1 && "border-b",
              )}
            >
              <span className="text-[13px] font-medium text-muted">{tile.label}</span>
              <span className="text-[clamp(17px,1.6vw,22px)] tracking-[-0.015em] break-words">
                <TileValue value={tile.value} />
              </span>
              <span
                aria-hidden
                className="hidden text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:inline"
              >
                ↗
              </span>
            </a>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-3 text-[13px] text-muted">
          <span>{profile.footer}</span>
          <span>{profile.copyright}</span>
        </div>
      </Section>
    </PageShell>
  );
}
