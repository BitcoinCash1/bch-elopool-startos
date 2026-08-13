import { setupManifest } from '@start9labs/start-sdk'

export const manifest = setupManifest({
  id: 'bch-elopool',
  title: 'EloPool',
  license: 'GPL-3.0',
  packageRepo: 'https://github.com/BitcoinCash1/bch-elopool-startos',
  upstreamRepo: 'https://github.com/skaisser/ckpool',
  marketingUrl: 'https://elopool.bch.sx',
  donationUrl: null,
  docsUrls: [
    'https://github.com/BitcoinCash1/bch-elopool-startos/blob/master/instructions.md',
    'https://github.com/skaisser/ckpool',
  ],
  description: {
    short: 'EloPool — BCH mining pool with pool & solo modes',
    long: 'EloPool is a high-performance Bitcoin Cash mining pool built on ckpool. It supports dual-mode operation: pool mining (shared rewards on port 3333) and solo mining (winner takes all on port 4567). Includes a built-in WebUI dashboard for real-time monitoring.',
  },
  volumes: ['main'],
  images: {
    elopool: {
      source: { dockerBuild: {} },
      arch: ['x86_64', 'aarch64'],
      emulateMissingAs: 'x86_64',
    },
  },
  dependencies: {
    bitcoincashd: {
      description:
        'Bitcoin Cash Node — C++ full node providing the JSON-RPC interface for mining.',
      optional: true,
      s9pk: null,
    },
    bchd: {
      description:
        'BCHD — Go-based full node providing the JSON-RPC interface for mining. An alternative to BCHN.',
      optional: true,
      s9pk: null,
    },
    flowee: {
      description:
        'Flowee the Hub — Fast BCH validator. Good for relay, but uses SPV-level validation. Not recommended as sole mining node.',
      optional: true,
      s9pk: null,
    },
    'knuth-bch': {
      description:
        'Knuth — high-performance C++ BCH full node. v1.3.0 mining is getblocktemplatelight/submitblocklight (mempool GBT). EloPool still uses classic GBT',
      optional: true,
      s9pk: null,
    },
    tor: {
      description:
        'StartOS Tor package providing SOCKS5 proxy support for optional onion-routed node RPC.',
      optional: true,
      s9pk: null,
    },
  },
})
