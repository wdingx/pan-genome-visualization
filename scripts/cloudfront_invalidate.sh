#!/usr/bin/env bash
set -euo pipefail
trap "exit" INT

export AWS_CLOUDFRONT_DISTRIBUTION_ID="${1:? Pass Cloudfront distribution ID as third parameter}"

# Update Cloudfront cache
aws cloudfront create-invalidation \
  --no-paginate \
  --distribution-id ${AWS_CLOUDFRONT_DISTRIBUTION_ID} \
  --paths "/*" \
  >/dev/null
