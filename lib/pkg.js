const fs = require('fs')
const path = require('path')
const log = require('./log')

module.exports = async () => {
  const packagePath = path.join(process.cwd(), 'package.json')
  let pkg

  if (!fs.existsSync(packagePath)) {
    log.error(`No package.json was found in ${packagePath}.`)
    process.exit(1)
  }

  try {
    pkg = await JSON.parse(fs.readFileSync(packagePath, 'utf-8'))
  } catch (error) {
    log.error(`Could not parse package.json in ${packagePath}.`)
    process.exit(1)
  }

  if (!pkg.version) {
    log.error(`There is no version specified in package.json.`)
    process.exit(1)
  }

  return pkg
}
