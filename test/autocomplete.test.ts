import type {Command} from '@oclif/core'

import {expect} from 'chai'

import {fishCompletion, fishQuote} from '../src/autocomplete'

describe('Fish completion', () => {
  it('quotes shell metacharacters without evaluating them', () => {
    expect(fishQuote(String.raw`it's \ $(secret)`)).to.equal(String.raw`'it\'s \\ $(secret)'`)
  })

  it('generates nested commands, option values, and short flags without hidden entries', () => {
    const commands = [
      {
        description: 'Create a note\nMore details', flags: {
          editor: {char: 'e', description: 'Use an editor', type: 'boolean'},
          secret: {hidden: true, type: 'boolean'},
          title: {description: "Note's title", options: ['one', 'two'], type: 'option'},
        }, id: 'notes:create',
      },
      {flags: {}, hidden: true, id: 'internal'},
    ] as unknown as Command.Loadable[]
    const output = fishCompletion('hackmd-cli', commands)
    expect(output).to.include("-a 'notes'").and.include("-a 'create'")
    expect(output).to.include("-l 'editor' -s 'e'")
    expect(output).to.include("-l 'title' -r -a")
    expect(output).to.not.include("-l 'secret'").and.not.include("-a 'internal'")
    expect(output).to.not.include('More details')
  })
})
