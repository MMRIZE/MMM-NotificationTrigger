# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [1.1.0](https://github.com/MMRIZE/MMM-NotificationTrigger/compare/v1.0.1...v1.1.0) (2026-01-03)

### Added

* add automated tests workflow for linting ([c1d79a2](https://github.com/MMRIZE/MMM-NotificationTrigger/commit/c1d79a2ec3e13114b387d740567bddb5f5a0addf))
* add demo configuration ([e44346c](https://github.com/MMRIZE/MMM-NotificationTrigger/commit/e44346c6ef57b405ed241de9341ceb54a12daba7))
* add Dependabot configuration for GitHub Actions and npm updates ([c657ce0](https://github.com/MMRIZE/MMM-NotificationTrigger/commit/c657ce082ec39ba7f6078d2bf61a2ab02dd2f4c5))


### Fixed

* correct error handling in exec callback ([35030c8](https://github.com/MMRIZE/MMM-NotificationTrigger/commit/35030c8ab6e7520a35f4471157fed8c8b2cf189a))
* correct spelling of 'INCOMING_NOTIFICATION' in code and documentation ([a57e3a8](https://github.com/MMRIZE/MMM-NotificationTrigger/commit/a57e3a8e22b5ed8f856e0f9d70496a79293758fd))
* resolve variable shadowing in setTimeout callback ([7ba99ba](https://github.com/MMRIZE/MMM-NotificationTrigger/commit/7ba99ba15729d234d1638535e7e58a8f562d62fc))


### Documentation

* add Code of Conduct ([cc78c4a](https://github.com/MMRIZE/MMM-NotificationTrigger/commit/cc78c4a5f6ea6eef3fe983f9563e26442ec2afbd))


### Chores

* add release script and commit-and-tag-version dependency ([11eba89](https://github.com/MMRIZE/MMM-NotificationTrigger/commit/11eba897ecae2e0d22389f6b30b0b0ad707005af))
* update dependencies ([ecfd84a](https://github.com/MMRIZE/MMM-NotificationTrigger/commit/ecfd84a87a10ccd55cc660c27a796b3937de4f36))
* update ESLint configuration and add stylistic plugin ([df5ba3d](https://github.com/MMRIZE/MMM-NotificationTrigger/commit/df5ba3d816bbd204e420acce4ac52e338cd14bbd))


### Code Refactoring

* handle linter issues ([b60a57e](https://github.com/MMRIZE/MMM-NotificationTrigger/commit/b60a57eec30bfc41b82958b1a10e29a4dbc8c208))

## [1.0.1](https://github.com/MMRIZE/MMM-NotificationTrigger/compare/v1.0.0...v1.0.1) (2025-07-22)

### Documentation

* add symbolization image and introduction
* add update instructions to README.md
* improve formatting and structure in README.md
* switch LICENSE file to markdown
* update installation instructions in README.md

### Chores

* add .gitignore and package.json files
* add 'body-parser' as a dependency in package.json
* add linter scripts and ESLint dependencies

### Code Refactoring

* handle linter issues
* replace console.log with Log for consistent logging

## 1.0.0 (2020-04-03)

Initial release with webhook support and exec functionality.

### Added

* Webhook GET method bug ([9a49be6](https://github.com/MMRIZE/MMM-NotificationTrigger/commit/9a49be6d587f9e883a0e3eb8d156ed5e35713732))
* Execute external shell commands via `exec` parameter
* Function support for dynamic `exec` commands
* Notification filtering with `triggerSenderFilter` and `triggerPayloadFilter`
* Multi-fire support with configurable delays

## 2018-10-02

### Added

- `exec` feature: Execute external shell commands or scripts via notification ([00ab727](https://github.com/MMRIZE/MMM-NotificationTrigger/commit/00ab727266f2acf55dafb5bd9b23a477710ab5b1))

## 2018-07-09

Intial commit and module creation.
