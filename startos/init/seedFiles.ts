import { sdk } from '../sdk'
import { storeJson } from '../file-models/store.json'

export const seedFiles = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') return

  await storeJson.merge(effects, {
    nodePackageId: 'bitcoincashd',
    nodeConfirmed: false,
    payoutAddress: '',
    poolFee: 1,
    poolIdentifier: 'EloPool',
    poolDifficulty: 64,
    nodeRpcUser: '',
    nodeRpcPassword: '',
  })
})
