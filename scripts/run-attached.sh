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

mkdir -p .volumes/nginx/{config,cache,logs,tmp}
mkdir -p .volumes/node/tmp

docker-compose -f config/docker/docker-compose.yml build
docker-compose -f config/docker/docker-compose.yml up
