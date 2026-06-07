# AGLG Phase 0 — Brain Substrate Standup — Readiness / Blocker Report

**Date:** 2026-06-07
**Author:** Claude Code (remote web session)
**Gate status:** ❌ **BLOCKED at environment-readiness — Step 0. No standup steps executed.**
**Action requested:** Daniel's direction on where/how to run this (see "What's needed" below).

---

## TL;DR

This task is authored to run in the environment where **Railway + Paperclip
credentials live** (`runs_in: Claude Code (his environment …)`). It was instead
dispatched to an **ephemeral cloud container that freshly cloned the open-source
`paperclip` repo**. That container has **none** of the infrastructure access or
credentials the nine steps require. Per the task's own guardrail — *"Cascade-test
each step. On any failure: stop and report, don't patch"* — I stopped at the
first gate (environment readiness) instead of fabricating progress.

**Nothing was deployed, provisioned, wired, or modified.** No Supabase, no
Hindsight, no Obsidian vault, no Paperclip changes. This report is the only
artifact produced.

---

## What I verified in this environment

| Capability the task needs | Present here? | Evidence |
| --- | --- | --- |
| Railway CLI / Railway creds (deploy to "AGLG Railway instance") | ❌ No | `railway` not on PATH; no `RAILWAY_*` env vars |
| Docker **daemon** (run Hindsight container; run a Supabase stack) | ❌ No | `docker` binary present but `docker info` → no daemon reachable |
| `docker-compose` | ❌ No | not on PATH |
| Self-hosted Supabase tooling | ❌ No | `supabase` CLI absent |
| Hindsight (image, endpoint, or creds) | ❌ No | not in repo; no `HINDSIGHT_*` env; it is an external product |
| Obsidian (vault render, plugin install) | ❌ No | not installed; `os-setup` / `team-os` / `os-mcp` / `obsidian-paperclip` not present |
| Paperclip control-plane creds (reach `paperclip-production-9e45`) | ❌ No | none of `PAPERCLIP_API_URL` / `PAPERCLIP_AGENT_ID` / `PAPERCLIP_API_KEY` injected — this is **not** a Paperclip heartbeat run |
| The 7 brain-build skills to import | ❌ No | `traction-eos`, `positioning-canvas`, `jobs-to-be-done`, `process-doc`, `process-optimization`, `copychief`, `conversation-distillate` are absent from this repo |
| `AGLG-CEO-Arc1-Brain-Build-Brief.md` | ❌ No | not found anywhere in the working tree |
| Standalone Anthropic API key (Hindsight LLM provider) | ❌ No | only `ANTHROPIC_BASE_URL=https://api.anthropic.com`; auth is harness OAuth, not a portable key |
| `psql`, `node`, `pnpm`, `git`, `curl` | ✅ Yes | present (but no target DB/host to point them at) |

### Guardrail conflict worth flagging
A **managed Supabase Cloud MCP server** *is* attached to this session. The task
explicitly forbids it: *"Never Hindsight Cloud, never managed Supabase cloud …
everything self-hosted on the AGLG Railway instance."* I therefore did **not**
use it to provision anything. Using it would directly violate the per-customer
on-instance isolation requirement.

---

## Step-by-step: why each step is blocked here

0. **Environment readiness** — ❌ wrong environment (this report). Everything below cascades from this.
1. **Self-hosted Supabase on the AGLG instance** — no Railway access, no Docker daemon, no `supabase` CLI. Cannot deploy or confirm PG15+/pgvector.
2. **Hindsight (Docker)** — no Docker daemon, no Hindsight image/endpoint/creds. Cannot deploy or run the `retain`→`recall` smoke test.
3. **Obsidian vault skeleton (`os-setup`)** — Obsidian and the `os-setup` tooling are not present. Cannot scaffold the vault.
4. **Access layer (`team-os` Relay + RBAC)** — `team-os` not present; no instance to host it. Cannot configure canonical/staging zones.
5. **Agent connection (`os-mcp`)** — `os-mcp` not present. Nothing to wire.
6. **Cockpit (`obsidian-paperclip`)** — plugin not present, no vault, no reachable Paperclip server. Cannot install or point at AGL company.
7. **Memory wiring (vault→Hindsight; agent recall via Hindsight MCP)** — no Hindsight endpoint and no vault. Nothing to wire.
8. **Add 7 skills to existing CEO (Paperclip, AGL org)** — no Paperclip control-plane creds; the shared instance lives off this box. Cannot import/assign.
9. **Load CEO brief** — the brief file does not exist in this environment to load.

---

## What's needed to actually run Phase 0 (pick one)

**Option A — run it in the intended environment (recommended).**
Re-dispatch this task into Daniel's Claude Code environment where the Railway and
Paperclip credentials already live, with a Docker daemon and Obsidian available.
That is what the task header (`runs_in`) assumes.

**Option B — provision this container with the missing access.**
If this remote session is to do it, it needs, at minimum:
- Railway API token (+ project ref for the AGLG instance), or a reachable
  Postgres URL for the self-hosted Supabase once it exists.
- A reachable Docker daemon (or a Railway/Nixpacks deploy path) for Hindsight.
- Hindsight image reference + `HINDSIGHT_API_DATABASE_URL` target + a portable
  Anthropic API key for its LLM provider.
- Paperclip control-plane creds for the AGL org on `paperclip-production-9e45`
  (`PAPERCLIP_API_URL` + an API key/JWT with rights to assign skills to the CEO).
- The 7 brain-build skill packages (source/registry), and the
  `AGLG-CEO-Arc1-Brain-Build-Brief.md` file.
- Obsidian (or the headless `os-setup`/`team-os`/`os-mcp` toolchain) to scaffold
  and serve the vault.

---

## Validation gate — status

Every item below is **NOT MET** because no step ran:

- [ ] Supabase up; PG15+ and pgvector present.
- [ ] Hindsight up; `retain`/`recall` round-trips against Supabase.
- [ ] Vault renders in Obsidian; graph view + routing chain walk.
- [ ] Amy reaches only her staging zone.
- [ ] obsidian-paperclip shows AGL issues inside the vault.
- [ ] vault→Hindsight ingestion path live; agent recall reaches AGL's Hindsight via MCP.
- [ ] The 7 skills assigned to the existing CEO; the brief loaded.

**No session was started** (the gate forbids it regardless).
