import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The block game shipped as /games/tetris before it was renamed;
      // keep any shared links working.
      { source: "/games/tetris", destination: "/games/tetrix", permanent: true },
    ];
  },
};

export default nextConfig;
