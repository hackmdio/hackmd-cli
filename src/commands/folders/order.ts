import {Flags} from '@oclif/core'

import HackMDCommand from '../../command'
import {folderOrder} from '../../flags'
import {parseFolderOrder} from '../../utils'

export default class Order extends HackMDCommand {
  static description = 'Get or update folder order'
  static examples = [
    '$ hackmd-cli folders order',
    `$ hackmd-cli folders order --order='{"root":["91722050-bf47-4334-9e5d-87125a724c29","fc7a3d48-4a07-4cbf-bf4f-e65dd896e01c"]}'`,
  ]
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
