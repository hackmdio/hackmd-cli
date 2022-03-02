import { CommentPermissionType, CreateNoteOptions, NotePermissionRole } from '@hackmd/api/dist/type'
import {CliUx, Command, Flags} from '@oclif/core'

import {APIClient} from '../../api'

export default class Create extends Command {
  static description = 'Create a note'

  static examples = [
    `notes create --content='# A new note' --readPermission=owner --writePermission=owner --commentPermission=disabled
ID                     Title                            User Path               Team Path
────────────────────── ──────────────────────────────── ──────────────────────  ────────
raUuSTetT5uQbqQfLnz9lA A new note                       gvfz2UB5THiKABQJQnLs6Q  null     `
  ]

  static flags = {
    help: Flags.help({char: 'h'}),
    title: Flags.string(),
    content: Flags.string(),
    readPermission: Flags.string(),
    writePermission: Flags.string(),
    commentPermission: Flags.string(),
    ...CliUx.ux.table.flags(),
  }

  async run() {
    const {flags} = await this.parse(Create)
    const options: CreateNoteOptions = {
      title: flags.title,
      content: flags.content,
      readPermission: flags.readPermission as NotePermissionRole,
      writePermission: flags.writePermission as NotePermissionRole,
      commentPermission: flags.commentPermission as CommentPermissionType
    }

    try {
      const note = await APIClient.createNote(options)

      CliUx.ux.table([note], {
        id: {
          header: 'ID',
        },
        title: {},
        userPath: {
          header: 'User path'
        },
        teamPath: {
          header: 'Team path'
        }
      }, {
        printLine: this.log.bind(this),
        ...flags
      })
    } catch (e) {
      this.log('Create note failed')
      this.error(e)
    }
  }
}
