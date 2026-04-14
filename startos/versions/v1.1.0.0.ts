import { VersionInfo } from '@start9labs/start-sdk'

export const v_1_1_0_0 = VersionInfo.of({
  version: '1.1.0:0',
  releaseNotes:
    'Initial release of EloPool for StartOS. High-performance BCH mining pool built on ckpool with dual-mode operation (pool + solo), built-in web dashboard, and Bitcoin Cash Node dependency wiring.',
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
