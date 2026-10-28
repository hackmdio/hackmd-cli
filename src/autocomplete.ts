import {Args, type Command, type Interfaces} from '@oclif/core'
import {mkdir, writeFile} from 'node:fs/promises'
import path from 'node:path'

export const shellArg = () => Args.string({description: 'Shell type', options: ['bash', 'fish', 'zsh', 'powershell']})

export function fishQuote(value: string): string {
  return `'${value.replaceAll('\\', '\\\\').replaceAll('\'', String.raw`\'`)}'`
}

export function fishCompletion(bin: string, commands: Command.Loadable[]): string {
  const predicate = `__fish_${bin.replaceAll(/\W/g, '_')}_using_command`
  const lines = [
    `function ${predicate}`,
    '  set -l mode $argv[1]',
    '  set -e argv[1]',
    '  set -l words (commandline -opc)',
    '  set -e words[1]',
    '  if test (count $words) -lt (count $argv)',
    '    return 1',
    '  end',
    '  for i in (seq (count $argv))',
    '    if test "$words[$i]" != "$argv[$i]"',
    '      return 1',
    '    end',
    '  end',
    '  if test "$mode" = exact; and test (count $words) -ne (count $argv)',
    '    return 1',
    '  end',
    '  return 0',
    'end',
    `complete -c ${fishQuote(bin)} -f`,
  ]
  const seen = new Set<string>()
  for (const command of commands.filter(command => !command.hidden)) {
    const words = command.id.split(':')
    for (let depth = 0; depth < words.length; depth++) {
      const id = words.slice(0, depth + 1).join(':')
      if (seen.has(id)) continue
      seen.add(id)
      const condition = `${predicate} exact ${words.slice(0, depth).map(word => fishQuote(word)).join(' ')}`
      const description = depth === words.length - 1 ? command.summary || command.description || '' : ''
      lines.push(`complete -c ${fishQuote(bin)} -n ${fishQuote(condition)} -a ${fishQuote(words[depth])} -d ${fishQuote(description.split('\n')[0])}`)
    }

    const conditions = [`${predicate} prefix ${words.map(word => fishQuote(word)).join(' ')}`]
    for (const child of commands.filter(child => !child.hidden && child.id.startsWith(command.id + ':'))) {
      conditions.push(`not ${predicate} prefix ${child.id.split(':').map(word => fishQuote(word)).join(' ')}`)
    }

    const condition = conditions.join('; and ')
    for (const [name, flag] of Object.entries(command.flags)) {
      if (flag.hidden) continue
      let line = `complete -c ${fishQuote(bin)} -n ${fishQuote(condition)} -l ${fishQuote(name)}`
      if (flag.char) line += ` -s ${fishQuote(flag.char)}`
      if (flag.type === 'option') {
        line += ' -r'
        if (flag.options) line += ` -a ${fishQuote(flag.options.map(option => fishQuote(option)).join(' '))}`
      }

      line += ` -d ${fishQuote((flag.summary || flag.description || '').split('\n')[0])}`
      lines.push(line)
    }
  }

  return lines.join('\n') + '\n'
}

export async function writeFishCompletion(config: Interfaces.Config): Promise<string> {
  const filename = path.join(config.cacheDir, 'autocomplete', 'functions', 'fish', `${config.bin}.fish`)
  await mkdir(path.dirname(filename), {recursive: true})
  await writeFile(filename, fishCompletion(config.bin, config.commands))
  return filename
}

export async function runOfficialAutocomplete(config: Interfaces.Config, id: string, argv: string[]): Promise<void> {
  const plugin = config.plugins.get('@oclif/plugin-autocomplete')
  if (!plugin) throw new Error('Autocomplete plugin is not available')
  const implementation = await plugin.findCommand(id, {must: true})
  await implementation.run(argv, config)
}
