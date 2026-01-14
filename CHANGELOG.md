# Changelog

All notable changes to HackMD-CLI will be documented in this file.

## 2.4.0

### Added

- Smoke tests for built CLI binary verification
- Integration tests for login, notes, and whoami commands
- GitHub Actions workflow for automated unit and smoke test execution
- GitHub Actions workflow for automated package publishing to npm
- pnpm as the package manager

### Changed

- Migrated from Yarn to pnpm for dependency management
- Upgraded Node.js requirement from >=12.0.0 to >=24.0.0
- Modernized ESLint configuration (migrated from `.eslintrc` to `eslint.config.mjs`)
- Upgraded ESLint dependencies and fixed linting issues
- Updated test infrastructure and configuration
- Improved CI/CD workflows

### Fixed

- Various linting issues across the codebase
- Build process to run before smoke tests
- Config test workflow configuration

## 2.3.2

### Changed

- Replaced oclif-completion with custom fork for autocomplete functionality

## 2.3.1

### Added

- Added autocomplete plugin support

## 2.3.0

### Changed

- Updated README documentation
- Added `/lib` to package files

## 2.2.0

### Added

- Support `--editor` option for team note creation

### Changed

- Migrated from npm to Yarn as package manager
- Upgraded oclif dependencies
- Upgraded various dependencies

### Fixed

- Removed dev-cli references
- Fixed lint errors and typing issues
- Added test helper improvements

## 2.1.0

### Added

- Support `$EDITOR` environment variable for creating notes with content

### Changed

- Upgraded Node.js requirement from >=10.0.0 to >=12.0.0
- Upgraded oclif to version 18
- Updated CI workflow to use Node.js 18

### Fixed

- Fixed config file creation to ensure it's present with proper initialization
- Fixed tslint issues

## 2.0.2

### Fixed

- Fixed stdin unavailable read when accessing stdin.fd

## 2.0.1

### Added

- Added `export` command to export note content

### Changed

- Upgraded Node.js requirement to >=17.0.0
- Replaced lodash with lodash.defaults package for smaller bundle size

### Fixed

- Fixed stdin stream not being consumed and being paused
- Removed teamPath from notes create command documentation

### Removed

- Removed unused inquirer dependency

## 2.0.0

### Added

- Rewrite old and add new commands supported by [v2 @hackmd/api](https://www.npmjs.com/package/@hackmd/api)
- Github Action CI for config testing

### Changed

- Migrate [oclif](https://www.npmjs.com/package/oclif) to v2.5.0
- Change to use hackmd api end point URL and and access token for authentication

### Removed

- Remove commands based on deprecated v1 @hackmd/api, including `import`, `export`
- CodiMD has not been supported
