import type {UpdateNoteOptions} from '@hackmd/api'

import {Flags} from '@oclif/core'

import HackMDCommand from '../../command'
import {
  noteContent, noteId, notePermission, noteTags, noteTitle, parentFolderId, permalink,
} from '../../flags'
import {buildNoteUpdatePayload} from '../../note-update'
import {safeStdinRead} from '../../utils'

export default class Update extends HackMDCommand {
  static description = 'Update note'
  static examples = [
    "$ hackmd-cli notes update --noteId=WNkLM6gkS0Cg2cQ8rv7bYA --title='A new title'",
    "$ hackmd-cli notes update --noteId=WNkLM6gkS0Cg2cQ8rv7bYA --content='# A new title'",
    "$ hackmd-cli notes update --noteId=WNkLM6gkS0Cg2cQ8rv7bYA --parentFolderId=fc7a3d48-4a07-4cbf-bf4f-e65dd896e01c --content='# A new title'",
    '$ hackmd-cli notes update --noteId=WNkLM6gkS0Cg2cQ8rv7bYA --readPermission=owner --writePermission=owner',
    '$ hackmd-cli notes update --noteId=WNkLM6gkS0Cg2cQ8rv7bYA --tags=tag1,tag2',
    '$ cat README.md | hackmd-cli notes update --noteId=WNkLM6gkS0Cg2cQ8rv7bYA',
  ]
  static flags = {
    content: noteContent,
    help: Flags.help({char: 'h'}),
    noteId,
    parentFolderId,
    permalink,
    readPermission: notePermission(),
    tags: noteTags,
    title: noteTitle,
    writePermission: notePermission(),
  }

  async run() {
    const {flags} = await this.parse(Update)
    const {content, noteId, parentFolderId, permalink, readPermission, tags, title, writePermission} = flags

    if (!noteId) {
      this.error('Flag noteId could not be empty')
    }

    const stdinContent = process.stdin.isTTY ? undefined : safeStdinRead()
    let payload: UpdateNoteOptions
    try {
      payload = buildNoteUpdatePayload(
        {
          content, parentFolderId, permalink, readPermission, tags, title, writePermission,
        },
        stdinContent,
      )
    } catch (error) {
      this.error(error as Error)
    }

    try {
      const APIClient = await this.getAPIClient()
      await APIClient.updateNote(noteId, payload)
    } catch (error) {
      this.log('Update note failed')
      this.error(error as Error)
    }
  }
}
