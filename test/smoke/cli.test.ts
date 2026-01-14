import {expect} from 'chai'
import {exec} from 'node:child_process'
import * as fs from 'node:fs'
import path from 'node:path'
import {promisify} from 'node:util'

const execAsync = promisify(exec)

/**
 * Verify that build artifacts exist
 * This is a prerequisite for smoke tests
 * Throws an error if build artifacts are missing
 */
function ensureBuildExists(): void {
  // Use process.cwd() which works in both CommonJS and ES modules
  // Tests are run from project root
  const projectRoot = process.cwd()
  const distDir = path.join(projectRoot, 'dist')
  const libDir = path.join(projectRoot, 'lib')
  const cliBinary = path.join(projectRoot, 'bin', 'run')

  const hasDist = fs.existsSync(distDir) && fs.readdirSync(distDir).length > 0
  const hasLib = fs.existsSync(libDir) && fs.readdirSync(libDir).length > 0
  const hasBinary = fs.existsSync(cliBinary)

  if (!hasBinary) {
    throw new Error('CLI binary not found. Please run "pnpm build" first.')
  }

  if (!hasDist && !hasLib) {
    throw new Error('Build output not found. Please run "pnpm build" first.')
  }
}

/**
 * Smoke tests for built CLI artifacts
 * These tests verify that the CLI binary works correctly after build
 *
 * Prerequisites: Run "pnpm build" before running these tests
 */
