import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static build → `out/` folder, deployable on any static host.
  output: "export",
  // No image optimization server in a static export.
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
