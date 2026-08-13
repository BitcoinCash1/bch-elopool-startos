export const short = {
  en_US: 'A Bitcoin Cash mining pool you run yourself.',
  es_ES: 'Un pool de minería de Bitcoin Cash que usted mismo opera.',
  de_DE: 'Ein Bitcoin-Cash-Mining-Pool, den Sie selbst betreiben.',
  pl_PL: 'Kopalnia Bitcoin Cash, którą prowadzisz samodzielnie.',
  fr_FR: 'Un pool de minage Bitcoin Cash que vous exploitez vous-même.',
}

export const long = {
  en_US:
    'EloPool runs a Bitcoin Cash mining pool on hardware you control, so your miners submit work to your own node instead of a third-party pool that sees every share you find and decides when to pay you. It serves two Stratum endpoints at once: a shared one, where a block it finds pays your address and you settle with your miners however you like, and a solo one, where a block pays the miner that found it, less a fee you set. A built-in dashboard shows hashrate, shares and connected workers. Bitcoin Cash Node, Bitcoin Cash Daemon and Flowee the Hub are all supported as the node it mines against.',
  es_ES:
    'EloPool ejecuta un pool de minería de Bitcoin Cash en hardware que usted controla, de modo que sus mineros envían trabajo a su propio nodo en lugar de a un pool de terceros que ve cada acción que encuentra y decide cuándo pagarle. Ofrece dos puntos de conexión Stratum a la vez: uno compartido, donde el bloque que encuentra paga a su dirección y usted liquida con sus mineros como prefiera, y uno solo, donde el bloque paga al minero que lo encontró, menos la comisión que fije. Un panel integrado muestra la tasa de hash, las acciones y los trabajadores conectados. Bitcoin Cash Node, Bitcoin Cash Daemon y Flowee the Hub son compatibles como nodo contra el que minar.',
  de_DE:
    'EloPool betreibt einen Bitcoin-Cash-Mining-Pool auf Hardware, die Sie kontrollieren, sodass Ihre Miner ihre Arbeit an Ihren eigenen Knoten senden statt an einen fremden Pool, der jeden gefundenen Share sieht und über Ihre Auszahlung entscheidet. Er stellt zwei Stratum-Endpunkte gleichzeitig bereit: einen geteilten, bei dem ein gefundener Block an Ihre Adresse zahlt und Sie mit Ihren Minern nach eigenem Ermessen abrechnen, und einen Solo-Endpunkt, bei dem der Block an den Finder geht, abzüglich einer von Ihnen festgelegten Gebühr. Ein integriertes Dashboard zeigt Hashrate, Shares und verbundene Worker. Bitcoin Cash Node, Bitcoin Cash Daemon und Flowee the Hub werden als Knoten unterstützt, gegen den gemint wird.',
  pl_PL:
    'EloPool prowadzi kopalnię Bitcoin Cash na sprzęcie, który kontrolujesz, dzięki czemu Twoje koparki wysyłają pracę do Twojego własnego węzła, a nie do zewnętrznej kopalni, która widzi każdy znaleziony udział i decyduje, kiedy Ci zapłacić. Udostępnia jednocześnie dwa punkty końcowe Stratum: współdzielony, w którym znaleziony blok trafia na Twój adres i sam rozliczasz się z koparkami, oraz solo, w którym blok trafia do koparki, która go znalazła, pomniejszony o ustaloną przez Ciebie prowizję. Wbudowany panel pokazuje moc obliczeniową, udziały i podłączone koparki. Obsługiwane węzły to Bitcoin Cash Node, Bitcoin Cash Daemon i Flowee the Hub.',
  fr_FR:
    "EloPool fait tourner un pool de minage Bitcoin Cash sur du matériel que vous contrôlez, de sorte que vos mineurs soumettent leur travail à votre propre nœud plutôt qu'à un pool tiers qui voit chaque part trouvée et décide quand vous payer. Il expose deux points de connexion Stratum à la fois : un partagé, où un bloc trouvé paie votre adresse et où vous réglez vos mineurs comme vous l'entendez, et un solo, où le bloc paie le mineur qui l'a trouvé, moins les frais que vous fixez. Un tableau de bord intégré affiche le taux de hachage, les parts et les mineurs connectés. Bitcoin Cash Node, Bitcoin Cash Daemon et Flowee the Hub sont pris en charge comme nœud sur lequel miner.",
}

export const bitcoincashdDescription = {
  en_US:
    'The reference C++ Bitcoin Cash full node. Builds the block templates the pool mines on.',
  es_ES:
    'El nodo completo de Bitcoin Cash de referencia en C++. Construye las plantillas de bloque que mina el pool.',
  de_DE:
    'Der C++-Referenz-Vollknoten für Bitcoin Cash. Erstellt die Blockvorlagen, auf denen der Pool mint.',
  pl_PL:
    'Referencyjny pełny węzeł Bitcoin Cash w C++. Buduje szablony bloków, na których kopie kopalnia.',
  fr_FR:
    'Le nœud complet Bitcoin Cash de référence en C++. Construit les modèles de bloc que le pool mine.',
}

export const bchdDescription = {
  en_US:
    'A Go implementation of a Bitcoin Cash full node. Builds the block templates the pool mines on.',
  es_ES:
    'Una implementación en Go de un nodo completo de Bitcoin Cash. Construye las plantillas de bloque que mina el pool.',
  de_DE:
    'Eine Go-Implementierung eines Bitcoin-Cash-Vollknotens. Erstellt die Blockvorlagen, auf denen der Pool mint.',
  pl_PL:
    'Implementacja pełnego węzła Bitcoin Cash w języku Go. Buduje szablony bloków, na których kopie kopalnia.',
  fr_FR:
    "Une implémentation en Go d'un nœud complet Bitcoin Cash. Construit les modèles de bloc que le pool mine.",
}

export const floweeDescription = {
  en_US:
    'A modular Bitcoin Cash full node built for speed. Builds the block templates the pool mines on.',
  es_ES:
    'Un nodo completo de Bitcoin Cash modular diseñado para la velocidad. Construye las plantillas de bloque que mina el pool.',
  de_DE:
    'Ein modularer, auf Geschwindigkeit ausgelegter Bitcoin-Cash-Vollknoten. Erstellt die Blockvorlagen, auf denen der Pool mint.',
  pl_PL:
    'Modułowy pełny węzeł Bitcoin Cash zbudowany z myślą o szybkości. Buduje szablony bloków, na których kopie kopalnia.',
  fr_FR:
    'Un nœud complet Bitcoin Cash modulaire conçu pour la vitesse. Construit les modèles de bloc que le pool mine.',
}

export const knuthDescription = {
  en_US:
    'Optional sideload (BitcoinCash1). A C++ Bitcoin Cash full node. Classic GBT is served by the package sidecar so Fulcrum, Explorer and pools can use it.',
  es_ES:
    'Sideload opcional (BitcoinCash1). Nodo completo C++ de Bitcoin Cash. El sidecar del paquete sirve GBT clásico.',
  de_DE:
    'Optionales Sideload (BitcoinCash1). C++-Bitcoin-Cash-Vollknoten. Das Paket-Sidecar stellt klassisches GBT bereit.',
  pl_PL:
    'Opcjonalny sideload (BitcoinCash1). Pełny węzeł Bitcoin Cash w C++. Sidecar pakietu serwuje klasyczne GBT.',
  fr_FR:
    'Sideload optionnel (BitcoinCash1). Nœud complet Bitcoin Cash en C++. Le sidecar du paquet sert le GBT classique.',
}
