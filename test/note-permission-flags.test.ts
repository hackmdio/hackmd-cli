import {Parser} from '@oclif/core'
import {expect} from 'chai'

import CreateNote from '../src/commands/notes/create'
import UpdateNote from '../src/commands/notes/update'
import CreateTeamNote from '../src/commands/team-notes/create'
import UpdateTeamNote from '../src/commands/team-notes/update'

const commands = [
  ['notes create', CreateNote],
  ['notes update', UpdateNote],
  ['team-notes create', CreateTeamNote],
  ['team-notes update', UpdateTeamNote],
] as const

describe('Note permission flags', () => {
  for (const [name, command] of commands) {
    it(`preserves different read and write permissions for ${name}`, async () => {
      const {flags} = await Parser.parse(
        ['--readPermission=guest', '--writePermission=owner'],
        {
          flags: {
            readPermission: command.flags.readPermission,
            writePermission: command.flags.writePermission,
          },
        },
      )

      expect(flags).to.deep.equal({
        readPermission: 'guest',
        writePermission: 'owner',
      })
    })

    it(`keeps a lone read permission as readPermission for ${name}`, async () => {
      const {flags} = await Parser.parse(
        ['--readPermission=guest'],
        {
          flags: {
            readPermission: command.flags.readPermission,
            writePermission: command.flags.writePermission,
          },
        },
      )

      expect(flags).to.deep.equal({readPermission: 'guest'})
    })
  }
})
