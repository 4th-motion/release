#!/usr/bin/env node
const log = require('../lib/log')
const exec = require('../lib/exec')
const pkgContent = require('../lib/pkg')
const getTags = require('../lib/tags')
const getCommits = require('../lib/commits')
const updateChangelog = require('../lib/changelog')

const RELEASE_BRANCH = 'develop'

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

  // get all commits since the last tag and format the output
  const commits = await getCommits(latestTag)

  // update changelog
  updateChangelog(commits)
}

// here we go
createRelease()
