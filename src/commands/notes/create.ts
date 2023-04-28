import {
  CommentPermissionType,
  CreateNoteOptions,
  NotePermissionRole,
} from '@hackmd/api/dist/type'
import {CliUx, Flags} from '@oclif/core'
import * as fs from 'fs'

import HackMDCommand from '../../command'
import {
  commentPermission,
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
    help: Flags.help({char: 'h'}),
    title: noteTitle(),
    content: noteContent(),
    readPermission: notePermission(),
    writePermission: notePermission(),
    commentPermission: commentPermission(),
    editor: Flags.boolean({
      char: 'e',
      description: 'create note with $EDITOR',
    }),
    ...CliUx.ux.table.flags(),
  }

  async run() {
    const {flags} = await this.parse(CreateCommand)
    const pipeString = safeStdinRead()

    const options: CreateNoteOptions = {
      title: flags.title,
      content: pipeString || flags.content,
      readPermission: flags.readPermission as NotePermissionRole,
      writePermission: flags.writePermission as NotePermissionRole,
      commentPermission: flags.commentPermission as CommentPermissionType,
    }

    if (flags.editor) {
      try {
        const mdFile = temporaryMD()
        await openEditor(mdFile)

        options.content = fs.readFileSync(mdFile).toString()
      } catch (e) {
        this.error(e as Error)
      }
    }

    try {
      const APIClient = await this.getAPIClient()
      const note = await APIClient.createNote(options)

      CliUx.ux.table(
        [note],
        {
          id: {
            header: 'ID',
          },
          title: {},
          userPath: {
            header: 'User path',
          },
          teamPath: {
            header: 'Team path',
          },
        },
        {
          printLine: this.log.bind(this),
          ...flags,
        }
      )
    } catch (e) {
      this.log('Create note failed')
      this.error(e as Error)
    }
  }
}
