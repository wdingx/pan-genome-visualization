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

echo "Ungzipping"
find "${INPUT_DIR}" -mindepth 2 -maxdepth 2 -type d | parallel --lb pigz -dfrq || true

echo "Gzipping"
pigz -fkq "${INPUT_DIR}/*.json"
find "${INPUT_DIR}" -mindepth 2 -maxdepth 2 -type d | parallel --lb pigz -kfrq || true
