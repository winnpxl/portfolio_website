import type { MetadataRoute } from "next";

import { site, work } from "@/content/site";

/**
 * Every page worth indexing. Case studies come from `work`, so a project
 * that gains an `href` is listed without touching this file.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/about",
    "/gallery",
    "/games",
    "/games/tetrix",
    "/games/space-invaders",
    ...work.flatMap((project) => (project.href ? [project.href] : [])),
  ];

  const now = new Date();
  return paths.map((path) => ({
    url: new URL(path, site.url).href,
    lastModified: now,
    priority: path === "/" ? 1 : 0.7,
  }));
}
