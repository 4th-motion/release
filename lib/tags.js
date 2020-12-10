const taggedVersions = require('tagged-versions')

exports.latest = async () => {
  const latestTag = await taggedVersions.getLastVersion()

  return latestTag
}

exports.all = async () => {
  return taggedVersions.getList()
}
