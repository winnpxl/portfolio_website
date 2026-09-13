import type { Metadata } from "next";

import { Nav } from "@/components/Nav";
import { gameNav, socials } from "@/components/navItems";
import { PageShell, Section } from "@/components/Page";
import { GameHeader } from "@/components/games/GameHeader";
import { SpaceInvaders } from "@/components/games/SpaceInvaders";

export const metadata: Metadata = {
  title: "Space Invaders — Samuel Winner",
  description: "Play Space Invaders with your keyboard. High scores are saved in your browser.",
};

/** Space is dark, so this whole page is: theme-space flips the colour tokens. */
export default function SpaceInvadersPage() {
  return (
    <div className="theme-space">
      <PageShell>
        <Nav items={gameNav("Space Invaders")} socials={socials} />
        <GameHeader
          title="Space Invaders"
          blurb="Move, fire and duck behind the bunkers. Each wave marches faster than the last."
        />
        <Section width={880} className="pb-[clamp(56px,8vw,104px)]">
          <SpaceInvaders />
        </Section>
      </PageShell>
    </div>
  );
}
