import {CommentPermissionType, CreateNoteOptions, NotePermissionRole} from '@hackmd/api/dist/type'
import {Flags, ux} from '@oclif/core'
import fs from 'node:fs'

import HackMDCommand from '../../command'
import {commentPermission, editor, noteContent, notePermission, noteTitle, teamPath} from '../../flags'
import openEditor from '../../open-editor'
import {safeStdinRead, temporaryMD} from '../../utils'

export default class Create extends HackMDCommand {
  static description = 'Create a team note'

  static examples = [
    `team-notes:create --teamPath=CLI-test --content='# A new note' --readPermission=owner --writePermission=owner --commentPermission=disabled
ID                     Title                            User Path              Team Path
────────────────────── ──────────────────────────────── ────────────────────── ────────
raUuSTetT5uQbqQfLnz9lA A new note                       gvfz2UB5THiKABQJQnLs6Q null     `,

    'Or you can pipe content via Unix pipeline:',
    'cat README.md | hackmd-cli notes create --teamPath=CLI-test',
  ]

  static flags = {
    help: Flags.help({char: 'h'}),
    teamPath,
    title: noteTitle,
    content: noteContent,
    readPermission: notePermission,
    writePermission: notePermission,
    commentPermission,
    editor,
    ...ux.table.flags(),
  }

  async run() {
    const {flags} = await this.parse(Create)
    const pipeString = safeStdinRead()

    const {teamPath, title, content, readPermission, writePermission, commentPermission} = flags
    const options: CreateNoteOptions = {
      title: title,
      content: pipeString || content,
      readPermission: readPermission as NotePermissionRole,
      writePermission: writePermission as NotePermissionRole,
      commentPermission: commentPermission as CommentPermissionType,
    }

    if (!teamPath) {
      this.error('Flag teamPath could not be empty')
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
      const note = await APIClient.createTeamNote(teamPath, options)

      ux.table([note], {
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
      }, {
        printLine: this.log.bind(this),
        ...flags,
      })
    } catch (error) {
      this.log('Create team note failed')
      this.error(error as Error)
    }
  }
}
