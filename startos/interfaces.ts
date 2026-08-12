import { i18n } from './i18n'
import { sdk } from './sdk'
import {
  poolInterfaceId,
  poolPort,
  soloInterfaceId,
  soloPort,
  uiInterfaceId,
  uiPort,
} from './utils'

/** Miners are pointed at `stratum+tcp://<host>:<port>`, so the addresses StartOS shows say so. */
const stratumScheme = { ssl: 'stratum+tcp', noSsl: 'stratum+tcp' }

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  // Stratum is raw TCP, and mining hardware speaks it unencrypted.
  const poolMulti = sdk.MultiHost.of(effects, 'pool-mining')
  const poolOrigin = await poolMulti.bindPort(poolPort, {
    protocol: null,
    preferredExternalPort: poolPort,
    addSsl: null,
    secure: { ssl: false },
  })
  const pool = sdk.createInterface(effects, {
    name: i18n('Pool Mining'),
    id: poolInterfaceId,
    description: i18n(
      'Stratum endpoint for shared mining — a block it finds pays your payout address, and you settle with your miners',
    ),
    type: 'p2p',
    masked: false,
    schemeOverride: stratumScheme,
    username: null,
    path: '',
    query: {},
  })

  const soloMulti = sdk.MultiHost.of(effects, 'solo-mining')
  const soloOrigin = await soloMulti.bindPort(soloPort, {
    protocol: null,
    preferredExternalPort: soloPort,
    addSsl: null,
    secure: { ssl: false },
  })
  const solo = sdk.createInterface(effects, {
    name: i18n('Solo Mining'),
    id: soloInterfaceId,
    description: i18n(
      'Stratum endpoint for solo mining — a block pays the miner that found it, less your fee',
    ),
    type: 'p2p',
    masked: false,
    schemeOverride: stratumScheme,
    username: null,
    path: '',
    query: {},
  })

  const uiMulti = sdk.MultiHost.of(effects, 'web-ui')
  const uiOrigin = await uiMulti.bindPort(uiPort, { protocol: 'http' })
  const ui = sdk.createInterface(effects, {
    name: i18n('Web Dashboard'),
    id: uiInterfaceId,
    description: i18n(
      'Hashrate, shares, connected workers and block history for both mining modes',
    ),
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })

  return [
    await poolOrigin.export([pool]),
    await soloOrigin.export([solo]),
    await uiOrigin.export([ui]),
  ]
})
