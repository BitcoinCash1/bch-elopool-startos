import { sdk } from '../sdk'
import { storeJson } from '../file-models/store.json'

export const seedFiles = sdk.setupOnInit(async (effects) => {
  // Seed default store.json on first install
  const existing = await storeJson.read().once()
  if (!existing?.payoutAddress) {
    await storeJson.merge(effects, {
      payoutAddress: '',
      poolFee: 1,
      poolIdentifier: 'EloPool',
      poolDifficulty: 64,
      bchnRpcUser: '',
      bchnRpcPassword: '',
    })
  }
})
