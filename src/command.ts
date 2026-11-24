import {API} from '@hackmd/api'
import {Command} from '@oclif/core'

import config from './config'
import {setAccessTokenConfig} from './utils'

export default abstract class HackMDCommand extends Command {
  protected async catch(error: Error) {
    if (error.name === 'ExitPromptError') this.exit(130)
    return super.catch(error)
  }

  protected async getAccessToken() {
    if (config.accessToken) return config.accessToken
    if (!process.stdin.isTTY) {
      this.error('No access token configured. Set HMD_API_ACCESS_TOKEN or run hackmd-cli login in a terminal.')
    }

    const {default: password} = await import('@inquirer/password')
    return password({mask: false, message: 'Enter your access token', toggleMask: false})
  }

  async getAPIClient() {
    const token = await this.getAccessToken()
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
