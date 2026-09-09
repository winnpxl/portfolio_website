import Image from "next/image";
import type { CSSProperties } from "react";

import type { GalleryTile } from "@/content/gallery";
import { cx, tileRotation } from "./ui";

const fillClass = {
  tile: "bg-tile",
  deep: "bg-tile-deep",
  dark: "bg-tile-dark",
  surface: "bg-surface shadow-tile",
} as const;

function Item({ tile, index }: { tile: GalleryTile; index: number }) {
  return (
    <div
      className={cx(
        "relative h-[clamp(132px,17vw,208px)] shrink-0 overflow-hidden rounded-[16px]",
        fillClass[tileRotation[index % tileRotation.length]],
      )}
      style={{ aspectRatio: tile.ratio }}
    >
      {tile.image.src ? (
        <Image
          src={tile.image.src}
          alt={tile.image.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 60vw, 240px"
        />
      ) : (
        <span className="absolute inset-0 grid place-items-center px-3 text-center text-[11px] font-medium text-faint">
          {tile.image.placeholder}
        </span>
      )}
    </div>
  );
}

/** One half of the track. Both halves must be identical for the seam
 *  to land exactly on the 50% shift. */
function Row({ tiles, echo }: { tiles: GalleryTile[]; echo?: boolean }) {
  return (
    <div className="flex shrink-0 gap-4 pr-4" aria-hidden={echo || undefined}>
      {tiles.map((tile, i) => (
        <Item key={echo ? `echo-${tile.id}` : tile.id} tile={tile} index={i} />
      ))}
    </div>
  );
}

/**
 * Full-bleed row of work images drifting to the right. The track holds
 * the row twice, so shifting it by half its width lands on the seam and
 * the loop is invisible; the second copy is hidden from assistive tech
 * since it is the same content again.
 *
 * Motion, pause-on-hover and the reduced-motion fallback are all CSS,
 * so this stays a server component.
 */
export function Ticker({
  tiles,
  seconds = 70,
  className,
}: {
  tiles: GalleryTile[];
  seconds?: number;
  className?: string;
}) {
  return (
    <div
      className={cx("ticker", className)}
      style={{ "--ticker-duration": `${seconds}s` } as CSSProperties}
    >
      <div className="ticker-track">
        <Row tiles={tiles} />
        <Row tiles={tiles} echo />
      </div>
    </div>
  );
}
