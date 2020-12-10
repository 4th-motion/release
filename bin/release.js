#!/usr/bin/env node
const fs = require('fs')

const log = require('../lib/log')
const exec = require('../lib/exec')
const pkgContent = require('../lib/pkg')
const getTags = require('../lib/tags')
const getCommits = require('../lib/commits')
const gitConfig = require('../lib/gitConfig')
const updateChangelog = require('../lib/changelog')
const question = require('../lib/question')

const RELEASE_BRANCH = 'develop'
const CHANGELOG_FILEPATH = 'CHANGELOG.md'

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

  question('          Type your new version:\n', async (newVersion) => {
    // get all commits since the last tag and format the output
    const commits = await getCommits(latestTag)

    // update changelog
    await updateChangelog(CHANGELOG_FILEPATH, newVersion, commits)

    // bump the version
    pkg.version = newVersion
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, '  '), 'utf-8')
    log.info(`Bump version to v${newVersion}`)

    // commit and push files
    exec(`git commit -am "release: v${newVersion}" --no-verify`)
    exec('git push origin --quiet', `Push changes to ${RELEASE_BRANCH} branch.`)

    // create new tag and push it aswell
    exec(`git tag v${newVersion}`)
    exec('git push --tags --quiet', 'Create new tag.')

    // create the release link
    const config = await gitConfig()
    const releaseUrl = config.remote.origin.url.replace('.git', `/releases/new?tag=v${newVersion}`)

    log.success(`The release v${newVersion} was successfully created.`)
    log.empty(`Describe the release on Github: ${releaseUrl}`)
  })
}

// here we go
createRelease()
