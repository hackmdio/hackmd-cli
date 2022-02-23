import {Command, Flags, CliUx } from '@oclif/core'
import {APIClient} from '../api'

export default class Notes extends Command {
  static description = 'List user notes'

  static examples = [
    `$ hackmd-cli notes
ID                     Title                            User Path               Team Path 
────────────────────── ──────────────────────────────── ────────────────────── ──────── 
raUuSTetT5uQbqQfLnz9lA CLI test note                    gvfz2UB5THiKABQJQnLs6Q null     `,
  ]

  static flags = {
    help: Flags.help({char: 'h'}),
    ...CliUx.ux.table.flags(),
  }

  async run() {
    const {flags} = await this.parse(Notes)
    
    try {
      const notes = await APIClient.getNoteList()

      CliUx.ux.table(notes, {
        id: {
          header: 'ID',
        },
        title: {},
        userPath: {
          header:'User Path'
        },
        teamPath: {
          header: 'Team Path'
        },
      }, {
        printLine: this.log.bind(this),
        ...flags
      })
    } catch (e) {
      this.log('Fetch user notes failed')
      this.error(e)
    }
  }
}
