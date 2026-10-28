import {Flags} from '@oclif/core'

import HackMDCommand from '../../command'
import {noteId} from '../../flags'
import {table, tableFlags} from '../../table'

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
    noteId,
    ...tableFlags(),
  }

  async run() {
    const {flags} = await this.parse(IndexCommand)

    try {
      const APIClient = await this.getAPIClient()
      const notes = flags.noteId ? [await APIClient.getNote(flags.noteId)] : await APIClient.getNoteList()

      table(notes, {
        id: {
          header: 'ID',
        },
        tags: {
          get: row => (row.tags ?? []).join(', '),
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
      this.log('Fetch user notes failed')
      this.error(error as Error)
    }
  }
}
