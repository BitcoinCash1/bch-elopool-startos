# EloPool

## Documentation

- [ckpool](https://github.com/skaisser/ckpool) — the upstream pool server, its configuration reference and release notes.

## What you get on StartOS

Two mining endpoints and a dashboard, all fed by a Bitcoin Cash node running on this server:

- **Pool Mining** — shared. A block found here pays your payout address in full, and you settle with your miners however you like. There is no automatic split.
- **Solo Mining** — a block pays the miner that found it, straight to the address it connected with, minus the fee you set.
- **Web Dashboard** — hashrate, share counts, connected miners and block history for both.

## Getting set up

1. **Install a Bitcoin Cash node first** and let it finish syncing. Bitcoin Cash Node, Bitcoin Cash Daemon and Flowee the Hub all work. Mining against a node that has not caught up produces blocks the network will reject.
2. Run **Select Node Backend** and choose the node you installed. If you chose Flowee the Hub, a task appears on Flowee to register the login the pool will use — run it, then restart Flowee.
3. Run **Configure** and set your **Payout Address**. It has to belong to the same chain as your node: a `bitcoincash:` address for mainnet, `bchtest:` for the test chains, `bchreg:` for regtest. Neither pool will mine until this is right, and the Mining health check tells you if it is not.
4. Start the service. The **Node** health check turns green once your node is synced and answering.
5. Run **Connection Info** and copy an address into your mining hardware.

## Using EloPool

### Pointing miners at the pools

**Connection Info** gives you the `stratum+tcp://` addresses for both endpoints, along with the username and password format. Set the username to a Bitcoin Cash address, optionally followed by a dot and a name for the machine — `bitcoincash:qr….rig1`. On the solo endpoint that address is what a block it finds pays to. Miners with no name are numbered `worker01`, `worker02` and so on. The password is not checked; anything will do.

### Web Dashboard

Shows both pools side by side: current hashrate, accepted shares, connected workers, the best share found so far, and recent blocks. Workers appear a minute or two after they start submitting.

### Actions

- **Configure** — your payout address, the fee you keep from a solo-mined block, the identifier written into the coinbase of blocks you find, and the difficulty new miners start at. Saving restarts both pools.
- **Select Node Backend** — switch which node the pools mine on. If the new node is on a different chain, the accumulated share and hashrate figures are cleared, because they do not carry across chains.
- **Connection Info** — the addresses and login format for your miners.
- **Wipe Mining State** — clears every share count and hashrate figure and restarts. Use it when a miner is stuck showing as idle or the statistics look wrong. Blocks already found are not affected.

## Limitations

Shared mining does not split a block between miners on-chain — the whole reward goes to your payout address and paying your miners is up to you. If you want miners paid directly, point them at the solo endpoint instead. Knuth is not supported as a node backend; it serves mining templates through a different set of RPC calls than this pool knows how to make.
