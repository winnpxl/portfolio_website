import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { profile } from "@/content/site";

/**
 * The card shown when a link to the site is pasted into a message,
 * a post or a search result. Rendered once at build time.
 *
 * The type is next/og's own face rather than PP Mori: it rasterises
 * fonts with Satori, which does not read woff2, and woff2 is the only
 * cut of Mori in the repo.
 */

export const alt = `${profile.name}, ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const portrait = await readFile(join(process.cwd(), "public/images/my_photo.JPG"));
  const src = `data:image/jpeg;base64,${portrait.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#f5f5f3",
          color: "#111110",
          padding: 72,
          gap: 56,
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
          <div style={{ fontSize: 26, color: "#6f6f6a" }}>{profile.location}</div>
          <div style={{ fontSize: 86, fontWeight: 600, letterSpacing: -3, marginTop: 18 }}>
            {profile.name}
          </div>
          <div style={{ fontSize: 34, color: "#3d3d3a", marginTop: 14, maxWidth: 560 }}>
            {profile.role}
          </div>
          <div style={{ display: "flex", marginTop: 40, fontSize: 26, color: "#6f6f6a" }}>
            canvasofsam.pro
          </div>
        </div>
        <img
          src={src}
          alt=""
          width={372}
          height={486}
          style={{ borderRadius: 28, objectFit: "cover", objectPosition: "50% 60%" }}
        />
      </div>
    ),
    size,
  );
}
