const fs = require('fs')
const path = require('path')
const log = require('./log')

module.exports = async (fileName = 'package.json') => {
  const packagePath = path.join(process.cwd(), fileName)
  let pkg

  if (!fs.existsSync(packagePath)) {
    log.error(`No ${fileName} was found in ${packagePath}.`)
    process.exit(1)
  }

  try {
    pkg = await JSON.parse(fs.readFileSync(packagePath, 'utf-8'))
  } catch (error) {
    log.error(`Could not parse ${fileName} in ${packagePath}.`)
    process.exit(1)
  }

  if (!pkg.version) {
    log.error(`There is no version specified in ${fileName}.`)
    process.exit(1)
  }

  return pkg
}
