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

const readConfig = fs.existsSync(configFilePath) ? JSON.parse(fs.readFileSync(configFilePath, 'utf-8')) : {}

export default defaults(readConfig, envConfig, defaultConfig)
