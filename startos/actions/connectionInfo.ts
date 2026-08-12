import { T } from '@start9labs/start-sdk'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { poolInterfaceId, soloInterfaceId } from '../utils'

/** The addresses miners on the network can reach a stratum endpoint at. */
const stratumUrls = (effects: T.Effects, hostId: string, interfaceId: string) =>
  sdk.host
    .getOwn(effects, hostId, (host) =>
      Object.values(host?.bindings ?? {})
        .flatMap((b) => Object.values(b.interfaces))
        .find((i) => i.id === interfaceId)
        ?.addressInfo.nonLocal.format(),
    )
    .once()

export const connectionInfo = sdk.Action.withoutInput(
  'connection-info',

  async () => ({
    name: i18n('Connection Info'),
    description: i18n('Show what to enter on your mining hardware.'),
    warning: null,
    allowedStatuses: 'only-running',
    group: null,
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    const pool =
      (await stratumUrls(effects, 'pool-mining', poolInterfaceId)) ?? []
    const solo =
      (await stratumUrls(effects, 'solo-mining', soloInterfaceId)) ?? []

    if (!pool.length && !solo.length) {
      return {
        version: '1',
        title: i18n('Connection Info'),
        message: i18n(
          'No mining address is available yet. Start the pool and try again.',
        ),
        result: null,
      }
    }

    const urlMembers = (
      urls: string[],
      name: string,
      description: string,
    ): T.ActionResultMember[] =>
      urls.map((value, i) => ({
        name: urls.length > 1 ? `${name} ${i + 1}` : name,
        description: i === 0 ? description : null,
        type: 'single',
        value,
        copyable: true,
        qr: false,
        masked: false,
      }))

    return {
      version: '1',
      title: i18n('Connection Info'),
      message: i18n(
        'Point your miner at one of the addresses below. Use a Bitcoin Cash address as the username — on the solo endpoint that is the address a block it finds pays to.',
      ),
      result: {
        type: 'group',
        value: [
          ...urlMembers(
            pool,
            i18n('Shared Mining Address'),
            i18n('A block found here pays your payout address'),
          ),
          ...urlMembers(
            solo,
            i18n('Solo Mining Address'),
            i18n(
              'A block found here pays the miner that found it, less your fee',
            ),
          ),
          {
            name: i18n('Username'),
            description: i18n(
              'Your Bitcoin Cash address, optionally followed by a dot and a name for that miner — bitcoincash:qr….rig1. Miners with no name are numbered worker01, worker02 and so on.',
            ),
            type: 'single',
            value: '<your BCH address>.<worker name>',
            copyable: false,
            qr: false,
            masked: false,
          },
          {
            name: i18n('Password'),
            description: i18n('Anything — Stratum does not check it.'),
            type: 'single',
            value: 'x',
            copyable: true,
            qr: false,
            masked: false,
          },
        ],
      },
    }
  },
)
