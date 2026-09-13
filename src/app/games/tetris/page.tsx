import type { Metadata } from "next";

import { Nav } from "@/components/Nav";
import { gameNav, socials } from "@/components/navItems";
import { PageShell, Section } from "@/components/Page";
import { GameHeader } from "@/components/games/GameHeader";
import { Tetris } from "@/components/games/Tetris";

export const metadata: Metadata = {
  title: "Tetris — Samuel Winner",
  description: "Play Tetris with your keyboard. High scores are saved in your browser.",
};

export default function TetrisPage() {
  return (
    <PageShell>
      <Nav items={gameNav("Tetris")} socials={socials} />
      <GameHeader
        title="Tetris"
        blurb="Rotate and stack the falling pieces. Fill a row to clear it, and keep the well from overflowing."
      />
      <Section width={880} className="pb-[clamp(56px,8vw,104px)]">
        <Tetris />
      </Section>
    </PageShell>
  );
}
