import {CliUx, Flags} from '@oclif/core'

import HackMDCommand from '../../command'
import {noteId} from '../../flags'

export default class IndexCommand extends HackMDCommand {
  static description = 'HackMD notes commands'

  static examples = [
    `$ hackmd-cli notes
ID                     Title                            User Path               Team Path
────────────────────── ──────────────────────────────── ────────────────────── ────────
raUuSTetT5uQbqQfLnz9lA CLI test note                    gvfz2UB5THiKABQJQnLs6Q null     `,
  ]

  static flags = {
    help: Flags.help({char: 'h'}),
    noteId: noteId(),
    ...CliUx.ux.table.flags(),
  }

  async run() {
    const {flags} = await this.parse(IndexCommand)

    try {
      const APIClient = await this.getAPIClient()
      const notes = flags.noteId ? [await APIClient.getNote(flags.noteId)] : await APIClient.getNoteList()

      CliUx.ux.table(notes, {
        id: {
          header: 'ID',
        },
        title: {},
        userPath: {
          header: 'User Path'
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
      this.error(e as Error)
    }
  }
}
