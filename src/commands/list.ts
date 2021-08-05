import {Command, flags} from '@oclif/command'
import cli from 'cli-ux'

import {APIClient} from '../api'

export default class History extends Command {
  static description = 'List owned notes or team notes (HackMD-only feature)'

  static examples = [
    `$ hackmd-cli list

ID                     Name
A58r8ehYTlySO94oiC_MUA Note1
EeNHDGocSTi70ytMMGQaaQ Note2`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    team: flags.string({
      char: 't',
      description: 'team name',
    }),
    ...cli.table.flags(),
  }

  async run() {
    const {flags} = this.parse(History)

    try {
      let notes
      if (flags.team) {
        notes = await APIClient.listTeamNotes(flags.team)
      } else {
        notes = await APIClient.listNotes()
      }

      cli.table(notes, {
        id: {
          header: 'ID',
        },
        name: {
          get: row => (row as any).title
        }
      }, {
        printLine: this.log,
        ...flags
      })
    } catch (e) {
      this.log('Fetch history failed')
      this.error(e as string)
    }
  }
}
