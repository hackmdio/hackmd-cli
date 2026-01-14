import * as fs from 'fs-extra'
import * as os from 'node:os'
import path from 'node:path'

export function tempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'foo-'))
}
