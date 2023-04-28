import fs from 'fs-extra'
import {homedir, tmpdir} from 'node:os'
import * as path from 'node:path'

export function getConfigFilePath() {
  const configDir = process.env.HMD_CLI_CONFIG_DIR ? process.env.HMD_CLI_CONFIG_DIR || '' : path.join(homedir(), '.hackmd')

  const configPath = path.join(configDir, 'config.json')

  if (!fs.existsSync(configDir)) {
    fs.ensureFileSync(configPath)
    fs.writeFileSync(configPath, JSON.stringify({}))
  }

  return configPath
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
  try {
    result = fs.readFileSync(process.stdin.fd).toString()
  } catch {}

  return result
}

// generate temporary markdown file in /tmp directory
export function temporaryMD() {
  const tmpDir = tmpdir()
  const filename = `temp_${Math.random().toString(36).slice(2)}.md`
  const filePath = path.join(tmpDir, filename)

  return filePath
}
