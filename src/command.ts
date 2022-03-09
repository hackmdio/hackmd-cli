import API from '@hackmd/api'
import {CliUx, Command} from '@oclif/core'

import config from './config'
import {setAccessTokenConfig} from './utils'

export default abstract class HackMDCommand extends Command {
  async getAPIClient() {
    const token = config.accessToken || await CliUx.ux.prompt('Enter your access token', {
      type: 'hide'
    })
    const APIClient = new API(token, config.hackmdAPIEndpointURL)

    try {
      await APIClient.getMe()
      if (!config.accessToken) {
        setAccessTokenConfig(token)
      }

      return APIClient
    } catch (e) {
      this.log('Please ensure your credentials are correct')
      this.error(e)
    }
  }

}
