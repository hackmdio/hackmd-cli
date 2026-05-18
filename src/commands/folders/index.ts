import {Flags, ux} from '@oclif/core'

import HackMDCommand from '../../command'
import {folderId} from '../../flags'

export default class IndexCommand extends HackMDCommand {
  static description = 'HackMD folders commands'
  static examples = [
    `$ hackmd-cli folders
ID                                   Color Description           Icon  Name        Parent Folder ID
──────────────────────────────────── ───── ───────────────────── ───── ─────────── ────────────────────────────────────
91722050-bf47-4334-9e5d-87125a724c29 blue  Project documentation 1F600 engineering fc7a3d48-4a07-4cbf-bf4f-e65dd896e01c`,
  ]
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

      ux.table(
        folders,
        Object.fromEntries([
          [
            'id',
            {
              header: 'ID',
            },
          ],
          ['color', {}],
          ['description', {}],
          ['icon', {}],
          ['name', {}],
          [
            'parentFolderId',
            {
              header: 'Parent Folder ID',
            },
          ],
        ]),
        {
          printLine: this.log.bind(this),
          ...flags,
        },
      )
    } catch (error) {
      this.log('Fetch folders failed')
      this.error(error as Error)
    }
  }
}
