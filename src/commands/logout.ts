import {Command, flags} from '@oclif/command'

import {APIClient} from '../api'

export default class Logout extends Command {
  static description = 'Logout from CLI'

  static examples = [
    `$ codimd-cli logout

You've logged out successfully
`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    this.parse(Logout)

    try {
      await APIClient.logout()
      this.log('You\'ve logged out successfully')
    } catch (err) {
      this.error(err)
    }
  }
}
