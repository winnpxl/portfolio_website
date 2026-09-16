import { Section } from "./Page";
import { LiveDot, Pill, cx } from "./ui";
import { contact, profile } from "@/content/site";

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

/**
 * The contact block and footer line that close the home page, shared so
 * other pages end the same way.
 */
export function SiteFooter() {
  return (
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
  );
}
