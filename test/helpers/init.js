const path = require('path')
const dotenv = require('dotenv')

// Load .env file from project root if it exists
// Use process.cwd() to ensure we're loading from the project root, not test directory
// Set override: true to ensure project .env takes precedence over any existing env vars
const envPath = path.resolve(process.cwd(), '.env')
const fs = require('fs')

// Only clear and reload if .env file exists
if (fs.existsSync(envPath)) {
  // Store original values as fallback
  const originalToken = process.env.HMD_API_ACCESS_TOKEN
  const originalEndpoint = process.env.HMD_API_ENDPOINT_URL
  
  // Clear existing env vars to ensure .env file values are used
  if (process.env.HMD_API_ACCESS_TOKEN && !process.env.FORCE_ENV_OVERRIDE) {
    delete process.env.HMD_API_ACCESS_TOKEN
  }
  if (process.env.HMD_API_ENDPOINT_URL && !process.env.FORCE_ENV_OVERRIDE) {
    delete process.env.HMD_API_ENDPOINT_URL
  }
  
  // Load from .env file
  const result = dotenv.config({path: envPath, override: true})
  
  // If .env file didn't load the token, restore the original (if it existed)
  if (!process.env.HMD_API_ACCESS_TOKEN && originalToken) {
    process.env.HMD_API_ACCESS_TOKEN = originalToken
  }
  if (!process.env.HMD_API_ENDPOINT_URL && originalEndpoint) {
    process.env.HMD_API_ENDPOINT_URL = originalEndpoint
  }
} else {
  // If .env doesn't exist, try default dotenv.config() to load from any location
  dotenv.config({override: true})
}

process.env.TS_NODE_PROJECT = path.resolve('test/tsconfig.json')
process.env.NODE_ENV = 'development'

// Initialize oclif config for @oclif/test
try {
  const {Config} = require('@oclif/config')
  const config = Config.load()
  global.oclif = global.oclif || {}
  global.oclif.config = config
  global.oclif.columns = 80
} catch {
  // If oclif config can't be loaded, set minimal globals
  global.oclif = global.oclif || {}
  global.oclif.columns = 80
}
