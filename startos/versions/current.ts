import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.1.0:2',
  releaseNotes: {
    en_US:
      'Solo (port 4567) no longer starts at ASIC-scale share difficulty. ckpool treats ports above 4000 as highdiff (1e6); highdiff is now the configured start difficulty so CPU miners on chipnet can land shares. Optional Knuth sideload (BitcoinCash1); Flowee is dialed on the per-network RPC port. The solo fee now works (it was divided by a hundred and the fee address was never set). The pool reaches its node over the StartOS host bridge. Mining addresses are shown as stratum+tcp:// URLs, and a Node health check reports when the node is still syncing.',
    es_ES:
      'La comisión de solo ya funciona. ckpool la lee como porcentaje y la paga a una dirección aparte; este paquete la dividía entre cien y nunca fijaba esa dirección, así que no se cobraba nada. El pool también llega a su nodo como StartOS espera, lo que arregla la minería con Flowee the Hub: sus credenciales RPC cambiaron de sitio y el pool seguía buscando las antiguas. Se elimina Knuth como backend: no sirve el tipo de plantilla de bloque que pide este pool. Las direcciones de minería se muestran como URLs stratum+tcp:// que puede copiar directamente en un minero, y una nueva comprobación de estado Nodo avisa cuando el nodo aún se está sincronizando.',
    de_DE:
      'Die Solo-Gebühr funktioniert jetzt. ckpool liest sie als Prozentwert und zahlt sie an eine eigene Adresse; dieses Paket teilte sie zusätzlich durch hundert und setzte jene Adresse nie — es wurde also nichts einbehalten. Der Pool erreicht seinen Knoten außerdem auf dem von StartOS vorgesehenen Weg, was das Mining mit Flowee the Hub repariert: dessen RPC-Zugangsdaten sind umgezogen, der Pool suchte noch die alten. Knuth als Backend entfällt — es liefert nicht die Art von Blockvorlage, die dieser Pool anfordert. Mining-Adressen werden als stratum+tcp://-URLs angezeigt, die sich direkt in einen Miner kopieren lassen, und eine neue Zustandsprüfung „Knoten" meldet, wenn der Knoten noch synchronisiert.',
    pl_PL:
      'Prowizja solo wreszcie działa. ckpool czyta ją jako procent i wypłaca na osobny adres, a ten pakiet dodatkowo dzielił ją przez sto i nigdy nie ustawiał tego adresu — nic więc nie było pobierane. Kopalnia łączy się też ze swoim węzłem w sposób przewidziany przez StartOS, co naprawia kopanie z Flowee the Hub: jego dane logowania RPC zmieniły miejsce, a kopalnia wciąż szukała starych. Knuth jako zaplecze został usunięty — nie udostępnia szablonów bloków, o które prosi ta kopalnia. Adresy do kopania są pokazywane jako adresy stratum+tcp://, które można wkleić wprost do koparki, a nowa kontrola stanu „Węzeł" informuje, gdy węzeł wciąż się synchronizuje.',
    fr_FR:
      "Les frais de solo fonctionnent enfin. ckpool les lit comme un pourcentage et les verse à une adresse distincte ; ce paquet les divisait en plus par cent et ne fixait jamais cette adresse — rien n'était donc prélevé. Le pool joint également son nœud de la manière prévue par StartOS, ce qui répare le minage avec Flowee the Hub : ses identifiants RPC ont changé de place et le pool cherchait toujours les anciens. Knuth disparaît comme backend : il ne fournit pas le type de modèle de bloc que ce pool demande. Les adresses de minage sont affichées sous forme d'URL stratum+tcp:// à copier directement dans un mineur, et un nouveau contrôle d'état « Nœud » signale quand le nœud est encore en cours de synchronisation.",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
