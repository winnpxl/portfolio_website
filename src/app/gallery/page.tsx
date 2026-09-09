import type { Metadata } from "next";

import { Nav } from "@/components/Nav";
import { galleryNav } from "@/components/navItems";
import { PageShell, Section } from "@/components/Page";
import { ButtonLink, Eyebrow, ImageFrame, Pill, cx, tileRotation } from "@/components/ui";
import { galleryCta, galleryHeader, tiles } from "@/content/gallery";

export const metadata: Metadata = {
  title: "Gallery — Samuel Winner",
  description: galleryHeader.lead,
};

export default function GalleryPage() {
  return (
    <PageShell>
      <Nav items={galleryNav} />

      <Section className="pt-[clamp(48px,8vw,104px)] pb-[clamp(40px,6vw,72px)]">
        <div className="flex flex-wrap gap-2">
          {galleryHeader.pills.map((pill) => (
            <Pill key={pill.label}>{pill.label}</Pill>
          ))}
        </div>
        <h1 className="m-0 mt-8 text-[clamp(40px,6vw,72px)] font-normal leading-none tracking-[-0.03em]">
          {galleryHeader.title}
        </h1>
        <p className="text-pretty-wrap m-0 mt-5 max-w-[56ch] text-[clamp(17px,1.5vw,20px)] leading-[1.55] text-muted">
          {galleryHeader.lead}
        </p>
      </Section>

      <Section className="pb-[clamp(56px,8vw,112px)]">
        <div className="grid gap-x-6 gap-y-9 [grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr))]">
          {tiles.map((tile, i) => {
            const fill = tileRotation[i % tileRotation.length];
            return (
              <figure
                key={tile.id}
                className={cx("m-0", tile.wide && "sm:col-span-2")}
              >
                <ImageFrame
                  slot={tile.image}
                  ratio={tile.ratio}
                  fill={fill}
                  ring={fill === "surface"}
                  sound
                  sizes={tile.wide ? "(max-width: 640px) 100vw, 66vw" : "(max-width: 640px) 100vw, 33vw"}
                />
                <figcaption className="mt-3 flex flex-wrap justify-between gap-2 px-1 text-[14px]">
                  <span className="font-medium tracking-[-0.01em]">{tile.caption}</span>
                  <span className="text-muted">{tile.meta}</span>
                </figcaption>
              </figure>
            );
          })}
        </div>

        <div className="on-dark mt-12 flex flex-wrap items-end justify-between gap-6 rounded-[28px] bg-tile-dark p-8 text-canvas sm:p-12">
          <div>
            <Eyebrow className="text-canvas/50">Case studies</Eyebrow>
            <div className="mt-4 max-w-[22ch] text-[clamp(26px,3.2vw,40px)] font-semibold leading-[1.1] tracking-[-0.02em]">
              {galleryCta.title}
            </div>
          </div>
          <ButtonLink href={galleryCta.href} tone="light">
            {galleryCta.label}
          </ButtonLink>
        </div>
      </Section>
    </PageShell>
  );
}
