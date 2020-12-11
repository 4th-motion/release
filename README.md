# @4th-motion/release
> Bump a new version and update your changelogs with a single command.

![Version][version-image]
![License][license-image]

Say goodbye to handwritten changelogs - with this tool, a GitHub release is created and all changes since the last version are automatically recorded in the changelog file. You can have a look at how such a generated [changelog file][changelog] looks like.

<br>

![Terminal][screenshot]

<br>

## Installation

Add this package as a devDependency to your project:

```
yarn add --dev @4th-motion/release
```

<br>

## Usage

Once that is done, you can run the command:

```
yarn release
```

You will be asked which version you want to release. If you have entered a valid version, your changelog will be adjusted, a tag will be created and all changes will be pushed. When you use certain keywords for your commits (e.g. `fix:`, `feat:`, …) your commits will be sorted accordingly in the changelog.

_Note: If you want to make sure your team adheres to specific commit rules, we recommend to use [@4th-motion/git-hooks][git-hooks]. There you can define your rules and make sure that only schematically correct commits are pushed._

<br>

## Customize to your needs

This script takes the master branch as default. And the changelog file must be in the root folder of your project. If you want to change these settings, you can do it [here](https://github.com/4th-motion/release/blob/eda97f527d57b02e67da18936f2368a7bd9a7071/bin/release.js#L13-L14).

```javascript
const RELEASE_BRANCH = 'master'
const CHANGELOG_FILEPATH = 'CHANGELOG.md'
```

<br>

## Further documents
- [Changelog](/docs/changelog.md)
- [Contributing](/docs/contributing.md)
- [Pull request](/docs/pull_request.md)
- [Code of conduct](/docs/code_of_conduct.md)

<br>

## License

Copyright © 2020 by 4th motion GmbH. Released under the [MIT License][license].

[screenshot]: https://assets.4thmotion.com/github/release/screenshot.png
[version-image]: https://img.shields.io/github/package-json/v/4th-motion/release
[license-image]: https://img.shields.io/github/license/4th-motion/release
[git-hooks]: https://github.com/4th-motion/git-hooks
[license]: /LICENSE.md
[changelog]: /CHANGELOG.md
