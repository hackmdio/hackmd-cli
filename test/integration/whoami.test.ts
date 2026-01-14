import API from '@hackmd/api'
import {expect} from 'chai'

import {clearConfigCache, cleanupTestConfigDir, getTestAPIEndpoint, setupTestConfigDir, shouldRunIntegrationTests} from './helpers'

describe('Integration: API Client - User', function () {
  let testConfigDir: string
  let apiClient: API

  before(function () {
    // Ensure .env is loaded (it should be loaded by init.js, but double-check)
    if (!process.env.HMD_API_ACCESS_TOKEN) {
      // Try to load .env if not already loaded
      const path = require('path')
      const dotenv = require('dotenv')
      const envPath = path.resolve(process.cwd(), '.env')
      dotenv.config({path: envPath, override: true})
    }
    
    if (!shouldRunIntegrationTests()) {
      this.skip()
    }
  })

  beforeEach(function () {
    clearConfigCache()
    testConfigDir = setupTestConfigDir()
    // Ensure env vars are set from .env
    if (!process.env.HMD_API_ENDPOINT_URL) {
      process.env.HMD_API_ENDPOINT_URL = getTestAPIEndpoint()
    }
    if (!process.env.HMD_API_ACCESS_TOKEN) {
      throw new Error('HMD_API_ACCESS_TOKEN not set. Please check your .env file.')
    }
    const endpoint = getTestAPIEndpoint()
    const token = process.env.HMD_API_ACCESS_TOKEN!
    apiClient = new API(token, endpoint)
  })

  afterEach(function () {
    cleanupTestConfigDir(testConfigDir)
    // Don't delete env vars - they're needed for other tests
  })

  it('should fetch current user information', async function () {
    const user = await apiClient.getMe()
    expect(user).to.have.property('id')
    expect(user).to.have.property('name')
    expect(user).to.have.property('userPath')
  })
})
