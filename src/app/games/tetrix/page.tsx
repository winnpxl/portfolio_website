import type { Metadata } from "next";

import { Nav } from "@/components/Nav";
import { gameNav, socials } from "@/components/navItems";
import { PageShell, Section } from "@/components/Page";
import { GameHeader } from "@/components/games/GameHeader";
import { Tetris } from "@/components/games/Tetris";

export const metadata: Metadata = {
  title: "Tetrix — Samuel Winner",
  description: "Play Tetrix with a keyboard or touch controls. High scores are saved in your browser.",
};

export default function TetrixPage() {
  return (
    <PageShell>
      <Nav items={gameNav("Tetrix")} socials={socials} />
      <GameHeader
        title="Tetrix"
        blurb="Rotate and stack the falling pieces. Fill a row to clear it, and keep the well from overflowing."
      />
      <Section width={880} className="pb-[clamp(56px,8vw,104px)]">
        <Tetris />
      </Section>
    </PageShell>
  );
}
