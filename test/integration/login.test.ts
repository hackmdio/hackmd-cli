import API from '@hackmd/api'
import {expect} from 'chai'

import {clearConfigCache, cleanupTestConfigDir, getTestAPIEndpoint, setupTestConfigDir, shouldRunIntegrationTests} from './helpers'

describe('Integration: API Client - Authentication', function () {
  let testConfigDir: string

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
      // Token should be loaded from .env by dotenv in init.js
      throw new Error('HMD_API_ACCESS_TOKEN not set. Please check your .env file.')
    }
  })

  afterEach(function () {
    cleanupTestConfigDir(testConfigDir)
    // Don't delete env vars - they're needed for other tests
  })

  it('should authenticate successfully with valid access token', async function () {
    const endpoint = getTestAPIEndpoint()
    const token = process.env.HMD_API_ACCESS_TOKEN!
    const apiClient = new API(token, endpoint)

    // getMe() will throw if authentication fails
    const user = await apiClient.getMe()
    expect(user).to.have.property('id')
  })

  it('should fail authentication with invalid access token', async function () {
    const endpoint = getTestAPIEndpoint()
    const apiClient = new API('invalid_token', endpoint)

    try {
      await apiClient.getMe()
      expect.fail('Should have thrown an error')
    } catch (error) {
      expect(error).to.exist
    }
  })
})
