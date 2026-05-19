import { VersionInfo } from '@start9labs/start-sdk'

export const v_1_1_1_3 = VersionInfo.of({
  version: '1.1.1:3',
  releaseNotes:
    'Fix: hashrate display now uses 1-hour average instead of 5-minute average for a more stable and accurate reading.',
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
