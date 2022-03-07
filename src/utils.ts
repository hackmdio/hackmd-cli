import {homedir} from 'os'
import * as path from 'path'

export function getConfigFilePath() {
  let configDir
  if (process.env.HMD_CLI_CONFIG_DIR) {
    configDir = process.env.HMD_CLI_CONFIG_DIR || ''
  } else {
    configDir = path.join(homedir(), '.hackmd')
  }

  return path.join(configDir, 'config.json')
}
