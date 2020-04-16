import * as fs from 'fs-extra'
import * as os from 'os'
import * as path from 'path'

export function tempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'foo-'))
}
