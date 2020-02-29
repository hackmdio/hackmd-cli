import {Command, flags} from '@oclif/command'
import cli from 'cli-ux'

import {APIClient} from '../api'

export default class History extends Command {
  static description = 'List history'

  static examples = [
    `$ codimd-cli history

ID                     Name
A58r8ehYTlySO94oiC_MUA Note1
EeNHDGocSTi70ytMMGQaaQ Note2`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    ...cli.table.flags(),
  }

  async run() {
    const {flags} = this.parse(History)

    try {
      const {history} = await APIClient.getHistory()
      cli.table(history, {
        id: {
          header: 'ID',
        },
        name: {
          get: row => row.text
        }
      }, {
        printLine: this.log,
        ...flags
      })
    } catch (e) {
      this.log('Fetch history failed')
      this.error(e)
    }
  }
}
