import {expect} from 'chai';
import path from 'node:path';

import {tempDir} from './utils';

const SECRET_TOKEN = 'super-secret-token-value';

function loadConfigCommand() {
  // config is read at import time, so reload modules after setting env
  delete require.cache[require.resolve('../src/config')];
  delete require.cache[require.resolve('../src/commands/config')];
  return require('../src/commands/config').default;
}

async function runConfig(
  flags: {path?: boolean},
  env: Record<string, string>,
) {
  const originalEnv = process.env;
  process.env = {...env};

  const lines: string[] = [];
  try {
    const ConfigCommand = loadConfigCommand();
    const command = {
      log: (message = '') => lines.push(message),
      parse: async () => ({flags}),
    };
    await ConfigCommand.prototype.run.call(command);
  } finally {
    process.env = originalEnv;
  }

  return lines.join('\n');
}

describe('Config command', () => {
  it('prints the config file path', async () => {
    const configDir = tempDir();
    const output = await runConfig({}, {HMD_CLI_CONFIG_DIR: configDir});

    expect(output).to.include(path.join(configDir, 'config.json'));
  });

  it('never prints the access token value', async () => {
    const output = await runConfig(
      {},
      {
        HMD_API_ACCESS_TOKEN: SECRET_TOKEN,
        HMD_CLI_CONFIG_DIR: tempDir(),
      },
    );

    expect(output).to.not.include(SECRET_TOKEN);
    expect(output).to.include('accessToken: (set)');
  });

  it('shows (not set) when no access token is configured', async () => {
    const output = await runConfig({}, {HMD_CLI_CONFIG_DIR: tempDir()});

    expect(output).to.include('accessToken: (not set)');
  });

  it('prints only the path with --path', async () => {
    const configDir = tempDir();
    const output = await runConfig(
      {path: true},
      {
        HMD_API_ACCESS_TOKEN: SECRET_TOKEN,
        HMD_CLI_CONFIG_DIR: configDir,
      },
    );

    expect(output).to.equal(path.join(configDir, 'config.json'));
  });
});
