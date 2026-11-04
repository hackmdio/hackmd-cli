import {Parser} from '@oclif/core'
import {expect} from 'chai'
import stringWidth from 'string-width'
import {parse} from 'yaml'

import {table, tableFlags} from '../src/table'

const rows = [
  {
    id: '10', note: 'hello, "world"\n第二行', tags: ['one', 'two'], title: 'Note 10',
  },
  {
    id: '2', note: '', tags: [], title: 'Note 2',
  },
  {
    id: '1', note: null, tags: ['one'], title: '中文😀',
  },
]
const columns = {
  id: {header: 'ID'},
  note: {extended: true},
  tags: {get: (row: typeof rows[number]) => row.tags.join(', ')},
  title: {header: 'Title'},
}

function render(options: Parameters<typeof table>[2] = {}): string {
  const lines: string[] = []
  table(rows, columns, {...options, printLine: line => lines.push(line)})
  return lines.join('\n')
}

describe('Table compatibility', () => {
  it('keeps selected columns, their order, and natural multi-column sorting', () => {
    const output = render({columns: 'title,ID,title', output: 'json', sort: 'id'})
    expect(JSON.parse(output)).to.deep.equal([
      {id: '1', title: '中文😀'},
      {id: '2', title: 'Note 2'},
      {id: '10', title: 'Note 10'},
    ])
    expect(Object.keys(JSON.parse(output)[0])).to.deep.equal(['title', 'id'])
    expect(JSON.parse(render({output: 'json', sort: '-id'})).map((row: {id: string}) => row.id))
    .to.deep.equal(['10', '2', '1'])
    const lines: string[] = []
    table([{group: 'B', id: '1'}, {group: 'A', id: '2'}, {group: 'A', id: '10'}], {
      group: {}, id: {},
    }, {output: 'json', printLine: line => lines.push(line), sort: 'group,-id'})
    expect(JSON.parse(lines[0])).to.deep.equal([
      {group: 'A', id: '10'}, {group: 'A', id: '2'}, {group: 'B', id: '1'},
    ])
  })

  it('supports positive and negative regex filters and reports invalid filters', () => {
    expect(JSON.parse(render({filter: 'Title=^Note', output: 'json'}))).to.have.length(2)
    expect(JSON.parse(render({filter: '-Title=^Note', output: 'json'}))).to.have.length(1)
    expect(() => render({filter: 'missing=value'})).to.throw('Filter flag has an invalid value')
    expect(() => render({filter: 'title=['})).to.throw()
  })

  it('keeps string values and custom getters in JSON and YAML', () => {
    const options = {extended: true}
    const json = JSON.parse(render({...options, output: 'json'}))
    expect(parse(render({...options, output: 'yaml'}))).to.deep.equal(json)
    expect(json[0].tags).to.equal('one, two')
    expect(json[2].note).to.equal('')
  })

  it('escapes CSV quotes, commas, and newlines and supports --csv', () => {
    const output = render({columns: 'id,note', output: 'csv'})
    expect(output).to.equal('ID,Note\n10,"hello, ""world""\n第二行"\n2,\n1,')
    expect(render({columns: 'id,note', csv: true})).to.equal(output)
    expect(render({columns: 'id', 'no-header': true, output: 'csv'})).to.equal('10\n2\n1')
  })

  it('renders Unicode, multiline cells, and headerless tables', () => {
    expect(render()).to.include('中文😀').and.include('ID').and.not.include('hello,')
    expect(render({extended: true})).to.include('第二行')
    expect(render({'no-header': true})).to.not.include('Title')
    const lines: string[] = []
    table([], columns, {output: 'json', printLine: line => lines.push(line)})
    expect(lines).to.deep.equal(['[]'])
    expect(() => table([], {}, {printLine() {}})).to.not.throw()
  })

  it('truncates only TTY output and honors --no-truncate', () => {
    const tty = Object.getOwnPropertyDescriptor(process.stdout, 'isTTY')
    const width = Object.getOwnPropertyDescriptor(process.stdout, 'columns')
    try {
      Object.defineProperty(process.stdout, 'isTTY', {configurable: true, value: true})
      Object.defineProperty(process.stdout, 'columns', {configurable: true, value: 24})
      const lines: string[] = []
      const data = [{title: '中文😀'.repeat(20)}]
      table(data, {title: {}}, {printLine: line => lines.push(line)})
      expect(lines.every(line => stringWidth(line) <= 24)).to.equal(true)
      expect(lines.join('\n')).to.include('…')
      lines.length = 0
      table(data, {title: {}}, {'no-truncate': true, printLine: line => lines.push(line)})
      expect(lines.join('\n')).to.include(data[0].title)
    } finally {
      if (tty) Object.defineProperty(process.stdout, 'isTTY', tty)
      else Reflect.deleteProperty(process.stdout, 'isTTY')
      if (width) Object.defineProperty(process.stdout, 'columns', width)
      else Reflect.deleteProperty(process.stdout, 'columns')
    }
  })

  it('preserves table flags and exclusivity without sharing mutable definitions', async () => {
    const flags = tableFlags()
    expect(tableFlags().columns).to.not.equal(flags.columns)
    const result = await Parser.parse(['-x', '--sort=-ID', '--filter=Title=Note'], {flags})
    expect(result.flags).to.include({extended: true, filter: 'Title=Note', sort: '-ID'})
    await Promise.all([['--columns=id', '-x'], ['--csv', '--output=json'], ['--csv', '--no-header']].map(async argv => {
      try {
        await Parser.parse(argv, {flags: tableFlags()})
        expect.fail(`Expected conflicting flags to fail: ${argv.join(' ')}`)
      } catch (error) {
        expect((error as Error).message).to.match(/cannot|exclusive/i)
      }
    }))
  })
})
