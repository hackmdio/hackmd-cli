import {CliUx, Flags} from '@oclif/core'

import HackMDCommand from '../command'

export default class Whoami extends HackMDCommand {
  static description = 'Show current user information'

  static examples = [
    `$ hackmd-cli whoami
ID                                   Name           Email User path
──────────────────────────────────── ────────────── ───── ──────────────────────
82f7f3d9-4079-4c78-8a00-14094272ece9 Ming-Hsiu Tsai null  gvfz2UB5THiKABQJQnLs6Q  `,
  ]

  static flags = {
    help: Flags.help({char: 'h'}),
    ...CliUx.ux.table.flags(),
  }

  async run() {
    const {flags} = await this.parse(Whoami)

    try {
      const APIClient = await this.getAPIClient()
      const user = await APIClient.getMe()

      CliUx.ux.table([user], {
        id: {
          header: 'ID',
        },
        name: {},
        email: {},
        userPath: {
          header: 'User Path'
        },
      }, {
        printLine: this.log.bind(this),
        ...flags
      })
    } catch (e) {
      this.log('Fetch user info failed')
      this.error(e as Error)
    }
  }
}
