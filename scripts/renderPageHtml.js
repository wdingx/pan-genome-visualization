const dotenv = require('dotenv')
const jade = require('jade')
const fs = require('fs')
const util = require('util')

dotenv.config()

const writeFile = util.promisify(fs.writeFile)

const PLAUSIBLE_IO_DOMAIN = process.env.PLAUSIBLE_IO_DOMAIN

async function renderPageHtml(page) {
  const html = jade.renderFile(`views/${page}.jade`, {
    pretty: true,
    PLAUSIBLE_IO_DOMAIN
  })
  return writeFile(`public/${page}.html`, html)
}

async function main() {
  return Promise.all([
    '404',
    'compare',
    'download',
    'gridstack',
    'index',
    'pipeline',
    'tutorial',
  ].map((page) => renderPageHtml(page)))
}

main().catch(console.error)

