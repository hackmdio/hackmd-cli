import {expect} from 'chai'
import {spawn} from 'node:child_process'
import {mkdtempSync, rmSync, writeFileSync} from 'node:fs'
import {createServer, IncomingMessage, ServerResponse} from 'node:http'
import {createRequire} from 'node:module'
import {tmpdir} from 'node:os'
import path from 'node:path'

type Result = {code: null | number; stderr: string; stdout: string}

function run(args: string[], endpoint: string, configDir: string, input?: string): Promise<Result> {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(process.cwd(), 'bin/run'), ...args], {
      env: {
        ...process.env, HMD_API_ACCESS_TOKEN: 'test-token', HMD_API_ENDPOINT_URL: endpoint, HMD_CLI_CONFIG_DIR: configDir, NODE_ENV: 'production',
      },
    })
    let stdout = ''
    let stderr = ''
    child.stdout.on('data', chunk => {
      stdout += chunk
    })
    child.stderr.on('data', chunk => {
      stderr += chunk
    })
    child.on('error', reject)
    child.on('close', code => resolve({code, stderr, stdout}))
    if (input === undefined) child.stdin.end()
    else child.stdin.end(input)
  })
}

describe('CLI commands with local API client', () => {
  const configDir = mkdtempSync(path.join(tmpdir(), 'hackmd-cli-api-'))
  const requests: Array<{authorization: string | undefined; body: string; contentType: string | undefined; url: string | undefined}> = []
  let endpoint = ''
  let status = 200
  let responseBody = '{}'
  let contentType = 'application/json'
  const server = createServer(async (request: IncomingMessage, response: ServerResponse) => {
    const chunks: Buffer[] = []
    for await (const chunk of request) chunks.push(Buffer.from(chunk))
    requests.push({
      authorization: request.headers.authorization,
      body: Buffer.concat(chunks).toString(),
      contentType: request.headers['content-type'],
      url: request.url,
    })
    response.writeHead(status, {'Content-Type': contentType, ETag: '"v1"'})
    response.end(status === 204 || status === 304 ? undefined : responseBody)
  })

  before(async () => {
    await new Promise<void>(resolve => {
      server.listen(0, '127.0.0.1', resolve)
    })
    const address = server.address()
    if (!address || typeof address === 'string') throw new Error('Expected a local TCP address')
    endpoint = `http://127.0.0.1:${address.port}/v1`
  })

  after(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close(error => error ? reject(error) : resolve())
    })
    rmSync(configDir, {force: true, recursive: true})
  })

  beforeEach(() => {
    requests.length = 0
    status = 200
    responseBody = '{}'
    contentType = 'application/json'
  })

  it('loads the CJS raw entry and lists/describes operations offline', async () => {
    const raw = createRequire(path.join(process.cwd(), 'package.json'))('@hackmd/api/raw')
    expect(raw.operationRegistry.GetTeamNote.call).to.be.a('function')
    const list = await run(['api', 'operations'], 'http://127.0.0.1:1/v1', configDir)
    expect(list.code).to.equal(0)
    expect(list.stdout).to.include('installed API client')
    expect(list.stdout).to.include('GetTeamNote')
    const describe = await run(['api', 'describe', 'GetTeamNote'], 'http://127.0.0.1:1/v1', configDir)
    expect(describe.code).to.equal(0)
    const operation = JSON.parse(describe.stdout)
    expect(operation.path).to.equal('/teams/{teampath}/notes/{noteId}')
    expect(operation.parameters.map((parameter: {name: string}) => parameter.name)).to.include.members(['teampath', 'noteId'])
    expect(requests).to.have.length(0)
  })

  it('uses token, custom endpoint, path, query and response headers', async () => {
    responseBody = JSON.stringify({id: 'abc'})
    const result = await run(['api', 'call', 'GetTeamNote', '--path', 'teampath=docs', '--path', 'noteId=abc', '--include'], endpoint, configDir)
    expect(result.code, result.stderr).to.equal(0)
    expect(result.stdout).to.include('HTTP 200')
    expect(result.stdout).to.include('"id": "abc"')
    expect(requests).to.have.length(1)
    expect(requests[0].url).to.equal('/v1/teams/docs/notes/abc')
    expect(requests[0].authorization).to.equal('Bearer test-token')
    const query = await run(['api', 'call', 'ListVersions', '--path', 'noteId=abc', '--query', 'limit=2'], endpoint, configDir)
    expect(query.code, query.stderr).to.equal(0)
    expect(requests[1].url).to.equal('/v1/notes/abc/versions?limit=2')
  })

  it('handles documented no-body statuses without printing the generated empty object', async () => {
    status = 304
    const notModified = await run(['api', 'call', 'GetNote', '--path', 'noteId=abc', '--header', 'If-None-Match: "v1"', '--include'], endpoint, configDir)
    expect(notModified.code, notModified.stderr).to.equal(0)
    expect(notModified.stdout).to.include('HTTP 304')
    expect(notModified.stdout).not.to.include('{}')
    status = 204
    const restored = await run(['api', 'call', 'RestoreNote', '--path', 'noteId=abc'], endpoint, configDir)
    expect(restored.code, restored.stderr).to.equal(0)
    expect(restored.stdout).to.equal('')
    status = 202
    const updated = await run(['api', 'call', 'UpdateNote', '--path', 'noteId=abc', '--body', '{"content":"updated"}'], endpoint, configDir)
    expect(updated.code, updated.stderr).to.equal(0)
    expect(updated.stdout).to.equal('')
  })

  it('sends JSON once and prints a 207 response', async () => {
    status = 207
    responseBody = JSON.stringify({error: 'partial', note: {id: 'abc'}})
    const result = await run(['api', 'call', 'CreateNote', '--body', '{"content":"hello"}'], endpoint, configDir)
    expect(result.code, result.stderr).to.equal(0)
    expect(result.stdout).to.include('"partial"')
    expect(requests).to.have.length(1)
    expect(JSON.parse(requests[0].body)).to.deep.equal({content: 'hello'})
    const filePath = path.join(configDir, 'note.json')
    writeFileSync(filePath, '{"content":"from file"}')
    const fromFile = await run(['api', 'call', 'CreateNote', '--body', `@${filePath}`], endpoint, configDir)
    expect(fromFile.code, fromFile.stderr).to.equal(0)
    expect(JSON.parse(requests[1].body)).to.deep.equal({content: 'from file'})
    const fromStdin = await run(['api', 'call', 'CreateNote', '--body', '-'], endpoint, configDir, '{"content":"from stdin"}')
    expect(fromStdin.code, fromStdin.stderr).to.equal(0)
    expect(JSON.parse(requests[2].body)).to.deep.equal({content: 'from stdin'})
  })

  it('uploads multipart with inferred MIME and supports NDJSON text', async () => {
    const imagePath = path.join(configDir, 'image.png')
    writeFileSync(imagePath, Buffer.from([0x89, 0x50, 0x4E, 0x47]))
    const upload = await run(['api', 'call', 'UploadNoteImage', '--path', 'noteId=abc', '--file', `image=@${imagePath}`], endpoint, configDir)
    expect(upload.code, upload.stderr).to.equal(0)
    expect(requests[0].contentType).to.include('multipart/form-data')
    expect(requests[0].body).to.include('image/png')
    expect(requests[0].body).to.include('filename="image.png"')
    const uploadWithMime = await run(['api', 'call', 'UploadNoteImage', '--path', 'noteId=abc', '--file', `image=@${imagePath}`, '--mime', 'image/jpeg'], endpoint, configDir)
    expect(uploadWithMime.code, uploadWithMime.stderr).to.equal(0)
    expect(requests[1].body).to.include('image/jpeg')
    contentType = 'application/x-ndjson'
    responseBody = '{"id":1}\n{"id":2}\n'
    const exportResult = await run(['api', 'call', 'ExportWebhookDeliveries', '--path', 'hookId=abc'], endpoint, configDir)
    expect(exportResult.code, exportResult.stderr).to.equal(0)
    expect(exportResult.stdout).to.equal(responseBody)
  })

  it('rejects unknown parameters before making a request and reports HTTP errors', async () => {
    const invalid = await run(['api', 'call', 'GetNote', '--path', 'wrong=abc'], endpoint, configDir)
    expect(invalid.code).not.to.equal(0)
    expect(invalid.stderr).to.include('Missing required --path noteId')
    expect(requests).to.have.length(0)
    status = 404
    responseBody = JSON.stringify({error: 'Note not found'})
    const notFound = await run(['api', 'call', 'GetNote', '--path', 'noteId=abc'], endpoint, configDir)
    expect(notFound.code).not.to.equal(0)
    expect(notFound.stderr).to.include('HTTP 404')
    expect(notFound.stderr).to.include('Note not found')
  })

  it('passes descriptions when creating personal and team notes', async () => {
    responseBody = JSON.stringify({id: 'abc', tags: [], title: 'Test'})
    const personal = await run(['notes', 'create', '--title=Test', '--description=Personal'], endpoint, configDir)
    expect(personal.code, personal.stderr).to.equal(0)
    const personalRequest = requests.find(request => request.url === '/v1/notes')
    expect(JSON.parse(personalRequest!.body)).to.include({description: 'Personal'})

    requests.length = 0
    const team = await run(['team-notes', 'create', '--teamPath=docs', '--title=Test', '--description=Team'], endpoint, configDir)
    expect(team.code, team.stderr).to.equal(0)
    const teamRequest = requests.find(request => request.url === '/v1/teams/docs/notes')
    expect(JSON.parse(teamRequest!.body)).to.include({description: 'Team'})
  })

  it('passes description and null root placement when updating personal and team notes', async () => {
    status = 202
    const personal = await run(['notes', 'update', '--noteId=abc', '--description=', '--root'], endpoint, configDir)
    expect(personal.code, personal.stderr).to.equal(0)
    const personalRequest = requests.find(request => request.url === '/v1/notes/abc')
    expect(JSON.parse(personalRequest!.body)).to.deep.equal({description: '', parentFolderId: null})

    requests.length = 0
    const team = await run(['team-notes', 'update', '--teamPath=docs', '--noteId=abc', '--description=Team', '--root'], endpoint, configDir)
    expect(team.code, team.stderr).to.equal(0)
    const teamRequest = requests.find(request => request.url === '/v1/teams/docs/notes/abc')
    expect(JSON.parse(teamRequest!.body)).to.deep.equal({description: 'Team', parentFolderId: null})
  })

  it('clears nullable personal and team folder fields without changing omitted fields', async () => {
    status = 202
    const personal = await run(['folders', 'update', '--folderId=abc', '--clear=description', '--root'], endpoint, configDir)
    expect(personal.code, personal.stderr).to.equal(0)
    const personalRequest = requests.find(request => request.url === '/v1/folders/abc')
    expect(JSON.parse(personalRequest!.body)).to.deep.equal({description: null, parentFolderId: null})

    requests.length = 0
    const team = await run(['team-folders', 'update', '--teamPath=docs', '--folderId=abc', '--clear=color', '--clear=icon'], endpoint, configDir)
    expect(team.code, team.stderr).to.equal(0)
    const teamRequest = requests.find(request => request.url === '/v1/teams/docs/folders/abc')
    expect(JSON.parse(teamRequest!.body)).to.deep.equal({color: null, icon: null})
  })

  it('clears personal and team note descriptions with null', async () => {
    status = 202
    const personal = await run(['notes', 'update', '--noteId=abc', '--clear=description'], endpoint, configDir)
    expect(personal.code, personal.stderr).to.equal(0)

    const team = await run(['team-notes', 'update', '--teamPath=docs', '--noteId=abc', '--clear=description'], endpoint, configDir)
    expect(team.code, team.stderr).to.equal(0)
    const personalRequest = requests.find(request => request.url === '/v1/notes/abc')
    const teamRequest = requests.find(request => request.url === '/v1/teams/docs/notes/abc')
    expect(JSON.parse(personalRequest!.body)).to.deep.equal({description: null})
    expect(JSON.parse(teamRequest!.body)).to.deep.equal({description: null})
  })

  it('reads one team note and passes a history limit', async () => {
    responseBody = JSON.stringify({id: 'abc', tags: [], title: 'Team note'})
    const note = await run(['team-notes', '--teamPath=docs', '--noteId=abc'], endpoint, configDir)
    expect(note.code, note.stderr).to.equal(0)
    expect(note.stdout).to.include('Team note')
    expect(requests.some(request => request.url === '/v1/teams/docs/notes/abc')).to.be.true

    requests.length = 0
    responseBody = '[]'
    const history = await run(['history', '--limit=5'], endpoint, configDir)
    expect(history.code, history.stderr).to.equal(0)
    expect(requests.some(request => request.url === '/v1/history?limit=5')).to.be.true
  })

  for (const [args, url, body] of [
    [['notes', 'update', '--noteId=abc', '--title=Changed'], '/v1/notes/abc', {title: 'Changed'}],
    [['team-notes', 'update', '--teamPath=docs', '--noteId=abc', '--title=Changed'], '/v1/teams/docs/notes/abc', {title: 'Changed'}],
    [['folders', 'update', '--folderId=abc', '--name=Changed'], '/v1/folders/abc', {name: 'Changed'}],
    [['team-folders', 'update', '--teamPath=docs', '--folderId=abc', '--name=Changed'], '/v1/teams/docs/folders/abc', {name: 'Changed'}],
  ] as const) {
    it(`keeps omitted ${args[0]} update fields unchanged`, async () => {
      status = 202
      const result = await run([...args], endpoint, configDir)
      expect(result.code, result.stderr).to.equal(0)
      const request = requests.find(request => request.url === url)
      expect(JSON.parse(request!.body)).to.deep.equal(body)
    })
  }

  it('keeps the default team list and history requests unchanged', async () => {
    responseBody = '[]'
    const team = await run(['team-notes', '--teamPath=docs'], endpoint, configDir)
    expect(team.code, team.stderr).to.equal(0)
    expect(requests.some(request => request.url === '/v1/teams/docs/notes')).to.be.true

    const history = await run(['history'], endpoint, configDir)
    expect(history.code, history.stderr).to.equal(0)
    expect(requests.some(request => request.url === '/v1/history')).to.be.true
  })

  it('rejects conflicting and invalid flags before sending any request', async () => {
    const rootConflict = await run(['notes', 'update', '--noteId=abc', '--parentFolderId=folder', '--root'], endpoint, configDir)
    expect(rootConflict.code).not.to.equal(0)
    expect(rootConflict.stderr).to.include('Use either --root or --parentFolderId')

    const clearConflict = await run(['folders', 'update', '--folderId=abc', '--description=Text', '--clear=description'], endpoint, configDir)
    expect(clearConflict.code).not.to.equal(0)
    expect(clearConflict.stderr).to.include('Use either --description or --clear=description')

    const noteConflict = await run(['notes', 'update', '--noteId=abc', '--description=', '--clear=description'], endpoint, configDir)
    expect(noteConflict.code).not.to.equal(0)
    expect(noteConflict.stderr).to.include('Use either --description or --clear=description')

    const invalidClear = await run(['notes', 'update', '--noteId=abc', '--clear=icon'], endpoint, configDir)
    expect(invalidClear.code).not.to.equal(0)

    const invalidLimit = await run(['history', '--limit=0'], endpoint, configDir)
    expect(invalidLimit.code).not.to.equal(0)
    expect(invalidLimit.stderr).to.include('Flag limit must be a positive integer')
    expect(requests).to.have.length(0)
  })
})
