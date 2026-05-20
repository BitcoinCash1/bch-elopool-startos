import { VersionInfo } from '@start9labs/start-sdk'

export const v_1_1_1_5 = VersionInfo.of({
  version: '1.1.1:5',
  releaseNotes:
    'Fix: maxdiff now also caps miner-suggested difficulty (mining.suggest_difficulty). Previously, a miner suggesting a high difficulty (e.g. 1000000) would bypass the maxdiff ceiling, causing the Idle bug even with maxdiff configured.',
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
