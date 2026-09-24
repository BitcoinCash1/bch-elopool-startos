import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

/**
 * Whether users may downgrade from this release to an earlier one. Set it per
 * release: `true` only when earlier versions can still read the data this one
 * leaves behind, `false` when this release is one-way.
 */
const ALLOW_DOWNGRADE = false

export const current = VersionInfo.of({
  version: '1.1.0:1',
  releaseNotes: {
    en_US:
      'Small miners on the solo port are no longer rejected. ckpool starts any port above 4000 at an ASIC-sized difficulty of 1,000,000 regardless of the configured start difficulty, so every share from a CPU or small miner on the solo port (4567) was refused as too easy; both ports now start at the difficulty you set. Knuth is also available again as a node backend, wired like the other nodes: the pool asks Knuth to turn JSON-RPC on and use its full database mode.',
    es_ES:
      'Los mineros pequeños en el puerto solo ya no son rechazados. ckpool inicia cualquier puerto por encima de 4000 con una dificultad de tamaño ASIC de 1.000.000, sea cual sea la dificultad inicial configurada, así que cada acción de una CPU o minero pequeño en el puerto solo (4567) se rechazaba por demasiado fácil; ahora ambos puertos empiezan con la dificultad que usted fije. Knuth vuelve a estar disponible como nodo, conectado como los demás: el pool pide a Knuth que active JSON-RPC y use su modo de base de datos completo.',
    de_DE:
      'Kleine Miner am Solo-Port werden nicht mehr abgewiesen. ckpool startet jeden Port über 4000 mit einer ASIC-Schwierigkeit von 1.000.000, unabhängig von der eingestellten Startschwierigkeit — jeder Share einer CPU oder eines kleinen Miners am Solo-Port (4567) wurde als zu leicht abgelehnt; beide Ports starten jetzt mit der von Ihnen gesetzten Schwierigkeit. Knuth steht außerdem wieder als Knoten zur Verfügung und wird wie die anderen angebunden: Der Pool bittet Knuth, JSON-RPC einzuschalten und den vollständigen Datenbankmodus zu verwenden.',
    pl_PL:
      'Małe koparki na porcie solo nie są już odrzucane. ckpool uruchamia każdy port powyżej 4000 z trudnością na poziomie ASIC 1 000 000, niezależnie od ustawionej trudności początkowej, więc każdy udział z CPU lub małej koparki na porcie solo (4567) był odrzucany jako zbyt łatwy; oba porty zaczynają teraz od ustawionej trudności. Knuth znów jest dostępny jako węzeł, podłączony tak jak pozostałe: kopalnia prosi Knuth o włączenie JSON-RPC i pełnego trybu bazy danych.',
    fr_FR:
      "Les petits mineurs sur le port solo ne sont plus rejetés. ckpool démarre tout port au-dessus de 4000 à une difficulté de taille ASIC de 1 000 000, quelle que soit la difficulté de départ configurée : chaque part d'un CPU ou petit mineur sur le port solo (4567) était refusée comme trop facile ; les deux ports démarrent désormais à la difficulté que vous fixez. Knuth est aussi de nouveau disponible comme nœud, branché comme les autres : le pool demande à Knuth d'activer JSON-RPC et son mode de base de données complet.",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: ALLOW_DOWNGRADE ? async () => {} : IMPOSSIBLE,
  },
})
