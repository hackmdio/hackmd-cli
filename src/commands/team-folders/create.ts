import type {CreateTeamFolderBody} from '@hackmd/api'

import {Flags, ux} from '@oclif/core'

import HackMDCommand from '../../command'
import {
  folderColor,
  folderDescription,
  folderIcon,
  folderName,
  parentFolderId,
  teamPath,
} from '../../flags'

export default class Create extends HackMDCommand {
  static description = 'Create a team folder'
  static flags = {
    color: folderColor,
    description: folderDescription,
    help: Flags.help({char: 'h'}),
    icon: folderIcon,
    name: folderName,
    parentFolderId,
    teamPath,
    ...ux.table.flags(),
  }

  async run() {
    const {flags} = await this.parse(Create)
    const {color, description, icon, name, parentFolderId, teamPath} = flags

    if (!teamPath) {
      this.error('Flag teamPath could not be empty')
    }

    if (!name) {
      this.error('Flag name could not be empty')
    }

    const payload: CreateTeamFolderBody = {
      color,
      description,
      icon,
      name,
      parentFolderId,
    }

    try {
      const APIClient = await this.getAPIClient()
      const folder = await APIClient.createTeamFolder(teamPath, payload)

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
      this.log('Create team folder failed')
      this.error(error as Error)
    }
  }
}
