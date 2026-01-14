import * as fs from 'fs-extra'
import * as os from 'node:os'
import path from 'node:path'

/**
 * Check if integration tests should run
 * Tests will be skipped if HMD_API_ACCESS_TOKEN is not set
 */
export function shouldRunIntegrationTests(): boolean {
  return Boolean(process.env.HMD_API_ACCESS_TOKEN)
}

/**
 * Get the API endpoint URL for tests
 * Defaults to http://localhost:3000/v1 if not set
 */
export function getTestAPIEndpoint(): string {
  return process.env.HMD_API_ENDPOINT_URL || 'http://localhost:3000/v1'
}

/**
 * Setup a temporary config directory for tests
 */
export function setupTestConfigDir(): string {
  const configDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hackmd-cli-test-'))
  process.env.HMD_CLI_CONFIG_DIR = configDir
  return configDir
}

/**
 * Cleanup test config directory
 * @param configDir - The config directory to cleanup
 */
export function cleanupTestConfigDir(configDir: string): void {
  if (fs.existsSync(configDir)) {
    fs.removeSync(configDir)
  }

  delete process.env.HMD_CLI_CONFIG_DIR
}

/**
 * Delete config module cache to force reload
 * @returns {void}
 */
export function clearConfigCache(): void {
  delete require.cache[require.resolve('../../src/config')]
}
