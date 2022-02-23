import {Command, Flags} from '@oclif/core'

import {APIClient} from '../../api'

export default class Update extends Command {
  static description = 'Update a team note'

  static examples = [
    `$ hackmd-cli team-notes update --teamPath=CLI-test --noteId=WNkLM6gkS0Cg2cQ8rv7bYA --content='# A new title'`
  ]

  static flags = {
    help: Flags.help({char: 'h'}),
    teamPath: Flags.string(),
    noteId: Flags.string(),
    content: Flags.string()
  }

  async run() {
    const {flags} = await this.parse(Update)
    const {teamPath, noteId, content} = flags

    if(!teamPath) {
      this.error('Flag teamPath could not be empty')
    }

    if(!noteId) {
      this.error('Flag noteId could not be empty')
    }
    
    try {
      await APIClient.updateTeamNoteContent(teamPath, noteId, content)
    } catch (e) {
      this.log('Update team note content failed')
      this.error(e)
    }
  }
}

