import { setupManifest } from '@start9labs/start-sdk'
import {
  bchdDescription,
  bitcoincashdDescription,
  floweeDescription,
  knuthDescription,
  long,
  short,
} from './i18n'

export const manifest = setupManifest({
  id: 'bch-elopool',
  title: 'EloPool',
  license: 'GPL-3.0',
  packageRepo: 'https://github.com/Start9-Community/bch-elopool-startos',
  upstreamRepo: 'https://github.com/skaisser/ckpool',
  marketingUrl: 'https://elopool.bch.sx',
  donationUrl: null,
  description: { short, long },
  volumes: ['main'],
  images: {
    elopool: {
      source: { dockerBuild: {} },
      arch: ['x86_64', 'aarch64'],
    },
  },
  // Exactly one of these is needed at a time — whichever the Select Node
  // Backend action has chosen — so each is optional on its own.
  dependencies: {
    bitcoincashd: {
      description: bitcoincashdDescription,
      optional: true,
      metadata: {
        title: 'Bitcoin Cash Node',
        icon: 'https://raw.githubusercontent.com/Start9-Community/bitcoin-cash-node-startos/master/icon.png',
      },
    },
    bchd: {
      description: bchdDescription,
      optional: true,
      metadata: {
        title: 'Bitcoin Cash Daemon',
        icon: 'https://raw.githubusercontent.com/Start9-Community/bitcoin-cash-daemon-startos/master/icon.png',
      },
    },
    'knuth-bch': {
      description: knuthDescription,
      optional: true,
      metadata: {
        title: 'Knuth',
        icon: 'https://raw.githubusercontent.com/BitcoinCash1/knuth-bch-startos/master/icon.svg',
      },
    },
    flowee: {
      description: floweeDescription,
      optional: true,
      metadata: {
        title: 'Flowee the Hub',
        icon: 'https://raw.githubusercontent.com/Start9-Community/flowee-the-hub-startos/master/icon.png',
      },
    },
  },
})
