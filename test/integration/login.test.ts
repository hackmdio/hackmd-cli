import {API} from '@hackmd/api'
import {expect} from 'chai'

import {
  cleanupTestConfigDir, clearConfigCache, getTestAPIEndpoint, setupTestConfigDir, shouldRunIntegrationTests,
} from './helpers'

describe('Integration: API Client - Authentication', () => {
  let testConfigDir: string

  before(function () {
    // Ensure .env is loaded (it should be loaded by init.js, but double-check)
    if (!process.env.HMD_API_ACCESS_TOKEN) {
      const dotenv = require('dotenv')
      // Try to load .env if not already loaded
      const path = require('node:path')
      const envPath = path.resolve(process.cwd(), '.env')
      dotenv.config({override: true, path: envPath})
    }

    if (!shouldRunIntegrationTests()) {
      this.skip()
    }
  })

  beforeEach(() => {
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

  afterEach(() => {
    cleanupTestConfigDir(testConfigDir)
    // Don't delete env vars - they're needed for other tests
  })

  it('should authenticate successfully with valid access token', async () => {
    const endpoint = getTestAPIEndpoint()
    const token = process.env.HMD_API_ACCESS_TOKEN!
    const apiClient = new API(token, endpoint)

    // getMe() will throw if authentication fails
    const user = await apiClient.getMe()
    expect(user).to.have.property('id')
  })

  it('should fail authentication with invalid access token', async () => {
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
