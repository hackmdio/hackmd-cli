import type {NotePermissionRole, UpdateNoteOptions} from '@hackmd/api'

import {Flags} from '@oclif/core'

import HackMDCommand from '../../command'
import {
  noteContent, noteId, notePermission, noteTags, parentFolderId, permalink, teamPath,
} from '../../flags'

export default class Update extends HackMDCommand {
  static description = 'Update team note'
  static examples = [
    "$ hackmd-cli team-notes update --teamPath=CLI-test --noteId=WNkLM6gkS0Cg2cQ8rv7bYA --content='# A new title'",
    "$ hackmd-cli team-notes update --teamPath=CLI-test --noteId=WNkLM6gkS0Cg2cQ8rv7bYA --parentFolderId=fc7a3d48-4a07-4cbf-bf4f-e65dd896e01c --content='# A new title'",
    '$ hackmd-cli team-notes update --teamPath=CLI-test --noteId=WNkLM6gkS0Cg2cQ8rv7bYA --readPermission=owner --writePermission=owner',
    '$ hackmd-cli team-notes update --teamPath=CLI-test --noteId=WNkLM6gkS0Cg2cQ8rv7bYA --tags=tag1,tag2',
  ]
  static flags = {
    content: noteContent,
    help: Flags.help({char: 'h'}),
    noteId,
    parentFolderId,
    permalink,
    readPermission: notePermission,
    tags: noteTags,
    teamPath,
    writePermission: notePermission,
  }

  async run() {
    const {flags} = await this.parse(Update)
    const {content, noteId, parentFolderId, permalink, readPermission, tags, teamPath, writePermission} = flags

    if (!teamPath) {
      this.error('Flag teamPath could not be empty')
    }

    if (!noteId) {
      this.error('Flag noteId could not be empty')
    }

    const payload: UpdateNoteOptions & {tags?: string[]} = {}

    if (content !== undefined) payload.content = content
    if (parentFolderId !== undefined) payload.parentFolderId = parentFolderId
    if (readPermission !== undefined) payload.readPermission = readPermission as NotePermissionRole
    if (writePermission !== undefined) payload.writePermission = writePermission as NotePermissionRole
    if (permalink !== undefined) payload.permalink = permalink
    if (tags !== undefined) payload.tags = tags.split(',').map((t: string) => t.trim()).filter(Boolean)

    try {
      const APIClient = await this.getAPIClient()
      await APIClient.updateTeamNote(teamPath, noteId, payload as UpdateNoteOptions)
    } catch (error) {
      this.log('Update team note failed')
      this.error(error as Error)
    }
  }
}
