import {Flags} from '@oclif/core'

import HackMDCommand from '../command'
import {noteId} from '../flags'

export default class Export extends HackMDCommand {
  static description = 'Export note content'

  static examples = [
    `$ hackmd-cli export --noteId=kNFWV5E-Qz-QP7u6XnNvyQ
# A note to be exported
    `,
  ]

  static flags = {
    help: Flags.help({char: 'h'}),
    noteId: noteId()
  }

  async run() {
    const {flags} = await this.parse(Export)
    const {noteId} = flags

    if (!noteId) {
      this.error('Flag noteId could not be empty')
    }

    try {
      const APIClient = await this.getAPIClient()
      const note = await APIClient.getNote(noteId)
      this.log(note.content)
    } catch (e) {
      this.log('Export note content failed')
      this.error(e as Error)
    }
  }
}
