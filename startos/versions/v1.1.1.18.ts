import { VersionInfo } from '@start9labs/start-sdk'

export const v_1_1_1_18 = VersionInfo.of({
  version: '1.1.1:18',
  releaseNotes:
    'Payout-address network guard: the pool now validates the payout address against the selected node via the node\'s own validateaddress RPC, and refuses to start (with a clear error) if it does not match the node\'s network — e.g. a mainnet (bitcoincash:) address on a chipnet node. Previously such a mismatch silently broke the pool ("Invalid address" / "No bitcoinds active") while the health check still showed green. ' +
    'Health checks now report a failure when the pool can accept connections but cannot build work (bad address or node unreachable), instead of a misleading "ready". The Configure form also format-checks the address inline.',
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
