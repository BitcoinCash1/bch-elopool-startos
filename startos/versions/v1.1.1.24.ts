import { VersionInfo } from '@start9labs/start-sdk'

export const v_1_1_1_24 = VersionInfo.of({
  version: '1.1.1:24',
  releaseNotes:
    'Pin ckpool highdiff to the configured start difficulty. Solo listens on ' +
    '4567, and ckpool treats ports >4000 as ASIC highdiff (1e6) — chipnet CPU ' +
    'shares were rejected as below minimum.',
  migrations: {
    up: async () => {},
    down: async () => {},
  },
})
