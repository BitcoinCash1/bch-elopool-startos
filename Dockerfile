# ── Build ckpool (EloPool) from source ──────────────────────────────
FROM ubuntu:22.04 AS build-ckpool

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    build-essential autoconf automake libtool pkg-config \
    libssl-dev libjansson-dev libzmq3-dev \
    git ca-certificates && \
    rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/skaisser/ckpool.git /build/ckpool
WORKDIR /build/ckpool
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

# Entrypoint for UI daemon (starts stats updater + nginx)
COPY assets/ui-entrypoint.sh /usr/local/bin/ui-entrypoint.sh
RUN chmod +x /usr/local/bin/ui-entrypoint.sh

RUN mkdir -p /data/pool /data/solo /var/www/html/api

EXPOSE 80 3333 4567