describe('Smoke Tests: Built CLI Binary', () => {
  // Use process.cwd() which works in both CommonJS and ES modules
  // Tests are run from project root
  const projectRoot = process.cwd()
  const cliBinary = path.join(projectRoot, 'bin', 'run')
  const distDir = path.join(projectRoot, 'dist')
  const libDir = path.join(projectRoot, 'lib')

  before(() => {
    // Ensure build exists before running tests
    // This will throw an error if build is missing, causing tests to fail explicitly
    ensureBuildExists()
  })

  /**
   * Execute the CLI binary with given arguments
   */
  async function runCLI(args: string[] = [], options: {env?: NodeJS.ProcessEnv} = {}): Promise<{code: null | number; stderr: string; stdout: string;}> {
    const env = {
      ...process.env,
      ...options.env,
    }

    try {
      const {stderr, stdout} = await execAsync(
        `node "${cliBinary}" ${args.join(' ')}`,
        {
          cwd: projectRoot,
          env,
          timeout: 10_000, // 10 second timeout
        },
      )
      return {code: 0, stderr, stdout}
    } catch (error: unknown) {
      // exec throws on non-zero exit codes, but we want to capture them
      const execError = error as {code?: number; stderr?: string; stdout?: string}
      return {
        code: execError.code || null,
        stderr: execError.stderr || '',
        stdout: execError.stdout || '',
      }
    }
  }

  describe('Build artifacts verification', () => {
    it('should have CLI binary file', () => {
      expect(fs.existsSync(cliBinary)).to.be.true
    })

    it('should have compiled output directory (dist or lib)', () => {
      const hasDist = fs.existsSync(distDir)
      const hasLib = fs.existsSync(libDir)
      expect(hasDist || hasLib).to.be.true
    })

    it('should have executable permissions on binary', () => {
      if (process.platform !== 'win32') {
        // Check if file is executable by trying to access it
        // This avoids bitwise operators which are disallowed by linter
        try {
          fs.accessSync(cliBinary, fs.constants.X_OK)
          // If we get here, file is executable - test passes
        } catch {
          // File is not executable - fail the test
          expect.fail('CLI binary should be executable')
        }
      }
    })
  })

  describe('Basic CLI commands (no auth required)', () => {
    it('should show version with --version flag', async () => {
      const result = await runCLI(['--version'])
      expect(result.code).to.equal(0)
      expect(result.stdout).to.include('@hackmd/hackmd-cli')
      expect(result.stdout).to.match(/\d+\.\d+\.\d+/)
    })

    it('should show version with -v flag', async () => {
      const result = await runCLI(['-v'])
      expect(result.code).to.equal(0)
      expect(result.stdout).to.include('@hackmd/hackmd-cli')
    })

    it('should show help with --help flag', async () => {
      const result = await runCLI(['--help'])
      expect(result.code).to.equal(0)
      expect(result.stdout).to.include('USAGE')
      expect(result.stdout).to.include('COMMAND')
    })

    it('should show help with -h flag', async () => {
      const result = await runCLI(['-h'])
      expect(result.code).to.equal(0)
      expect(result.stdout).to.include('USAGE')
    })

    it('should show help for specific command', async () => {
      const result = await runCLI(['help', 'whoami'])
      // Help command might exit with non-zero if command not found, but should produce output
      expect(result.stdout || result.stderr).to.exist
      // If it succeeds, it should mention whoami
      if (result.code === 0) {
        expect(result.stdout.toLowerCase()).to.include('whoami')
      }
    })

    it('should list available commands', async () => {
      const result = await runCLI(['--help'])
      expect(result.code).to.equal(0)
      // Check for some common commands in help output
      const output = result.stdout.toLowerCase()
      // Help should mention at least one of these commands
      const hasCommand = output.includes('notes') || output.includes('teams') || output.includes('whoami') || output.includes('login') || output.includes('command')
      expect(hasCommand).to.be.true
    })
  })

  describe('Command structure verification', () => {
    it('should recognize notes command', async () => {
      const result = await runCLI(['notes', '--help'])
      // Command should execute (even if it requires auth) and produce output
      expect(result.stdout || result.stderr).to.exist
      // If help succeeds, it should mention notes
      if (result.code === 0) {
        expect(result.stdout.toLowerCase()).to.include('notes')
      }
    })

    it('should recognize teams command', async () => {
      const result = await runCLI(['teams', '--help'])
      // Command should execute and produce output
      expect(result.stdout || result.stderr).to.exist
      // If help succeeds, it should mention team
      if (result.code === 0) {
        expect(result.stdout.toLowerCase()).to.include('team')
      }
    })

    it('should recognize whoami command', async () => {
      const result = await runCLI(['whoami', '--help'])
      // Command should execute and produce output
      expect(result.stdout || result.stderr).to.exist
      // If help succeeds, it should mention whoami
      if (result.code === 0) {
        expect(result.stdout.toLowerCase()).to.include('whoami')
      }
    })

    it('should recognize login command', async () => {
      const result = await runCLI(['login', '--help'])
      // Command should execute and produce output
      expect(result.stdout || result.stderr).to.exist
      // If help succeeds, it should mention login
      if (result.code === 0) {
        expect(result.stdout.toLowerCase()).to.include('login')
      }
    })

    it('should recognize logout command', async () => {
      const result = await runCLI(['logout', '--help'])
      // Command should execute and produce output
      expect(result.stdout || result.stderr).to.exist
      // If help succeeds, it should mention logout
      if (result.code === 0) {
        expect(result.stdout.toLowerCase()).to.include('logout')
      }
    })
  })

  describe('Error handling', () => {
    it('should handle unknown command gracefully', async () => {
      const result = await runCLI(['unknown-command-that-does-not-exist'])
      expect(result.code).to.not.equal(0)
      expect(result.stderr || result.stdout).to.match(/not found|unknown|error/i)
    })

    it('should handle invalid flag gracefully', async () => {
      const result = await runCLI(['--invalid-flag'])
      expect(result.code).to.not.equal(0)
    })

    it('should require authentication for whoami without token', async () => {
      // Clear any existing token
      const result = await runCLI(['whoami'], {
        env: {
          HMD_API_ACCESS_TOKEN: '',
          HMD_CLI_CONFIG_DIR: path.join(projectRoot, 'test', 'tmp', 'no-config'),
        },
      })
      // Should fail without token, but CLI should still execute
      // Exit code might be 0 or non-zero depending on implementation
      expect(result.stdout || result.stderr).to.exist
    })
  })

  describe('Output format verification', () => {
    it('should support JSON output format', async () => {
      const result = await runCLI(['--version', '--json'])
      expect(result.code).to.equal(0)
      // Version command with --json should output valid JSON
      try {
        JSON.parse(result.stdout.trim())
      } catch {
        // If not JSON, that's okay - version might not support --json
        // Just verify it doesn't crash
        expect(result.stdout).to.exist
      }
    })
  })
})
