#!/usr/bin/env node
const fs = require('fs')
const args = require('args')

const log = require('../lib/log')
const exec = require('../lib/exec')
const pkgContent = require('../lib/pkg')
const getTags = require('../lib/tags')
const getCommits = require('../lib/commits')
const gitConfig = require('../lib/gitConfig')
const updateChangelog = require('../lib/changelog')
const question = require('../lib/question')

args
  .option('branch', 'Change the release branch (default is master)')
  .option('changelog', 'Path to the changelog file (default is /CHANGELOG.md)')

// overwrite default settings
const flags = args.parse(process.argv)
const RELEASE_BRANCH = flags.branch || 'master'
const CHANGELOG_FILEPATH = flags.changelog || 'CHANGELOG.md'

const createRelease = async () => {
  log.empty('Starting the release process…')

  // fetch, checkout release branch and pull
  exec('git fetch origin --quiet', 'Fetch origin.')
  exec(`git checkout ${RELEASE_BRANCH} --quiet`, `Checkout ${RELEASE_BRANCH} branch.`)
  exec('git pull origin --quiet', 'Pull from origin.')

  // get the current version and latest tag
  const pkg = await pkgContent()
  const version = pkg.version
  const latestTag = await getTags.latest()

  // to which version should be bumped?
  log.info(`Current version: ${version}`)

  question.version('Type your new version:', 'Your new version is invalid. Try again.', async (newVersion) => {
    const commits = await getCommits(latestTag)

    // update changelog
    await updateChangelog(CHANGELOG_FILEPATH, newVersion, commits)

    // bump the version (we already verified that the package.json exists)
    pkg.version = newVersion
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, '  '), 'utf-8')
    log.info(`Bump version to v${newVersion}`)

    // commit and push files
    question.commit('Should the changes be committed directly? (yes/no)', async (answer) => {
      if (answer === 'yes') {
        exec(`git commit -am "release: v${newVersion}" --no-verify`)
        exec('git push origin --quiet', `Push changes to ${RELEASE_BRANCH} branch.`)
        exec(`git tag v${newVersion}`)
        exec('git push --tags --quiet', 'Create new tag.')
      }

      // create the release link
      const config = await gitConfig()
      const releaseUrl = config.remote.origin.url.replace('.git', `/releases/new?tag=v${newVersion}`)

      log.success(`The release v${newVersion} was successfully created.`)
      log.empty(`Describe the release on GitHub: ${releaseUrl}`)
    })
  })
}

// here we go
createRelease()
