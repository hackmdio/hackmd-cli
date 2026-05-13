import {Flags} from '@oclif/core'

import HackMDCommand from '../../command'
import {folderOrder} from '../../flags'
import {parseFolderOrder} from '../../utils'

export default class Order extends HackMDCommand {
  static description = 'Get or update folder order'
  static flags = {
    help: Flags.help({char: 'h'}),
    order: folderOrder,
  }

  async run() {
    const {flags} = await this.parse(Order)

    try {
      const APIClient = await this.getAPIClient()

      if (flags.order) {
        await APIClient.updateFolderOrder({
          order: parseFolderOrder(flags.order),
        })
        this.log('Folder order updated')
        return
      }

      const order = await APIClient.getFolderOrder()
      this.log(JSON.stringify(order, null, 2))
    } catch (error) {
      this.log('Update folder order failed')
      this.error(error as Error)
    }
  }
}
