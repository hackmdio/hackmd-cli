import {Flags} from '@oclif/core'

import HackMDCommand from '../../command'
import {noteId} from '../../flags'

export default class Delete extends HackMDCommand {
  static description = 'Delete a note'

  static examples = [
    '$ hackmd-cli notes delete --noteId=WNkLM6gkS0Cg2cQ8rv7bYA'
  ]

  static flags = {
    help: Flags.help({char: 'h'}),
    noteId,
  }

  async run() {
    const {flags} = await this.parse(Delete)
    const {noteId} = flags

    if (!noteId) {
      this.error('Flag noteId could not be empty')
    }

    try {
      const APIClient = await this.getAPIClient()
      await APIClient.deleteNote(noteId)
    } catch (e) {
      this.log('Delete note failed')
      this.error(e as Error)
    }
  }
}
