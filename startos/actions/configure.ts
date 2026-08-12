import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

export const configure = sdk.Action.withInput(
  'configure',

  async () => ({
    name: i18n('Configure'),
    description: i18n('Set the payout address and how the pool pays out.'),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  InputSpec.of({
    payoutAddress: Value.text({
      name: i18n('Payout Address'),
      description: i18n(
        'Where shared mining pays a found block, and where the solo fee is paid. It must belong to the chain the node is on — mainnet addresses start bitcoincash:, the test chains bchtest:, regtest bchreg:.',
      ),
      required: true,
      default: null,
      placeholder: 'bitcoincash:qr...',
      masked: false,
      patterns: [
        {
          regex:
            '^((bitcoincash|bchtest|bchreg):)?[qpQP][a-zA-Z0-9]{41}$|^[123mn][a-km-zA-HJ-NP-Z1-9]{25,34}$',
          description: i18n(
            'A Bitcoin Cash address, either CashAddr (bitcoincash:q…) or legacy.',
          ),
        },
      ],
    }),
    poolFee: Value.number({
      name: i18n('Solo Fee'),
      description: i18n(
        'The share of a solo-mined block you keep. It applies to solo mining only: shared mining already pays the whole block to your payout address.',
      ),
      required: true,
      default: 1,
      min: 0,
      max: 10,
      integer: false,
      units: '%',
    }),
    poolIdentifier: Value.text({
      name: i18n('Pool Identifier'),
      description: i18n(
        'Written into the coinbase transaction of every block this pool finds, where block explorers show it.',
      ),
      required: true,
      default: 'EloPool',
      placeholder: 'EloPool',
      masked: false,
      minLength: 1,
      // ckpool truncates a signature longer than this and says so in its log.
      maxLength: 30,
    }),
    poolDifficulty: Value.number({
      name: i18n('Starting Difficulty'),
      description: i18n(
        'The share difficulty a miner is given when it first connects. The pool raises or lowers it from there to match what the miner can actually do.',
      ),
      required: true,
      default: 42,
      min: 1,
      max: 1000000,
      integer: true,
      units: null,
    }),
  }),

  async () => {
    const store = await storeJson.read().once()
    return {
      payoutAddress: store?.payoutAddress ?? '',
      poolFee: store?.poolFee ?? 1,
      poolIdentifier: store?.poolIdentifier ?? 'EloPool',
      poolDifficulty: store?.poolDifficulty ?? 42,
    }
  },

  // `main` reads these through a `.const()`, so writing them here is what
  // restarts the pool onto the new settings.
  async ({ effects, input }) => storeJson.merge(effects, input),
)
