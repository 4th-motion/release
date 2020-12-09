#!/usr/bin/env node
const log = require('../lib/log')
const exec = require('../lib/exec')

const RELEASE_BRANCH = 'develop'

const createRelease = async () => {
  log.empty('Starting the release process…')

  // fetch, checkout release branch and pull
  exec('git fetch origin --quiet', 'Fetch origin.')
  exec(`git checkout ${RELEASE_BRANCH} --quiet`, `Checkout ${RELEASE_BRANCH} branch.`)
  exec('git pull origin --quiet', 'Pull from origin.')
}

// here we go
createRelease()
