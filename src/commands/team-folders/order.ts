import {Flags} from '@oclif/core'

import HackMDCommand from '../../command'
import {folderOrder, teamPath} from '../../flags'
import {parseFolderOrder} from '../../utils'

export default class Order extends HackMDCommand {
  static description = 'Get or update team folder order'
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
