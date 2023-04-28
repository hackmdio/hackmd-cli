import {Flags} from '@oclif/core'

import HackMDCommand from '../../command'
import {noteId, teamPath} from '../../flags'

export default class Delete extends HackMDCommand {
  static description = 'Delete a team note'

  static examples = [
    '$ hackmd-cli team-notes delete --teamPath=CLI-test --noteId=WNkLM6gkS0Cg2cQ8rv7bYA'
  ]

  static flags = {
    help: Flags.help({char: 'h'}),
    teamPath,
    noteId,
  }

  async run() {
    const {flags} = await this.parse(Delete)
    const {teamPath, noteId} = flags

    if (!teamPath) {
      this.error('Flag teamPath could not be empty')
    }

    if (!noteId) {
      this.error('Flag noteId could not be empty')
    }

    try {
      const APIClient = await this.getAPIClient()
      await APIClient.deleteTeamNote(teamPath, noteId)
    } catch (e) {
      this.log('Delete team note failed')
      this.error(e as Error)
    }
  }
}
