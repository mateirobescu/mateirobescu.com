#!/bin/sh
set -e

nginx -g 'daemon off;' &
NGINX_PID=$!

# Certbot renews certs in the background (see docker-compose.yml); reload
# nginx periodically so it picks up renewed certs without a redeploy.
while :; do
  sleep 12h
  nginx -s reload
done &

wait "$NGINX_PID"
