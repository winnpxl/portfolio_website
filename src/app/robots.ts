import type { MetadataRoute } from "next";

import { site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // The scores endpoint is data, not a page; everything else is open.
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: new URL("/sitemap.xml", site.url).href,
  };
}
