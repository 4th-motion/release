const parseGitConfig = require('parse-git-config')

module.exports = async (key = false) => {
  const config = await parseGitConfig()
  const obj = await parseGitConfig.expandKeys(config)

  return key ? obj[key] : obj
}
