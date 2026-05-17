# EloPool Mining Pool

EloPool is a high-performance Bitcoin Cash mining pool built on ckpool.
It supports dual-mode operation: **pool mining** (shared rewards) and
**solo mining** (winner takes all).

## Prerequisites

EloPool requires a running and fully-synced Bitcoin Cash full node:
- **BCHN** (recommended)
- **BCHD**
- **Flowee the Hub**
- **Knuth** (JSON-RPC not yet available upstream — selecting it will show an RPC error
  until Knuth ships its built-in RPC module)

Select your node backend via **Actions → Select Node Backend**.

## Connecting Miners

Point your mining hardware to one of these Stratum endpoints:

| Mode | Stratum Address                  | Port |
|------|----------------------------------|------|
| Pool | `<your-server-lan-address>`      | 3333 |
| Solo | `<your-server-lan-address>`      | 4567 |

Use the WebUI dashboard to monitor real-time hashrate, shares, and miner status.

## Pool vs Solo

- **Pool** — shares block rewards proportionally across all connected miners.
- **Solo** — each miner competes independently; the miner who finds a block keeps
  the full reward.

## Support

- Package: <https://github.com/BitcoinCash1/bch-elopool-startos>
- Upstream: <https://github.com/skaisser/ckpool>
