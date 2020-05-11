import {Command, flags} from '@oclif/command'
import * as fs from 'fs-extra'
import * as path from 'path'

import {APIClient} from '../api'

export default class Import extends Command {
  static description = 'Create a note from markdown file'

  static examples = [
    `$ hackmd-cli import /path/to/markdown/file.md --team=xxx

Your note is available at https://hackmd.io/note-url
`,
  ]

  static args = [{
    name: 'file'
  }]

  static flags = {
    help: flags.help({char: 'h'}),
    team: flags.string({
      char: 't',
      default: '',
      description: 'team to use',
      required: false
    })
  }

  async run() {
    const {args, flags} = this.parse(Import)

    if (!args.file) {
      return this.log('No file path specified.')
    }

    const content = fs.readFileSync(path.resolve(process.cwd(), args.file), 'utf-8')
    try {
      const url = await APIClient.newNote(content, {team: flags.team})
      this.log(`Your note is available at ${url}`)
    } catch (err) {
      this.error(err)
    }
  }
}
