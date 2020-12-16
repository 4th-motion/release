const { execSync } = require('child_process')
const log = require('../lib/log')

module.exports = (command, message) => {
  try {
    execSync(command, { stdio: 'inherit' })
    log.info(message)
  } catch (error) {
    log.error(`${error.message}`)
    process.exit(1)
  }
}
