import type { Metadata } from "next";

import { CaseStudyPage } from "@/components/CaseStudy";
import { runbeta } from "@/content/runbeta";

export const metadata: Metadata = {
  title: `${runbeta.name} case study — Samuel Winner`,
  description: runbeta.intro[0],
};

export default function RunBetaCaseStudy() {
  return <CaseStudyPage study={runbeta} />;
}
