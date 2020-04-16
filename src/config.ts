import * as fs from 'fs-extra'
import defaults from 'lodash/defaults'
import {homedir} from 'os'
import * as path from 'path'

let configDir
if (process.env.HMD_CLI_CONFIG_DIR) {
  configDir = process.env.HMD_CLI_CONFIG_DIR
} else {
  configDir = path.join(homedir(), '.codimd')
}

const configFilePath = path.join(configDir, 'config.json')
const defaultCookiePath = path.join(homedir(), '.codimd', 'cookies.json')

const defaultConfig = {
  cookiePath: defaultCookiePath,
  serverUrl: 'https://hackmd.io',
  enterprise: true
}

function toBooleanConfig(configValue?: string | boolean) {
  if (configValue && typeof configValue === 'string') {
    return (configValue === 'true')
  }
  return configValue
}

const envConfig = {
  cookiePath: process.env.HMD_CLI_COOKIE_PATH || process.env.CMD_CLI_COOKIE_PATH,
  serverUrl: process.env.HMD_CLI_SERVER_URL || process.env.CMD_CLI_SERVER_URL,
  enterprise: (process.env.HMD_CLI_COOKIE_PATH || process.env.HMD_CLI_SERVER_URL)
    ? true
    : (process.env.CMD_CLI_COOKIE_PATH || process.env.CMD_CLI_SERVER_URL)
      ? false
      : toBooleanConfig(process.env.HMD_CLI_ENTERPRISE)
}

// look for a readable config file; we can merge it with the env.
let hasExistingConfigFile = false
try {
  fs.accessSync(configFilePath, fs.constants.R_OK)
  hasExistingConfigFile = true
} catch (err) {
  // if we don't have a serverUrl from the environment, we don't have one at all
  // and have to abort
  if (!envConfig.serverUrl) {
    throw new Error(`

  Configuration file at ${configFilePath} not readable. Encountered exception:

  ${err}

  `)
  }
}

let readConfig = {}
if (hasExistingConfigFile) {
  try {
    readConfig = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'))
  } catch (err) {
    throw new Error(`

Could not read JSON config file at ${configFilePath}. Encountered exception:

${err}

`)
  }
}

// prefer environment config over file config
const config = defaults(envConfig, readConfig, defaultConfig)

// !FIXME This branching never meets because we have defaultConfig
if (!config.serverUrl) {
  throw new Error(`

Please specify CodiMD server URL either in ${configFilePath} or by environment variable CMD_CLI_SERVER_URL.

You can learn how to configure codimd-cli at https://github.com/hackmdio/codimd-cli

`)
}

const cookieDirPath = path.dirname(config.cookiePath)
try {
  fs.mkdirSync(cookieDirPath)
} catch (err) {
  if (err.code !== 'EEXIST') {
    throw new Error(`

Could not create dir for cookie file at ${cookieDirPath}. Encountered exception:

${err}

`)
  }
  // at this point, the directory exists.  if the cookie file does not exist,
  // ensure the dir is writable (because we will create the file); otherwise
  // ensure the file itself is writable.
  let hasExistingCookieFile = false
  try {
    fs.existsSync(config.cookiePath)
    hasExistingConfigFile = true
  } catch (ignored) {}

  if (hasExistingCookieFile) {
    try {
      fs.accessSync(config.cookiePath, fs.constants.W_OK)
    } catch (err) {
      throw new Error(`

Cookie file ${config.cookiePath} is not writable. Encountered exception:

${err}

`)
    }
  } else {
    try {
      fs.accessSync(cookieDirPath, fs.constants.W_OK)
    } catch (err) {
      throw new Error(`

Dir for cookie file at ${cookieDirPath} is not writable. Encountered exception:

${err}

`)
    }
  }
}

export default config
