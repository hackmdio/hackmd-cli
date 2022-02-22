import {Command, run as multiRun} from '@oclif/command'

import {APIClient} from './api'
import readStdin from './read-stdin-stream'

class IndexCommand extends Command {
  static description = 'You can create a note by piping text stream to hackmd-cli'

  static examples = [
    `$ cat README.md | hackmd-cli

Your note is available at https://hackmd.io/note-url`,
  ]

  static args = [{name: 'command'}]

  async run() {
    const pipeString = await readStdin()

    if (pipeString) {
      try {
        // const url = await APIClient.newNote(pipeString)
        // this.log(`Your note is available at ${url}`)
      } catch (err) {
        this.error(err)
      }
    } else {
      await multiRun()
      process.exit(0)
    }
  }
}

export = IndexCommand
