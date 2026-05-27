import {Flags} from '@oclif/core'

import HackMDCommand from '../../command'
import {folderId} from '../../flags'

export default class Delete extends HackMDCommand {
  static description = 'Delete a folder'
  static examples = [
    '$ hackmd-cli folders delete --folderId=a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
  ]
  static flags = {
    folderId,
    help: Flags.help({char: 'h'}),
  }

  async run() {
    const {flags} = await this.parse(Delete)
    const {folderId} = flags

    if (!folderId) {
      this.error('Flag folderId could not be empty')
    }

    try {
      const APIClient = await this.getAPIClient()
      await APIClient.deleteFolder(folderId)
    } catch (error) {
      this.log('Delete folder failed')
      this.error(error as Error)
    }
  }
}
