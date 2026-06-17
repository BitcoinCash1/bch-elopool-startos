import { VersionInfo } from '@start9labs/start-sdk'

export const v_1_1_1_12 = VersionInfo.of({
  version: '1.1.1:12',
  releaseNotes:
    'Fix Flowee the Hub connection on non-mainnet networks. ' +
    'Flowee uses network-specific RPC ports (e.g. chipnet = 48332) matching the same scheme as BCHN. ' +
    'The previous build incorrectly used port 8332 for all Flowee networks, causing EloPool to fail to start when Flowee was selected as the node on chipnet or other test networks.',
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
