const jade = require('jade')
const fs = require('fs')
const util = require('util')
const dotenv = require('dotenv')

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

async function main() {
  const indexJsonPath = process.argv[2]
  const indexJsonStr = await readFile(indexJsonPath, 'utf8')
  const indexJson = JSON.parse(indexJsonStr)
  return Promise.all(indexJson.datasets.map((pathogen) => renderPathogenHtml(pathogen)))
}

main().catch(console.error)

