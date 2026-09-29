import {Args, Flags} from '@oclif/core'

import {getOperation} from '../../api/operations'
import HackMDCommand from '../../command'

export default class DescribeCommand extends HackMDCommand {
  static args = {operationId: Args.string({required: true})}
  static description = 'Show details for an API operation'
  static flags = {help: Flags.help({char: 'h'})}

  async run() {
    const {args} = await this.parse(DescribeCommand)
    this.log(JSON.stringify({operationId: args.operationId, ...getOperation(args.operationId)}, null, 2))
  }
}
