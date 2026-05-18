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
  static examples = [
    `$ hackmd-cli team-folders update --teamPath=CLI-test --folderId=a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d --name='team-docs' --parentFolderId=fc7a3d48-4a07-4cbf-bf4f-e65dd896e01c --description='Docs' --icon=1F600 --color=blue
ID                                   Name      Parent Folder ID                     Color Description Icon
──────────────────────────────────── ───────── ──────────────────────────────────── ───── ─────────── ─────
a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d team-docs fc7a3d48-4a07-4cbf-bf4f-e65dd896e01c blue  Docs        1F600`,
  ]
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
        id: {
          header: 'ID',
        },
        name: {},
        parentFolderId: {
          header: 'Parent Folder ID',
        },
        color: {},
        description: {},
        icon: {},
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
