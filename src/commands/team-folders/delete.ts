import {Flags} from '@oclif/core'

import HackMDCommand from '../../command'
import {folderId, teamPath} from '../../flags'

export default class Delete extends HackMDCommand {
  static description = 'Delete a team folder'
  static examples = [
    '$ hackmd-cli team-folders delete --teamPath=CLI-test --folderId=a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
  ]
  static flags = {
    folderId,
    help: Flags.help({char: 'h'}),
    teamPath,
  }

  async run() {
    const {flags} = await this.parse(Delete)
    const {folderId, teamPath} = flags

    if (!teamPath) {
      this.error('Flag teamPath could not be empty')
    }

    if (!folderId) {
      this.error('Flag folderId could not be empty')
    }

    try {
      const APIClient = await this.getAPIClient()
      await APIClient.deleteTeamFolder(teamPath, folderId)
    } catch (error) {
      this.log('Delete team folder failed')
      this.error(error as Error)
    }
  }
}
