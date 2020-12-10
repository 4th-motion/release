const fs = require('fs')
const log = require('./log')

// copy the first lines till the first <br>
// as it is an introductory text
const firstLinesIndicator = '<br>'
let firstLinesCount = 0

const getFirstLines = async (CHANGELOG_FILEPATH) => {
  let firstLines = ''

  try {
    const data = fs.readFileSync(CHANGELOG_FILEPATH, 'UTF-8')
    const lines = data.split(/\r?\n/)
    let indicatorFound = false

    lines.forEach((line) => {
      if (!indicatorFound) {
        firstLines += `${line}\n`
        firstLinesCount += 1
      }
      if (line === firstLinesIndicator) indicatorFound = true
    })
  } catch (error) {
    log.error(`Could not read ${CHANGELOG_FILEPATH}.`)
    process.exit(1)
  }

  return firstLines
}

const getRemainingLines = async (CHANGELOG_FILEPATH) => {
  let remainingLines = ''
  let lastLine = ''

  try {
    const data = fs.readFileSync(CHANGELOG_FILEPATH, 'UTF-8')
    const lines = data.split(/\r?\n/)

    lines.forEach((line, index) => {
      if (index >= firstLinesCount && lastLine !== line) {
        remainingLines += `${line}\n`
      }

      // do not copy duplicate lines (duplicate line breaks)
      lastLine = line
    })
  } catch (error) {
    log.error(`Could not read ${CHANGELOG_FILEPATH}.`)
    process.exit(1)
  }

  return remainingLines
}

module.exports = async (CHANGELOG_FILEPATH, version, commits) => {
  const firstLines = await getFirstLines(CHANGELOG_FILEPATH)
  const CHANGELOG_COPY_FILEPATH = '.CHANGELOG.md'

  // create a new changelog file with only the first lines
  try {
    fs.writeFileSync(CHANGELOG_COPY_FILEPATH, firstLines)
  } catch (error) {
    log.error(`Could not create a copy of ${CHANGELOG_FILEPATH}.`)
    process.exit(1)
  }

  // add headline to show the release version
  fs.appendFileSync(CHANGELOG_COPY_FILEPATH, `\n## v${version}`)

  // loop through the latest commits and group different types
  let output = ''
  let currentCommitType

  commits.forEach((commit) => {
    const parts = commit.split(': ')
    const commitType = parts[0]
    const commitText = parts[1]

    // ignore some commit types
    if (commitType === 'release' || commitType === 'bump' || commitType === 'Update' || commitType === 'Create') return

    if (currentCommitType !== commitType && commitText) {
      output += `\n\n**${commitType.toUpperCase()}**\n`
      currentCommitType = commitType
    }

    if (commitText) {
      output += `\n* ${commitText}`
    }
  })

  // add latest commits
  fs.appendFileSync(CHANGELOG_COPY_FILEPATH, `${output} \n\n<br>\n\n`)

  // copy the remaining lines from old file
  const oldChangelog = await getRemainingLines(CHANGELOG_FILEPATH)

  fs.appendFileSync(CHANGELOG_COPY_FILEPATH, `${oldChangelog}`)

  // copy content to original changelog file
  fs.copyFile(CHANGELOG_COPY_FILEPATH, CHANGELOG_FILEPATH, (error) => {
    if (error) log.error(`Could not copy ${CHANGELOG_COPY_FILEPATH}.`)
  })

  // delete copied file
  fs.unlink(CHANGELOG_COPY_FILEPATH, (error) => {
    if (error) log.error(`Could not delete ${CHANGELOG_COPY_FILEPATH}.`)
  })

  log.info('Update changelog.')
}
