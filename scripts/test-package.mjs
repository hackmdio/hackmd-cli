/* eslint-disable no-await-in-loop -- Install modes share a cache and CLI checks run in order. */
import assert from 'node:assert/strict'
import {execFile} from 'node:child_process'
import {once} from 'node:events'
import {
  mkdtemp, readdir, readFile, rm, stat,
} from 'node:fs/promises'
import http from 'node:http'
import {createRequire} from 'node:module'
import {tmpdir} from 'node:os'
import path from 'node:path'
import {performance} from 'node:perf_hooks'
import {fileURLToPath} from 'node:url'
import {promisify} from 'node:util'

const exec = promisify(execFile)
const project = fileURLToPath(new URL('..', import.meta.url))
const {version} = JSON.parse(await readFile(path.join(project, 'package.json'), 'utf8'))
// Run npm with Node directly so Windows never needs to launch a .cmd shim.
const npmPackage = createRequire(import.meta.url).resolve('npm/package.json', {
  paths: [path.dirname(process.execPath), path.join(path.dirname(process.execPath), '..', 'lib')],
})
const npmCli = path.join(path.dirname(npmPackage), 'bin', 'npm-cli.js')
const temporary = await mkdtemp(path.join(tmpdir(), 'hackmd-cli-package-'))
const requests = []
const note = {
  content: '# Test', id: 'note-1', tags: ['test'], teamPath: null, title: '中文😀', userPath: 'tester',
}
const user = {id: 'user-1', name: 'Test User', userPath: 'tester'}
const folder = {
  color: '#FFFFFF', description: 'Test folder', icon: '', id: 'folder-1', name: 'Docs', parentFolderId: null,
}
const server = http.createServer(async (request, response) => {
  const chunks = []
  for await (const chunk of request) chunks.push(chunk)
  const body = Buffer.concat(chunks).toString()
  requests.push({
    authorization: request.headers.authorization, body: body ? JSON.parse(body) : undefined, method: request.method, url: request.url,
  })
  let data
  if (request.url === '/me') data = user
  else if (request.url.endsWith('/folders')) data = request.method === 'GET' ? [folder] : folder
  else if (request.url === '/teams') data = [{
    id: 'team-1', name: 'Engineering', ownerId: 'user-1', path: 'engineering',
  }]
  else if (request.url === '/history') data = [note]
  else if (request.url.endsWith('/notes')) data = request.method === 'GET' ? [note] : note
  else data = note
  response.writeHead(200, {'content-type': 'application/json'})
  response.end(JSON.stringify(data))
})

async function inventory(directory) {
  let bytes = 0
  const packages = []
  for (const entry of await readdir(directory, {withFileTypes: true})) {
    const filename = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      const child = await inventory(filename)
      bytes += child.bytes
      packages.push(...child.packages)
    } else if (entry.isFile()) {
      bytes += (await stat(filename)).size
      if (entry.name === 'package.json') {
        const pkg = JSON.parse(await readFile(filename, 'utf8'))
        if (pkg.name && pkg.version) packages.push(pkg)
      }
    }
  }

  return {bytes, packages}
}

