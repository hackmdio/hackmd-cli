import type {Client} from '@hackmd/api/raw'

import {createClient} from '@hackmd/api/raw'
import {Args, Flags, ux} from '@oclif/core'
import {readFileSync} from 'node:fs'
import {basename, extname} from 'node:path'

import type {Operation} from '../../api/operations'

import {getOperation, parsePairs, validateParameters} from '../../api/operations'
import HackMDCommand from '../../command'
import config from '../../config'
import {setAccessTokenConfig} from '../../utils'

type RawResponse = {data: unknown; headers: Record<string, unknown>; status: number}
type RawCall = (options: {
  body?: unknown;
  client: Client;
  headers?: Record<string, string>;
  path?: Record<string, boolean | number | string>;
  query?: Record<string, boolean | number | string>;
  responseType?: 'text';
  throwOnError: true;
}) => Promise<RawResponse>

const mimeTypes: Record<string, string> = {
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}

function readBody(value: string): unknown {
  const content = value === '-'
    ? readFileSync(process.stdin.fd, 'utf8')
    : (value.startsWith('@') ? readFileSync(value.slice(1), 'utf8') : value)
  try {
    return JSON.parse(content)
  } catch {
    throw new Error('--body must contain valid JSON')
  }
}

function prepareFiles(operation: Operation, files: string[], mime: string | undefined): Record<string, File> {
  if (!operation.requestBody?.contentTypes.includes('multipart/form-data')) throw new Error('--file is only supported for multipart operations')
  const result: Record<string, File> = {}
  for (const input of files) {
    const [field, filepath] = input.split('=@', 2)
    if (!field || !filepath || !operation.requestBody.binaryFields.some(entry => entry.name === field)) {
      throw new Error(`Invalid --file "${input}"; expected a documented field such as image=@path`)
    }

    if (result[field]) throw new Error(`Duplicate --file field "${field}"`)
    const contentType = mime ?? mimeTypes[extname(filepath).toLowerCase()]
    if (!contentType) throw new Error(`Cannot infer MIME type for ${filepath}; pass --mime`)
    result[field] = new File([readFileSync(filepath)], basename(filepath), {type: contentType})
  }

  for (const field of operation.requestBody.binaryFields) {
    if (field.required && !result[field.name]) throw new Error(`Missing required --file ${field.name}=@path`)
  }

  return result
}

function prepareBody(operation: Operation, body: string | undefined, file: string[] | undefined, mime: string | undefined): unknown {
  const files = file ?? []
  if (body !== undefined && files.length > 0) throw new Error('Use either --body or --file, not both')
  if (mime && files.length === 0) throw new Error('--mime requires --file')
  if ((body !== undefined || files.length > 0) && !operation.requestBody) throw new Error(`${operation.method} ${operation.path} has no request body`)
  if (operation.requestBody?.required && body === undefined && files.length === 0) throw new Error('This operation requires --body or --file')
  if (files.length > 0) return prepareFiles(operation, files, mime)

  if (body !== undefined) {
    if (!operation.requestBody?.contentTypes.includes('application/json')) throw new Error('--body JSON is not supported by this operation')
    return readBody(body)
  }
}

function formatBody(data: unknown): string {
  if (typeof data === 'string') return data
  return JSON.stringify(data, null, 2)
}

export default class CallCommand extends HackMDCommand {
  static args = {operationId: Args.string({required: true})}
  static description = 'Call a HackMD API operation'
  static examples = [
    'hackmd-cli api call GetTeamNote --path teampath=docs --path noteId=abc',
    'hackmd-cli api call CreateNote --body @note.json',
    'hackmd-cli api call UploadNoteImage --path noteId=abc --file image=@photo.png',
  ]
  static flags = {
    body: Flags.string({description: 'JSON value, @file, or - for stdin'}),
    file: Flags.string({description: 'Multipart binary field, e.g. image=@photo.png', multiple: true}),
    header: Flags.string({description: 'Request header Name: value', multiple: true}),
    help: Flags.help({char: 'h'}),
    include: Flags.boolean({description: 'Include HTTP status and response headers'}),
    mime: Flags.string({description: 'MIME type override for --file'}),
    path: Flags.string({description: 'Path parameter key=value', multiple: true}),
    query: Flags.string({description: 'Query parameter key=value', multiple: true}),
  }

  async run() {
    const {args, flags} = await this.parse(CallCommand)
    const operation = getOperation(args.operationId)
    const path = validateParameters(operation, 'path', parsePairs(flags.path ?? [], '=', 'path'))
    const query = validateParameters(operation, 'query', parsePairs(flags.query ?? [], '=', 'query'))
    const headers = parsePairs(flags.header ?? [], ':', 'header')
    const body = prepareBody(operation, flags.body, flags.file, flags.mime)
    const token = config.accessToken || await ux.prompt('Enter your access token', {type: 'hide'})
    if (!token) throw new Error('An access token is required')
    const client = createClient({
      auth: token,
      baseURL: config.hackmdAPIEndpointURL,
      validateStatus: status => (status >= 200 && status < 300) || status === 304,
    })
    const ndjson = Object.values(operation.responses).some(contentTypes => contentTypes.includes('application/x-ndjson'))
    try {
      const response = await (operation.call as unknown as RawCall)({
        body,
        client,
        headers,
        path,
        query,
        ...(ndjson ? {responseType: 'text' as const} : {}),
        throwOnError: true,
      })
      if (!config.accessToken) setAccessTokenConfig(token)
      if (flags.include) {
        this.log(`HTTP ${response.status}`)
        for (const [name, value] of Object.entries(response.headers)) this.log(`${name}: ${value}`)
        this.log('')
      }

      const hasBody = operation.responses[String(response.status)]?.length !== 0
      if (hasBody && response.data !== undefined && response.data !== null) {
        if (ndjson) process.stdout.write(formatBody(response.data))
        else this.log(formatBody(response.data))
      }
    } catch (error) {
      const failure = error as {message?: string; response?: RawResponse}
      if (failure.response) {
        const {data, status} = failure.response
        this.error(`HTTP ${status}${data === undefined ? '' : `: ${formatBody(data)}`}`)
      }

      this.error(failure.message ?? String(error))
    }
  }
}
