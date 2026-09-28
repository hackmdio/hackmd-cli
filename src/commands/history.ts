import {Flags, ux} from '@oclif/core'

import HackMDCommand from '../command'

export default class History extends HackMDCommand {
  static description = 'List user browse history'
  static examples = [
    `$ hackmd-cli history
ID                     Title                            User Path               Team Path
────────────────────── ──────────────────────────────── ────────────────────── ────────
raUuSTetT5uQbqQfLnz9lA CLI test note                    gvfz2UB5THiKABQJQnLs6Q null
BnC6gN0_TfStV2KKmPPXeg Welcome to your team's workspace null                   CLI-test`,
    '$ hackmd-cli history --limit=10',
  ]
  static flags = {
    help: Flags.help({char: 'h'}),
    limit: Flags.integer({description: 'maximum number of history items to return'}),
    ...ux.table.flags(),
  }

  async run() {
    const {flags} = await this.parse(History)

    if (flags.limit !== undefined && flags.limit < 1) {
      this.error('Flag limit must be a positive integer')
    }

    try {
      const APIClient = await this.getAPIClient()
      const history = await APIClient.getHistory(flags.limit === undefined ? undefined : {limit: flags.limit})

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
