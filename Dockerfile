# ── Build ckpool (EloPool) from source ──────────────────────────────
FROM ubuntu:22.04 AS build-ckpool

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    build-essential autoconf automake libtool pkg-config \
    libssl-dev libjansson-dev libzmq3-dev \
    ca-certificates git && \
    rm -rf /var/lib/apt/lists/*

RUN git clone --depth 1 https://github.com/skaisser/ckpool.git /build/ckpool
WORKDIR /build/ckpool
# BCHD requires an "id" field in every JSON-RPC request; upstream ckpool omits it.
# Also remove "coinbasetxn" from the GBT capabilities: BCHD interprets it as
# "build me a ready-made coinbase" and errors unless --miningaddr is set.
# Without coinbasetxn, BCHD returns a normal template and the pool builds its own coinbase.
RUN sed -i 's/{\\\"method\\\": /{\\\"id\\\":0,\\\"method\\\": /g; s/{\\\"method\\\":\\\"/{\\\"id\\\":0,\\\"method\\\":\\\"/g; s/\\\"coinbasetxn\\\", //g' src/bitcoin.c
RUN ./autogen.sh && ./configure && make

# ── Runtime ─────────────────────────────────────────────────────────
FROM node:20-bookworm-slim

ENV NODE_ENV=production

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    nginx libssl3 libjansson4 libzmq5 curl jq && \
    rm -rf /var/lib/apt/lists/*

# ckpool binaries
COPY --from=build-ckpool /build/ckpool/src/ckpool /usr/local/bin/
COPY --from=build-ckpool /build/ckpool/src/ckpmsg /usr/local/bin/

# WebUI static files
COPY webui/ /var/www/html/

# nginx config
COPY assets/nginx.conf /etc/nginx/sites-available/default

# Stats API helper
COPY assets/stats-api.sh /usr/local/bin/stats-api.sh
RUN chmod +x /usr/local/bin/stats-api.sh

# Pool/solo daemon entrypoint (runs stats-writer alongside ckpool)
COPY assets/pool-entrypoint.sh /usr/local/bin/pool-entrypoint.sh
RUN chmod +x /usr/local/bin/pool-entrypoint.sh

# Entrypoint for UI daemon (starts stats updater + nginx)
COPY assets/ui-entrypoint.sh /usr/local/bin/ui-entrypoint.sh
RUN chmod +x /usr/local/bin/ui-entrypoint.sh

RUN mkdir -p /data/pool /data/solo /var/www/html/api

EXPOSE 80 3333 4567
