import {operationRegistry} from '@hackmd/api/raw'
import {Flags} from '@oclif/core'

import HackMDCommand from '../../command'

export default class OperationsCommand extends HackMDCommand {
  static description = 'List operations supported by the installed @hackmd/api API client (offline)'
  static flags = {help: Flags.help({char: 'h'})}

  async run() {
    await this.parse(OperationsCommand)
    this.log('Operations supported by the installed API client (not necessarily by the connected server):')
    for (const [id, operation] of Object.entries(operationRegistry)) {
      this.log(`${id}\t${operation.method} ${operation.path}`)
    }
  }
}
