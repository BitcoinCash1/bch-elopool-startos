<p align="center">
  <img src="icon.png" alt="EloPool Logo" width="21%">
</p>

# EloPool on StartOS

> Everything not listed in this document should behave the same as upstream
> EloPool. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[EloPool](https://github.com/skaisser/ckpool) is a Bitcoin Cash fork of ckpool: a mining pool your hardware connects to over stratum, building block templates from your own node. This package runs it as **two pools at once** — shared and solo — plus a dashboard, against whichever of the four Bitcoin Cash nodes you choose.

- **Upstream repo:** <https://github.com/skaisser/ckpool>
- **Wrapper repo:** <https://github.com/Start9-Community/bch-elopool-startos>

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Upstream Updates](#upstream-updates)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

One image, built here, running three times.

| Property      | Value                                     |
| ------------- | ----------------------------------------- |
| Image         | Built from this repo's `Dockerfile`       |
| Architectures | x86_64, aarch64                           |
| Command       | The pool in two modes, plus the dashboard |

| Subcontainer | Purpose                                    |
| ------------ | ------------------------------------------ |
| `pool-sub`   | The shared pool — attach here for its logs |
| `solo-sub`   | The solo pool, same image, different mode  |
| `ui-sub`     | The dashboard                              |

**The image is built from source, natively for each architecture.** Cross-building it on one platform would put the wrong binaries in the other architecture's image while the manifest claimed otherwise.

## Volume and Data Layout

One volume, plus a read-only view of the selected node's.

| Volume                 | Mount Point | Purpose                            |
| ---------------------- | ----------- | ---------------------------------- |
| `main`                 | `/data`     | Both pools' configuration and logs |
| The node's `main` (ro) | `/mnt/node` | The node's own store               |

| Path         | Written by                 | Holds                                       |
| ------------ | -------------------------- | ------------------------------------------- |
| `pool/`      | `main` and the shared pool | Its config, and its share and block history |
| `solo/`      | `main` and the solo pool   | The same, for solo                          |
| `store.json` | Actions                    | Everything the user configures              |

**The two pools keep entirely separate state**, in sibling directories — separate configurations, separate logs, separate totals.

**The node's volume is mounted for its store, not for chain data.** What is read from it is which chain the node is on and — for three of the four nodes — the RPC credentials it published there.

## File Models

Two models, one of which is written twice.

| File          | Format | Modelled                | Written by         |
| ------------- | ------ | ----------------------- | ------------------ |
| `ckpool.conf` | JSON   | Yes, once per pool      | `main`             |
| `store.json`  | JSON   | Yes — `FileHelper.json` | Actions and `main` |

**Both pool configurations are generated in full at every start**, from the stored settings plus the node address resolved at that moment. A hand-edit does not survive.

**The pool fee has to be written as a decimal**, and that is not a formatting nicety: ckpool reads it through a JSON parser whose "is this a real number" test is false for a whole number, so an integer fee is silently discarded in favour of the built-in default. The model writes it with decimal places for exactly that reason.

The store holds the node selection, the payout address, the fee, the pool identifier and starting difficulty, the Flowee credential, and two pieces of bookkeeping — the "wipe on next start" flag and the last-seen chain, both of which `main` writes itself and are therefore deliberately outside its reactive read.

## Dependencies

Four declared, **exactly one active** — whichever node you select.

| Dependency          | Required         | Health checks required | Why                            |
| ------------------- | ---------------- | ---------------------- | ------------------------------ |
| Bitcoin Cash Node   | Only if selected | `primary`              | Block templates and submission |
| Bitcoin Cash Daemon | Only if selected | `rpc-plaintext`        | The same                       |
| Flowee the Hub      | Only if selected | `primary`              | The same                       |
| Knuth               | Only if selected | `primary`              | The same                       |

**They are gated on being up, not on being synced** — a node's initial sync takes days, and reporting that the chain is behind is more useful than refusing to start for the duration. The Node health check is what reports it.

**Each node is dialed differently:** Bitcoin Cash Node remaps its RPC port per chain, so which port to resolve depends on the chain it is on; Bitcoin Cash Daemon is dialed through its plaintext proxy so no certificate has to be trusted; and **Flowee keeps only a hash of each RPC password**, so this package mints its own credential and asks Flowee to register it.

Selecting a node clears the tasks belonging to the nodes you are not on.

## Network Access and Interfaces

Three interfaces.

| Interface | Id            | Type | Port | Description                        |
| --------- | ------------- | ---- | ---- | ---------------------------------- |
| Shared    | `pool-mining` | p2p  | 3333 | The shared pool's stratum endpoint |
| Solo      | `solo-mining` | p2p  | 4567 | The solo pool's stratum endpoint   |
| Dashboard | `web-ui`      | ui   | 80   | Hashrate, shares, workers, blocks  |

**Which pool a miner is on is decided purely by which port it connects to**, and the difference between them is a single flag in ckpool.

| Pool       | Who a found block pays      | What your fee does                    |
| ---------- | --------------------------- | ------------------------------------- |
| **Shared** | The operator — your address | Nothing. The fee is set to zero here. |
| **Solo**   | The miner that found it     | Takes its configured percentage       |

**Shared mining pays the whole block to your payout address**, and settling with the miners who contributed is then between you and them, off-chain. A pool fee on that endpoint would only take a cut of your own reward, so the package writes it as zero.

**Solo mining pays the finder**, which is what gives a fee something to take a share of. The fee is a percentage, and ckpool only pays it out when a fee address validates — so **without that address, no fee is taken however high the percentage is set**. The package writes the address alongside the fee whenever the fee is non-zero.

Its sibling package, ASICSeer, has no solo mode at all, because its upstream has none.

Both stratum ports are raw TCP and **advertise themselves with a `stratum+tcp://` scheme** rather than an HTTP one, so an address can be copied straight into mining hardware.

**Stratum is unencrypted** — that is the protocol, not a choice here.

**Nothing is authenticated**, on either stratum port or the dashboard. Anyone who can reach a port can mine there, and anyone who can reach the dashboard sees your statistics.

## Installation and First-Run Flow

Install raises **two `critical` tasks**: choose the node, and set the payout address. Neither can be skipped — a pool with no node has no work, and shared mining with no address has nowhere to pay a block.

Selecting **Flowee** raises a third task, on Flowee rather than here, asking it to register the credential this package generated. Selecting **Knuth** raises one on Knuth instead, asking it to turn JSON-RPC on and use its full database mode; it is recurring, so turning either back off raises it again.

Once the node is running, both pools write their configurations, start, and accept miners.

**Neither pool refuses to start over a fixable problem.** A missing payout address, an address on the wrong chain, or an unreachable node brings the service up with a single failing health check that says which — rather than throwing, because a thrown start-up crash-loops under automatic restart and leaks a mount set every cycle.

## Actions

Four actions.

### Select Node Backend

Chooses which of the four Bitcoin Cash nodes both pools mine against.

- **What it changes:** the selection, and through it the dependency, the mount, and the RPC address.
- **Cost:** both pools restart onto the new node.
- **Choosing Flowee raises the credential task on Flowee**, from here rather than from the dependency declaration — which re-runs on every init and would keep asking.

### Configure

The payout address, the fee, the pool identifier written into blocks, and the starting difficulty. The starting difficulty is also written as ckpool's `highdiff`: ckpool otherwise starts any port above 4000 — the solo port is 4567 — at 1,000,000, and every share from a small miner there is rejected as too easy.

- **The address does two jobs**: it is where a shared block pays, and it is where the solo fee is collected.
- **The fee applies to solo only** — see [Network Access and Interfaces](#network-access-and-interfaces).
- **The address is checked against the node's chain by prefix**, locally. The node is not asked, because this fork decodes Cash addresses itself and never needed to.

### Wipe Mining State

Clears the accumulated share and block statistics for both pools.

- **What it changes:** sets a flag; the clearing happens on the next start, before the pools launch — because ckpool reloads its totals from its own status file at start.

### Connection Info

Shows what to type into mining hardware for each endpoint.

- **Requires the service to be running.**

## Tasks

Up to four, one of which lands on another package.

| Task                | Raised on    | Severity   | Raised when                                            | Cleared when           |
| ------------------- | ------------ | ---------- | ------------------------------------------------------ | ---------------------- |
| Select Node Backend | This package | `critical` | Install                                                | The action runs        |
| Configure           | This package | `critical` | Install                                                | The action runs        |
| Configure (address) | This package | `critical` | A start with no address, or one on the wrong chain     | A valid address is set |
| Register credential | `flowee`     | `critical` | Flowee is selected                                     | Flowee registers it    |
| Auto-Configure      | `knuth-bch`  | `critical` | Knuth is selected and its JSON-RPC or full mode is off | Its settings match     |

The address task is raised from the start-up path with its own replay key, so it reappears whenever the address goes missing or stops matching the chain.

## Health Checks

Four checks.

| Check         | Displayed as    | Method                                |
| ------------- | --------------- | ------------------------------------- |
| `pool`        | "Shared Mining" | The shared pool's log, then its port  |
| `solo`        | "Solo Mining"   | The solo pool's log, then its port    |
| `ui`          | "Web Dashboard" | The dashboard's port                  |
| `node-status` | "Node"          | The node's store, read from the mount |

**Each mining check reads the log before probing its port.** ckpool holds the stratum port open even when it cannot get a block template, so a bare port check would report a healthy pool that mines nothing. The check looks for the two failures that produce exactly that: an address the node rejected, and a node that is not answering.

**The Node check is how a chain change is noticed.** The node's chain is a file rather than a reactive source, and it has to be re-read — a binding a node moves off is left _disabled_ rather than removed, and a disabled binding still resolves, so the address read would never go null on its own. On a change, the check restarts the service.

When the node reports it is still syncing, that is reported as loading rather than blocking: **a block found on a stale tip would be orphaned**, which is worth saying and not worth refusing to run over.

## Backups and Restore

The `main` volume is copied wholesale — `sdk.Backups.ofVolumes('main')`. That is both pools' settings, their generated configurations, and their share and block history.

**There are no keys here.** Payouts happen in the coinbase of a found block; this service holds no wallet and custodies nothing.

A restored instance comes back on the same node with the same address and fee, re-resolves the node's address, and continues.

## Limitations and Differences

1. **Two pools, one configuration.** Address, fee, identifier and difficulty are shared; only the mode and the ports differ.
2. **The fee only applies to solo.** On the shared pool it is written as zero, because the block already pays you.
3. **A fee with no address collects nothing**, silently — ckpool gates the fee output on the address validating.
4. **Nothing is authenticated**, on either stratum port or the dashboard.
5. **Stratum is unencrypted** — that is the protocol.
6. **A node is required but not required to be synced.** Blocks found while it is behind would be orphaned, and the Node check says so.
7. **Both configurations are regenerated at every start**; editing them directly does not survive.
8. **Changing chains wipes the statistics** for both pools, because shares counted at one chain's difficulty mean nothing on another.

---

## Upstream Updates

`check-upstream.yml` looks for a new ckpool release tag daily. When one appears, `scripts/auto-bump.sh` sets `startos/versions/current.ts` to `<upstream>:0`, resets `ALLOW_DOWNGRADE` to `false`, updates `ARG CKPOOL_REF` in the `Dockerfile`, commits the bump straight to `master`, and the workflow dispatches Tag and Release, which builds and publishes the new version. If a patch in `patches/apply.py` no longer applies to the new source, the build stops and nothing is released. Package-only fixes bump the revision after the colon by hand.

## Quick Reference for AI Consumers

```yaml
package_id: bch-elopool
image: built from ./Dockerfile # ckpool from source, natively per arch
architectures:
  - x86_64
  - aarch64
subcontainers:
  - pool-sub # shared mode
  - solo-sub # ckpool -B (btcsolo)
  - ui-sub
volumes:
  main: /data # pool/ and solo/ each hold a config and a log dir; store.json at the root
  # the selected node's main volume is read-only at /mnt/node — for its store, not chain data
file_models:
  - pool/ckpool.conf # generated in full each start
  - solo/ckpool.conf # same, with poolfee + pooladdress
  - store.json # node selection, payout address, fee, identifier, difficulty, flowee creds
startos_managed_env_vars: [] # everything is ckpool.conf
dependencies: # exactly one is declared at a time, from the stored selection
  - bitcoincashd # healthChecks: [primary]; RPC port varies per chain
  - bchd # healthChecks: [rpc-plaintext]; dialed via the plaintext proxy
  - flowee # healthChecks: [primary]; needs a credential registered via createTask
  - knuth-bch # healthChecks: [primary]; RPC port varies per chain; JSON-RPC + full mode via autoconfig task
interfaces:
  pool-mining: { type: p2p, port: 3333 } # shared; block pays btcaddress
  solo-mining: { type: p2p, port: 4567 } # solo; block pays the finder, fee to pooladdress
  web-ui: { type: ui, port: 80 }
actions:
  - select-node
  - configure
  - wipe-mining-state
  - connection-info # only-running
tasks:
  - { action: select-node, severity: critical } # install
  - { action: configure, severity: critical } # install
  - { action: configure, severity: critical, replayId: payout-address } # raised from main
  - { on: flowee, action: create-dependent-credential, severity: critical }
  - { on: knuth-bch, action: autoconfig, severity: critical, once: false }
health_checks:
  - pool # "Shared Mining"; scrapes the log before probing the port
  - solo # "Solo Mining"; same
  - ui # "Web Dashboard"
  - node-status # "Node"; re-reads the node's chain and restarts on a change
```
