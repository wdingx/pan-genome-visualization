#!/usr/bin/env bash
set -euo pipefail
trap "exit" INT

source .env

# Remove unused
find public/dataset/* -type d -exec rm -rf {} \+
rm -rf public/download
rm -rf public/phyloTree

# Precompress files
pigz -dfrq public/ || true
pigz -kfrq public/

## Clear bucket
#aws s3 rm \
#  --recursive \
#  --only-show-errors \
#  "s3://${AWS_S3_BUCKET}/"

# Upload non-compressed non-HTML files
aws s3 sync \
  --delete \
  --only-show-errors \
  --cache-control "max-age=2592000, public" \
  --metadata-directive REPLACE \
  --exclude "*.git*" \
  --exclude "*.html" \
  --exclude "*.gz" \
  "public/" "s3://${AWS_S3_BUCKET}/"

# Upload compressed non-HTML files
aws s3 sync \
  --delete \
  --only-show-errors \
  --cache-control "max-age=2592000, public" \
  --content-encoding=gzip \
  --metadata-directive REPLACE \
  --exclude "*" \
  --include "*.gz" \
  --exclude "*.git*" \
  --exclude "*.html.gz" \
  "public/" "s3://${AWS_S3_BUCKET}/"

# Remove non-HTML files
find public/ -type f \( ! -iname "*.html" -a ! -iname "*.html.gz" \) -exec rm {} \+
rename --filename 's/\.html//' public/*.html || true
rename --filename 's/\.html//' public/*.html.gz || true

# Upload non-compressed HTML files
aws s3 sync \
  --delete \
  --only-show-errors \
  --content-type "text/html" \
  --cache-control "max-age=86400, public" \
  --metadata-directive REPLACE \
  --exclude "*.*" \
  "public/" "s3://${AWS_S3_BUCKET}/"

# Upload compressed HTML files
aws s3 sync \
  --delete \
  --only-show-errors \
  --content-type "text/html" \
  --cache-control "max-age=86400, public" \
  --content-encoding=gzip \
  --metadata-directive REPLACE \
  --exclude "*" \
  --include "*.gz" \
  --exclude "*.*.gz" \
  "public/" "s3://${AWS_S3_BUCKET}/"

# Update Cloudfront cache
aws cloudfront create-invalidation \
  --no-paginate \
  --distribution-id ${AWS_CLOUDFRONT_DISTRIBUTION_ID} \
  --paths "/*" \
  >/dev/null
