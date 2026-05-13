import {Flags, ux} from '@oclif/core'

import HackMDCommand from '../../command'
import {folderId, teamPath} from '../../flags'

export default class IndexCommand extends HackMDCommand {
  static description = 'HackMD team folders commands'
  static flags = {
    folderId,
    help: Flags.help({char: 'h'}),
    teamPath,
    ...ux.table.flags(),
  }

  async run() {
    const {flags} = await this.parse(IndexCommand)

    if (!flags.teamPath) {
      this.error('Flag teamPath could not be empty')
    }

    try {
      const APIClient = await this.getAPIClient()
      const folders = flags.folderId ? [await APIClient.getTeamFolder(flags.teamPath, flags.folderId)] : await APIClient.getTeamFolderList(flags.teamPath)

      ux.table(folders, {
        color: {},
        description: {},
        icon: {},
        id: {
          header: 'ID',
        },
        name: {},
        parentFolderId: {
          header: 'Parent Folder ID',
        },
      }, {
        printLine: this.log.bind(this),
        ...flags,
      })
    } catch (error) {
      this.log('Fetch team folders failed')
      this.error(error as Error)
    }
  }
}
