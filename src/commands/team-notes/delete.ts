import {Command, Flags} from '@oclif/core'

import {APIClient} from '../../api'

export default class Delete extends Command {
  static description = 'Delete a team note'

  static examples = [
    `$ hackmd-cli team-notes delete --teamPath=CLI-test --noteId=WNkLM6gkS0Cg2cQ8rv7bYA`
  ]

  static flags = {
    help: Flags.help({char: 'h'}),
    teamPath: Flags.string(),
    noteId: Flags.string(),
  }

  async run() {
    const {flags} = await this.parse(Delete)
    const {teamPath, noteId} = flags

    if(!teamPath) {
      this.error('Flag teamPath could not be empty')
    }

    if(!noteId) {
      this.error('Flag noteId could not be empty')
    }
    
    try {
      await APIClient.deleteTeamNote(teamPath, noteId)
    } catch (e) {
      this.log('Delete team note failed')
      this.error(e)
    }
  }
}

