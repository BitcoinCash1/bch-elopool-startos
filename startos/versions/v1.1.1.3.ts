import { VersionInfo } from '@start9labs/start-sdk'

export const v_1_1_1_3 = VersionInfo.of({
  version: '1.1.1:3',
  releaseNotes:
    'Fix: pool mining stratum port changed from 3333 to 43333. ' +
    'Port 3333 was being remapped to a random high port by StartOS because it was already claimed ' +
    'at the time of initial installation. Port 43333 is unique and will be assigned stably. ' +
    'Update your miners to use port 43333 for pool mode; solo mode port 4567 is unchanged.',
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
