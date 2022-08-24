// Implements rewrite of non-gz to gz URLs using AWS Lambda@Edge. This is
// useful if you have precompressed your files.
//
// Usage: Create an AWS Lambda function and attach it to "Origin Request" event
// of a Cloudfront distribution

ARCHIVE_EXTS = [
  '.7z',
  '.br',
  '.bz2',
  '.gz',
  '.lzma',
  '.xz',
  '.zip',
  '.zst',
]

exports.handler = (event, context, callback) => {
  const request = event.Records[0].cf.request

  // If not an archive file (which are not precompressed), rewrite the URL to
  // get the corresponding .gz file
  if(!ARCHIVE_EXTS.every(ext => request.uri.endsWith(ext))) {
    request.uri += '.gz'
  }

  callback(null, request)
}
