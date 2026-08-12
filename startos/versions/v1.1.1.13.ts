import { VersionInfo } from '@start9labs/start-sdk'

export const v_1_1_1_13 = VersionInfo.of({
  version: '1.1.1:13',
  releaseNotes:
    'Fix Flowee the Hub compatibility: make coinbaseaux optional in ckpool. ' +
    'Flowee does not include coinbaseaux in getblocktemplate responses (it is optional per BIP22), ' +
    'but upstream ckpool required it, causing "JSON failed to decode GBT" errors and "No bitcoinds active" when Flowee was selected as the node. ' +
    'ckpool now treats coinbaseaux as optional.',
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
