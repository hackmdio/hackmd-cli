import type {UpdateNoteOptions} from '@hackmd/api'

import {Flags} from '@oclif/core'

import HackMDCommand from '../../command'
import {noteContent, noteId, parentFolderId} from '../../flags'

export default class Update extends HackMDCommand {
  static description = 'Update note content'
  static examples = [
    "$ hackmd-cli notes update --noteId=WNkLM6gkS0Cg2cQ8rv7bYA --content='# A new title'",
    "$ hackmd-cli notes update --noteId=WNkLM6gkS0Cg2cQ8rv7bYA --parentFolderId=fc7a3d48-4a07-4cbf-bf4f-e65dd896e01c --content='# A new title'",
  ]
  static flags = {
    content: noteContent,
    help: Flags.help({char: 'h'}),
    noteId,
    parentFolderId,
  }

  async run() {
    const {flags} = await this.parse(Update)
    const {content, noteId, parentFolderId} = flags

    if (!noteId) {
      this.error('Flag noteId could not be empty')
    }

    const payload: UpdateNoteOptions = {
      content,
      parentFolderId,
    }

    try {
      const APIClient = await this.getAPIClient()
      await APIClient.updateNote(noteId, payload)
    } catch (error) {
      this.log('Update note content failed')
      this.error(error as Error)
    }
  }
}
