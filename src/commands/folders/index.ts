import {Flags, ux} from '@oclif/core'

import HackMDCommand from '../../command'
import {folderId} from '../../flags'

export default class IndexCommand extends HackMDCommand {
  static description = 'HackMD folders commands'
  static flags = {
    folderId,
    help: Flags.help({char: 'h'}),
    ...ux.table.flags(),
  }

  async run() {
    const {flags} = await this.parse(IndexCommand)

    try {
      const APIClient = await this.getAPIClient()
      const folders = flags.folderId ? [await APIClient.getFolder(flags.folderId)] : await APIClient.getFolderList()

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
      this.log('Fetch folders failed')
      this.error(error as Error)
    }
  }
}
