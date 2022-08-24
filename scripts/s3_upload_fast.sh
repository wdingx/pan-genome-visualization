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

function bucket_path {
  realpath --relative-to="${INPUT_DIR}" "${1}"
}
export -f bucket_path

function upload_gzip() {
  aws s3 sync --only-show-errors --cache-control "max-age=2592000, public" --content-encoding=gzip --exclude "*" --include "*.gz" "${INPUT_DIR}/${1}" "s3://${S3_BUCKET}/${1}"
}
export -f upload_gzip

function upload_non_gzip() {
  aws s3 sync --only-show-errors --cache-control "max-age=2592000, public" --exclude "*.gz" "${INPUT_DIR}/${1}" "s3://${S3_BUCKET}/${1}"
}
export -f upload_non_gzip

function upload_one_directory() {
  echo "Uploading '${1}'"
  parallel ::: "upload_gzip $(bucket_path ${1})" "upload_non_gzip $(bucket_path ${1})"
}
export -f upload_one_directory

aws s3 cp --only-show-errors --cache-control "max-age=2592000, public" "${INPUT_DIR}/index.json" "s3://${S3_BUCKET}/index.json"
aws s3 cp --only-show-errors --cache-control "max-age=2592000, public" --content-encoding=gzip "${INPUT_DIR}/index.json.gz" "s3://${S3_BUCKET}/index.json.gz"

find "${INPUT_DIR}" -mindepth 2 -maxdepth 2 -type d | parallel -j 4 upload_one_directory
