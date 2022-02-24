import {Command, Flags, CliUx } from '@oclif/core'

import {APIClient} from '../../api'

export default class IndexCommand extends Command {
  static description = 'HackMD team-notes commands'

  static examples = [
    `$ hackmd-cli team-notes --teamPath=CLI-test
ID                     Title                            User path Team path 
────────────────────── ──────────────────────────────── ──────── ──────── 
WNkLM6gkS0Cg2cQ8rv7bYA a team note                      null     CLI-test 
BnC6gN0_TfStV2KKmPPXeg Welcome to your team's workspace null     CLI-test`,
  ]

  static flags = {
    help: Flags.help({char: 'h'}),
    teamPath: Flags.string(),
    ...CliUx.ux.table.flags(),
  }

  async run() {
    const {flags} = await this.parse(IndexCommand)
    
    if(!flags.teamPath) {
      this.error('Flag teamPath could not be empty')
    }

    try {
      const notes = await APIClient.getTeamNotes(flags.teamPath)
      
      CliUx.ux.table(notes, {
        id: {
          header: 'ID',
        },
        title: {},
        userPath: {
          header: 'User path'
        },
        teamPath:{
          header: 'Team path'
        }
      }, {
        printLine: this.log.bind(this),
        ...flags
      })
    } catch (e) {
      this.log('Fetch team notes failed')
      this.error(e)
    }
  }
}

