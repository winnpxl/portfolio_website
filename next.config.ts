import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The block game shipped as /games/tetris before it was renamed;
      // keep any shared links working.
      { source: "/games/tetris", destination: "/games/tetrix", permanent: true },
      // The gallery is locked while its shots are reworked. Temporary, so
      // browsers do not cache it; delete this line to reopen /gallery.
      { source: "/gallery", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
