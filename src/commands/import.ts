import {Command, flags} from '@oclif/command'
import * as fs from 'fs-extra'
import * as path from 'path'

import {APIClient} from '../api'

export default class Import extends Command {
  static description = 'Create a note from markdown file'

  static examples = [
    `$ hackmd-cli import /path/to/markdown/file.md

Your note is available at https://hackmd.io/note-url
`,
  ]

  static args = [{
    name: 'file'
  }]

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    const {args} = this.parse(Import)

    const content = fs.readFileSync(path.resolve(process.cwd(), args.file), 'utf-8')
    try {
      const url = await APIClient.newNote(content)
      this.log(`Your note is available at ${url}`)
    } catch (err) {
      this.error(err)
    }
  }
}
