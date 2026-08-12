#!/usr/bin/env python3
"""Patch ckpool so it works against all three BCH nodes StartOS packages.

Upstream targets Bitcoin Cash Node, whose JSON-RPC the pool assumes. BCHD and
Flowee the Hub each break a different one of those assumptions, and each break
is silent — the pool starts, holds the stratum port open, and never produces
work. Run from the ckpool source root.

Every replacement below asserts its expected hit count, so an upstream bump that
moves one of these lines fails the image build instead of shipping a pool that
cannot mine against one node.
"""

import sys

COINBASE_AUX_FLAGS = (
    'flags = json_string_value(json_object_get(coinbase_aux, "flags"));'
)
COINBASE_AUX_GUARDED = (
    'flags = coinbase_aux ? json_string_value(json_object_get(coinbase_aux, '
    '"flags")) : NULL;'
)

# (why, file, find, replace, expected hit count)
PATCHES = [
    (
        'BCHD rejects a JSON-RPC request with no "id" member; upstream omits it',
        'src/bitcoin.c',
        r'{\"method\": ',
        r'{\"id\":0,\"method\": ',
        10,
    ),
    (
        'BCHD errors on the "coinbasetxn" GBT capability unless --miningaddr is set',
        'src/bitcoin.c',
        r'\"coinbasetxn\", ',
        '',
        1,
    ),
    (
        'coinbaseaux is optional per BIP22 and Flowee omits it, so reading its '
        '"flags" subfield dereferences NULL',
        'src/bitcoin.c',
        COINBASE_AUX_FLAGS,
        COINBASE_AUX_GUARDED,
        1,
    ),
    (
        'and the same field must stop being required of the template',
        'src/bitcoin.c',
        ' || !coinbase_aux',
        '',
        1,
    ),
]


def main() -> int:
    for why, path, find, replace, expected in PATCHES:
        with open(path) as f:
            src = f.read()

        found = src.count(find)
        if found != expected:
            print(
                f'ERROR: {path}: expected {expected} occurrence(s) of the anchor '
                f'for "{why}", found {found}. Upstream moved — reanchor this patch.',
                file=sys.stderr,
            )
            return 1

        with open(path, 'w') as f:
            f.write(src.replace(find, replace))

        print(f'patched {path} ({found}x): {why}')

    return 0


if __name__ == '__main__':
    sys.exit(main())
