const jade = require('jade')
const fs = require('fs')
const util = require('util')

const writeFile = util.promisify(fs.writeFile)

async function renderPageHtml(page) {
  const html = jade.renderFile(`views/${page}.jade`, {
    pretty: true,
  })
  return writeFile(`public/${page}.html`, html)
}

async function main() {
  return Promise.all([
    'compare',
    'download',
    'gridstack',
    'index',
    'notFound',
    'pipeline',
    'tutorial',
  ].map((page) => renderPageHtml(page)))
}

main().catch(console.error)

