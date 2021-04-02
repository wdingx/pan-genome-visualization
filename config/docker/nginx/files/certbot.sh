#!/usr/bin/env bash

set -x

BASH_DEBUG="${BASH_DEBUG:=}"
([ "${BASH_DEBUG}" == "true" ] || [ "${BASH_DEBUG}" == "1" ] ) && set -o xtrace
set -o errexit
set -o nounset
set -o pipefail
shopt -s dotglob
trap "exit" INT

EMAIL="hello@neherlab.org"
WEBROOT="/usr/share/nginx/html/"
DOMAINS="pangenome.org,pangenome.ch,pangenome.de"

echo "[info] ${0}: Updating SSL certificates for $(IFS=','; echo "${DOMAINS[*]}")"
bash -c "certbot certonly \
  --webroot \
  -n \
  -w ${WEBROOT} \
  --email=${EMAIL} \
  --no-eff-email \
  --agree-tos \
  --domains=${DOMAINS} \
  "

  # --staging \
  # --test-cert \
  # --dry-run \

# Enable HTTPS
sed -i 's/# include https.conf;/include https.conf;/' /etc/nginx/nginx.conf

echo "[info] ${0}: Reloading nginx"
nginx -s reload
