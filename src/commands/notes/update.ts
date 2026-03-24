import {NotePermissionRole} from '@hackmd/api/dist/type'
import {Flags} from '@oclif/core'

import HackMDCommand from '../../command'
import {
  noteContent, noteId, notePermission, noteTags, permalink,
} from '../../flags'

export default class Update extends HackMDCommand {
  static description = 'Update note'
  static examples = [
    "$ hackmd-cli notes update --noteId=WNkLM6gkS0Cg2cQ8rv7bYA --content='# A new title'",
    '$ hackmd-cli notes update --noteId=WNkLM6gkS0Cg2cQ8rv7bYA --readPermission=owner --writePermission=owner',
    '$ hackmd-cli notes update --noteId=WNkLM6gkS0Cg2cQ8rv7bYA --tags=tag1,tag2',
  ]
  static flags = {
    content: noteContent,
    help: Flags.help({char: 'h'}),
    noteId,
    permalink,
    readPermission: notePermission,
    tags: noteTags,
    writePermission: notePermission,
  }

  async run() {
    const {flags} = await this.parse(Update)
    const {content, noteId, permalink, readPermission, tags, writePermission} = flags

    if (!noteId) {
      this.error('Flag noteId could not be empty')
    }

    const payload: Parameters<Awaited<ReturnType<typeof this.getAPIClient>>['updateNote']>[1] & {tags?: string[]} = {}

    if (content !== undefined) payload.content = content
    if (readPermission !== undefined) payload.readPermission = readPermission as NotePermissionRole
    if (writePermission !== undefined) payload.writePermission = writePermission as NotePermissionRole
    if (permalink !== undefined) payload.permalink = permalink
    if (tags !== undefined) payload.tags = tags.split(',').map((t: string) => t.trim()).filter(Boolean)

    try {
      const APIClient = await this.getAPIClient()
      await APIClient.updateNote(noteId, payload as Parameters<Awaited<ReturnType<typeof this.getAPIClient>>['updateNote']>[1])
    } catch (error) {
      this.log('Update note failed')
      this.error(error as Error)
    }
  }
}
