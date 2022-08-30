#!/usr/bin/env bash
set -euo pipefail
trap "exit" INT

export INPUT_DIR="${1:? Pass input directory as first parameter}"

if [ ! -d "${INPUT_DIR}/dataset/" ]; then
  echo "Invalid input directory: '${INPUT_DIR}'. Input directory should contain subdirectory 'dataset/'"
fi

if [ ! -f "${INPUT_DIR}/index.json" ]; then
  echo "Invalid input directory: '${INPUT_DIR}'. Input directory should contain 'index.json'"
fi


function compress_if_not_compressed() {
  f="${1}"
  if [ ! -f "${f}.gz" ]; then
    pigz -kq "${f}" || true
  fi
}
export -f compress_if_not_compressed

function compress_one_directory() {
  echo "Compressing '${1}'"
  find "${1}" -type f \( ! -iname "*.gz" \) | parallel -j4 compress_if_not_compressed || true
}
export -f compress_one_directory

find "${INPUT_DIR}" -mindepth 2 -maxdepth 2 -type d | sort -h | parallel --lb -j8 compress_one_directory





