#!/bin/sh
# Entrypoint for the pool and solo mining subcontainers.
#
# ckpool writes its own stats to {logdir}:
#   /data/{mode}/log/pool/pool.status   pool-wide stats, multi-line JSON
#   /data/{mode}/log/users/{address}    per-user/worker stats
# The UI container reads these files off the shared /data volume.

MODE="${1:-pool}"                     # "pool" or "solo"
CONF="${2}"

log() {
  printf '%s %s\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" "$*"
}

RPC_TARGET=$(jq -r '.btcd[0].url // empty' "$CONF" 2>/dev/null)
RPC_USER=$(jq -r '.btcd[0].auth // empty' "$CONF" 2>/dev/null)
RPC_PASS=$(jq -r '.btcd[0].pass // empty' "$CONF" 2>/dev/null)

# Clear sharelog state so worker difficulty always resets from startdiff on
# restart. Stale high-difficulty entries otherwise leave miners looking idle.
rm -rf /data/${MODE}/log/???????? /data/${MODE}/log/clients.json 2>/dev/null

# Clean the socket directory left by a previous run
rm -rf "/tmp/${MODE}" 2>/dev/null

# -n sets the process name, which is also the socket directory under /tmp.
# -B is ckpool's btcsolo mode: the coinbase pays the miner that found the
# block rather than the pool's own address.
if [ "$MODE" = "solo" ]; then
  set -- ckpool -c "$CONF" -n "$MODE" -B -L
else
  set -- ckpool -c "$CONF" -n "$MODE" -L
fi

log "starting ckpool mode=${MODE} conf=${CONF} rpc_target=${RPC_TARGET:-unknown} rpc_user=${RPC_USER:-unknown}"

# ckpool only creates the sharelog directory /data/{mode}/log/{height:08x} when
# it detects a NEW block. Between restarts — or before the next block, ~10
# minutes on mainnet — there is no directory, fopen() fails, and every share
# submitted in that window is dropped from the sharelog, which is the only place
# per-worker accepted/rejected counts are persisted. Pre-create the directory
# for the current tip and the next couple of heights.
(
  LOGROOT="/data/${MODE}/log"
  while : ; do
    if [ -n "$RPC_TARGET" ] && [ -n "$RPC_USER" ] && [ -n "$RPC_PASS" ]; then
      BC=$(curl -s --max-time 5 --user "${RPC_USER}:${RPC_PASS}" \
             --data-binary '{"jsonrpc":"1.0","id":"sl","method":"getblockcount","params":[]}' \
             -H 'content-type: text/plain;' "http://${RPC_TARGET}/" 2>/dev/null \
           | jq -r '.result // empty' 2>/dev/null)
      if [ -n "$BC" ] && [ "$BC" -gt 0 ] 2>/dev/null; then
        # Current and next 2 heights — covers the race where the pool learns of
        # a new block slightly before or after this loop does.
        for d in 0 1 2; do
          HEX=$(printf '%08x' "$((BC + d))")
          mkdir -p "${LOGROOT}/${HEX}" 2>/dev/null
          chmod 0755 "${LOGROOT}/${HEX}" 2>/dev/null
        done
      fi
    fi
    sleep 30
  done
) &

# ckpool keeps a diff-weighted share sum per worker on disk, but each client's
# current vardiff is only reachable over its Unix socket. Stage the live client
# table on the shared volume so the dashboard can derive a real per-worker
# submission count from it.
(
  while : ; do
    sleep 10
    [ -S "/tmp/${MODE}/listener" ] || continue
    OUT=$(printf 'clients\n' | ckpmsg -s /tmp -n "${MODE}" 2>/dev/null \
            | sed -n 's/.*Received response: //p' | head -1)
    if [ -n "$OUT" ]; then
      mkdir -p "/data/${MODE}/log" 2>/dev/null
      printf '%s' "$OUT" > "/data/${MODE}/log/.clients.tmp" \
        && mv "/data/${MODE}/log/.clients.tmp" "/data/${MODE}/log/clients.json"
    fi
  done
) &

# Restart loop — ckpool exits when the node RPC is not yet answering.
MAX_RETRIES=10
RETRY=0
while true; do
  log "launch attempt $((RETRY + 1))/${MAX_RETRIES} mode=${MODE}"
  "$@" &
  PID=$!

  # Forward SIGTERM/SIGINT to the daemon for a clean shutdown
  trap 'kill "$PID" 2>/dev/null; exit 0' TERM INT
  wait "$PID"
  EXIT_CODE=$?

  # Exit 0 means a clean shutdown (SIGTERM) — don't restart
  [ "$EXIT_CODE" -eq 0 ] && exit 0

  RETRY=$((RETRY + 1))
  if [ "$RETRY" -ge "$MAX_RETRIES" ]; then
    log "ckpool (${MODE}) failed ${MAX_RETRIES} times, giving up"
    exit 1
  fi

  log "ckpool (${MODE}) exited with code ${EXIT_CODE}, restarting in 5s (attempt ${RETRY}/${MAX_RETRIES})"
  rm -rf "/tmp/${MODE}" 2>/dev/null
  sleep 5
done
