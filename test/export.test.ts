import {expect} from 'chai'

import Export from '../src/commands/export'

async function captureExport(content: string): Promise<string> {
  const stdoutDescriptor = Object.getOwnPropertyDescriptor(process, 'stdout')
  if (!stdoutDescriptor) throw new Error('process.stdout descriptor is unavailable')

  let output = ''
  Object.defineProperty(process, 'stdout', {
    configurable: true,
    value: {
      write(chunk: string) {
        output += chunk
        return true
      },
    },
  })

  try {
    const command = {
      error(error: Error | string): never {
        throw typeof error === 'string' ? new Error(error) : error
      },
      getAPIClient: async () => ({
        getNote: async () => ({content}),
      }),
      log: (message = '') => process.stdout.write(`${message}\n`),
      parse: async () => ({flags: {noteId: 'note-id'}}),
    } as unknown as Export

    await Export.prototype.run.call(command)
  } finally {
    Object.defineProperty(process, 'stdout', stdoutDescriptor)
  }

  return output
}

describe('Export note content', () => {
  it('preserves content without a trailing newline', async () => {
    const content = '# Exported note\n\nNo trailing newline.'

    expect(await captureExport(content)).to.equal(content)
  })

  it('preserves content with a trailing newline', async () => {
    const content = '# Exported note\n\nTrailing newline.\n'

    expect(await captureExport(content)).to.equal(content)
  })

  it('preserves empty content', async () => {
    expect(await captureExport('')).to.equal('')
  })
})
