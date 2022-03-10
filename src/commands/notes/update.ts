import {Flags} from '@oclif/core'

import HackMDCommand from '../../command'
import {noteContent, noteId} from '../../flags'

export default class Update extends HackMDCommand {
  static description = 'Update note content'

  static examples = [
    "$ hackmd-cli notes update --noteId=WNkLM6gkS0Cg2cQ8rv7bYA --content='# A new title'"
  ]

  static flags = {
    help: Flags.help({char: 'h'}),
    noteId: noteId(),
    content: noteContent()
  }

  async run() {
    const {flags} = await this.parse(Update)
    const {noteId, content} = flags

    if (!noteId) {
      this.error('Flag noteId could not be empty')
    }

    try {
      const APIClient = await this.getAPIClient()
      await APIClient.updateNoteContent(noteId, content)
    } catch (e) {
      this.log('Update note content failed')
      this.error(e as Error)
    }
  }
}
