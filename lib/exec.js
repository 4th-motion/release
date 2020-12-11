const { execSync } = require('child_process')
const log = require('../lib/log')

module.exports = (command, message) => {
  execSync(command, (error) => {
    if (error) {
      log.error(error.message)
      process.exit(1)
    }
  })

  log.info(message)
}
