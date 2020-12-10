const readline = require('readline')
const semver = require('semver')
const chalk = require('chalk')

module.exports = async (message, callback) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const question = (message) => {
    rl.question(message, (newVersion) => {
      const isValidVersion = semver.valid(newVersion)

      if (isValidVersion) {
        callback(newVersion)
        rl.close()
      } else {
        question(chalk`{bold.red [ERROR]  } Your new version is invalid. Try again.\n`)
      }
    })
  }

  // ask the question
  question(message)
}
