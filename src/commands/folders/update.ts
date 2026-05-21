import type {UpdateUserFolderBody} from '@hackmd/api'

import {Flags} from '@oclif/core'

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
  static examples = [
    "$ hackmd-cli folders update --folderId=a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d --name='docs' --parentFolderId=fc7a3d48-4a07-4cbf-bf4f-e65dd896e01c --description='Docs' --icon=1F600 --color=#4F46E5",
  ]
  static flags = {
    color: folderColor,
    description: folderDescription,
    folderId,
    help: Flags.help({char: 'h'}),
    icon: folderIcon,
    name: folderName,
    parentFolderId,
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
      await APIClient.updateFolder(folderId, payload)
    } catch (error) {
      this.log('Update folder failed')
      this.error(error as Error)
    }
  }
}
