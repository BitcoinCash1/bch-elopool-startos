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
 * ckpool reads `poolfee` with jansson's `json_is_real`, which is false for a
 * whole number, so a fee of 1 would be discarded and no fee taken at all. JSON
 * cannot spell a whole number as a float, so the value is stitched in after
 * serialisation, keyed off a sentinel that cannot collide with anything
 * `JSON.stringify` emits.
 */
const POOL_FEE = ' poolfee '

const toFile = (conf: CkpoolConf) =>
  JSON.stringify({ ...conf, poolfee: POOL_FEE }, null, 2).replace(
    JSON.stringify(POOL_FEE),
    conf.poolfee.toFixed(3),
  )

/**
 * The pool and solo daemons each get their own copy on the shared volume, where
 * the dashboard's stats script also reads the RPC target and stratum port back
 * out of it. Regenerated in full by `main` on every start.
 */
export const ckpoolConf = (mode: 'pool' | 'solo') =>
  FileHelper.raw<CkpoolConf>(
    { base: sdk.volumes.main, subpath: `${mode}/ckpool.conf` },
    toFile,
    JSON.parse,
    (data) => shape.parse(data),
  )
