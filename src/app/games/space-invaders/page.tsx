import type { Metadata } from "next";

import { Nav } from "@/components/Nav";
import { gameNav, socials } from "@/components/navItems";
import { PageShell } from "@/components/Page";
import { SpaceInvaders } from "@/components/games/SpaceInvaders";

export const metadata: Metadata = {
  title: "Space Invaders — Samuel Winner",
  description: "Play Space Invaders with a keyboard or touch controls. High scores are saved in your browser.",
};

/** Space is dark, so this whole page is: theme-space flips the colour tokens. */
export default function SpaceInvadersPage() {
  return (
    <div className="theme-space">
      <PageShell>
        <Nav items={gameNav("Space Invaders")} socials={socials} />
        <main className="mx-auto max-w-[1280px] px-[clamp(20px,5vw,72px)] pb-[clamp(40px,6vw,64px)] pt-[clamp(12px,2vw,24px)]">
          <SpaceInvaders
            title="Space Invaders"
            blurb="Move, fire and duck behind the bunkers. Each wave marches faster than the last."
          />
        </main>
      </PageShell>
    </div>
  );
}
