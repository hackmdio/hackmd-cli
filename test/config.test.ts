/* eslint-disable node/no-missing-require */
/* eslint-disable unicorn/prefer-module */
import {expect} from 'chai'
import * as fs from 'fs-extra'
import * as path from 'node:path'

import {tempDir} from './utils'

const requireConfig = () => require('../src/config').default

const cleanup = () => {
  // delete config module cache
  delete require.cache[require.resolve('../src/config')]

  // reset env
  process.env = {}
}

const setupConfigFile = () => {
  const configDir = tempDir()
  process.env.HMD_CLI_CONFIG_DIR = configDir
  return path.join(configDir, 'config.json')
}

describe('Config test', function () {
  beforeEach(function () {
    cleanup()
    this.configFilePath = setupConfigFile()
  })

  it.skip('should throw no config error if config.json not found and no hackmdAPIEndpointURL set in env', function () {
    expect(requireConfig)
    .to.throw(new RegExp(`Configuration file at ${this.configFilePath} not readable`))
  })

  it('should throw read error if config.json is not valid JSON', function () {
    fs.writeFileSync(this.configFilePath, '.', 'utf8')

    expect(requireConfig)
    .to.throw(/Could not read JSON config file at/)
  })

  it('should set hackmdAPIEndpointURL to defalut value: https://api.hackmd.io/v1 if no value is given', function () {
    fs.writeFileSync(this.configFilePath, '{}', 'utf8')

    const config = requireConfig()
    expect(config.hackmdAPIEndpointURL).to.eq('https://api.hackmd.io/v1')
  })

  it.skip('should throw error if no access token is set', function () {
    fs.writeFileSync(this.configFilePath, '{}', 'utf8')

    expect(requireConfig)
    .to.throw(/Please specify access token either/)
  })
})
