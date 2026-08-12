import { VersionInfo } from '@start9labs/start-sdk'

export const v_1_1_1_17 = VersionInfo.of({
  version: '1.1.1:17',
  releaseNotes:
    'Dashboard now shows a prominent network badge in the header (Mainnet / Chipnet / Testnet / etc.), colored to stand out for non-mainnet networks. This avoids confusion when difficulty and hashrate figures look unusually small simply because the node is on a test network.',
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
