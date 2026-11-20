import {Flags} from '@oclif/core'
import Table from 'cli-table3'
import {orderBy} from 'natural-orderby'
import {inspect} from 'node:util'
import stringWidth from 'string-width'
import {stringify} from 'yaml'

interface Column<T> {
  extended?: boolean;
  get?: (row: T) => unknown;
  header?: string;
  minWidth?: number;
}

interface Options {
  columns?: string;
  csv?: boolean;
  extended?: boolean;
  filter?: string;
  'no-header'?: boolean;
  'no-truncate'?: boolean;
  output?: string;
  printLine?: (line: string) => void;
  sort?: string;
}

export function table<T extends object>(data: T[], definitions: Record<string, Column<T>>, options: Options = {}): void {
  const printLine = options.printLine ?? console.log
  let columns = Object.entries(definitions).map(([key, column]) => ({
    ...column,
    header: column.header ?? key.replaceAll('_', ' ').replace(/^./, char => char.toUpperCase()),
    key,
  }))
  let rows = data.map(row => Object.fromEntries(columns.map(column => {
    const value = column.get ? column.get(row) : (row as Record<string, unknown>)[column.key] ?? ''
    return [column.key, typeof value === 'string' ? value : inspect(value, {breakLength: Number.POSITIVE_INFINITY})]
  })))

  const findColumn = (header: string) => columns.find(column => column.header.toLowerCase() === header.toLowerCase())
  if (options.filter) {
    const separator = options.filter.indexOf('=')
    const header = options.filter.slice(0, separator)
    const negate = header.startsWith('-')
    const column = findColumn(negate ? header.slice(1) : header)
    if (separator === -1 || !column || !options.filter.slice(separator + 1)) {
      throw new Error('Filter flag has an invalid value')
    }

    const pattern = new RegExp(options.filter.slice(separator + 1))
    rows = rows.filter(row => pattern.test(row[column.key]) !== negate)
  }

  if (options.sort) {
    const sorters = options.sort.split(',').map(header => ({
      column: findColumn(header.replace(/^-/, '')),
      order: header.startsWith('-') ? 'desc' as const : 'asc' as const,
    })).filter(sorter => sorter.column)
    rows = orderBy(rows, sorters.map(sorter => sorter.column!.key), sorters.map(sorter => sorter.order))
  }

  columns = options.columns
    ? [...new Set(options.columns.split(','))].flatMap(header => findColumn(header) ?? [])
    : columns.filter(column => options.extended || !column.extended)

  const output = options.csv ? 'csv' : options.output
  if (output === 'csv') {
    const escape = (value: string) => /[",\r\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value
    if (!options['no-header']) printLine(columns.map(column => escape(column.header)).join(','))
    for (const row of rows) printLine(columns.map(column => escape(row[column.key])).join(','))
    return
  }

  if (output === 'json' || output === 'yaml') {
    const selected = rows.map(row => Object.fromEntries(columns.map(column => [column.key, row[column.key]])))
    printLine(output === 'json' ? JSON.stringify(selected, undefined, 2) : stringify(selected).trimEnd())
    return
  }

  renderTable(rows, columns, options)
}

function renderTable(
  rows: Record<string, string>[],
  columns: Array<{header: string; key: string; minWidth?: number}>,
  options: Options,
): void {
  const printLine = options.printLine ?? console.log
  if (columns.length === 0) return
  const widths = columns.map(column => {
    let width = Math.max(column.minWidth ?? 0, stringWidth(column.header))
    for (const row of rows) {
      for (const line of row[column.key].split('\n')) width = Math.max(width, stringWidth(line))
    }

    return width + 1
  })
  if (process.stdout.isTTY && !options['no-truncate']) {
    const available = process.stdout.columns - columns.length - 1
    const minimum = columns.map(column => Math.max(column.minWidth ?? 0, stringWidth(column.header) + 1))
    let total = 0
    for (const width of widths) total += width
    while (total > available) {
      let widest = 0
      for (let index = 1; index < widths.length; index++) {
        if (widths[index] - minimum[index] > widths[widest] - minimum[widest]) widest = index
      }

      if (widths[widest] <= minimum[widest]) break
      widths[widest]--
      total--
    }
  }

  const rendered = new Table({
    chars: {
      bottom: '', 'bottom-left': '', 'bottom-mid': '', 'bottom-right': '',
      left: '', 'left-mid': '', mid: '─', 'mid-mid': ' ', middle: ' ', right: '', 'right-mid': '',
      top: '', 'top-left': '', 'top-mid': '', 'top-right': '',
    },
    colWidths: widths,
    head: options['no-header'] ? [] : columns.map(column => column.header),
    style: {
      border: [], compact: true, head: [], 'padding-left': 0, 'padding-right': 1,
    },
  })
  for (const row of rows) rendered.push(columns.map(column => row[column.key]))
  for (const line of rendered.toString().split('\n')) printLine(line)
}

export const tableFlags = () => ({
  columns: Flags.string({description: 'only show provided columns (comma-separated)', exclusive: ['extended']}),
  csv: Flags.boolean({description: 'output is csv format [alias: --output=csv]', exclusive: ['no-truncate']}),
  extended: Flags.boolean({char: 'x', description: 'show extra columns', exclusive: ['columns']}),
  filter: Flags.string({description: 'filter property by partial string matching, ex: name=foo'}),
  'no-header': Flags.boolean({description: 'hide table header from output', exclusive: ['csv']}),
  'no-truncate': Flags.boolean({description: 'do not truncate output to fit screen', exclusive: ['csv']}),
  output: Flags.string({
    description: 'output in a more machine friendly format',
    exclusive: ['no-truncate', 'csv'],
    options: ['csv', 'json', 'yaml'],
  }),
  sort: Flags.string({description: 'property to sort by (prepend \'-\' for descending)'}),
})
