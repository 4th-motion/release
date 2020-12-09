/* eslint-disable no-console */
const chalk = require('chalk')

exports.info = (message) => {
  console.log(chalk`{cyanBright.bold [INFO]   } ${message}`)
}

exports.error = (message) => {
  console.error(chalk`{bold.red [ERROR]  } ${message}`)
}

exports.success = (message) => {
  console.log(chalk`{bold.green [SUCCESS]} ${message}`)
}

exports.empty = (message) => {
  console.log(chalk`          ${message}`)
}
