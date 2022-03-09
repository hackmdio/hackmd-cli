import {Flags} from '@oclif/core'

import HackMDCommand from '../command'

export default class Login extends HackMDCommand {
  static description = 'Login to HackMD server from CLI'

  static examples = [
    `$ hackmd-cli login

Enter your access token: MY_ACCESS_TOKEN

Login successfully
`
  ]

  static flags = {
    help: Flags.help({char: 'h'})
  }

  async run() {
    try {
      await this.getAPIClient()
      this.log('Login successfully')
    } catch (err) {
      this.log('Login failed')
      this.error(err as Error)
    }
  }
}
