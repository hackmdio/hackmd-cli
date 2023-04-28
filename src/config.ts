import * as fs from 'fs-extra'
import defaults from 'lodash.defaults'

import {getConfigFilePath} from './utils'

const configFilePath = getConfigFilePath()

const defaultConfig = {
  hackmdAPIEndpointURL: 'https://api.hackmd.io/v1',
}

const envConfig = {
  hackmdAPIEndpointURL: process.env.HMD_API_ENDPOINT_URL,
  accessToken: process.env.HMD_API_ACCESS_TOKEN,
}

// look for a readable config file; we can merge it with the env.
let hasExistingConfigFile = false
try {
  fs.accessSync(configFilePath, fs.constants.R_OK)
  hasExistingConfigFile = true
  // tslint:disable-next-line: no-unused
} catch {
  // noop
}

let readConfig = {}
if (hasExistingConfigFile) {
  try {
    readConfig = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'))
  } catch (error) {
    throw new Error(`

Could not read JSON config file at ${configFilePath}. Encountered exception:

${error}

`)
  }
}

// prefer environment config over file config
const config = defaults(envConfig, readConfig, defaultConfig)

export default config
