import API from '@hackmd/api'

import config from './config'

export const APIClient = new API(config.accessToken as string, config.hackmdAPIEndpointURL)
