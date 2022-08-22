const allowMethods = require('allow-methods')
const express = require('express')
const expressStaticGzip = require('express-static-gzip')
const morgan = require('morgan')
const path = require('path')

const PORT = 8000
const ROOT = path.join(__dirname, '..', 'public')
const NOT_FOUND_HTML = path.join(ROOT, '404.html')

function main() {
  const app = express()

  app.use(morgan('dev'))

  app.use(allowMethods(['GET', 'HEAD']))

  app.use(expressStaticGzip(ROOT, {
    enableBrotli: true,
    serveStatic: {
      extensions: ['html'],
      fallthrough: true,
      setHeaders: (res) => res.setHeader('Cache-Control', 'no-cache'),
    }
  }))

  app.use((req, res, next) => {
    res.status(404)

    res.format({
      html: function() {
        res.sendFile(NOT_FOUND_HTML)
      },
      json: function() {
        res.json({ error: 'Not found' })
      },
      default: function() {
        res.type('txt').send('Not found')
      }
    })
  })


  app.listen(PORT, () => {
    console.info(`Serving files from '${ROOT}' on 'http://localhost:${PORT}'. Try:`)
    console.info(`  curl -vfsS 'http://localhost:${PORT}' | head`)
  })
}

main()
