import {operationRegistry} from '@hackmd/api/raw'
import {Flags} from '@oclif/core'

import HackMDCommand from '../../command'

export default class OperationsCommand extends HackMDCommand {
  static description = 'List available API operations'
  static flags = {help: Flags.help({char: 'h'})}

  async run() {
    await this.parse(OperationsCommand)
    this.log('Available API operations:')
    for (const [id, operation] of Object.entries(operationRegistry)) {
      this.log(`${id}\t${operation.method} ${operation.path}`)
    }
  }
}
