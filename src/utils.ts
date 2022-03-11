import fs from 'fs'
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

export function setAccessTokenConfig(token: string) {
  const configFilePath = getConfigFilePath()
  const newConfigFile = require(configFilePath)
  newConfigFile.accessToken = token
  fs.writeFile(configFilePath, JSON.stringify(newConfigFile, null, 2), function (err) {
    if (err) {
      throw err
    }
  })
}

export function safeStdinRead() {
  let result
  const STDIN_FD = 0
  try {
    result = fs.readFileSync(STDIN_FD).toString()
  } catch {}
  return result
}
