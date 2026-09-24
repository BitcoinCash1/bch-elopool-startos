# EloPool — Bitcoin Cash mining pool (ckpool) on StartOS

A Bitcoin Cash mining pool you run yourself.

EloPool runs a Bitcoin Cash mining pool on hardware you control, so your miners submit work to your own node instead of a third-party pool that sees every share you find and decides when to pay you. It serves two Stratum endpoints at once: a shared one, where a block it finds pays your address and you settle with your miners however you like, and a solo one, where a block pays the miner that found it, less a fee you set. A built-in dashboard shows hashrate, shares and connected workers. Bitcoin Cash Node, Bitcoin Cash Daemon, Flowee the Hub and Knuth are all supported as the node it mines against.
