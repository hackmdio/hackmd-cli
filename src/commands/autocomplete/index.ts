import {Command, Flags} from '@oclif/core'
import path from 'node:path'

import {
  fishQuote, runOfficialAutocomplete, shellArg, writeFishCompletion,
} from '../../autocomplete'

export default class Autocomplete extends Command {
  static args = {shell: shellArg()}
  static description = 'Display autocomplete installation instructions'
  static examples = [
    '$ <%= config.bin %> autocomplete',
    '$ <%= config.bin %> autocomplete bash',
    '$ <%= config.bin %> autocomplete fish',
    '$ <%= config.bin %> autocomplete zsh',
    '$ <%= config.bin %> autocomplete --refresh-cache',
  ]
  static flags = {
    'refresh-cache': Flags.boolean({char: 'r', description: 'Refresh cache (ignores displaying instructions)'}),
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(Autocomplete)
    if ((args.shell ?? path.basename(this.config.shell)) !== 'fish') {
      await runOfficialAutocomplete(this.config, 'autocomplete', this.argv)
      return
    }

    const filename = await writeFishCompletion(this.config)
    if (!flags['refresh-cache']) {
      this.log([
        'Fish completion setup:',
        '',
        '  mkdir -p "$__fish_config_dir/completions"',
        `  cp ${fishQuote(filename)} "$__fish_config_dir/completions/${this.config.bin}.fish"`,
        `  source "$__fish_config_dir/completions/${this.config.bin}.fish"`,
        '',
        `Run '${this.config.bin} autocomplete fish' again after upgrading to refresh completions.`,
      ].join('\n'))
    }
  }
}
