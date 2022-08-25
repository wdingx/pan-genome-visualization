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

cd "${INPUT_DIR}"

# If parallel version does not work for you, here is a serial version

echo "Upload gz"
aws s3 sync --only-show-errors --cache-control "max-age=2592000, public" --content-encoding=gzip --metadata-directive REPLACE \
 --content-encoding=gzip --exclude "*" --include "*.gz" . "s3://${S3_BUCKET}"

echo "Upload non-gz"
aws s3 sync --only-show-errors --cache-control "max-age=2592000, public" --metadata-directive REPLACE \
 --exclude "*.gz" . "s3://${S3_BUCKET}"

# # Here is a slightly parallel version
#
# function upload_gzip() {
#   aws s3 sync --only-show-errors --delete --cache-control "max-age=2592000, public" \
#     --content-encoding=gzip --metadata-directive REPLACE --exclude "*" --include "*.gz" \
#     . "s3://${S3_BUCKET}"
# }
# export -f upload_gzip
#
# function upload_non_gzip() {
#   aws s3 sync --only-show-errors --delete --cache-control "max-age=2592000, public" --metadata-directive REPLACE \
#     --exclude "*.gz" \
#     . "s3://${S3_BUCKET}"
# }
# export -f upload_non_gzip
#
# parallel ::: upload_gzip upload_non_gzip
