import {Command} from '@oclif/core'
import path from 'node:path'

import {
  fishQuote, runOfficialAutocomplete, shellArg, writeFishCompletion,
} from '../../autocomplete'

export default class AutocompleteScript extends Command {
  static args = {shell: shellArg()}
  static description = 'Output autocomplete config script for shells'
  static hidden = true

  async run(): Promise<void> {
    const {args} = await this.parse(AutocompleteScript)
    if ((args.shell ?? path.basename(this.config.shell)) !== 'fish') {
      await runOfficialAutocomplete(this.config, 'autocomplete:script', this.argv)
      return
    }

    this.log(`source ${fishQuote(await writeFishCompletion(this.config))}`)
  }
}
