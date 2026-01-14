import {Flags, ux} from '@oclif/core'

import HackMDCommand from '../command'

export default class History extends HackMDCommand {
  static description = 'List user browse history'
  static examples = [
    `$ hackmd-cli history
ID                     Title                            User Path               Team Path
────────────────────── ──────────────────────────────── ────────────────────── ────────
raUuSTetT5uQbqQfLnz9lA CLI test note                    gvfz2UB5THiKABQJQnLs6Q null
BnC6gN0_TfStV2KKmPPXeg Welcome to your team's workspace null                   CLI-test `,
  ]
  static flags = {
    help: Flags.help({char: 'h'}),
    ...ux.table.flags(),
  }

  async run() {
    const {flags} = await this.parse(History)

    try {
      const APIClient = await this.getAPIClient()
      const history = await APIClient.getHistory()

      ux.table(history, {
        id: {
          header: 'ID',
        },
        teamPath: {
          header: 'Team Path',
        },
        title: {},
        userPath: {
          header: 'User Path',
        },
      }, {
        printLine: this.log.bind(this),
        ...flags,
      })
    } catch (error) {
      this.log('Fetch history failed')
      this.error(error as Error)
    }
  }
}
