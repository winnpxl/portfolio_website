import type { Metadata } from "next";

import { Nav } from "@/components/Nav";
import { galleryNav } from "@/components/navItems";
import { PageShell, Section } from "@/components/Page";
import { ButtonLink, ImageFrame, Pill, cx } from "@/components/ui";
import { galleryCta, galleryHeader, tiles } from "@/content/gallery";

export const metadata: Metadata = {
  title: "Gallery — Samuel Winner",
  description: galleryHeader.lead,
};

const toneFill = {
  cream: "bg-cream",
  butter: "bg-butter",
  rose: "bg-rose",
} as const;

export default function GalleryPage() {
  return (
    <PageShell>
      <Nav items={galleryNav} />

      <Section className="pt-[clamp(36px,7vw,80px)] pb-[clamp(22px,4vw,40px)]">
        <div className="mb-[22px] flex flex-wrap gap-3">
          {galleryHeader.pills.map((pill) => (
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
        <h1 className="m-0 mb-[18px] max-w-[16ch] font-display text-[clamp(40px,8vw,96px)] font-extrabold leading-[.96] tracking-[-.02em]">
          {galleryHeader.title}
        </h1>
        <p className="text-pretty-wrap m-0 max-w-[56ch] text-[clamp(17px,2vw,21px)] leading-[1.5]">
          {galleryHeader.lead}
        </p>
      </Section>

      <Section className="pb-[clamp(48px,7vw,90px)]">
        <div className="grid gap-[22px] [grid-template-columns:repeat(auto-fill,minmax(min(100%,280px),1fr))]">
          {tiles.map((tile) => (
            <figure
              key={tile.id}
              className={cx(
                "m-0 rounded-[24px] border-2 border-maroon p-[14px] shadow-hard-7",
                toneFill[tile.tone ?? "cream"],
                // Wide tiles span two columns, but only once two columns exist.
                tile.wide && "sm:col-span-2",
              )}
            >
              <ImageFrame
                slot={tile.image}
                ratio={tile.ratio}
                backing={tile.tone === "rose" ? "bg-cream" : "bg-rose"}
              />
              <figcaption className="flex flex-wrap justify-between gap-2 px-1.5 pb-1 pt-3 text-[14px] font-semibold">
                <span>{tile.caption}</span>
                <span className="opacity-60">{tile.meta}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="on-maroon mt-[26px] flex flex-wrap items-center justify-between gap-4 rounded-[26px] border-2 border-maroon bg-maroon p-[clamp(20px,3vw,34px)] shadow-deep-8">
          <div className="max-w-[26ch] font-display text-[clamp(22px,3vw,34px)] font-extrabold leading-[1.05] text-cream">
            {galleryCta.title}
          </div>
          <ButtonLink href={galleryCta.href} tone="butter">
            {galleryCta.label}
          </ButtonLink>
        </div>
      </Section>
    </PageShell>
  );
}
