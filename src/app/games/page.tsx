import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { Nav } from "@/components/Nav";
import { gamesNav, socials } from "@/components/navItems";
import { PageShell, Section } from "@/components/Page";
import { InvadersCover, TetrisCover } from "@/components/games/Covers";
import { BestScore } from "@/components/games/GameUI";
import type { GameId } from "@/components/games/leaderboard";
import { Eyebrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "Games — Samuel Winner",
  description: "Tetris and Space Invaders, rebuilt for this site and played with a keyboard.",
};

const GAMES: { id: GameId; href: string; title: string; blurb: string; keys: string; cover: ReactNode }[] = [
  {
    id: "tetris",
    href: "/games/tetris",
    title: "Tetris",
    blurb: "Rotate and stack the falling pieces. Clear rows before the well fills up.",
    keys: "Arrow keys, Space to drop",
    cover: <TetrisCover />,
  },
  {
    id: "space-invaders",
    href: "/games/space-invaders",
    title: "Space Invaders",
    blurb: "Hold the line against wave after wave marching down from above.",
    keys: "Arrow keys, Space to fire",
    cover: <InvadersCover />,
  },
];

export default function GamesPage() {
  return (
    <PageShell>
      <Nav items={gamesNav} socials={socials} />

      <Section className="pt-[clamp(48px,8vw,104px)]">
        <Eyebrow>Games</Eyebrow>
        <h1 className="text-pretty-wrap m-0 mt-5 max-w-[18ch] text-[clamp(34px,5vw,58px)] font-normal leading-[1.08] tracking-[-0.025em]">
          Take a break and play something.
        </h1>
        <p className="text-pretty-wrap m-0 mt-5 max-w-[54ch] text-[clamp(16px,1.5vw,19px)] leading-[1.6] text-muted">
          Two arcade classics I rebuilt from scratch for this site. Grab a keyboard, set a high score, and try to hold
          the top spot. Scores stay in your browser.
        </p>
      </Section>

      <Section className="py-[clamp(40px,6vw,80px)]">
        <div className="grid gap-x-6 gap-y-12 md:grid-cols-2">
          {GAMES.map((game) => (
            <Link key={game.id} href={game.href} data-sound className="group block">
              <div className="overflow-hidden rounded-[28px] border-[3px] border-arcade-ink transition-transform duration-300 ease-out group-hover:-translate-y-1">
                {game.cover}
              </div>
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="m-0 text-[22px] font-semibold tracking-[-0.015em]">{game.title}</h2>
                  <p className="m-0 mt-1.5 max-w-[40ch] text-[15px] leading-[1.5] text-muted">{game.blurb}</p>
                </div>
                <span className="shrink-0 rounded-full bg-ink px-4 py-2 text-[14px] font-medium text-canvas transition-colors group-hover:bg-ink-soft">
                  Play
                </span>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-faint">
                <span>{game.keys}</span>
                <BestScore game={game.id} />
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
