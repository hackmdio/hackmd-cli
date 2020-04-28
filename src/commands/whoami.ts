import {Command, flags} from '@oclif/command'

import {APIClient} from '../api'

export default class Whoami extends Command {
  static description = 'Show logged in account info'

  static examples = [
    `$ hackmd-cli whoami

You are logged in hackmd.io as {YOUR NAME} [user-id]
`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    this.parse(Whoami)

    try {
      const data = await APIClient.getMe()
      if (data.status === 'ok') {
        this.log(`You are logged in ${APIClient.domain} as ${data.name} [${data.id}]`)
      } else {
        this.log('You are not logged in yet.')
      }
    } catch (err) {
      this.log('Sorry, something went wrong!')

      this.error(err)
    }
  }
}
