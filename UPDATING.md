# Updating the upstream version

This package builds [ckpool](https://github.com/skaisser/ckpool) from source in its own `Dockerfile`.

## Determining the upstream version

The fork cuts git tags but not always GitHub releases, and its `configure.ac` still carries Con Kolivas' `0.9.9`, so the tags are the version:

```sh
git ls-remote --tags https://github.com/skaisser/ckpool.git 'refs/tags/v*'
```

The current pin is the `CKPOOL_REF` build argument in `Dockerfile`.

> Package versions up to `1.1.1:22` claimed an upstream `1.1.1` that upstream never tagged. `1.1.0:0` is the first version to name a real one.

## Applying the bump

1. Set `CKPOOL_REF` in `Dockerfile` to the new tag.
2. Build the image (`make x86`). `patches/apply.py` asserts the expected hit count of every patch it applies, so a line that moved upstream fails the build with the patch that needs reanchoring named. Reanchor it against the new source rather than loosening the assertion — each patch is what makes the pool work against one of the three supported nodes, and a silently skipped one produces a pool that starts and mines nothing.
3. Bump `version` and rewrite `releaseNotes` in `startos/versions/current.ts`.
