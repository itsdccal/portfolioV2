import { spawn } from "node:child_process";
import { createRequire } from "node:module";

// The machine's global env sets NODE_ENV=production, which breaks
// `next dev`. Force development mode before spawning the Next.js CLI.
process.env.NODE_ENV = "development";

const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");

const child = spawn(process.execPath, [nextBin, "dev"], {
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code) => process.exit(code ?? 0));
