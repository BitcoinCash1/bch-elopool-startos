# Updating the upstream version

This package copies binaries from the pre-built GHCR image `ghcr.io/bitcoincash1/elopool-bch:latest`,
which is built from the patched fork at [BitcoinCash1/EloPool](https://github.com/BitcoinCash1/EloPool).
Upstream source: [skaisser/ckpool](https://github.com/skaisser/ckpool/releases).

## Determining the upstream version

Check the [upstream releases](https://github.com/skaisser/ckpool/releases).
The current package version is in `startos/versions/index.ts`.

## Applying the bump

1. Update the upstream sync in [BitcoinCash1/EloPool](https://github.com/BitcoinCash1/EloPool) if needed — the daily sync workflow handles this automatically.
2. Trigger a rebuild of `ghcr.io/bitcoincash1/elopool-bch` by pushing a tag or running `workflow_dispatch` on the Docker build workflow in that repo.
3. Add a new `startos/versions/v<X>.<Y>.<Z>.0.ts` file and update `startos/versions/index.ts` to set it as `current`.
4. Update version references in `README.md` and `instructions.md`.
