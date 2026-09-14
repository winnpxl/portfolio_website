import type { Metadata } from "next";

import { CaseStudyPage } from "@/components/CaseStudy";
import { gojaye } from "@/content/gojaye";

export const metadata: Metadata = {
  title: `${gojaye.name} case study — Samuel Winner`,
  description: gojaye.intro[0],
};

export default function GoJayeCaseStudy() {
  return <CaseStudyPage study={gojaye} />;
}
