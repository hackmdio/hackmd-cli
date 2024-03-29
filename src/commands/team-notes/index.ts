import {Flags, ux} from '@oclif/core'

import HackMDCommand from '../../command'
import {teamPath} from '../../flags'

export default class IndexCommand extends HackMDCommand {
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
    teamPath,
    ...ux.table.flags(),
  }

  async run() {
    const {flags} = await this.parse(IndexCommand)

    if (!flags.teamPath) {
      this.error('Flag teamPath could not be empty')
    }

    try {
      const APIClient = await this.getAPIClient()
      const notes = await APIClient.getTeamNotes(flags.teamPath)

      ux.table(notes, {
        id: {
          header: 'ID',
        },
        title: {},
        userPath: {
          header: 'User path',
        },
        teamPath: {
          header: 'Team path',
        },
      }, {
        printLine: this.log.bind(this),
        ...flags,
      })
    } catch (error) {
      this.log('Fetch team notes failed')
      this.error(error as Error)
    }
  }
}
