const readline = require('readline')
const semver = require('semver')
const chalk = require('chalk')

exports.version = async (message, fallback, callback) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const question = (message) => {
    rl.question(`          ${message}\n`, (newVersion) => {
      const isValidVersion = semver.valid(newVersion)

      if (isValidVersion) {
        callback(newVersion)
        rl.close()
      } else {
        question(chalk`\n{bold.red [ERROR]  } ${fallback}`)
      }
    })
  }

  // ask the question
  question(message)
}

exports.commit = async (message, callback) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const question = (message) => {
    rl.question(`          ${message}\n`, (answer) => {
      callback(answer)
      rl.close()
    })
  }

  question(message)
}
