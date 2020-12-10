/* eslint-disable no-console */
const chalk = require('chalk')

exports.info = (message) => {
  if (message) {
    console.log(chalk`{cyanBright.bold [INFO]   } ${message}`)
  }
}

exports.error = (message) => {
  if (message) {
    console.error(chalk`{bold.red [ERROR]  } ${message}`)
  }
}

exports.success = (message) => {
  if (message) {
    console.log(chalk`{bold.green [SUCCESS]} ${message}`)
  }
}

exports.empty = (message) => {
  if (message) {
    console.log(chalk`          ${message}`)
  }
}
