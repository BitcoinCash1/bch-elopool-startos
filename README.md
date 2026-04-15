<p align="center">
  <img src="icon.svg" alt="EloPool Logo" width="21%">
</p>

# EloPool for StartOS

<p align="center">
  <img src="https://img.shields.io/badge/platform-StartOS-brightgreen" alt="StartOS">
  <img src="https://img.shields.io/badge/architecture-x86__64%20%7C%20aarch64-blue" alt="Architecture">
  <img src="https://img.shields.io/badge/license-GPL--3.0-orange" alt="License">
</p>

**EloPool** is a high-performance Bitcoin Cash mining pool for [StartOS](https://start9.com), built on [ckpool](https://github.com/skaisser/ckpool). It provides **dual-mode** operation — pool mining and solo mining — with a built-in web dashboard.

## Features

- **Pool Mining** (port 3333) — Shared block rewards among all miners
- **Solo Mining** (port 4567) — Winner takes the entire block reward
- **Web Dashboard** (port 80) — Real-time hashrate, workers, blocks found
- **Stratum Protocol** — Compatible with all ASIC miners (Antminer, Whatsminer, Bitaxe, etc.)
- **Auto-configured** — Automatically connects to your Bitcoin Cash Node (BCHN or BCHD)
- **Multi-architecture** — Runs on x86_64 and aarch64

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   EloPool Package                    │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │  Pool ckpool │  │  Solo ckpool │  │  Web UI    │ │
│  │  :3333       │  │  :4567       │  │  :80       │ │
│  │  (shared)    │  │  (solo)      │  │  (nginx)   │ │
│  └──────┬───────┘  └──────┬───────┘  └─────┬──────┘ │
│         │                 │                │         │
│         └────────┬────────┘                │         │
│                  │                         │         │
│         ┌───────▼────────┐     ┌──────────▼───────┐ │
│         │  /data volume  │     │  stats-api.sh    │ │
│         │  (ckpool runs) │◄────│  (ckpmsg → JSON) │ │
│         └───────┬────────┘     └──────────────────┘ │
│                 │                                    │
└─────────────────┼────────────────────────────────────┘
                  │ RPC (8332)
         ┌────────▼────────┐
         │  Bitcoin Cash   │
         │  Node (BCHN     │
         │  or BCHD)       │
         └─────────────────┘
```

## Dependencies

| Package | Required | Notes |
|---------|----------|-------|
| **Bitcoin Cash Node** | Yes | BCHN or BCHD flavor. Must be fully synced with txindex enabled. |

## Quick Start

1. **Install Bitcoin Cash Node** on your StartOS server and wait for full sync
2. **Install EloPool** from the marketplace
3. **Configure** — Set your BCH payout address via Actions → Configure
4. **Point your miners** at:
   - Pool mode: `stratum+tcp://<your-server>:3333`
   - Solo mode: `stratum+tcp://<your-server>:4567`
5. **Monitor** via the Web Dashboard

### Miner Configuration

| Setting | Value |
|---------|-------|
| **URL** | `stratum+tcp://<host>:3333` (pool) or `:4567` (solo) |
| **Username** | Your BCH address |
| **Password** | Anything (or `d=DIFFICULTY` for custom difficulty) |

## Building from Source

```bash
# Prerequisites: StartOS SDK, Docker, Node.js 20+
git clone https://github.com/BitcoinCash1/bch-elopool-startos.git
cd bch-elopool-startos
npm install
make
```

## Port Allocation

| Port | Protocol | Purpose |
|------|----------|---------|
| 3333 | Stratum (TCP) | Pool mining |
| 4567 | Stratum (TCP) | Solo mining |
| 80 | HTTP | Web dashboard |

## Configuration Options

| Option | Default | Description |
|--------|---------|-------------|
| Payout Address | *(required)* | BCH address for coinbase rewards |
| Pool Fee | 1% | Fee percentage for pool mode (solo is always 0%) |
| Pool Identifier | `EloPool` | Coinbase signature visible on block explorers |
| Starting Difficulty | 64 | Initial share difficulty for new workers |

## How It Works

EloPool runs two independent ckpool instances from the same Docker image:
- **Pool instance** shares rewards proportionally based on submitted shares
- **Solo instance** directs the entire block reward to whichever miner finds it

Both instances connect to your Bitcoin Cash Node via RPC. The web dashboard uses `ckpmsg` to query ckpool's Unix domain sockets and serves stats as static JSON via nginx.

You can point different miners to different modes simultaneously — no reconfiguration needed.

## Upstream

- [skaisser/ckpool](https://github.com/skaisser/ckpool) — EloPool fork of ckpool
- [bitcoin-cash-node](https://github.com/bitcoin-cash-node/bitcoin-cash-node) — Bitcoin Cash full node

## License

GPL-3.0 — matches upstream ckpool license.

---

<details>
<summary><strong>AI Reference Prompt</strong></summary>

```yaml
package: bch-elopool
type: startos-service
sdk: "@start9labs/start-sdk@1.0.0"
upstream: skaisser/ckpool
depends_on: bitcoin-cash-node (BCHN or BCHD)
ports:
  pool: 3333 (stratum)
  solo: 4567 (stratum)
  ui: 80 (http)
daemons: 3 (pool-ckpool, solo-ckpool, ui-nginx)
volumes: main (/data)
dependency_mount: /mnt/bitcoin-cash-node (reads store.json for RPC creds)
critical_tasks: txindex=true, prune=null, zmqEnabled=true
config_fields: payoutAddress, poolFee, poolIdentifier, poolDifficulty
webui: nginx serving static HTML + stats-api.sh background (ckpmsg → JSON)
build: multi-stage Docker (ubuntu build-ckpool → node:20-bookworm-slim runtime)
```

</details>
