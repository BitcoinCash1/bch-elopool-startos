import { VersionInfo } from '@start9labs/start-sdk'

export const v_1_1_1_8 = VersionInfo.of({
  version: '1.1.1:8',
  releaseNotes: 'Move "Wipe Mining State" action to end of actions list.',
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
