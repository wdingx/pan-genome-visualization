#!/usr/bin/env bash
set -euxo pipefail
trap "exit" INT

[ -f ".env" ] && source .env

# Remove unused files
find public/dataset/* -type d -exec rm -rf {} \+
rm -rf public/download
rm -rf public/phyloTree

# Precompress files
pigz -dfrq public/ || true
pigz -kfrq public/
find public/ -type f \( ! -iname "*.gz" -a ! -iname "*.br" \) | parallel brotli -kf || true

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
  --exclude "*.br" \
  "public/" "s3://${AWS_S3_BUCKET}/"

# Upload gzip-compressed non-HTML files
aws s3 sync \
  --delete \
  --only-show-errors \
  --cache-control "max-age=2592000, public" \
  --content-encoding gzip \
  --metadata-directive REPLACE \
  --exclude "*" \
  --include "*.gz" \
  --exclude "*.git*" \
  --exclude "*.html*" \
  "public/" "s3://${AWS_S3_BUCKET}/"

# Upload brotli-compressed non-HTML files
aws s3 sync \
  --delete \
  --only-show-errors \
  --cache-control "max-age=2592000, public" \
  --content-encoding br \
  --metadata-directive REPLACE \
  --exclude "*" \
  --include "*.br" \
  --exclude "*.git*" \
  --exclude "*.html*" \
  "public/" "s3://${AWS_S3_BUCKET}/"

# Remove non-HTML files
find public/ -type f \( ! -iname "*.html" -a ! -iname "*.html.gz" -a ! -iname "*.html.br" \) -exec rm {} \+
rename --filename 's/\.html//' public/*.html || true
rename --filename 's/\.html//' public/*.html.gz || true
rename --filename 's/\.html//' public/*.html.br || true

# Upload non-compressed HTML files
aws s3 sync \
  --delete \
  --only-show-errors \
  --content-type "text/html" \
  --cache-control "max-age=86400, public" \
  --metadata-directive REPLACE \
  --exclude "*.*" \
  "public/" "s3://${AWS_S3_BUCKET}/"

# Upload gzip-compressed HTML files
aws s3 sync \
  --delete \
  --only-show-errors \
  --content-type "text/html" \
  --cache-control "max-age=86400, public" \
  --content-encoding gzip \
  --metadata-directive REPLACE \
  --exclude "*" \
  --include "*.gz" \
  --exclude "*.*.gz" \
  "public/" "s3://${AWS_S3_BUCKET}/"

# Upload brotli-compressed HTML files
aws s3 sync \
  --delete \
  --only-show-errors \
  --content-type "text/html" \
  --cache-control "max-age=86400, public" \
  --content-encoding br \
  --metadata-directive REPLACE \
  --exclude "*" \
  --include "*.br" \
  --exclude "*.*.br" \
  "public/" "s3://${AWS_S3_BUCKET}/"

# Update Cloudfront cache
aws cloudfront create-invalidation \
  --no-paginate \
  --distribution-id ${AWS_CLOUDFRONT_DISTRIBUTION_ID} \
  --paths "/*" \
  >/dev/null
