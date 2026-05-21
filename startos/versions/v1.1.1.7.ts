import { VersionInfo } from '@start9labs/start-sdk'

export const v_1_1_1_7 = VersionInfo.of({
  version: '1.1.1:7',
  releaseNotes:
    'Stay close to upstream: remove maxdiff config field and custom stratifier patch. ' +
    'Upstream default maxdiff=0 (no cap) — VARDIFF self-corrects naturally. ' +
    'startdiff default changed from 64 to 42 (upstream default).',
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
