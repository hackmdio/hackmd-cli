import {
  CommentPermissionType,
  CreateNoteOptions,
  NotePermissionRole,
} from '@hackmd/api/dist/type'
import {Flags, ux} from '@oclif/core'
import * as fs from 'node:fs'

import HackMDCommand from '../../command'
import {
  commentPermission,
  editor,
  noteContent,
  notePermission,
  noteTitle,
} from '../../flags'
import openEditor from '../../open-editor'
import {safeStdinRead, temporaryMD} from '../../utils'

export default class CreateCommand extends HackMDCommand {
  static description = 'Create a note'
  static examples = [
    "notes create --content='# A new note' --readPermission=owner --writePermission=owner --commentPermission=disabled",

    `ID                     Title                            User Path               Team Path
────────────────────── ──────────────────────────────── ──────────────────────  ────────
raUuSTetT5uQbqQfLnz9lA A new note                       gvfz2UB5THiKABQJQnLs6Q  null`,

    'Or you can pipe content via Unix pipeline:',
    'cat README.md | hackmd-cli notes create',
  ]
  static flags = {
    commentPermission,
    content: noteContent,
    editor,
    help: Flags.help({char: 'h'}),
    readPermission: notePermission,
    title: noteTitle,
    writePermission: notePermission,
    ...ux.table.flags(),
  }

  async run() {
    const {flags} = await this.parse(CreateCommand)
    const pipeString = safeStdinRead()

    const options: CreateNoteOptions = {
      commentPermission: flags.commentPermission as CommentPermissionType,
      content: pipeString || flags.content,
      readPermission: flags.readPermission as NotePermissionRole,
      title: flags.title,
      writePermission: flags.writePermission as NotePermissionRole,
    }

    if (flags.editor) {
      try {
        const mdFile = temporaryMD()
        await openEditor(mdFile)

        options.content = fs.readFileSync(mdFile).toString()
      } catch (error) {
        this.error(error as Error)
      }
    }

    try {
      const APIClient = await this.getAPIClient()
      const note = await APIClient.createNote(options)

      ux.table(
        [note],
        {
          id: {
            header: 'ID',
          },
          teamPath: {
            header: 'Team path',
          },
          title: {},
          userPath: {
            header: 'User path',
          },
        },
        {
          printLine: this.log.bind(this),
          ...flags,
        },
      )
    } catch (error) {
      this.log('Create note failed')
      this.error(error as Error)
    }
  }
}
