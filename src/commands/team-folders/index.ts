import {Flags, ux} from '@oclif/core'

import HackMDCommand from '../../command'
import {folderId, teamPath} from '../../flags'

export default class IndexCommand extends HackMDCommand {
  static description = 'HackMD team folders commands'
  static examples = [
    `$ hackmd-cli team-folders --teamPath engineering
ID                                   Color   Description     Icon  Name       Parent Folder ID
──────────────────────────────────── ─────── ─────────────── ───── ────────── ────────────────────────────────────
91722050-bf47-4334-9e5d-87125a724c29 #4F46E5 Team handbook    1F600 team-docs fc7a3d48-4a07-4cbf-bf4f-e65dd896e01c`,
  ]
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
      this.log('Fetch team folders failed')
      this.error(error as Error)
    }
  }
}
