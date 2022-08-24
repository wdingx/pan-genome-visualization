#!/usr/bin/env bash

set -euxo pipefail

export INPUT_DIR="${1:? Pass input directory as first parameter}"
export S3_BUCKET="${2:? Pass S3 bucket name as second parameter}"

content_encoding() {
  case "$1" in
    *.gz) echo --content-encoding=gzip;;
    *.br) echo --content-encoding=br;;
    *)    echo '';;
  esac
}
export -f content_encoding

content_type() {
  f="${1%.gz}"
  f="${f%.br}"
  f="${f%.zip}"
  f="${f%.xz}"
  f="${f%.zst}"
  f="${f%.zstd}"
  f="${f%.tar}"
  case "${f}" in
    *.apng)         echo --content-type=image/apng;;
    *.avif)         echo --content-type=image/avif;;
    *.bz2)          echo --content-type=application/x-bzip2;;
    *.css)          echo --content-type=text/css;;
    *.csv)          echo --content-type=text/csv;;
    *.gif)          echo --content-type=image/gif;;
    *.gz)           echo --content-type=application/gzip;;
    *.htm | *.html) echo --content-type=text/html;;
    *.ico)          echo --content-type=image/x-icon;;
    *.jpg | *.jpeg) echo --content-type=image/jpeg;;
    *.js | *.mjs)   echo --content-type=text/javascript;;
    *.json)         echo --content-type=application/json;;
    *.ndjson)       echo --content-type=application/x-ndjson;;
    *.png)          echo --content-type=image/png;;
    *.svg)          echo --content-type=image/svg+xml;;
    *.tar)          echo --content-type=application/x-tar;;
    *.tsv)          echo --content-type=text/tab-separated-values;;
    *.wasm)         echo --content-type=application/wasm;;
    *.webp)         echo --content-type=image/webp;;
    *.xz)           echo --content-type=application/x-xz;;
    *.zip)          echo --content-type=application/zip;;
    *.zst)          echo --content-type=application/zstd;;
    *)              echo --content-type=text/plain;;
  esac
}
export -f content_type

upload() {
  aws s3 cp --only-show-errors --cache-control "max-age=2592000, public" $(content_encoding "${1}") $(content_type "${1}") "-" "s3://${S3_BUCKET}/${1}"
}
export -f upload

upload_one_file() {
  if [[ "${1}" == *.gz ]] && [[ "${1}" != *.tar.gz ]]; then
    pigz -cdk "${1}" | upload "${1%.gz}"
    cat "${1}" | upload "${1}"
    pigz -cdk "${1}" | brotli -cf - | upload "${1%.gz}.br"
  elif [[ "${1}" != *.zip ]]; then
    cat "${1}" | upload "${1}"
    pigz -kf "${1}" | upload "${1}.gz"
    brotli -kf "${1}" | upload "${1}.br"
  fi
}
export -f upload_one_file

upload_one_directory() {
  echo "Uploading '${1}'"
  find "${1}/" -mindepth 1 -maxdepth 1 -type f | parallel -j 20 --lb upload_one_file
}
export -f upload_one_directory

find "${INPUT_DIR}" -mindepth 2 -maxdepth 2 -type d | parallel -j 8 upload_one_directory
