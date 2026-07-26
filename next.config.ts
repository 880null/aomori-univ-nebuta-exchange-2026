import type { NextConfig } from "next";
import { getBasePath } from "./config/base-path.mjs";

const basePath = getBasePath();

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
