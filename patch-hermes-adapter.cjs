#!/usr/bin/env node
/*
 * Codemod: make hermes-paperclip-adapter@0.3.0 inject the per-run Paperclip JWT.
 *
 * WHY: The published npm build of hermes-paperclip-adapter@0.3.0 never reads
 * ctx.authToken, so hermes_local agents start with NO PAPERCLIP_API_KEY in their
 * environment and every Paperclip API call returns 401. (The repo's `main` branch
 * already contains this fix, but it has not been published / version-bumped.)
 *
 * This script adds the same one-line injection the upstream `main` branch uses.
 *
 * HOW TO USE (durable): run it during the paperclip image build, AFTER
 * `pnpm install`, e.g. add to Dockerfile.railway:
 *     RUN node patch-hermes-adapter.cjs
 * or wire it as a postinstall step. It is idempotent (safe to re-run).
 *
 * Requires PAPERCLIP_AGENT_JWT_SECRET to be set on the paperclip service so the
 * server actually mints the JWT (already set for AGLG as of 2026-06-02).
 */
const fs = require("fs");
const path = require("path");

// Resolve the installed adapter regardless of pnpm hash dir.
function findExecuteJs() {
  const candidates = [];
  const base = path.join(process.cwd(), "node_modules");
  // direct (hoisted) path
  candidates.push(
    path.join(base, "hermes-paperclip-adapter", "dist", "server", "execute.js"),
  );
  // pnpm virtual store
  const pnpmDir = path.join(base, ".pnpm");
  if (fs.existsSync(pnpmDir)) {
    for (const d of fs.readdirSync(pnpmDir)) {
      if (d.startsWith("hermes-paperclip-adapter@")) {
        candidates.push(
          path.join(pnpmDir, d, "node_modules", "hermes-paperclip-adapter", "dist", "server", "execute.js"),
        );
      }
    }
  }
  return candidates.filter((p) => fs.existsSync(p));
}

const MARKER = "/*PCLIP_AUTHTOKEN_PATCH*/";
const ANCHOR = "const cwd = cfgString(config.cwd)";
const INJECT =
  MARKER +
  " if (ctx && ctx.authToken && !env.PAPERCLIP_API_KEY) { env.PAPERCLIP_API_KEY = ctx.authToken; } ";

let patched = 0;
const files = findExecuteJs();
if (files.length === 0) {
  console.error("hermes-paperclip-adapter execute.js not found — nothing to patch.");
  process.exit(0); // do not fail the build if the package layout changed
}
for (const f of files) {
  let s = fs.readFileSync(f, "utf8");
  if (s.includes(MARKER)) {
    console.log("already patched:", f);
    continue;
  }
  if (!s.includes(ANCHOR)) {
    console.error("anchor not found (adapter internals changed?):", f);
    continue;
  }
  s = s.replace(ANCHOR, INJECT + ANCHOR);
  fs.writeFileSync(f, s);
  patched++;
  console.log("patched:", f);
}
console.log(`done. files patched: ${patched}`);
