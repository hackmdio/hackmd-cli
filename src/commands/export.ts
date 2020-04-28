import {ExportType} from '@hackmd/api'
import {Command, flags} from '@oclif/command'
import * as path from 'path'

import {APIClient} from '../api'
import {pipeToFile as pipeStream} from '../utils'

export default class Export extends Command {
  static description = 'Export note to local file or stdout(if the output_file param is omitted)'

  static examples = [
    '$ hackmd-cli export [--pdf|--md|--html] <note_id> <output_file>',
  ]

  static args = [{
    name: 'noteId'
  }, {
    name: 'output'
  }]

  static flags = {
    help: flags.help({char: 'h'}),
    pdf: flags.boolean(),
    md: flags.boolean(),
    html: flags.boolean(),
    // slides: flags.boolean()
  }

  async run() {
    const {args, flags} = this.parse(Export)

    let exportType
    if (flags.pdf) {
      exportType = ExportType.PDF
    } else if (flags.html) {
      exportType = ExportType.HTML
    // } else if (flags.slides) {
    //   exportType = ExportType.SLIDE
    } else {
      exportType = ExportType.MD
    }

    try {
      const stream = await APIClient.exportStream(args.noteId, exportType)

      if (args.output) {
        const outputPath = path.resolve(process.cwd(), args.output)
        await pipeStream(stream, outputPath)
      } else {
        await APIClient.exportStream(args.noteId, exportType)

        // tslint:disable-next-line: align
        ; (stream as any).pipe(process.stdout)
      }
    } catch (e) {
      this.log('Note export failed')
      this.error(e)
    }
  }
}
