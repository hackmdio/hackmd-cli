import {Command, Flags, CliUx } from '@oclif/core'
import {APIClient} from '../api'

export default class History extends Command {
  static description = 'List history'

  static examples = [
    `$ hackmd-cli history
ID                     Title                            Userpath               Teampath 
────────────────────── ──────────────────────────────── ────────────────────── ──────── 
raUuSTetT5uQbqQfLnz9lA CLI test note                    gvfz2UB5THiKABQJQnLs6Q null     
BnC6gN0_TfStV2KKmPPXeg Welcome to your team's workspace null                   CLI-test `,
  ]

  static flags = {
    help: Flags.help({char: 'h'}),
    ...CliUx.ux.table.flags(),
  }

  async run() {
    const {flags} = await this.parse(History)
    
    try {
      const history = await APIClient.getHistory()

      CliUx.ux.table(history, {
        id: {
          header: 'ID',
        },
        title: {},
        userPath: {},
        teamPath: {},
      }, {
        printLine: this.log.bind(this),
        ...flags
      })
    } catch (e) {
      this.log('Fetch history failed')
      this.error(e)
    }
  }
}
