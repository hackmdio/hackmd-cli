import API from '@hackmd/api'
import {CliUx, Command, Flags} from '@oclif/core'
import fs from 'fs'

import config from '../config'
import {getConfigFilePath} from '../utils'

export default class Login extends Command {
  static description = 'Login to HackMD server from CLI'

  static examples = [
    `$ hackmd-cli login

Enter your email: MY_ACCESS_TOKEN

Login successfully!
`
  ]

  static flags = {
    help: Flags.help({char: 'h'}),
    accessToken: Flags.string({char: 'u', description: 'Login with accesstoken'}),
  }

  async run() {
    const {flags} = await this.parse(Login)

    const token = flags.accessToken || config.accessToken || await CliUx.ux.prompt('Enter your access token')

    try {
      const APIClient = new API(token, config.hackmdAPIEndpointURL)
      await APIClient.getMe()

      const configFilePath = getConfigFilePath()
      const newConfigFile = require(configFilePath)
      newConfigFile.accessToken = token

      fs.writeFile(configFilePath, JSON.stringify(newConfigFile, null, 2), function (err) {
        if (err) {
          throw err
        }
      })

      return this.log('Login successfully')
    } catch (err) {
      this.log('Login failed, please ensure your credentials are correct')
      this.error(err)
    }
  }
}
