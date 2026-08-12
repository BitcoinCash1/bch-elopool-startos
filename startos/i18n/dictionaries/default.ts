export const DEFAULT_LANG = 'en_US'

const dict = {
  // actions/configure.ts
  Configure: 0,
  'Set the payout address and how the pool pays out.': 1,
  'Payout Address': 2,
  'Where shared mining pays a found block, and where the solo fee is paid. It must belong to the chain the node is on — mainnet addresses start bitcoincash:, the test chains bchtest:, regtest bchreg:.': 3,
  'A Bitcoin Cash address, either CashAddr (bitcoincash:q…) or legacy.': 4,
  'Solo Fee': 5,
  'The share of a solo-mined block you keep. It applies to solo mining only: shared mining already pays the whole block to your payout address.': 6,
  'Pool Identifier': 7,
  'Written into the coinbase transaction of every block this pool finds, where block explorers show it.': 8,
  'Starting Difficulty': 9,
  'The share difficulty a miner is given when it first connects. The pool raises or lowers it from there to match what the miner can actually do.': 10,

  // actions/connectionInfo.ts
  'Connection Info': 11,
  'Show what to enter on your mining hardware.': 12,
  'No mining address is available yet. Start the pool and try again.': 13,
  'Point your miner at one of the addresses below. Use a Bitcoin Cash address as the username — on the solo endpoint that is the address a block it finds pays to.': 14,
  'Shared Mining Address': 15,
  'A block found here pays your payout address': 16,
  'Solo Mining Address': 17,
  'A block found here pays the miner that found it, less your fee': 18,
  Username: 19,
  'Your Bitcoin Cash address, optionally followed by a dot and a name for that miner — bitcoincash:qr….rig1. Miners with no name are numbered worker01, worker02 and so on.': 20,
  Password: 21,
  'Anything — Stratum does not check it.': 22,

  // actions/selectNode.ts
  'Select Node Backend': 23,
  'Choose which Bitcoin Cash node the pool gets its block templates from.': 24,
  'The pool restarts against the new node. If that node is on a different chain, the accumulated share and hashrate figures are cleared, because they do not carry across chains.': 25,
  'Node Backend': 26,
  'The node must be installed and fully synced before the pool can mine on it.': 27,
  'Bitcoin Cash Node': 28,
  'Bitcoin Cash Daemon': 29,
  'Flowee the Hub': 30,
  'Flowee needs an RPC credential registered for the pool to log in with': 31,

  // actions/wipeMiningState.ts
  'Wipe Mining State': 32,
  'Clear the accumulated share counts and hashrate figures and restart the pool. Use it when a miner is stuck showing as idle or the statistics look wrong.': 33,
  'Every share count and hashrate figure goes back to zero, and connected miners briefly disconnect. Blocks already found are not affected.': 34,

  // init/taskConfigure.ts
  'Set the address the pool pays a found block to': 35,

  // init/taskSelectNode.ts
  'Choose which Bitcoin Cash node the pool mines on': 36,

  // interfaces.ts
  'Pool Mining': 37,
  'Stratum endpoint for shared mining — a block it finds pays your payout address, and you settle with your miners': 38,
  'Solo Mining': 39,
  'Stratum endpoint for solo mining — a block pays the miner that found it, less your fee': 40,
  'Web Dashboard': 41,
  'Hashrate, shares, connected workers and block history for both mining modes': 42,

  // main.ts
  'Starting EloPool': 43,
  'The selected node reports an unrecognized chain: ${chain}.': 44,
  Mining: 45,
  'No payout address is set. Open Configure and set the address a found block should pay to.': 46,
  'The payout address does not belong to the chain the node is on (${chain}). Open Configure and set an address starting ${prefix}': 47,
  'The ${node} node is not reachable. The pool will start once it is installed and running.': 48,
  'Clearing mining statistics (chain is now ${chain})': 49,
  'The node rejected the payout address. Open Configure and set one valid on ${chain}.': 50,
  'The node is not answering, so there is no work to mine.': 51,
  'Accepting miners on ${chain}': 52,
  'Starting...': 53,
  'Shared Mining': 54,
  'The dashboard is ready': 55,
  'The dashboard is not ready': 56,
  Node: 57,
  'The node switched from ${from} to ${to}. Restarting.': 58,
  'The node is still syncing. Blocks found before it catches up would be rejected by the network.': 59,
  'Mining on ${chain}': 60,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
