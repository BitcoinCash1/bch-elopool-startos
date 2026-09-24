# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

**Start every task at the recipe index** — `../start-technologies/projects/start-sdk/docs/src/recipes.md`
(or <https://docs.start9.com/packaging/recipes.html>). It maps an intent ("prompt the user to create
admin credentials", "expose a web UI") to the constructs, the reference pages, and a named production
package to copy. Find the recipe before you read this package's neighbours: a package you reach by
grepping may be non-conformant, and the recipe outranks it.

Freshly scaffolded? Work the
[New Package Checklist](../start-technologies/projects/start-sdk/docs/src/new-package-checklist.md)
(or <https://docs.start9.com/packaging/new-package-checklist.html>) from top to bottom. It is a
guide page, not a file in this repo — read it, don't copy it in.

Keep `README.md` (technical reference for an AI support or administering agent) and
`instructions.md` (end-user docs) in sync with your changes.

**Bugs and feature requests are GitHub issues on this repo** — file them as you find them.
Don't record work in the repo instead: no `TODO.md`, no `NOTES.md`, no `PLAN.md`. What you
verified, tried, and decided belongs in the commit message and the PR body.

## This repo

- **The two endpoints are genuinely different, and the difference is `ckpool -B`.** Shared mining pays a found block to `btcaddress` — the operator — and the operator settles with miners off-chain. `-B` is btcsolo: the coinbase pays the miner that found the block. Its sibling package, ASICSeer, has no solo mode at all because its upstream has none; don't mirror changes between the two without checking which upstream they land on.
- **`poolfee` is a percentage paid to `pooladdress`, and both are required.** ckpool computes `reward / 100 * poolfee` and gates the fee output on `poolvalid`, which is only set when `pooladdress` validates — so without that address no fee is taken however high the percentage. It also reads the number through jansson's `json_is_real`, which is false for a whole number. `fileModels/ckpool.conf.ts` handles the float; `main.ts` sets `pooladdress` and applies the fee to the **solo** config only, writing `poolfee: 0` on shared because the block already pays the operator. A revision of this package divided the fee by a hundred _and_ never set the address; it collected nothing.
- **`Dockerfile` builds ckpool from source, natively per arch.** Don't reintroduce the `--platform=linux/amd64` pin on the builder stage: it put amd64 binaries in the aarch64 image while the manifest claimed that arch.
- **`main` must never throw for a user-fixable problem.** A thrown `main` crash-loops under auto-restart and leaks a mount set every cycle, so the missing/mismatched address and unreachable node paths return a single failing `mining` health check instead.
- **Statistics must be wiped before the daemons launch.** ckpool reloads its totals from its status file at start, so clearing under a running pool achieves nothing. A chain change wipes both pools too — shares counted at one chain's difficulty mean nothing on another.
- **BCHN remaps its RPC port per chain**; BCHD and Flowee are fixed. BCHD is dialed through its plaintext proxy so no certificate has to be trusted.
- **The node is reached with `sdk.host.getBridgeAddress`, never `<package-id>.startos`** — that overlay DNS is deprecated and forbidden.
- **Each mining check scrapes its own log before probing its port.** ckpool holds the stratum port open while it cannot get a block template, so a bare port check reports a pool that mines nothing.

## Repository conventions

This repo is the original the Start9-Community copy is imported from. Keep it a
near-replica of that copy: every difference must be one of those listed below.

- **Syncing with Start9-Community:** `git merge` their `master` into ours, never
  rebase or force-push. Take their side for packaging, layout, docs and CI;
  keep only the deliberate differences below.
- **Branches:** `master` is released — every push to it runs Tag and Release,
  and so does the upstream bot's dispatch after an auto-bump.
  `next` is kept on purpose: Start9's Sync Next workflow mirrors `master` into
  it, so do not delete it.
- **Versions:** `<upstream>:<revision>` in the single `startos/versions/current.ts`.
  Never change the upstream part by hand; a new upstream starts at `:0` (the
  auto-bump does this). The revision is bumped only when the maintainer
  decides — never for alignment, template, docs, CI or archive changes. `ALLOW_DOWNGRADE` stays `false` unless a
  release is known to be reversible.
- **`assets/` vs `archive/`:** `assets/` is packed into the s9pk as a whole. Here
  it holds Start9's runtime files (nginx config, entrypoints, the stats API and
  worker scripts) that the service uses; leave them as Start9 has them.
  `archive/` holds reference material (`ABOUT.md`, logos, picture variants) and
  is not packed. Never delete anything in `archive/`.
- **What StartOS shows:** name from `title` in `startos/manifest/index.ts`,
  description and About text from `short`/`long` in `startos/manifest/i18n.ts`,
  Instructions tab from `instructions.md` (required), logo from `icon.png`.
- **Commit and PR hygiene:** no session links, `Co-Authored-By` trailers or
  "Generated with" footers in commit messages, PR descriptions or comments.
  The Session Link Guard workflow fails any PR or push that carries one.
  Commits are authored by the maintainer, and all repository text (code
  comments, docs, commit messages, PR text) is written in the maintainer's
  voice, without naming the tools used to produce it.
- **Toolchain:** always follow the latest Start9 tooling — the newest
  `@start9labs/start-sdk` on npm (pinned exactly, with the `overrides` entry),
  the newest `start-cli` release, and the latest `Start9Labs/hello-world-startos`
  template. Its boilerplate files (workflows, `Makefile`, `tsconfig.json`,
  `.gitignore`, `.dockerignore`, `CLAUDE.md`, `startos/index.ts`,
  `startos/sdk.ts`, `startos/i18n/index.ts`, `startos/versions/index.ts`) stay
  byte-identical to it unless a difference is listed below. When the template,
  SDK or CLI moves, update every package. Where the template and the
  Start9-Community copy disagree, the template wins.
- **Deliberate differences from Start9-Community:** newer upstream (skaisser's ckpool v1.3.0; the "id" patch in `patches/apply.py` anchors 9 RPC requests there, since upstream no longer calls `validateaddress`); ckpool `highdiff` pinned to the start difficulty (in `fileModels/ckpool.conf.ts` and `main.ts`; ckpool otherwise starts ports above 4000, including solo on 4567, at 1,000,000); Knuth (`knuth-bch`) as a fourth node backend (utils, dependencies with a recurring autoconfig task, selectNode, manifest, i18n); `ALLOW_DOWNGRADE` in `current.ts`; `check-upstream.yml` + `scripts/auto-bump.sh` (daily upstream tag check, commits the bump to `master` and dispatches Tag and Release; `tagAndRelease.yml` accepts that dispatch); `dependabot.yml`; `session-link-guard.yml`; `scripts/setup-vm-forwarding*` (LAN port forwarding for StartOS in a libvirt/KVM VM); `startos/index.ts` and `startos/sdk.ts` synced to the hello-world template; `archive/` (including the old `icon.png`); the matching README/instructions notes.
