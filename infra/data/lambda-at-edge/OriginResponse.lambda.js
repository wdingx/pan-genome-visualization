// Workaround! Fixes HTTP headers for serving broken S3 uploads:
//   'Cache-Control': 'no-cache',
//   'Content-Encoding': 'gzip',
//
// Usage: Create an AWS Lambda@Edge function and attach it to "Origin Response"
// event of a Cloudfront distribution

const NEW_HEADERS_FIX_CACHE = {
  'Cache-Control': 'no-cache',
}

const NEW_HEADERS_FIX_COMPRESSION = {
  'Content-Encoding': 'gzip',
}

const ARCHIVE_EXTS = ['.7z', '.br', '.bz2', '.gz', '.lzma', '.xz', '.zip', '.zst']

function addHeaders(headersObject) {
  return Object.fromEntries(
    Object.entries(headersObject).map(([header, value]) => [header.toLowerCase(), [{
      key: header,
      value
    }]]),
  )
}

function getHeader(headers, headerName) {
  const header = headers[headerName.toLowerCase()]
  if (!header || !header[0] || !header[0].value) {
    return undefined
  }
  return header[0].value
}

function acceptsEncoding(headers, encoding) {
  const ae = getHeader(headers, 'Accept-Encoding')
  if (!ae || typeof ae != 'string') {
    return false
  }
  return ae.split(',').some((e) => e.trim().toLowerCase().startsWith(encoding.toLowerCase()))
}

function modifyHeaders({ request, response }) {
  let newHeaders = addHeaders(NEW_HEADERS_FIX_CACHE)

  if (ARCHIVE_EXTS.every((ext) => !request.uri.endsWith(ext))) {
    if(acceptsEncoding(request.headers, 'gzip')) {
      newHeaders = {
        ...newHeaders,
        ...addHeaders(NEW_HEADERS_FIX_COMPRESSION)
      }
    }
  }

  newHeaders = {
    ...response.headers,
    ...newHeaders,
  }

  return newHeaders
}

exports.handler = (event, context, callback) => {
  const { request, response } = event.Records[0].cf
  response.headers = modifyHeaders({ request, response })
  callback(null, response)
}

exports.modifyHeaders = modifyHeaders
