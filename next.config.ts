import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Parent folder (F:\dccal\projek) has its own lockfile which confuses
  // Next.js root detection — pin the root to this project.
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