try {
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const env = {
    ...process.env,
    CI: 'true',
    HMD_API_ACCESS_TOKEN: 'package-test-token',
    HMD_API_ENDPOINT_URL: `http://127.0.0.1:${server.address().port}/`,
    HMD_CLI_CONFIG_DIR: path.join(temporary, 'config'),
    HOME: temporary,
    NO_PROXY: '127.0.0.1',
    XDG_CACHE_HOME: path.join(temporary, 'cache'),
    XDG_CONFIG_HOME: path.join(temporary, '.config'),
  }
  const packed = await exec(process.execPath, [npmCli, 'pack', '--pack-destination', temporary], {cwd: project, maxBuffer: 10 * 1024 * 1024})
  const filename = path.join(temporary, packed.stdout.trim().split('\n').at(-1))
  const results = []
  for (const ignoreScripts of [true, false]) {
    const prefix = path.join(temporary, ignoreScripts ? 'ignore-scripts' : 'with-scripts')
    const started = performance.now()
    const installed = await exec(process.execPath, [
      npmCli,
      'install',
      '--global',
      filename,
      '--prefix',
      prefix,
      '--cache',
      path.join(temporary, 'npm-cache'),
      '--no-audit',
      '--no-fund',
      ...(ignoreScripts ? ['--ignore-scripts'] : []),
    ], {cwd: temporary, env, maxBuffer: 10 * 1024 * 1024})
    const seconds = (performance.now() - started) / 1000
    assert.doesNotMatch(installed.stderr, /deprecated/i, 'npm installation emitted a deprecation warning')
    const packageRoot = path.join(prefix, process.platform === 'win32' ? 'node_modules' : 'lib/node_modules', '@hackmd/hackmd-cli')
    const tree = await inventory(path.dirname(path.dirname(packageRoot)))
    for (const forbidden of ['oclif', 'cli-ux', 'aws-sdk', '@oclif/config', '@oclif/command']) {
      assert(!tree.packages.some(pkg => pkg.name === forbidden), `Unexpected runtime dependency: ${forbidden}`)
    }

    assert(tree.packages.filter(pkg => pkg.name === '@oclif/core').every(pkg => pkg.version.startsWith('5.')))
    // eslint-disable-next-line unicorn/consistent-function-scoping -- Each installed CLI has its own binary and environment.
    const run = async argv => {
      const pending = exec(process.execPath, [path.join(packageRoot, 'bin/run'), ...argv], {cwd: temporary, env, timeout: 20_000})
      pending.child.stdin.end()
      const result = await pending
      assert.doesNotMatch(result.stderr, /Warning:|Error|MODULE_NOT_FOUND|ERR_/, `Unexpected stderr for ${argv.join(' ')}`)
      return result.stdout
    }

    assert((await run(['--version'])).includes(`@hackmd/hackmd-cli/${version}`))
    assert.match(await run(['-v']), /@hackmd\/hackmd-cli/)
    assert.match(await run(['--help']), /autocomplete/)
    assert.match(await run(['-h']), /USAGE/)
    await assert.rejects(
      exec(process.execPath, [path.join(packageRoot, 'bin/run'), 'whoami'], {
        cwd: temporary, env: {...env, HMD_API_ACCESS_TOKEN: ''}, timeout: 5000,
      }),
      error => error.code === 2 && /No access token configured/.test(error.stderr),
    )
    assert.match(await run(['help', 'notes', 'create']), /--readPermission/)
    for (const argv of [
      ['whoami'],
      ['teams'],
      ['history'],
      ['notes'],
      ['team-notes', '--teamPath=engineering'],
      ['folders'],
      ['team-folders', '--teamPath=engineering'],
      ['notes', 'create', '--content=# Test', '--readPermission=guest', '--writePermission=owner'],
      ['team-notes', 'create', '--teamPath=engineering', '--content=# Test'],
      ['folders', 'create', '--name=Docs'],
      ['team-folders', 'create', '--teamPath=engineering', '--name=Docs'],
    ]) {
      const output = JSON.parse(await run([...argv, '--output=json']))
      assert.equal(output.length, 1)
      assert(output[0].id)
    }

    const payload = requests.find(request => request.method === 'POST' && request.url === '/notes').body
    assert.equal(payload.readPermission, 'guest')
    assert.equal(payload.writePermission, 'owner')
    assert.match(await run(['notes', '--csv', '--columns=ID,Title']), /note-1,中文😀/)
    assert.match(await run(['notes', '--output=yaml', '--filter=Title=中文']), /中文😀/)
    assert.equal(await run(['export', '--noteId=note-1']), '# Test')
    await run(['autocomplete', 'bash', '--refresh-cache'])
    assert.match(await run(['autocomplete', 'script', 'bash']), /bash_setup/)
    await run(['autocomplete', 'zsh', '--refresh-cache'])
    assert.match(await run(['autocomplete', 'script', 'zsh']), /zsh_setup/)
    assert.match(await run(['autocomplete', 'fish']), /Fish completion setup/)
    assert.equal(await run(['autocomplete', 'fish', '--refresh-cache']), '')
    const fishSource = await run(['autocomplete', 'script', 'fish'])
    assert.match(fishSource, /^source '/)
    const fishPath = fishSource.trim().slice("source '".length, -1)
    const fishScript = await readFile(fishPath, 'utf8')
    assert.match(fishScript, /-a 'notes'/)
    assert.match(fishScript, /-l 'readPermission'/)
    if (process.env.CI) {
      await exec('bash', ['-n', path.join(path.dirname(path.dirname(fishPath)), 'bash', 'hackmd-cli.bash')])
      await exec('zsh', ['-n', path.join(path.dirname(path.dirname(fishPath)), 'zsh', '_hackmd-cli')])
      await exec('fish', ['--no-config', '--no-execute', fishPath])
      const completed = await exec('fish', ['--no-config', '-c', `${fishSource}\ncomplete -C 'hackmd-cli notes '\ncomplete -C 'hackmd-cli notes create --read'`], {env})
      assert.match(completed.stdout, /create/)
      assert.match(completed.stdout, /--readPermission/)
    }

    results.push({
      ignoreScripts, packages: tree.packages.length, seconds: Number(seconds.toFixed(2)), sizeMiB: Number((tree.bytes / (1024 ** 2)).toFixed(2)),
    })
  }

  assert(requests.every(request => request.authorization === 'Bearer package-test-token'))
  console.log(JSON.stringify(results, null, 2))
} finally {
  server.close()
  await rm(temporary, {force: true, recursive: true})
}
