const taggedVersions = require('tagged-versions')

exports.latest = async () => {
  const latestTag = await taggedVersions.getLastVersion()
  const version = latestTag.version

  return version
}

exports.all = async () => {
  return taggedVersions.getList()
}
