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
const defaultCookiePath = path.join(homedir(), '.codimd/cookies.json')

const defaultConfig = {
  cookiePath: defaultCookiePath
}

const envConfig = {
  cookiePath: process.env.CMD_CLI_COOKIE_PATH,
  serverUrl: process.env.CMD_CLI_SERVER_URL
}

const hasExistingConfig = fs.existsSync(configFilePath)
const readConfig = hasExistingConfig ? JSON.parse(fs.readFileSync(configFilePath, 'utf-8')) : {}

const defaultServerUrl = 'PLEASE FILL THE SERVER URL'
if (!hasExistingConfig) {
  fs.writeFileSync(configFilePath, JSON.stringify({serverUrl: defaultServerUrl}, null, 2), 'utf-8')
}

const config = defaults(readConfig, envConfig, defaultConfig)

if (!config.serverUrl || config.serverUrl === defaultServerUrl) {
  throw new Error(`

Please specify CodiMD server url either in ${configFilePath} or by environment varaible.

You can learn how to config codimd-cli on https://github.com/hackmdio/codimd-cli

`)
}

export default config
