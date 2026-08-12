<p align="center">
  <img src="icon.svg" alt="EloPool Logo" width="21%">
</p>

# EloPool on StartOS

> **Upstream docs:** <https://github.com/skaisser/ckpool>
>
> Everything not listed in this document should behave the same as upstream
> ckpool. If a feature, setting, or behavior is not mentioned here, the upstream
> documentation is accurate and fully applicable.

[ckpool](https://github.com/skaisser/ckpool) is a Bitcoin Cash mining pool server — a fork of Con Kolivas' ckpool with CashAddr support. This package runs it as two pools at once, shared and solo, against a Bitcoin Cash full node installed on the same StartOS server, and adds a web dashboard for monitoring them.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions (StartOS UI)](#actions-startos-ui)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Dependencies](#dependencies)
- [Limitations and Differences](#limitations-and-differences)
- [What Is Unchanged from Upstream](#what-is-unchanged-from-upstream)
- [Contributing](#contributing)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

One image, `elopool`, built from the package `Dockerfile`. There is no upstream image: the first stage clones `skaisser/ckpool` at the tag pinned in `CKPOOL_REF` and builds it with autotools; the runtime stage is `node:20-bookworm-slim` with nginx, curl and jq added.

Architectures: `x86_64` and `aarch64`, each built natively.

`patches/apply.py` runs against the upstream source before it is compiled. Upstream targets Bitcoin Cash Node, and each patch fixes something that is otherwise silently broken against one of the other two nodes — a JSON-RPC request with no `id` member and a `coinbasetxn` GBT capability (both rejected by BCHD), and a `coinbaseaux` field that Flowee omits and the pool dereferences. Every patch asserts its expected hit count, so an upstream bump that moves one of these lines fails the image build rather than producing a pool that cannot mine.

Four daemons share the one image:

| Daemon | Subcontainer | Command                                | Purpose                         |
| ------ | ------------ | -------------------------------------- | ------------------------------- |
| `pool` | `pool-sub`   | `pool-entrypoint.sh pool <conf>`       | Shared stratum server           |
| `solo` | `solo-sub`   | `pool-entrypoint.sh solo <conf>`       | Solo stratum server (`ckpool -B`) |
| `ui`   | `ui-sub`     | `ui-entrypoint.sh`                     | nginx + stats writer            |

`pool-entrypoint.sh` wraps the ckpool binary rather than replacing it: it restarts the daemon if it exits abnormally, pre-creates the sharelog directory for the next few block heights (upstream only creates it when it sees a new block, so shares submitted in between are dropped from the only per-worker record that is persisted), and stages the live client table to the shared volume so the dashboard can derive a per-worker submission count.

## Volume and Data Layout

One volume, `main`, mounted at `/data` in all three subcontainers.

| Path                        | Contents                                                        |
| --------------------------- | --------------------------------------------------------------- |
| `/data/store.json`          | StartOS-side settings — node choice, payout address, pool params |
| `/data/pool/ckpool.conf`    | Generated shared-pool config, rewritten on every start          |
| `/data/solo/ckpool.conf`    | Generated solo config, rewritten on every start                 |
| `/data/{pool,solo}/log/`    | Pool status, sharelogs, per-user files — the mining statistics   |

The selected node's own `main` volume is mounted read-only at `/mnt/node`. Nothing reads chain data from it; it is there so `main` can read the node's `store.json` for the chain it is on and, on Bitcoin Cash Node and Bitcoin Cash Daemon, its RPC credentials.

## Installation and First-Run Flow

Two critical tasks are raised on install: **Select Node Backend** and **Configure**. Neither pool can mine without both — an unset payout address means a shared-mined block would pay nowhere.

`main` refuses to start the mining daemons and reports a single failing **Mining** health check when the payout address is missing, belongs to a different chain than the node is on, or the node's RPC is not reachable. It does not throw: a thrown `setupMain` crash-loops the service under auto-restart and leaks a subcontainer mount set on every cycle.

Choosing Flowee the Hub additionally raises a task on Flowee. Flowee stores only a hash of each RPC password and cannot hand one back, so this package mints a credential on first init and registers it there through Flowee's own `create-dependent-credential` action.

## Configuration Management

| StartOS-Managed                                                               | Upstream-Managed                          |
| ----------------------------------------------------------------------------- | ----------------------------------------- |
| Both `ckpool.conf` files in full — RPC target and credentials, payout address, pool signature, stratum ports, log directories, solo fee, starting difficulty | Nothing — the config files are regenerated on every start and hand edits are lost |

The settings a user can change are the four inputs of the **Configure** action plus the node choice in **Select Node Backend**. Everything else in the generated configs is fixed at upstream's defaults.

Two details of how ckpool reads a fee are load-bearing:

- `poolfee` is a **percentage**, not a fraction — the coinbase deduction is `reward / 100 * poolfee`.
- The fee is paid to **`pooladdress`**, a separate key. `poolvalid` is only set when that address validates, and the fee branch is gated on it, so without `pooladdress` no fee is taken however high the percentage.

It is written with a decimal point even when whole, because ckpool reads it through jansson's `json_is_real`, which is false for an integer.

The fee is applied to the solo config only. Shared mining already pays the whole block to `btcaddress` — the operator's own payout address — so a fee output there would only take a cut of their own reward.

## Network Access and Interfaces

| Interface     | Id            | Internal port | Protocol | Type  | Purpose                    |
| ------------- | ------------- | ------------- | -------- | ----- | -------------------------- |
| Pool Mining   | `pool-mining` | 3333          | raw TCP  | `p2p` | Shared stratum endpoint    |
| Solo Mining   | `solo-mining` | 4567          | raw TCP  | `p2p` | Solo stratum endpoint      |
| Web Dashboard | `web-ui`      | 80            | HTTP     | `ui`  | Mining statistics          |

Both stratum interfaces carry a `schemeOverride` of `stratum+tcp`, so the addresses StartOS shows are in the form a miner accepts. Stratum is unencrypted — mining hardware does not speak TLS — so both bind with `secure: { ssl: false }`.

Where each interface is reachable is the user's choice, made in StartOS.

## Actions (StartOS UI)

| Name                | Id                  | Visibility | Availability | Inputs                                                            | Outputs                    |
| ------------------- | ------------------- | ---------- | ------------ | ----------------------------------------------------------------- | -------------------------- |
| Connection Info     | `connection-info`   | enabled    | only running | none                                                              | Stratum URLs, username and password format |
| Configure           | `configure`         | enabled    | any          | Payout address, solo fee, pool identifier, starting difficulty    | none                       |
| Select Node Backend | `select-node`       | enabled    | any          | Node package                                                      | none                       |
| Wipe Mining State   | `wipe-mining-state` | enabled    | any          | none                                                              | none                       |

**Configure** and **Select Node Backend** write `store.json`, which `main` reads through a mapped `.const()` — the write is what restarts the pools onto the new settings.

**Wipe Mining State** sets a flag and restarts. The deletion happens in `main` before the daemons launch, because ckpool reloads its accumulated totals from `{logdir}/pool/pool.status` on every start; deleting them while it is running would simply write them back. `main` performs the same wipe unprompted when the node's chain has changed since the last start, since shares counted against one chain's difficulty mean nothing on another.

## Backups and Restore

The `main` volume in full, which is the settings and the mining statistics. Restoring returns the pools to the settings and statistics of the backup; connected miners reconnect on their own.

## Health Checks

| Check         | Display       | What it reports                                                                                    |
| ------------- | ------------- | -------------------------------------------------------------------------------------------------- |
| `pool` daemon | Shared Mining | The last lines of the pool's log first — a rejected payout address or an unreachable node fail here — then that the stratum port is listening |
| `solo` daemon | Solo Mining   | The same, for the solo pool                                                                        |
| `ui` daemon   | Web Dashboard | Port 80 listening                                                                                  |
| `node-status` | Node          | Re-reads the node's `store.json`: restarts the service if the node changed chain, fails if it is unreadable, loads while the node is still syncing |
| `mining`      | Mining        | Replaces all of the above when neither pool can run — no payout address, wrong-chain address, or no reachable node |

The log check exists because ckpool holds the stratum port open while unable to build work, so a bare port check reports a healthy pool that mines nothing.

`node-status` is where a chain change is noticed, for every node. Bitcoin Cash Node does move its RPC port with the chain, but the binding it moves off is left *disabled* rather than removed, and a disabled binding still resolves to its old address — so the bridge address `main` watches does not go null and would not re-run `main` on its own.

## Dependencies

Exactly one node is needed at a time — whichever **Select Node Backend** has chosen — so all three are declared optional.

| Dependency          | Package id     | Health check     | Mounted                   | Purpose                                    |
| ------------------- | -------------- | ---------------- | ------------------------- | ------------------------------------------ |
| Bitcoin Cash Node   | `bitcoincashd` | `primary`        | `main` → `/mnt/node` (ro) | Block templates over JSON-RPC              |
| Bitcoin Cash Daemon | `bchd`         | `rpc-plaintext`  | `main` → `/mnt/node` (ro) | The same, dialed through BCHD's plaintext proxy so no certificate has to be trusted |
| Flowee the Hub      | `flowee`       | `primary`        | `main` → `/mnt/node` (ro) | The same, with a credential this package registers on it |

The dependency is gated on the node being up, not on it being synced — a pool that refused to start until a fresh chain had synced would be unusable for days. Sync state is reported by the `node-status` health check instead.

No autoconfig task is raised on Bitcoin Cash Node or Bitcoin Cash Daemon. The pool calls only `getblocktemplate`, `submitblock`, `validateaddress`, `getrawtransaction` and the chain-info reads, none of which need a transaction index or an unpruned chain.

## Limitations and Differences

1. **Knuth is not supported.** It serves mining templates through `getblocktemplatelight` / `submitblocklight`; ckpool speaks classic `getblocktemplate` only.
2. **Shared mining has no on-chain payout split.** That is ckpool's design: a block found on the shared endpoint pays entirely to the operator's address, and the operator settles with miners by whatever means they choose. Only the solo endpoint pays miners in the coinbase.
3. **Both config files are regenerated on every start.** Any hand edit to `/data/{pool,solo}/ckpool.conf` is overwritten.
4. **Only a subset of upstream's configuration is exposed.** `mindiff_overrides`, multiple `serverurl` entries, `donation`, ZMQ block notification and node/proxy/redirector/passthrough modes are all left at upstream defaults and are not settable.
5. **The node must be on the same StartOS server.** There is no option to point the pool at a remote node.
6. **The dashboard's suggested stratum URLs use the pools' internal ports.** Use the **Connection Info** action for the addresses StartOS actually assigned.

## What Is Unchanged from Upstream

- The stratum v1 protocol, vardiff behavior, and share accounting.
- `btcsolo` mode, which is what the solo endpoint runs: the coinbase pays the miner that found the block, less the `poolfee` output.
- The username-as-address convention, including the `address.workername` suffix.
- CashAddr handling, which this fork decodes itself rather than asking the node — which is why no `validateaddress` patch is needed here.
- The on-disk log layout ckpool writes: `pool.status`, the per-user files, and the per-height sharelog directories.

## Contributing

See [AGENTS.md](./AGENTS.md).

---

## Quick Reference for AI Consumers

```yaml
package_id: bch-elopool
architectures: [x86_64, aarch64]
volumes:
  main: /data
mounted_dependency_volumes:
  '<selected node>:main': /mnt/node (read-only)
ports:
  pool-mining: 3333
  solo-mining: 4567
  web-ui: 80
dependencies: [bitcoincashd, bchd, flowee] # all optional; exactly one selected
startos_managed_env_vars: []
startos_managed_files:
  - /data/pool/ckpool.conf
  - /data/solo/ckpool.conf
  - /data/store.json
actions:
  - connection-info
  - configure
  - select-node
  - wipe-mining-state
health_checks:
  - pool
  - solo
  - ui
  - node-status
```
