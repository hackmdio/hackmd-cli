import {Flags} from '@oclif/core';

import HackMDCommand from '../command';
import config from '../config';
import {getConfigFilePath} from '../utils';

export default class Config extends HackMDCommand {
  static description
    = 'Show config file path and current configuration (credentials are never printed)';
  static examples = [
    `$ hackmd-cli config
Config file: /Users/you/.hackmd/config.json
hackmdAPIEndpointURL: https://api.hackmd.io/v1
accessToken: (set)`,
    `$ hackmd-cli config --path
/Users/you/.hackmd/config.json`,
  ];
  static flags = {
    help: Flags.help({char: 'h'}),
    path: Flags.boolean({description: 'print only the config file path'}),
  };

  async run() {
    const {flags} = await this.parse(Config);
    const configFilePath = getConfigFilePath();

    if (flags.path) {
      this.log(configFilePath);
      return;
    }

    this.log(`Config file: ${configFilePath}`);
    this.log(`hackmdAPIEndpointURL: ${config.hackmdAPIEndpointURL}`);
    this.log(`accessToken: ${config.accessToken ? '(set)' : '(not set)'}`);
  }
}
