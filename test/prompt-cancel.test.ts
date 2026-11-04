import type {Config} from '@oclif/core'

import {expect} from 'chai'

import HackMDCommand from '../src/command'

class PromptCommand extends HackMDCommand {
  async handlePromptError(error: Error) {
    return this.catch(error)
  }

  async run() {}
}

describe('Prompt cancellation', () => {
  it('keeps exit 130 even when a command catches and rethrows the prompt error', async () => {
    const command = new PromptCommand([], {} as Config)
    let error = Object.assign(new Error('Cancelled'), {name: 'ExitPromptError'})
    try {
      command.error(error)
    } catch (error_) {
      error = error_ as Error
    }

    try {
      await command.handlePromptError(error)
      expect.fail('Expected cancellation to exit')
    } catch (error_) {
      expect((error_ as {oclif: {exit: number}}).oclif.exit).to.equal(130)
    }
  })
})
