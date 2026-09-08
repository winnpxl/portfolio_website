import type { Metadata } from "next";

import { Nav } from "@/components/Nav";
import { galleryNav } from "@/components/navItems";
import { PageShell, Section, TwilightBand } from "@/components/Page";
import { ButtonLink, ImageFrame, cx } from "@/components/ui";
import { galleryCta, galleryHeader, tiles } from "@/content/gallery";

export const metadata: Metadata = {
  title: "Gallery — Samuel Winner",
  description: galleryHeader.lead,
};

export default function GalleryPage() {
  return (
    <PageShell>
      <TwilightBand className="pb-[clamp(44px,7vw,72px)]">
        <Nav items={galleryNav} />

        <Section className="pt-[clamp(44px,7vw,80px)]">
          <div className="mb-6 flex flex-wrap gap-2">
            {galleryHeader.pills.map((pill) => (
              <span
                key={pill.label}
                className="rounded-full border border-parchment-cream/25 bg-parchment-cream/10 px-[12px] py-[5px] text-[12px] font-medium"
              >
                {pill.label}
              </span>
            ))}
          </div>
          <h1 className="m-0 max-w-[16ch] font-display text-[clamp(40px,7vw,64px)] font-normal leading-[1.1] tracking-[-0.023em] text-paper-white">
            {galleryHeader.title}
          </h1>
          <p className="text-pretty-wrap m-0 mt-5 max-w-[56ch] text-[clamp(16px,1.7vw,18px)] leading-[1.56] tracking-[-0.012em] text-parchment-cream/80">
            {galleryHeader.lead}
          </p>
        </Section>
      </TwilightBand>

      <Section className="py-[clamp(48px,7vw,80px)]">
        <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(min(100%,280px),1fr))]">
          {tiles.map((tile) => (
            <figure
              key={tile.id}
              className={cx(
                "m-0 rounded-[12px] bg-paper-white p-3 shadow-card",
                // Wide tiles span two columns, but only once two columns exist.
                tile.wide && "sm:col-span-2",
              )}
            >
              <ImageFrame slot={tile.image} ratio={tile.ratio} />
              <figcaption className="flex flex-wrap justify-between gap-2 px-1 pb-1 pt-3 text-[13px]">
                <span className="font-medium">{tile.caption}</span>
                <span className="text-ash-gray">{tile.meta}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[24px] bg-electric-violet p-6 sm:p-10">
          <div className="max-w-[26ch] font-display text-[clamp(24px,3.2vw,36px)] font-normal leading-[1.2] tracking-[-0.013em] text-ink-black">
            {galleryCta.title}
          </div>
          <ButtonLink href={galleryCta.href}>{galleryCta.label}</ButtonLink>
        </div>
      </Section>
    </PageShell>
  );
}
