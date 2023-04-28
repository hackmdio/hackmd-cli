import API from '@hackmd/api'
import {Command, ux} from '@oclif/core'

import config from './config'
import {setAccessTokenConfig} from './utils'

export default abstract class HackMDCommand extends Command {
  async getAPIClient() {
    const token = config.accessToken || await ux.prompt('Enter your access token', {
      type: 'hide'
    })
    const APIClient = new API(token, config.hackmdAPIEndpointURL)

    try {
      await APIClient.getMe()
      if (!config.accessToken) {
        setAccessTokenConfig(token)
      }

      return APIClient
    } catch {
      throw new Error('Please ensure your credentials are correct')
    }
  }
}
