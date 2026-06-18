# ── Build ckpool from source (with BCH + Flowee patches) ─────────────────────
FROM --platform=linux/amd64 ubuntu:22.04 AS ckpool-builder

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    build-essential autoconf automake libtool pkg-config \
    libssl-dev libjansson-dev libzmq3-dev \
    ca-certificates git && \
    rm -rf /var/lib/apt/lists/*

RUN git clone --depth 1 https://github.com/skaisser/ckpool.git /build/ckpool

WORKDIR /build/ckpool

# BCHD requires an "id" field in every JSON-RPC request; upstream ckpool omits it.
# Also remove "coinbasetxn" from GBT capabilities: BCHD errors unless --miningaddr is set.
RUN sed -i 's/{\\\"method\\\": /{\\\"id\\\":0,\\\"method\\\": /g; s/{\\\"method\\\":\\\"/{\\\"id\\\":0,\\\"method\\\":\\\"/g; s/\\\"coinbasetxn\\\", //g' src/bitcoin.c

# Flowee omits coinbaseaux (optional per BIP22); guard NULL dereference and remove from required-field check.
RUN sed -i \
    -e 's/flags = json_string_value(json_object_get(coinbase_aux, "flags"));/flags = coinbase_aux ? json_string_value(json_object_get(coinbase_aux, "flags")) : NULL;/' \
    -e 's/ || !coinbase_aux//' \
    src/bitcoin.c

RUN ./autogen.sh && ./configure && make

# ── Runtime ─────────────────────────────────────────────────────────
FROM node:20-bookworm-slim

ENV NODE_ENV=production

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    nginx libssl3 libjansson4 libzmq5 curl jq && \
    rm -rf /var/lib/apt/lists/*

# ckpool binaries (built above with BCH + Flowee patches — see Dockerfile.binary for the canonical image)
COPY --from=ckpool-builder /build/ckpool/src/ckpool /usr/local/bin/
COPY --from=ckpool-builder /build/ckpool/src/ckpmsg /usr/local/bin/

# WebUI static files
COPY webui/ /var/www/html/

# nginx config
COPY assets/nginx.conf /etc/nginx/sites-available/default

# Stats API helper
COPY assets/stats-api.sh /usr/local/bin/stats-api.sh
RUN chmod +x /usr/local/bin/stats-api.sh

# Delete-worker API handler
COPY assets/delete-worker.js /usr/local/bin/delete-worker.js

# Pool/solo daemon entrypoint (runs stats-writer alongside ckpool)
COPY assets/pool-entrypoint.sh /usr/local/bin/pool-entrypoint.sh
RUN chmod +x /usr/local/bin/pool-entrypoint.sh

# Entrypoint for UI daemon (starts stats updater + nginx)
COPY assets/ui-entrypoint.sh /usr/local/bin/ui-entrypoint.sh
RUN chmod +x /usr/local/bin/ui-entrypoint.sh

RUN mkdir -p /data/pool /data/solo /var/www/html/api

EXPOSE 80 3333 4567
