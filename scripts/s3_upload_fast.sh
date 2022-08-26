#!/usr/bin/env bash
set -euo pipefail
trap "exit" INT

export INPUT_DIR="${1:? Pass input directory as first parameter}"
export S3_BUCKET="${2:? Pass S3 bucket name as second parameter}"

if [ ! -d "${INPUT_DIR}/dataset/" ]; then
  echo "Invalid input directory: '${INPUT_DIR}'. Input directory should contain subdirectory 'dataset/'"
fi

if [ ! -f "${INPUT_DIR}/index.json" ]; then
  echo "Invalid input directory: '${INPUT_DIR}'. Input directory should contain 'index.json'"
fi

#echo "Ungzipping"
#find "${INPUT_DIR}" -mindepth 2 -maxdepth 2 -type d | parallel --lb pigz -dfrq || true

#echo "Gzipping"
#pigz -fkq "${INPUT_DIR}/index.json"
#find "${INPUT_DIR}" -mindepth 2 -maxdepth 2 -type d | parallel --lb pigz -kfrq || true

echo "Uploading"

function bucket_path() {
  realpath --relative-to="${INPUT_DIR}" "${1}"
}
export -f bucket_path

function upload_gzip() {
  aws s3 sync --only-show-errors --delete --cache-control "no-cache" \
    --metadata-directive REPLACE --content-encoding=gzip \
    --exclude "*" --include "*.gz" \
    "${INPUT_DIR}/${1}" "s3://${S3_BUCKET}/${1}"
}
export -f upload_gzip

function upload_non_gzip() {
  aws s3 sync --only-show-errors --delete --cache-control "no-cache" \
    --metadata-directive REPLACE \
    --exclude "*.gz" \
    "${INPUT_DIR}/${1}" "s3://${S3_BUCKET}/${1}"
}
export -f upload_non_gzip


function upload_one_directory() {
  name=$(bucket_path ${1})
  printf "Uploading '${name}'\n"
  upload_gzip "${name}"
  # upload_non_gzip "${name}"
  printf "Uploading '${name}: done'\n"
}
export -f upload_one_directory

pushd "${INPUT_DIR}" >/dev/null

  for f in *.json; do
    aws s3 cp \
      --cache-control "no-cache" \
      --metadata-directive REPLACE \
      "${INPUT_DIR}/$f" "s3://${S3_BUCKET}/"
  done

  for f in *.json.gz; do
    aws s3 cp \
      --cache-control "no-cache" \
      --content-encoding=gzip --metadata-directive REPLACE \
      "${INPUT_DIR}/$f" "s3://${S3_BUCKET}/"
  done

popd >/dev/null

find "${INPUT_DIR}" -mindepth 2 -maxdepth 2 -type d | sort -h | parallel -j8 upload_one_directory
