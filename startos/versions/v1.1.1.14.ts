import { VersionInfo } from '@start9labs/start-sdk'

export const v_1_1_1_14 = VersionInfo.of({
  version: '1.1.1:14',
  releaseNotes:
    'Settings now apply on save: changing the payout address (or any pool setting / node backend) restarts the service so the new ckpool config takes effect immediately — previously the change sat unused until a manual restart. ' +
    'Safety: the pool refuses to start without a configured payout address instead of silently falling back to an unspendable default address. ' +
    'Dashboard: the sync ring now reaches 100% on nodes that omit verificationprogress when synced (e.g. BCHD), stratum ports are read from the live config instead of being hard-coded, and the node stats panel honors Tor mode.',
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
