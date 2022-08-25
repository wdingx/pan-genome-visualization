/* eslint-disable prefer-destructuring */
// Adds additional headers to the response, including security headers.
// Suited for websites.
//
// See also:
//  - https://securityheaders.com/
//
// Usage: Create an AWS Lambda@Edge function and attach it to "Viewer Response"
// event of a Cloudfront distribution

const FEATURE_POLICY = {
  'accelerometer': `'none'`,
  'autoplay': `'none'`,
  'camera': `'none'`,
  'document-domain': `'none'`,
  'encrypted-media': `'none'`,
  'fullscreen': `'none'`,
  'geolocation': `'none'`,
  'gyroscope': `'none'`,
  'magnetometer': `'none'`,
  'microphone': `'none'`,
  'midi': `'none'`,
  'payment': `'none'`,
  'picture-in-picture': `'none'`,
  'sync-xhr': `'none'`,
  'usb': `'none'`,
  'xr-spatial-tracking': `'none'`,
}

function generateFeaturePolicyHeader(featurePolicyObject) {
  return Object.entries(featurePolicyObject)
    .map(([policy, value]) => `${policy} ${value}`)
    .join('; ')
}

const PERMISSIONS_POLICY = {
  'accelerometer': '()',
  'ambient-light-sensor': '()',
  'autoplay': '()',
  'battery': '()',
  'camera': '()',
  'clipboard-read': '()',
  'clipboard-write': '()',
  'conversion-measurement': '()',
  'cross-origin-isolated': '()',
  'display-capture': '()',
  'document-domain': '()',
  'encrypted-media': '()',
  'execution-while-not-rendered': '()',
  'execution-while-out-of-viewport': '()',
  'focus-without-user-activation': '()',
  'fullscreen': '()',
  'gamepad': '()',
  'geolocation': '()',
  'gyroscope': '()',
  'hid': '()',
  'idle-detection': '()',
  'interest-cohort': '()',
  'keyboard-map': '()',
  'magnetometer': '()',
  'microphone': '()',
  'midi': '()',
  'navigation-override': '()',
  'payment': '()',
  'picture-in-picture': '()',
  'publickey-credentials-get': '()',
  'screen-wake-lock': '()',
  'serial': '()',
  'speaker-selection': '()',
  'sync-script': '()',
  'sync-xhr': '()',
  'trust-token-redemption': '()',
  'usb': '()',
  'vertical-scroll': '()',
  'web-share': '()',
  'window-placement': '()',
  'xr-spatial-tracking': '()',
}

function generatePermissionsPolicyHeader(permissionsPolicyObject) {
  return Object.entries(permissionsPolicyObject)
    .map(([policy, value]) => `${policy}=${value}`)
    .join(', ')
}

const NEW_HEADERS = {
  'Content-Security-Policy':
    `default-src 'self' *.pangenome.org; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.pangenome.org maxcdn.bootstrapcdn.com; style-src 'self' 'unsafe-inline' maxcdn.bootstrapcdn.com fonts.googleapis.com; font-src 'self' maxcdn.bootstrapcdn.com fonts.googleapis.com fonts.gstatic.com;img-src 'self' data:; connect-src *; frame-src 'self' player.vimeo.com`,
  'Referrer-Policy': 'no-referrer',
  'Strict-Transport-Security': 'max-age=15768000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-DNS-Prefetch-Control': 'off',
  'X-Download-Options': 'noopen',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-XSS-Protection': '1; mode=block',
  'Feature-Policy': generateFeaturePolicyHeader(FEATURE_POLICY),
  'Permissions-Policy': generatePermissionsPolicyHeader(PERMISSIONS_POLICY),
}

function addHeaders(headersObject) {
  return Object.fromEntries(
    Object.entries(headersObject).map(([header, value]) => [header.toLowerCase(), [{
      key: header,
      value
    }]]),
  )
}

const HEADERS_TO_REMOVE = new Set(['server', 'via'])

function filterHeaders(headers) {
  return Object.entries(headers).reduce((result, [key, value]) => {
    if(HEADERS_TO_REMOVE.has(key.toLowerCase())) {
      return result
    }

    if(key.toLowerCase().includes('powered-by')) {
      return result
    }

    return { ...result, [key.toLowerCase()]: value }
  }, {})
}

function modifyHeaders({ request, response }) {
  let newHeaders = addHeaders(NEW_HEADERS)

  newHeaders = {
    ...response.headers,
    ...newHeaders,
  }

  newHeaders = filterHeaders(newHeaders)

  return newHeaders
}

exports.handler = (event, context, callback) => {
  const { request, response } = event.Records[0].cf
  response.headers = modifyHeaders({ request, response })
  callback(null, response)
}

exports.modifyHeaders = modifyHeaders
