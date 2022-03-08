import {Flags} from '@oclif/core'
import fs from 'fs'

import HackMDCommand from '../command'
import {getConfigFilePath} from '../utils'

export default class Logout extends HackMDCommand {
  static description = 'Login to HackMD server from CLI'

  static examples = [
    `$ hackmd-cli logout

You've logged out successfully
`
  ]

  static flags = {
    help: Flags.help({char: 'h'})
  }

  async run() {
    try {
      const configFilePath = getConfigFilePath()
      const newConfigFile = require(configFilePath)
      newConfigFile.accessToken = ''
      fs.writeFile(configFilePath, JSON.stringify(newConfigFile, null, 2), function (err) {
        if (err) {
          throw err
        }
      })
      this.log("You've logged out successfully")
    } catch (err) {
      this.error(err)
    }
  }
}
