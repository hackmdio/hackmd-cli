import {NotePermissionRole} from '@hackmd/api/dist/type'
import {Flags} from '@oclif/core'

import HackMDCommand from '../../command'
import {
  noteContent, noteId, notePermission, permalink,
} from '../../flags'

export default class Update extends HackMDCommand {
  static description = 'Update note'
  static examples = [
    "$ hackmd-cli notes update --noteId=WNkLM6gkS0Cg2cQ8rv7bYA --content='# A new title'",
    '$ hackmd-cli notes update --noteId=WNkLM6gkS0Cg2cQ8rv7bYA --readPermission=owner --writePermission=owner',
  ]
  static flags = {
    content: noteContent,
    help: Flags.help({char: 'h'}),
    noteId,
    permalink,
    readPermission: notePermission,
    writePermission: notePermission,
  }

  async run() {
    const {flags} = await this.parse(Update)
    const {content, noteId, permalink, readPermission, writePermission} = flags

    if (!noteId) {
      this.error('Flag noteId could not be empty')
    }

    const payload: Parameters<Awaited<ReturnType<typeof this.getAPIClient>>['updateNote']>[1] = {}

    if (content !== undefined) payload.content = content
    if (readPermission !== undefined) payload.readPermission = readPermission as NotePermissionRole
    if (writePermission !== undefined) payload.writePermission = writePermission as NotePermissionRole
    if (permalink !== undefined) payload.permalink = permalink

    try {
      const APIClient = await this.getAPIClient()
      await APIClient.updateNote(noteId, payload)
    } catch (error) {
      this.log('Update note failed')
      this.error(error as Error)
    }
  }
}
