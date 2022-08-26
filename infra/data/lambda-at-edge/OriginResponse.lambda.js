// Workaround! Fixes HTTP headers for serving broken S3 uploads:
//   'Cache-Control': 'no-cache',
//   'Content-Encoding': 'gzip',
//
// Usage: Create an AWS Lambda@Edge function and attach it to "Origin Response"
// event of a Cloudfront distribution

const NEW_HEADERS = {
  'Cache-Control': 'no-cache',
  'Content-Encoding': 'gzip',
}

function addHeaders(headersObject) {
  return Object.fromEntries(
    Object.entries(headersObject).map(([header, value]) => [header.toLowerCase(), [{
      key: header,
      value
    }]]),
  )
}

function modifyHeaders({ request, response }) {
  let newHeaders = addHeaders(NEW_HEADERS)

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
