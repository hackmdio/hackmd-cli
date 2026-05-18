
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
  static examples = [
    `$ hackmd-cli folders create --name='docs' --parentFolderId=fc7a3d48-4a07-4cbf-bf4f-e65dd896e01c --description='Docs' --icon=1F600 --color=#4F46E5
ID                                   Name Parent Folder ID                     Color   Description Icon
──────────────────────────────────── ──── ──────────────────────────────────── ─────── ─────────── ─────
a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d docs fc7a3d48-4a07-4cbf-bf4f-e65dd896e01c #4F46E5 Docs        1F600`,
  ]
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

      ux.table(
        [folder],
        Object.fromEntries([
          [
            'id',
            {
              header: 'ID',
            },
          ],
          ['name', {}],
          [
            'parentFolderId',
            {
              header: 'Parent Folder ID',
            },
          ],
          ['color', {}],
          ['description', {}],
          ['icon', {}],
        ]),
        {
          printLine: this.log.bind(this),
          ...flags,
        },
      )
    } catch (error) {
      this.log('Create folder failed')
      this.error(error as Error)
    }
  }
}
