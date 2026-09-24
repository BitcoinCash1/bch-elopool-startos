import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

/**
 * Whether users may downgrade from this release to an earlier one. Set it per
 * release: `true` only when earlier versions can still read the data this one
 * leaves behind, `false` when this release is one-way.
 */
const ALLOW_DOWNGRADE = false

export const current = VersionInfo.of({
  version: '1.3.0:0',
  releaseNotes: {
    en_US:
      "Updates the pool software to skaisser's ckpool v1.3.0. Small miners on the solo port are no longer rejected: ckpool starts any port above 4000 at an ASIC-sized difficulty of 1,000,000 regardless of the configured start difficulty, so both ports now start at the difficulty you set. Knuth is also available again as a node backend, wired like the other nodes.",
    es_ES:
      'Actualiza el software del pool a ckpool v1.3.0 de skaisser. Los mineros pequeños en el puerto solo ya no son rechazados: ckpool inicia cualquier puerto por encima de 4000 con una dificultad de tamaño ASIC de 1.000.000, sea cual sea la dificultad inicial configurada, así que ahora ambos puertos empiezan con la dificultad que usted fije. Knuth vuelve a estar disponible como nodo, conectado como los demás.',
    de_DE:
      'Aktualisiert die Pool-Software auf skaissers ckpool v1.3.0. Kleine Miner am Solo-Port werden nicht mehr abgewiesen: ckpool startet jeden Port über 4000 mit einer ASIC-Schwierigkeit von 1.000.000, unabhängig von der eingestellten Startschwierigkeit — beide Ports starten jetzt mit der von Ihnen gesetzten Schwierigkeit. Knuth steht außerdem wieder als Knoten zur Verfügung und wird wie die anderen angebunden.',
    pl_PL:
      'Aktualizuje oprogramowanie kopalni do ckpool v1.3.0 autorstwa skaisser. Małe koparki na porcie solo nie są już odrzucane: ckpool uruchamia każdy port powyżej 4000 z trudnością na poziomie ASIC 1 000 000, niezależnie od ustawionej trudności początkowej, więc oba porty zaczynają teraz od ustawionej trudności. Knuth znów jest dostępny jako węzeł, podłączony tak jak pozostałe.',
    fr_FR:
      'Met à jour le logiciel du pool vers ckpool v1.3.0 de skaisser. Les petits mineurs sur le port solo ne sont plus rejetés : ckpool démarre tout port au-dessus de 4000 à une difficulté de taille ASIC de 1 000 000, quelle que soit la difficulté de départ configurée ; les deux ports démarrent désormais à la difficulté que vous fixez. Knuth est aussi de nouveau disponible comme nœud, branché comme les autres.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: ALLOW_DOWNGRADE ? async () => {} : IMPOSSIBLE,
  },
})
