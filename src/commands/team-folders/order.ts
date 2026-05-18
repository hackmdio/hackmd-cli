import {Flags} from '@oclif/core'

import HackMDCommand from '../../command'
import {folderOrder, teamPath} from '../../flags'
import {parseFolderOrder} from '../../utils'

export default class Order extends HackMDCommand {
  static description = 'Get or update team folder order'
  static examples = [
    '$ hackmd-cli team-folders order --teamPath=CLI-test',
    '$ hackmd-cli team-folders order --teamPath=CLI-test --order=\'{"root":["91722050-bf47-4334-9e5d-87125a724c29","fc7a3d48-4a07-4cbf-bf4f-e65dd896e01c"]}\'',
  ]
  static flags = {
    help: Flags.help({char: 'h'}),
    order: folderOrder,
    teamPath,
  }

  async run() {
    const {flags} = await this.parse(Order)

    if (!flags.teamPath) {
      this.error('Flag teamPath could not be empty')
    }

    try {
      const APIClient = await this.getAPIClient()

      if (flags.order) {
        await APIClient.updateTeamFolderOrder(flags.teamPath, {
          order: parseFolderOrder(flags.order),
        })
        this.log('Team folder order updated')
        return
      }

      const order = await APIClient.getTeamFolderOrder(flags.teamPath)
      this.log(JSON.stringify(order, null, 2))
    } catch (error) {
      this.log('Update team folder order failed')
      this.error(error as Error)
    }
  }
}
