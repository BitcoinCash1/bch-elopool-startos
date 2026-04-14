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
    'https://github.com/BitcoinCash1/bch-elopool-startos/blob/master/README.md',
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
    },
  },
  alerts: {
    install:
      'EloPool requires a running Bitcoin Cash Node (BCHN or BCHD). Make sure your node is fully synced before starting the pool.',
    update: null,
    uninstall:
      'Uninstalling EloPool will permanently delete pool configuration and statistics. Mining hardware will need to be reconfigured.',
    restore:
      'Restoring will overwrite your current pool configuration.',
    start: null,
    stop: 'Stopping EloPool will disconnect all active miners.',
  },
  dependencies: {
    'bitcoin-cash-node': {
      description:
        'Bitcoin Cash Node provides the blockchain data and RPC interface required for mining.',
      optional: false,
    },
  },
})
