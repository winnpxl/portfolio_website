import type { ImageSlot } from "./site";

export type GalleryTile = {
  id: string;
  /** Frame aspect ratio, matching the prototype tile for tile. */
  ratio: "16/9" | "3/4" | "1/1" | "4/3";
  /** Tiles 1 and 6 run double width on wide viewports. */
  wide?: boolean;
  tone?: "cream" | "butter" | "rose";
  caption: string;
  meta: string;
  image: ImageSlot;
};

export const galleryHeader = {
  pills: [
    { label: "Shots & studies" },
    { label: "Updated as I ship" },
  ],
  title: "Gallery",
  lead: "Screens, components and visual studies from client work and side projects.",
};

export const galleryCta = {
  title: "Want the thinking behind any of these?",
  label: "Read the case studies →",
  href: "/#work",
};

export const tiles: GalleryTile[] = [
  { id: "gal-01", ratio: "16/9", wide: true, caption: "Caption goes here", meta: "Project, year", image: { alt: "", placeholder: "Drop a wide shot" } },
  { id: "gal-02", ratio: "3/4", caption: "Caption goes here", meta: "Project, year", image: { alt: "", placeholder: "Drop a mobile screen" } },
  { id: "gal-03", ratio: "1/1", caption: "Caption goes here", meta: "Project, year", image: { alt: "", placeholder: "Drop a square shot" } },
  { id: "gal-04", ratio: "3/4", caption: "Caption goes here", meta: "Project, year", image: { alt: "", placeholder: "Drop a mobile screen" } },
  { id: "gal-05", ratio: "4/3", caption: "Caption goes here", meta: "Project, year", image: { alt: "", placeholder: "Drop a component sheet" } },
  { id: "gal-06", ratio: "16/9", wide: true, caption: "Caption goes here", meta: "Project, year", image: { alt: "", placeholder: "Drop a wide shot" } },
  { id: "gal-07", ratio: "1/1", caption: "Caption goes here", meta: "Project, year", image: { alt: "", placeholder: "Drop a square shot" } },
  { id: "gal-08", ratio: "3/4", caption: "Caption goes here", meta: "Project, year", image: { alt: "", placeholder: "Drop a mobile screen" } },
  { id: "gal-09", ratio: "4/3", caption: "Caption goes here", meta: "Project, year", image: { alt: "", placeholder: "Drop a shot" } },
  { id: "gal-10", ratio: "1/1", caption: "Caption goes here", meta: "Project, year", image: { alt: "", placeholder: "Drop a square shot" } },
  { id: "gal-11", ratio: "3/4", caption: "Caption goes here", meta: "Project, year", image: { alt: "", placeholder: "Drop a mobile screen" } },
  { id: "gal-12", ratio: "4/3", caption: "Caption goes here", meta: "Project, year", image: { alt: "", placeholder: "Drop a shot" } },
];
