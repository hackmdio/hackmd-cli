
import type {CreateUserFolderBody} from '@hackmd/api'

import {Flags, ux} from '@oclif/core'

import HackMDCommand from '../../command'
import {
  folderColor,
  folderDescription,
  folderIcon,
  folderName,
  parentFolderId,
} from '../../flags'

export default class Create extends HackMDCommand {
  static description = 'Create a folder'
  static flags = {
    color: folderColor,
    description: folderDescription,
    help: Flags.help({char: 'h'}),
    icon: folderIcon,
    name: folderName,
    parentFolderId,
    ...ux.table.flags(),
  }

  async run() {
    const {flags} = await this.parse(Create)
    const {color, description, icon, name, parentFolderId} = flags

    if (!name) {
      this.error('Flag name could not be empty')
    }

    const payload: CreateUserFolderBody = {
      color,
      description,
      icon,
      name,
      parentFolderId,
    }

    try {
      const APIClient = await this.getAPIClient()
      const folder = await APIClient.createFolder(payload)

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
      this.log('Create folder failed')
      this.error(error as Error)
    }
  }
}
