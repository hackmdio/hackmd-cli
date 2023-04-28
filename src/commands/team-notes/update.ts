import {Flags} from '@oclif/core'

import HackMDCommand from '../../command'
import {noteContent, noteId, teamPath} from '../../flags'

export default class Update extends HackMDCommand {
  static description = 'Update team note content'

  static examples = [
    "$ hackmd-cli team-notes update --teamPath=CLI-test --noteId=WNkLM6gkS0Cg2cQ8rv7bYA --content='# A new title'",
  ]

  static flags = {
    help: Flags.help({char: 'h'}),
    teamPath,
    noteId,
    content: noteContent,
  }

  async run() {
    const {flags} = await this.parse(Update)
    const {teamPath, noteId, content} = flags

    if (!teamPath) {
      this.error('Flag teamPath could not be empty')
    }

    if (!noteId) {
      this.error('Flag noteId could not be empty')
    }

    try {
      const APIClient = await this.getAPIClient()
      await APIClient.updateTeamNoteContent(teamPath, noteId, content)
    } catch (error) {
      this.log('Update team note content failed')
      this.error(error as Error)
    }
  }
}
