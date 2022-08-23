const dotenv = require('dotenv')
const fetch = require('node-fetch')
const fs = require('fs')
const jade = require('jade')
const util = require('util')

dotenv.config()

const DATA_ROOT_URL = process.env.DATA_ROOT_URL
if(!DATA_ROOT_URL) {
  throw new Error('Environment variable \'DATA_ROOT_URL\' needs to be set')
}

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

async function renderPathogenHtml(pathogen) {
  const html = jade.renderFile('views/pathogen_template.jade', {
    pretty: true,
    ...pathogen,
    DATA_ROOT_URL,
  })
  return writeFile(`public/${pathogen.pathogenName}.html`, html)
}

async function getIndexJson(indexJsonPathOrUrl) {
  if(indexJsonPathOrUrl.startsWith('http')) {
    const res = await fetch(indexJsonPathOrUrl)
    return await res.text()
  }
  else {
    return readFile(indexJsonPathOrUrl, 'utf8')
  }
}

function getIndexPathOrUrl() {
  const indexJsonPathOrUrl = process.argv[2]
  if(indexJsonPathOrUrl) {
    return indexJsonPathOrUrl
  }
  return `${DATA_ROOT_URL}/index.json`
}

async function main() {
  const indexJsonPathOrUrl = getIndexPathOrUrl()
  const indexJsonStr = await getIndexJson(indexJsonPathOrUrl)
  const indexJson = JSON.parse(indexJsonStr)
  return Promise.all(indexJson.datasets.map((pathogen) => renderPathogenHtml(pathogen)))
}

main().catch(console.error)

