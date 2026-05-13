import type {UpdateUserFolderBody} from '@hackmd/api'

import {Flags, ux} from '@oclif/core'

import HackMDCommand from '../../command'
import {
  folderColor,
  folderDescription,
  folderIcon,
  folderId,
  folderName,
  parentFolderId,
} from '../../flags'

export default class Update extends HackMDCommand {
  static description = 'Update folder'
  static flags = {
    color: folderColor,
    description: folderDescription,
    folderId,
    help: Flags.help({char: 'h'}),
    icon: folderIcon,
    name: folderName,
    parentFolderId,
    ...ux.table.flags(),
  }

  async run() {
    const {flags} = await this.parse(Update)
    const {color, description, folderId, icon, name, parentFolderId} = flags

    if (!folderId) {
      this.error('Flag folderId could not be empty')
    }

    const payload: UpdateUserFolderBody = {
      color,
      description,
      icon,
      name,
      parentFolderId,
    }

    try {
      const APIClient = await this.getAPIClient()
      const folder = await APIClient.updateFolder(folderId, payload)

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
      this.log('Update folder failed')
      this.error(error as Error)
    }
  }
}
