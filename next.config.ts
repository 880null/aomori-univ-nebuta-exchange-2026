import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";
const basePath: string = isProduction
  ? "/aomori-univ-nebuta-exchange-2026"
  : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
