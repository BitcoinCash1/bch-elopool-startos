# ── Build ckpool ────────────────────────────────────────────────────
FROM ubuntu:22.04 AS build

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    build-essential autoconf automake libtool pkg-config \
    libssl-dev libjansson-dev libzmq3-dev \
    ca-certificates git python3 && \
    rm -rf /var/lib/apt/lists/*

ARG CKPOOL_REF=v1.1.0
RUN git clone --depth 1 --branch ${CKPOOL_REF} \
    https://github.com/skaisser/ckpool.git /build/ckpool

COPY patches/ /build/patches/
WORKDIR /build/ckpool

# Every patch below either fails the build or is asserted afterwards: a `sed`
# whose pattern stops matching a future upstream is otherwise silent, and the
# resulting binary breaks only against one of the three nodes.
RUN python3 /build/patches/apply.py

RUN ./autogen.sh && ./configure && make -j"$(nproc)"

# ── Runtime ─────────────────────────────────────────────────────────
FROM node:20-bookworm-slim

ENV NODE_ENV=production

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    nginx libssl3 libjansson4 libzmq5 curl jq && \
    rm -rf /var/lib/apt/lists/*

COPY --from=build /build/ckpool/src/ckpool /usr/local/bin/
COPY --from=build /build/ckpool/src/ckpmsg /usr/local/bin/

# WebUI static files
COPY webui/ /var/www/html/

# nginx config
COPY assets/nginx.conf /etc/nginx/sites-available/default

# Stats API helper
COPY assets/stats-api.sh /usr/local/bin/stats-api.sh
RUN chmod +x /usr/local/bin/stats-api.sh

# Delete-worker API handler
COPY assets/delete-worker.js /usr/local/bin/delete-worker.js

# Pool/solo daemon entrypoint
COPY assets/pool-entrypoint.sh /usr/local/bin/pool-entrypoint.sh
RUN chmod +x /usr/local/bin/pool-entrypoint.sh

# Entrypoint for the UI daemon (stats updater + nginx)
COPY assets/ui-entrypoint.sh /usr/local/bin/ui-entrypoint.sh
RUN chmod +x /usr/local/bin/ui-entrypoint.sh

RUN mkdir -p /data/pool /data/solo /var/www/html/api

EXPOSE 80 3333 4567
