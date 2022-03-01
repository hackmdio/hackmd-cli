import {CliUx, Command, Flags} from '@oclif/core'

import {APIClient} from '../api'

export default class Teams extends Command {
  static description = 'List teams'

  static examples = [
    `$ hackmd-cli teams
ID                                   Name          Path     Owner ID
──────────────────────────────────── ───────────── ──────── ────────────────────────────────────
f76308a6-d77a-41f6-86d0-8ada426a6fb4 CLI test team CLI-test 82f7f3d9-4079-4c78-8a00-14094272ece9 `,
  ]

  static flags = {
    help: Flags.help({char: 'h'}),
    ...CliUx.ux.table.flags(),
  }

  async run() {
    const {flags} = await this.parse(Teams)

    try {
      const notes = await APIClient.getTeams()

      CliUx.ux.table(notes, {
        id: {
          header: 'ID',
        },
        name: {},
        path: {},
        ownerId: {
          header: 'Owner ID'
        }
      }, {
        printLine: this.log.bind(this),
        ...flags
      })
    } catch (e) {
      this.log('Fetch teams failed')
      this.error(e)
    }
  }
}
