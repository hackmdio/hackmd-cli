# Changelog

All notable changes to HackMD-CLI will be documented in this file.

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
