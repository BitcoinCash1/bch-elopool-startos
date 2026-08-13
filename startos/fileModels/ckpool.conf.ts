import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.object({
  btcd: z.array(
    z.object({
      url: z.string(),
      auth: z.string(),
      pass: z.string(),
      notify: z.boolean(),
    }),
  ),
  btcaddress: z.string(),
  btcsig: z.string(),
  blockpoll: z.number(),
  update_interval: z.number(),
  serverurl: z.array(z.string()),
  mindiff: z.number(),
  startdiff: z.number(),
  maxdiff: z.number(),
  logdir: z.string(),
  poolfee: z.number(),
  pooladdress: z.string().optional(),
})

export type CkpoolConf = z.infer<typeof shape>

/**
 * ckpool reads `poolfee` with jansson's `json_is_real`, which rejects a whole
 * number — a fee of 1 would be discarded and nothing taken. JSON cannot spell a
 * whole number as a float, hence the sentinel.
 */
const POOL_FEE = ' poolfee '

const toFile = (conf: CkpoolConf) =>
  JSON.stringify({ ...conf, poolfee: POOL_FEE }, null, 2).replace(
    JSON.stringify(POOL_FEE),
    conf.poolfee.toFixed(3),
  )

/** One per daemon, on the shared volume the dashboard's stats script reads. */
export const ckpoolConf = (mode: 'pool' | 'solo') =>
  FileHelper.raw<CkpoolConf>(
    { base: sdk.volumes.main, subpath: `${mode}/ckpool.conf` },
    toFile,
    JSON.parse,
    (data) => shape.parse(data),
  )
