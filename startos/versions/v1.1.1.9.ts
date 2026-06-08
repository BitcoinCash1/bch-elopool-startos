import { VersionInfo } from '@start9labs/start-sdk'

export const v_1_1_1_9 = VersionInfo.of({
  version: '1.1.1:9',
  releaseNotes: 'Fix network switch: read network from node store.json to use the correct RPC port per network (BCHN remaps ports per network), and add a background monitor that restarts EloPool automatically when the node switches networks.',
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
