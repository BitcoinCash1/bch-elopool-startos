import { VersionInfo } from '@start9labs/start-sdk'

export const v_1_1_1_10 = VersionInfo.of({
  version: '1.1.1:10',
  releaseNotes: 'Show active network (mainnet/chipnet/etc.) in Pool and Solo Mining health checks.',
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
