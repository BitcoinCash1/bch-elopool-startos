import { VersionInfo } from '@start9labs/start-sdk'

export const v_1_1_1_15 = VersionInfo.of({
  version: '1.1.1:15',
  releaseNotes:
    'Mining stats now reset correctly. "Wipe Mining State" previously only restarted the pool, but ckpool reloads its cumulative stats (accepted shares, best share, hashrate averages) from disk on restart — so the old numbers came back. The action now actually deletes the persisted stats before the pool relaunches. ' +
    'Additionally, stats are wiped automatically when the node\'s network changes, so figures from one network (e.g. mainnet) can no longer leak into another (e.g. chipnet) — which previously made the solo "Round Progress" display an absurd percentage.',
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
