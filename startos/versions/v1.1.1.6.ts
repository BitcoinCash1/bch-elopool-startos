import { VersionInfo } from '@start9labs/start-sdk'

export const v_1_1_1_6 = VersionInfo.of({
  version: '1.1.1:6',
  releaseNotes:
    'Fix: sharelog state is now cleared on every restart, so a normal service restart always resets miner difficulty to the configured starting value — no manual log clearing needed. Added "Reset Mining State" action for in-UI self-service reset.',
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
