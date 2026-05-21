# ── Runtime ─────────────────────────────────────────────────────────
FROM node:20-bookworm-slim

ENV NODE_ENV=production

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    nginx libssl3 libjansson4 libzmq5 curl jq && \
    rm -rf /var/lib/apt/lists/*

# ckpool binaries (pre-built, BCHD-patched — see Dockerfile.binary)
COPY --from=ghcr.io/bitcoincash1/elopool-bch:latest /build/ckpool/src/ckpool /usr/local/bin/
COPY --from=ghcr.io/bitcoincash1/elopool-bch:latest /build/ckpool/src/ckpmsg /usr/local/bin/

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
