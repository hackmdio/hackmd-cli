import * as fs from 'fs-extra'
import defaults from 'lodash/defaults'
import {homedir} from 'os'
import * as path from 'path'

let configDir
if (process.env.HMD_CLI_CONFIG_DIR) {
  configDir = process.env.HMD_CLI_CONFIG_DIR || ''
} else {
  configDir = path.join(homedir(), '.hackmd')
}

const configFilePath = path.join(configDir, 'config.json')

const defaultConfig = {
  hackmdAPIEndpointURL: 'https://api.hackmd.io/v1'
}

const envConfig = {
  hackmdAPIEndpointURL: process.env.HMD_API_ENDPOINT_URL,
  accesstoken: process.env.HMD_API_ACCESS_TOKEN
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

export default config
