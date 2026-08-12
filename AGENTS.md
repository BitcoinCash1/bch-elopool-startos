# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (architecture, for developers and LLMs) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **Package id is `bch-elopool`.** Runs [ckpool](https://github.com/skaisser/ckpool) as a shared pool and a solo pool at once, against one of three Bitcoin Cash node packages, plus a static web dashboard served by nginx. One image, one `main` volume, three daemons.
- **The two endpoints are genuinely different, and the difference is `ckpool -B`.** Shared mining pays a found block to `btcaddress` — the operator — and the operator settles with miners off-chain. `-B` is btcsolo: the coinbase pays the miner that found the block. Its sibling package, ASICSeer, has no solo mode at all because its upstream has none; don't mirror changes between the two without checking which upstream they land on.
- **`poolfee` is a percentage paid to `pooladdress`, and both are required.** ckpool computes `reward / 100 * poolfee` and gates the fee output on `poolvalid`, which is only set when `pooladdress` validates — so without that address no fee is taken however high the percentage. It also reads the number through jansson's `json_is_real`, which is false for a whole number. `fileModels/ckpool.conf.ts` handles the float; `main.ts` sets `pooladdress` and applies the fee to the solo config only. A revision of this package divided the fee by a hundred *and* never set the address; it collected nothing.
- **`patches/apply.py` is load-bearing, and it fails loudly on purpose.** Upstream targets Bitcoin Cash Node; each patch fixes something that is otherwise silently broken against BCHD or Flowee. Every replacement asserts its expected hit count, so an upstream bump that moves a line fails the image build. Reanchor the patch — never loosen the assertion, and never make one optional. There is no `validateaddress` patch here, unlike ASICSeer: this fork decodes CashAddr itself and never asks the node.
- **`Dockerfile` builds ckpool from source, natively per arch.** Don't reintroduce the `--platform=linux/amd64` pin on the builder stage: it put amd64 binaries in the aarch64 image while the manifest claimed that arch.
- **The node is reached with `sdk.host.getBridgeAddress`, never `<package-id>.startos`.** That overlay DNS is deprecated and forbidden; see the packaging guide's Service-to-Service Networking page.
- **Flowee publishes no RPC password.** It stores only a hash, so `seedFiles` mints a credential and `selectNode` raises a task on Flowee to register it. Bitcoin Cash Node and Bitcoin Cash Daemon publish theirs in their own `store.json`, which `main` reads off the read-only mount at `/mnt/node`.

## Inspecting a running install

To run a command inside one of the service's containers, use `start-cli package attach bch-elopool -n pool-sub -- <cmd>` (or `-n solo-sub` / `-n ui-sub`). Select the subcontainer by **name** with `-n` (the name passed to `SubContainer.of` in `main.ts`) or by image with `-i`. Note: `-s/--subcontainer` matches the internal **Guid**, not the name, so passing a name to `-s` fails with "no matching subcontainers".
