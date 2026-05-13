import type {UpdateTeamFolderBody} from '@hackmd/api'

import {Flags, ux} from '@oclif/core'

import HackMDCommand from '../../command'
import {
  folderColor,
  folderDescription,
  folderIcon,
  folderId,
  folderName,
  parentFolderId,
  teamPath,
} from '../../flags'

export default class Update extends HackMDCommand {
  static description = 'Update team folder'
  static flags = {
    color: folderColor,
    description: folderDescription,
    folderId,
    help: Flags.help({char: 'h'}),
    icon: folderIcon,
    name: folderName,
    parentFolderId,
    teamPath,
    ...ux.table.flags(),
  }

  async run() {
    const {flags} = await this.parse(Update)
    const {color, description, folderId, icon, name, parentFolderId, teamPath} = flags

    if (!teamPath) {
      this.error('Flag teamPath could not be empty')
    }

    if (!folderId) {
      this.error('Flag folderId could not be empty')
    }

    const payload: UpdateTeamFolderBody = {
      color,
      description,
      icon,
      name,
      parentFolderId,
    }

    try {
      const APIClient = await this.getAPIClient()
      const folder = await APIClient.updateTeamFolder(teamPath, folderId, payload)

      ux.table([folder], {
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
      this.log('Update team folder failed')
      this.error(error as Error)
    }
  }
}
