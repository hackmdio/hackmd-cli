import {Command, Flags, CliUx} from '@oclif/core'

import {APIClient} from '../../api'

export default class Create extends Command {
  static description = 'Create a team note'

  static examples = [
    `team-notes:create --teamPath=CLI-test --content='# A new note' --readPermission=owner --writePermission=owner --commentPermission=disabled
ID                     Title                            User Path              Team Path 
────────────────────── ──────────────────────────────── ────────────────────── ──────── 
raUuSTetT5uQbqQfLnz9lA A new note                       gvfz2UB5THiKABQJQnLs6Q null     `
	]

  static flags = {
    help: Flags.help({char: 'h'}),
    teamPath: Flags.string(),
    title: Flags.string(),
    content: Flags.string(),
    readPermission: Flags.string(),
    writePermission: Flags.string(),
    commentPermission: Flags.string(),
		...CliUx.ux.table.flags(),
  }

  async run() {
    const {flags} = await this.parse(Create)
    const {teamPath, title, content, readPermission, writePermission, commentPermission} = flags
    const options = {title, content, readPermission, writePermission, commentPermission}

    if(!teamPath) {
      this.error('Flag teamPath could not be empty')
    }
    
    try {
			// TODO: create note options typing
      const note = await APIClient.createTeamNote(teamPath, options as any)

			CliUx.ux.table([note], {
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
      this.log('Create team note failed')
      this.error(e)
    }
  }
}

