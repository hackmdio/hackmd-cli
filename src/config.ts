import * as fs from 'fs-extra'
import defaults from 'lodash/defaults'
import {homedir} from 'os'
import * as path from 'path'

let configDir
if (process.env.HMD_CLI_CONFIG_DIR || process.env.CMD_CLI_CONFIG_DIR) {
  configDir = process.env.HMD_CLI_CONFIG_DIR || process.env.CMD_CLI_CONFIG_DIR || ''
} else {
  configDir = path.join(homedir(), '.hackmd')
}

const configFilePath = path.join(configDir, 'config.json')
const defaultCookiePath = path.join(homedir(), '.hackmd', 'cookies.json')

const defaultConfig = {
  cookiePath: defaultCookiePath,
  serverUrl: 'https://hackmd.io',
  enterprise: true,
  ldap: false
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
      : toBooleanConfig(process.env.HMD_CLI_ENTERPRISE),
  loginID: process.env.HMD_CLI_ID || process.env.CMD_CLI_ID,
  loginPassword: process.env.HMD_CLI_PASSWORD || process.env.CMD_CLI_PASSWORD,
  ldap: toBooleanConfig(process.env.HMD_LDAP)
}

// look for a readable config file; we can merge it with the env.
let hasExistingConfigFile = false
try {
  fs.accessSync(configFilePath, fs.constants.R_OK)
  hasExistingConfigFile = true
  // tslint:disable-next-line: no-unused
} catch (err) {
  // noop
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
  // tslint:disable-next-line: no-unused
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
