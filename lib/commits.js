const path = require('path')
const gitStream = require('git-spawned-stream')

const log = require('../lib/log')
const gitConfig = require('../lib/gitConfig')

const getCommits = async (rev) => {
  const config = await gitConfig()
  const commitPath = config.remote.origin.url.replace('.git', '/commit/')
  const repoPath = path.join(process.cwd(), '.git')
  const format = `%s ([%h](${commitPath}%h))`
  let commits = []

  // get all commit since the given rev
  return new Promise((resolve) => {
    const stream = gitStream(repoPath, ['rev-list', `--pretty=format:${format}`, '--header', rev || 'HEAD'])

    stream.on('data', (data) => {
      const parts = data.toString('utf8').split('commit ')

      // clean up the commit message
      parts.forEach((part) => {
        const trimmed = part.trim()
        const commit = trimmed.split('\n')[1]

        if (commit) {
          commits.push(commit)
        }
      })

      // sort it alphabetically
      commits.sort()
    })

    stream.on('error', () => {
      log.error('Unable to get the latest commits.')
      process.exit(1)
    })

    stream.on('end', () => resolve(commits))
  })
}

module.exports = async (latestTag) => {
  const rev = !latestTag ? false : `${latestTag}..HEAD`
  const commits = await getCommits(rev)

  log.info(`Get latest commits up to v${latestTag}`)

  return commits
}
