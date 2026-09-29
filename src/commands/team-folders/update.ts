import type {UpdateTeamFolderBody} from '@hackmd/api'

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
  teamPath,
} from '../../flags'
import {buildFolderUpdatePayload} from '../../folder-update'

export default class Update extends HackMDCommand {
  static description = 'Update team folder'
  static examples = [
    [
      '$ hackmd-cli team-folders update --teamPath=CLI-test ',
      '--folderId=a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d ',
      "--name='team-docs' ",
      '--parentFolderId=fc7a3d48-4a07-4cbf-bf4f-e65dd896e01c ',
      "--description='Docs' --icon=1F600 --color=#4F46E5",
    ].join(''),
    '$ hackmd-cli team-folders update --teamPath=CLI-test --folderId=a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d --root --clear=description',
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
    teamPath,
  }

  async run() {
    const {flags} = await this.parse(Update)
    const {clear, color, description, folderId, icon, name, parentFolderId, root, teamPath} = flags

    if (!teamPath) {
      this.error('Flag teamPath could not be empty')
    }

    if (!folderId) {
      this.error('Flag folderId could not be empty')
    }

    let payload: UpdateTeamFolderBody
    try {
      payload = buildFolderUpdatePayload({
        clear, color, description, icon, name, parentFolderId, root,
      })
    } catch (error) {
      this.error(error as Error)
    }

    try {
      const APIClient = await this.getAPIClient()
      await APIClient.updateTeamFolder(teamPath, folderId, payload)
    } catch (error) {
      this.log('Update team folder failed')
      this.error(error as Error)
    }
  }
}
