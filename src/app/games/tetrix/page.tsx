import type { Metadata } from "next";

import { Nav } from "@/components/Nav";
import { gameNav, socials } from "@/components/navItems";
import { PageShell } from "@/components/Page";
import { Tetris } from "@/components/games/Tetris";

export const metadata: Metadata = {
  title: "Tetrix — Samuel Winner",
  description: "Play Tetrix with a keyboard or touch controls. High scores are saved in your browser.",
};

export default function TetrixPage() {
  return (
    <PageShell>
      <Nav items={gameNav("Tetrix")} socials={socials} />
      <main className="mx-auto max-w-[1280px] px-[clamp(20px,5vw,72px)] pb-[clamp(40px,6vw,64px)] pt-[clamp(12px,2vw,24px)]">
        <Tetris
          title="Tetrix"
          blurb="Rotate and stack the falling pieces. Fill a row to clear it, and keep the well from overflowing."
        />
      </main>
    </PageShell>
  );
}
