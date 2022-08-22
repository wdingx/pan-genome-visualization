const jade = require('jade')
const fs = require('fs')
const util = require('util')

const writeFile = util.promisify(fs.writeFile)

async function renderPathogenHtml(pathogen) {
  const html = jade.renderFile('views/pathogen_template.jade', {
    pretty: true,
    ...pathogen,
  })
  return writeFile(`public/${pathogen.pathogenName}.html`, html)
}

async function main() {
  return Promise.all([
    { pathogenName: 'P_aeruginosa', hasNewColumnConfig: true, hasStandardColumnConfig: true },
    { pathogenName: 'P_marinus_meta', hasNewColumnConfig: true, hasStandardColumnConfig: true },
    { pathogenName: 'Pseudomonas_aeruginosa', hasNewColumnConfig: true, hasStandardColumnConfig: true },
    { pathogenName: 'S_pneumoniae616', hasNewColumnConfig: false, hasStandardColumnConfig: false },
    { pathogenName: 'Staphylococcus_aureus', hasNewColumnConfig: false, hasStandardColumnConfig: false },
    { pathogenName: 'Streptococcus_pneumoniae', hasNewColumnConfig: false, hasStandardColumnConfig: false },
    { pathogenName: 'Vibrio_cholerae', hasNewColumnConfig: false, hasStandardColumnConfig: false },
    { pathogenName: 'Yersinia_pestis', hasNewColumnConfig: false, hasStandardColumnConfig: false },
  ].map((pathogen) => renderPathogenHtml(pathogen)))
}

main().catch(console.error)

