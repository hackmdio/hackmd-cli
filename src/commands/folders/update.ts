import type {UpdateUserFolderBody} from '@hackmd/api'

import {Flags} from '@oclif/core'

import HackMDCommand from '../../command'
import {
  clearFields,
  folderColor,
  folderDescription,
  folderIcon,
  folderId,
  folderName,
  parentFolderId,
  root,
} from '../../flags'
import {buildFolderUpdatePayload} from '../../folder-update'

export default class Update extends HackMDCommand {
  static description = 'Update folder'
  static examples = [
    "$ hackmd-cli folders update --folderId=a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d --name='docs' --parentFolderId=fc7a3d48-4a07-4cbf-bf4f-e65dd896e01c --description='Docs' --icon=1F600 --color=#4F46E5",
    '$ hackmd-cli folders update --folderId=a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d --root --clear=description',
  ]
  static flags = {
    clear: clearFields(['description', 'icon', 'color']),
    color: folderColor,
    description: folderDescription,
    folderId,
    help: Flags.help({char: 'h'}),
    icon: folderIcon,
    name: folderName,
    parentFolderId,
    root,
  }

  async run() {
    const {flags} = await this.parse(Update)
    const {clear, color, description, folderId, icon, name, parentFolderId, root} = flags

    if (!folderId) {
      this.error('Flag folderId could not be empty')
    }

    let payload: UpdateUserFolderBody
    try {
      payload = buildFolderUpdatePayload({
        clear, color, description, icon, name, parentFolderId, root,
      })
    } catch (error) {
      this.error(error as Error)
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
