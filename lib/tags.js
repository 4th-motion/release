const taggedVersions = require('tagged-versions')

exports.latest = async () => {
  return taggedVersions.getLastVersion().then()
}

exports.all = async () => {
  return taggedVersions.getList().then()
}
