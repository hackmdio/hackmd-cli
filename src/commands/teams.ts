import {Command, flags} from '@oclif/command'
import cli from 'cli-ux'

import {APIClient} from '../api'

export default class Teams extends Command {
  static description = 'HackMD Teams Command'

  static examples = [
    `$ hackmd-cli teams

Path            Name
team1           Team 1
my-awesome-team My Awesome Team`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    ...cli.table.flags()
  }

  async run() {
    if (!APIClient.enterprise) {
      return this.log('Teams command only works on HackMD EE instance')
    }

    try {
      const teams = await APIClient.getTeams()

      cli.table(teams, {
        path: {
          header: 'Path',
        },
        name: {}
      }, {
        printLine: this.log,
        ...flags
      })
    } catch (err) {
      this.log('Fetch teams failed')
      this.error(err)
    }
  }
}
