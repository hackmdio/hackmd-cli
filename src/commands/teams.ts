import {Flags, ux} from '@oclif/core'

import HackMDCommand from '../command'

export default class Teams extends HackMDCommand {
  static description = 'List teams'
  static examples = [
    `$ hackmd-cli teams
ID                                   Name          Path     Owner ID
──────────────────────────────────── ───────────── ──────── ────────────────────────────────────
f76308a6-d77a-41f6-86d0-8ada426a6fb4 CLI test team CLI-test 82f7f3d9-4079-4c78-8a00-14094272ece9 `,
  ]
  static flags = {
    help: Flags.help({char: 'h'}),
    ...ux.table.flags(),
  }

  async run() {
    const {flags} = await this.parse(Teams)

    try {
      const APIClient = await this.getAPIClient()
      const notes = await APIClient.getTeams()

      ux.table(notes, {
        id: {
          header: 'ID',
        },
        name: {},
        ownerId: {
          header: 'Owner ID',
        },
        path: {},
      }, {
        printLine: this.log.bind(this),
        ...flags,
      })
    } catch (error) {
      this.log('Fetch teams failed')
      this.error(error as Error)
    }
  }
}
