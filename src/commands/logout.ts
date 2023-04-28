import {Flags} from '@oclif/core'

import HackMDCommand from '../command'
import {setAccessTokenConfig} from '../utils'

export default class Logout extends HackMDCommand {
  static description = 'Login to HackMD server from CLI'

  static examples = [
    `$ hackmd-cli logout

You've logged out successfully
`,
  ]

  static flags = {
    help: Flags.help({char: 'h'}),
  }

  async run() {
    try {
      setAccessTokenConfig('')
      this.log("You've logged out successfully")
    } catch (error) {
      this.error(String(error))
    }
  }
}
