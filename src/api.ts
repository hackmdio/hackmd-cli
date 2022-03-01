import API from '@hackmd/api'

import config from './config'

export const APIClient = new API(config.accesstoken as string, config.hackmdAPIEndpointURL)
