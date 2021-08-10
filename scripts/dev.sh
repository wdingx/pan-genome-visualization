#!/usr/bin/env bash

BASH_DEBUG="${BASH_DEBUG:=}"
([ "${BASH_DEBUG}" == "true" ] || [ "${BASH_DEBUG}" == "1" ] ) && set -o xtrace
set -o errexit
set -o nounset
set -o pipefail
shopt -s dotglob
trap "exit" INT

if [ -z "${USER:=}" ]; then
  USER="$(id -un)"
fi

if [ -z "${UID:=}" ]; then
  UID="$(id -u)"
fi

if [ -z "${GROUP:=}" ]; then
  GROUP="$(id -gn)"
fi

if [ -z "${GID:=}" ]; then
  GID="$(id -g)"
fi

export USER
export UID
export GROUP
export GID

echo "USER=${USER}"
echo "UID=${UID}"
echo "GROUP=${GROUP}"
echo "GID=${GID}"


docker run -it --rm \
-u "$(id -u):$(id -g)" \
-v "${PWD}/.:/src" \
-w "/src" \
-p 3000:3000 \
node:10.24.0-buster \
bash -c "npm install && npm run build && npm start"
