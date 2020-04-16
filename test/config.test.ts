import {expect} from '@oclif/test'
import * as fs from 'fs-extra'
import * as path from 'path'

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

  it('should throw no config error if config.json not found and no serverUrl set in env', function () {
    expect(requireConfig)
      .to.throw(new RegExp(`Configuration file at ${this.configFilePath} not readable`))
  })

  it('should throw read error if config.json is not valid JSON', function () {
    fs.writeFileSync(this.configFilePath, '.', 'utf8')

    expect(requireConfig)
      .to.throw(/Could not read JSON config file at/)
  })

  it.skip('should throw error if no serverUrl is set', function () {
    fs.writeFileSync(this.configFilePath, '{}', 'utf8')

    expect(requireConfig)
      .to.throw(/Please specify CodiMD server URL either/)
  })

  it('should set enterprise to true if HMD_CLI_COOKIE_PATH is supplied', function () {
    process.env.HMD_CLI_COOKIE_PATH = tempDir()
    fs.writeFileSync(this.configFilePath, '{}', 'utf8')

    const config = requireConfig()

    expect(config.cookiePath).to.eq(process.env.HMD_CLI_COOKIE_PATH)
    expect(config.enterprise).to.eq(true)
  })

  it('should set enterprise to true if HMD_CLI_SERVER_URL is supplied', function () {
    process.env.HMD_CLI_SERVER_URL = tempDir()
    fs.writeFileSync(this.configFilePath, '{}', 'utf8')

    const config = requireConfig()

    expect(config.serverUrl).to.eq(process.env.HMD_CLI_SERVER_URL)
    expect(config.enterprise).to.eq(true)
  })

  it('should set enterprise to false if either CMD_CLI_COOKIE_PATH or CMD_CLI_SERVER_URL are supplied', function () {
    fs.writeFileSync(this.configFilePath, '{}', 'utf8')

    process.env.CMD_CLI_SERVER_URL = tempDir()
    let config = requireConfig()

    expect(config.serverUrl).to.eq(process.env.CMD_CLI_SERVER_URL)
    expect(config.enterprise).to.eq(false)

    cleanup()

    process.env.CMD_CLI_COOKIE_PATH = tempDir()
    config = requireConfig()

    expect(config.cookiePath).to.eq(process.env.CMD_CLI_COOKIE_PATH)
    expect(config.enterprise).to.eq(false)
  })

  it('should set enterprise with HMD_CLI_ENTERPRISE', function () {
    fs.writeFileSync(this.configFilePath, '{}', 'utf8')

    process.env.HMD_CLI_ENTERPRISE = 'false'
    expect(requireConfig().enterprise).to.eq(false)

    cleanup()

    process.env.HMD_CLI_ENTERPRISE = 'true'
    expect(requireConfig().enterprise).to.eq(true)
  })
})
