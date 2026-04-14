#!/bin/sh
# UI entrypoint: starts the stats updater in the background, then runs nginx
/usr/local/bin/stats-api.sh &
exec nginx -g 'daemon off;'
