import Link from "next/link";

import { Section } from "@/components/Page";

/** Compact title row, kept short so the board fits on screen beneath it. */
export function GameHeader({ title, blurb }: { title: string; blurb: string }) {
  return (
    <Section width={880} className="pb-6 pt-[clamp(28px,4.5vw,52px)]">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <div>
          <Link href="/games" className="text-[13px] font-medium text-muted transition-colors hover:text-ink">
            Games
          </Link>
          <h1 className="m-0 mt-2 text-[clamp(32px,4.4vw,48px)] font-semibold leading-none tracking-[-0.025em]">
            {title}
          </h1>
        </div>
        <p className="m-0 max-w-[42ch] text-[15px] leading-[1.5] text-muted">{blurb}</p>
      </div>
    </Section>
  );
}
