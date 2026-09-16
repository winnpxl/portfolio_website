import type { Metadata } from "next";

import { GalleryStrip } from "@/components/GalleryStrip";
import { LocalTime } from "@/components/LocalTime";
import { Nav } from "@/components/Nav";
import { galleryNav, socials } from "@/components/navItems";
import { PageShell } from "@/components/Page";
import { Eyebrow } from "@/components/ui";
import { galleryCta, galleryHeader, tiles } from "@/content/gallery";
import { profile } from "@/content/site";

export const metadata: Metadata = {
  title: "Gallery — Samuel Winner",
  description: galleryHeader.lead,
};

const gutter = "px-[clamp(20px,5vw,72px)]";

/**
 * One screen, no page scroll: the nav, a strip of shots that moves
 * sideways, and a footer row. Modelled on leonsayer.framer.website.
 */
export default function GalleryPage() {
  return (
    <PageShell>
      <div className="flex min-h-[100svh] flex-col overflow-hidden">
        {/* A column flex item with auto margins shrinks to fit, so the nav
            gets a full-width wrapper to keep its own layout. */}
        <div className="w-full">
          <Nav items={galleryNav} socials={socials} />
        </div>

        <div className={`mx-auto mt-[clamp(20px,3vw,32px)] flex w-full max-w-[1280px] items-baseline justify-between gap-4 ${gutter}`}>
          <Eyebrow>{galleryHeader.pills[0].label}</Eyebrow>
          <Eyebrow>{tiles.length} shots</Eyebrow>
        </div>

        <div className="flex flex-1 items-center py-6">
          <GalleryStrip tiles={tiles} />
        </div>

        <div
          className={`mx-auto flex w-full max-w-[1280px] flex-wrap items-end justify-between gap-x-8 gap-y-3 pb-[max(20px,env(safe-area-inset-bottom))] text-[13px] ${gutter}`}
        >
          <p className="m-0 max-w-[44ch] leading-[1.5] text-muted">{galleryHeader.lead}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted">
            <span className="pointer-coarse:hidden">Scroll or drag sideways</span>
            <span className="hidden pointer-coarse:inline">Swipe sideways</span>
            <a href={galleryCta.href} data-sound className="text-ink hover:underline">
              {galleryCta.label}
            </a>
            <LocalTime timeZone="Africa/Lagos" label={profile.location.split(",")[0]} />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
