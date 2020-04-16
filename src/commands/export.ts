import {ExportType} from '@hackmd/api'
import {Command, flags} from '@oclif/command'
import * as path from 'path'

import {APIClient} from '../api'

export default class Export extends Command {
  static description = 'Export note to local file'

  static examples = [
    '$ codimd-cli export [--pdf|--md|--html] <note_id> <output_file>',
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

    let outputPath = path.resolve(process.cwd(), args.output)
    try {
      await APIClient.export(args.noteId, exportType, outputPath)
    } catch (e) {
      this.log('Note export failed')
      this.error(e)
    }
  }
}
